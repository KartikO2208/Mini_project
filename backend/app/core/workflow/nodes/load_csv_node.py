import pandas as pd
import io
from ..node_base import NodeBase  # <-- THIS LINE IS FIXED (uses '..')

class LoadCSVNode(NodeBase):
    def __init__(self, node_id: str, node_type: str):
        super().__init__(node_id, node_type)

    def execute(self, inputs: dict) -> pd.DataFrame:
        file_contents = inputs.get('file_contents')
        if file_contents is None:
            raise ValueError(f"[{self.node_id}] No file contents provided for LoadCSVNode.")
        
        print(f"[{self.node_id}] Loading data from user-uploaded file...")
        
        try:
            self.data = pd.read_csv(io.StringIO(file_contents.decode('utf-8')))
        except UnicodeDecodeError:
            print(f"[{self.node_id}] UTF-8 failed, trying latin-1...")
            self.data = pd.read_csv(io.StringIO(file_contents.decode('latin-1')))
        except Exception as e:
            raise ValueError(f"[{self.node_id}] Error decoding CSV: {e}")
            
        return self.data