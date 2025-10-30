import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDashboardStore } from '../store'; // Import the global store
import {UploadAnimation} from '../components/UploadAnimation';
import { UploadCloud, FileCheck } from 'lucide-react';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get the 'setAnalysisData' function from our store
  const setAnalysisData = useDashboardStore((state) => state.setAnalysisData);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setIsUploaded(false);
    setError(null);
    setAnalysisData(null); // Clear any old data

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Send the file to the real backend endpoint
      const response = await axios.post("http://127.0.0.1:8000/api/v1/analyze", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // 2. Save the ENTIRE response to our global store
      setAnalysisData(response.data);

      // 3. Set UI to success and redirect
      setIsUploading(false);
      setIsUploaded(true);
      
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to the dashboard
      }, 1000); // Wait 1 sec on "Success" before redirecting

    } catch (err) {
      // Handle errors from the backend
      setIsUploading(false);
      setIsUploaded(false);
      const errorMsg = err.response ? err.response.data.detail : "An error occurred during analysis.";
      setError(errorMsg);
      console.error(err);
    }
  };

  return (
    <div className="upload-page-container">
      <div className="upload-box">
        <UploadAnimation />
        
        <h2>AI-Powered Data Platform</h2>
        <p>Upload your CSV file to begin analysis. The dashboard will be generated instantly.</p>
        
        <label 
          className={`upload-button ${isUploading ? 'loading' : ''} ${isUploaded ? 'success' : ''}`}
        >
          {isUploading && (
            <>
              <div className="spinner"></div>
              Analyzing...
            </>
          )}
          {isUploaded && (
            <>
              <FileCheck size={20} />
              Success! Redirecting...
            </>
          )}
          {!isUploading && !isUploaded && (
            <>
              <UploadCloud size={20} />
              Select File to Analyze
            </>
          )}
          <input 
            type="file" 
            onChange={handleFileUpload} 
            disabled={isUploading || isUploaded}
            accept=".csv"
          />
        </label>
        
        {/* Show an error message if the API call fails */}
        {error && (
          <p style={{ color: 'var(--red-accent)', marginTop: '20px' }}>
            <strong>Analysis Failed:</strong> {error}
          </p>
        )}
      </div>
    </div>
  );
}