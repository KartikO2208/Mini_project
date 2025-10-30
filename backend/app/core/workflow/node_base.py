# backend/app/core/workflow/node_base.py (FINAL, ROBUST VERSION)

from abc import ABC, abstractmethod
from typing import Optional, Any, Dict, Type
import pandas as pd
from pydantic import BaseModel, Field, ValidationError

# --- Base Pydantic Model for Configuration Validation ---
class NodeConfigBase(BaseModel):
    """Base Pydantic model for node configuration validation. Concrete nodes inherit from this."""
    pass

class NodeBase(ABC):
    """
    The foundational Abstract Base Class, enforcing statefulness, lifecycle, and validation.
    """
    
    # --- METADATA (Class-level attributes for system/UI information) ---
    LABEL: str = "Abstract Node" 
    AUTHOR: str = "System"
    VERSION: str = "1.0.0"
    RESOURCE_HINTS: Dict[str, Any] = {} 
    
    # --- CONFIG VALIDATION HOOK (Must be overridden by concrete nodes) ---
    CONFIG_SCHEMA: Type[NodeConfigBase] = NodeConfigBase 

    def __init__(self, node_id: Any, config: Dict[str, Any]):
        self.node_id = node_id
        
        # 1. Pydantic Validation: Check the config immediately
        try:
            # Validate the incoming config dictionary against the node's specific schema
            self._validated_config = self.CONFIG_SCHEMA(**config) 
            self.config = self._validated_config.model_dump() # Store the validated dictionary
        except ValidationError as e:
            # If validation fails, raise an error immediately to halt the graph build
            raise ValueError(f"Configuration validation failed for {self.LABEL} ({node_id}): {e}")
        
        # --- STATEFUL ATTRIBUTES ---
        self.input_data: Optional[Any] = None
        self.output_data: Optional[pd.DataFrame] = None
        
        # --- EXECUTION CONTEXT ---
        self.status: str = "PENDING"
        self.error_detail: Optional[str] = None
    
    # --- LIFECYCLE HOOKS (Abstract/Mandatory for clean resource management) ---

    def configure(self) -> None:
        """Hook: Called by the runner after initialization but before execution starts."""
        pass
        
    def prepare(self) -> None:
        """Hook: Called just before execute(). Used for heavy setup tasks."""
        pass

    @abstractmethod
    def execute(self):
        """MANDATORY: Contains the core transformation logic."""
        pass
    
    def cleanup(self) -> None:
        """Hook: Called after execution (success or failure). Releases resources (e.g., file handles)."""
        pass
        
    # --- RUNNER INTERFACE METHODS ---
    
    def set_input(self, data: Optional[Any]):
        """Called by the Workflow Runner to pass data from predecessor nodes."""
        self.input_data = data
    
    def get_metadata(self) -> Dict[str, Any]:
        """Returns required metadata for the system/UI."""
        return {
            "label": self.LABEL,
            "author": self.AUTHOR,
            "version": self.VERSION,
            "resource_hints": self.RESOURCE_HINTS
        }
        
    def get_status(self) -> Dict[str, Any]:
        """Returns execution status for logging/monitoring."""
        return {
            "id": self.node_id,
            "label": self.LABEL,
            "status": self.status,
            "error": self.error_detail
        }