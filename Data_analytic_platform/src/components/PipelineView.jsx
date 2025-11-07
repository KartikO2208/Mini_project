import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import useDashboardStore from '../store';
import Papa from 'papaparse'; // <-- 1. IMPORT PAPAPARSE FOR DOWNLOADING
import { Loader, Download } from 'lucide-react'; // <-- 2. IMPORT DOWNLOAD ICON

import PipelineSidebar from './PipelineSidebar';
import './PipelineBuilder.css';

// --- (CustomNode component is the same) ---
const CustomNode = ({ data }) => {
  return (
    <div className="custom-node-body">
      <strong>{data.label}</strong>
      {data.node_type !== 'load_csv' && (
        <Handle type="target" position={Position.Left} id="input_1" />
      )}
      {(data.node_type === 'load_csv' || data.node_type === 'clean_data') && (
         <Handle type="source" position={Position.Right} id="output_1" />
      )}
    </div>
  );
};
const nodeTypes = { custom: CustomNode };
let id = 0;
const getId = () => `dndnode_${id++}`;
// --- (End CustomNode) ---

export default function PipelineView() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  const file = useDashboardStore((state) => state.file);
  const setPipelineData = useDashboardStore((state) => state.setPipelineData);
  
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [isLoading, setIsLoading] = useState(false);
  
  // --- 3. ADD NEW STATE TO HOLD THE DOWNLOADABLE DATA ---
  const [downloadableData, setDownloadableData] = useState(null);

  useEffect(() => {
    if (file) {
      setFileName(file.name);
    }
  }, [file]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeInfo = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type: 'custom', 
        position,
        data: { 
          label: nodeInfo.label,
          node_type: nodeInfo.node_type 
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const handleRunPipeline = async () => {
    if (!file) {
      alert("Go back to the Upload Page to select a file first!");
      return;
    }
    if (nodes.length === 0) {
      alert("Please build a pipeline by dragging nodes onto the canvas.");
      return;
    }

    const pipeline = { nodes, edges };
    setIsLoading(true);
    setResult(`Running workflow on '${fileName}'...`);
    setDownloadableData(null); // Clear old download data

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pipeline_json', JSON.stringify(pipeline));

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/workflow/run/", 
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      const responseData = response.data.result;
      const rawData = JSON.parse(responseData); // Parse the JSON from the string
      
      const lastNode = nodes.find(n => n.data.node_type === 'analyze_data');
      if (lastNode && !edges.some(e => e.source === lastNode.id)) {
        setPipelineData(rawData); // Send to dashboard
        setResult("Analysis complete! Check the 'Dashboard' tab for results.");
        setDownloadableData(null); // No download for dashboard
      } else {
        // --- 4. SAVE DATA FOR DOWNLOAD ---
        setResult(JSON.stringify(rawData, null, 2)); // Show pretty JSON
        setDownloadableData(rawData); // Save the raw data object
      }
      setIsLoading(false);

    } catch (error) {
      console.error("Error running pipeline:", error);
      const errorMsg = error.response ? error.response.data.detail : "An error occurred.";
      setResult(`Error: ${errorMsg}`);
      setIsLoading(false);
      setDownloadableData(null);
    }
  };

  // --- 5. NEW FUNCTION TO HANDLE THE DOWNLOAD ---
  const handleDownload = () => {
    if (!downloadableData) return;

    // Convert the JSON object back into a CSV string
    const csvString = Papa.unparse(downloadableData);
    
    // Create a "blob" (a file in memory)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Create a temporary link to download the blob
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'cleaned_data.csv');
    document.body.appendChild(link);
    
    // Click the link to trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  return (
    <div className="builder-layout">
      <ReactFlowProvider>
        <PipelineSidebar />
        <div className="builder-canvas" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
          
          <div className="control-panel">
            <span className="file-name">File: **{fileName}**</span>
            <button className="run-button" onClick={handleRunPipeline} disabled={isLoading}>
              {isLoading ? <Loader size={16} className="spinner" /> : '► Run Pipeline'}
            </button>
          </div>
        </div>
      </ReactFlowProvider>
      
      {result && (
        <div className="result-panel">
          {/* --- 6. ADD THE DOWNLOAD BUTTON --- */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Pipeline Output:</h3>
            {downloadableData && (
              <button className="run-button" onClick={handleDownload} style={{padding: '4px 8px', fontSize: '0.8rem'}}>
                <Download size={14} style={{marginRight: '4px'}}/>
                Download as CSV
              </button>
            )}
          </div>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}