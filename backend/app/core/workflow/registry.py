# backend/app/core/workflow/registry.py

from typing import Dict, Type
# Import the base class
from .node_base import NodeBase 
# Import all concrete node implementations
from .nodes.read_file import ReadFile
from .nodes.filter_rows import FilterRows
from .nodes.write_file import WriteFile
# NOTE: Add all other transformation nodes here (e.g., GroupBy, JoinNode)

# --- The Registry Dictionary ---
# Maps the string 'type' from the JSON contract to the Node Class
NODE_REGISTRY: Dict[str, Type[NodeBase]] = {
    # Input/Output Nodes
    "Read_File": ReadFile,
    "Write_File": WriteFile,
    
    # Transformation Nodes
    "Filter_Rows": FilterRows,
    # "Group_By": GroupBy, # Uncomment and import once created
    # "Clean_Nulls": CleanNulls, # Uncomment and import once created
}

def get_node_class(node_type: str) -> Type[NodeBase]:
    """
    Retrieves the corresponding Node class from the registry based on the 'type' string.
    
    Raises:
        ValueError: If the requested node type is not found.
    """
    if node_type not in NODE_REGISTRY:
        # This check is vital for handling invalid JSON contracts gracefully
        raise ValueError(f"Unknown node type '{node_type}' specified in the workflow. "
                         f"Supported types are: {list(NODE_REGISTRY.keys())}")
    return NODE_REGISTRY[node_type]