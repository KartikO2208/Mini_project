import React from 'react';

export default function PipelineSidebar() {
  const onDragStart = (event, nodeType, nodeName) => {
    // This is the data that will be passed to the 'onDrop' event
    const nodeData = {
      node_type: nodeType, // The type our Python backend understands
      label: nodeName,     // The text to display on the node
    };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="builder-sidebar">
      <h3>Node Palette</h3>
      
      {/* Node 1: Load CSV. This node will use the file already in the store */}
      <div 
        className="sidebar-node" 
        onDragStart={(event) => onDragStart(event, 'load_csv', 'Load Uploaded CSV')} 
        draggable
      >
        Load Uploaded CSV
      </div>
      
      {/* Node 2: Clean Data (This will be our "Remove Duplicates" node) */}
      <div 
        className="sidebar-node" 
        onDragStart={(event) => onDragStart(event, 'clean_data', 'Remove Duplicates')} 
        draggable
      >
        Remove Duplicates
      </div>

      {/* Node 3: Analyze Data. This node runs all the dashboard analytics. */}
      <div 
        className="sidebar-node" 
        onDragStart={(event) => onDragStart(event, 'analyze_data', 'Analyze & Show Dashboard')} 
        draggable
      >
        Analyze & Show Dashboard
      </div>
    </aside>
  );
}
