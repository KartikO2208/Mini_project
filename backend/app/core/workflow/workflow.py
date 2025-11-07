import networkx as nx
import pandas as pd
from ..registry import get_node_class  # Import from parent 'core' directory (go up one level with ..)
from fastapi.encoders import jsonable_encoder
import json

class WorkflowExecutor:
    def __init__(self, nodes: list, edges: list, file_contents: bytes):
        self.graph = self._build_graph(nodes, edges)
        self.node_instances = self._instantiate_nodes(nodes)
        self.file_contents = file_contents
        self.execution_results = {} 

    def _build_graph(self, nodes: list, edges: list) -> nx.DiGraph:
        graph = nx.DiGraph()
        for node in nodes:
            graph.add_node(node['id'], **node)
        
        for edge in edges:
            graph.add_edge(edge['source'], edge['target'], **edge)
        
        if not nx.is_directed_acyclic_graph(graph):
            raise ValueError("Workflow contains a cycle and cannot be run.")
        
        return graph

    def _instantiate_nodes(self, nodes: list) -> dict:
        instances = {}
        for node_data in nodes:
            node_id = node_data['id']
            node_type = node_data.get('data', {}).get('node_type')
            if not node_type:
                 raise ValueError(f"Node {node_id} is missing 'node_type' in 'data' field.")
            
            node_class = get_node_class(node_type)
            instances[node_id] = node_class(node_id=node_id, node_type=node_type)
        return instances

    def run(self) -> str: # Change return type hint to str
        """ Executes the workflow in topological order. """
        execution_order = list(nx.topological_sort(self.graph))
        
        print(f"Execution order: {execution_order}")

        for node_id in execution_order:
            node_instance = self.node_instances[node_id]
            inputs_for_this_node = {}

            if node_instance.node_type == 'load_csv':
                if self.file_contents is None:
                    raise ValueError("Workflow started but no file was provided.")
                inputs_for_this_node['file_contents'] = self.file_contents
            else:
                parent_node_ids = list(self.graph.predecessors(node_id))
                
                for parent_id in parent_node_ids:
                    edge_data = self.graph.get_edge_data(parent_id, node_id)
                    parent_result = self.execution_results.get(parent_id)
                    input_handle_id = edge_data.get('targetHandle', 'input_1') 
                    inputs_for_this_node[input_handle_id] = parent_result

            print(f"--- Executing Node: {node_instance.node_type} ({node_id}) ---")
            result = node_instance.execute(inputs_for_this_node)
            
            self.execution_results[node_id] = result

        # Return the result of the *last* node in the execution
        final_node_id = execution_order[-1]
        final_result = self.execution_results.get(final_node_id)
        
        
        # --- THIS IS THE FIX ---
        
        # Case 1: The final node was 'Analyze Data', which returns a DICT.
        # This dict contains Timestamps, so we must use jsonable_encoder.
        if isinstance(final_result, dict):
            print("Final result is a dict, using jsonable_encoder...")
            encoded_result = jsonable_encoder(final_result)
            return json.dumps(encoded_result)

        # Case 2: The final node was 'Remove Duplicates' or 'Load CSV'.
        # These return a pandas DataFrame.
        if isinstance(final_result, pd.DataFrame):
            print("Final result is a DataFrame, using pandas .to_json()...")
            # Use pandas's built-in JSON converter, which handles NumPy types.
            return final_result.to_json(orient='records')
        
        # Fallback for any other type
        print(f"Final result is an unknown type: {type(final_result)}")
        return json.dumps(jsonable_encoder(final_result))
        # --- END OF FIX ---