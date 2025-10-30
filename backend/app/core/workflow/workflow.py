# backend/app/core/workflow/workflow.py
import networkx as nx
from .registry import get_node_class

class Workflow:
    def __init__(self, spec: dict):
        """
        spec format:
        {
          "nodes": [{"id": 1, "type": "ReadCSV", "params": {...}}, ...],
          "edges": [{"from": 1, "to": 2}, ...]
        }
        """
        self.graph = nx.DiGraph()
        self._build(spec)

    def _build(self, spec: dict):
        # add nodes
        for n in spec.get("nodes", []):
            node_type = n["type"]
            cls = get_node_class(node_type)
            if cls is None:
                raise ValueError(f"Unknown node type: {node_type}")
            node_obj = cls(n["id"], n.get("params"))
            self.graph.add_node(n["id"], obj=node_obj)

        # add edges
        for e in spec.get("edges", []):
            src, dst = e["from"], e["to"]
            if src not in self.graph.nodes or dst not in self.graph.nodes:
                raise ValueError(f"Invalid edge: {e}")
            self.graph.add_edge(src, dst)

    def run(self):
        """Execute nodes in topological order."""
        for node_id in nx.topological_sort(self.graph):
            node = self.graph.nodes[node_id]["obj"]
            preds = list(self.graph.predecessors(node_id))
            inputs = [self.graph.nodes[p]["obj"].output_data for p in preds]

            # if there are inputs:
            if inputs:
                # pass single input directly, multiple as list
                node.set_input(inputs[0] if len(inputs) == 1 else inputs)

            print(f"\n--> Running Node {node_id} ({node.__class__.__name__})")
            node.execute()
        print("\n✅ Workflow execution finished.")
