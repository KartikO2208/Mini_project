import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
// import PipelineBuilderPage from './pages/PipelineBuilderPage'; // <-- 1. DELETE OR COMMENT OUT THIS LINE

function App() {
  return (
    <Routes>
      {/* The default page is the upload page */}
      <Route path="/" element={<UploadPage />} />
      
      {/* The dashboard page, redirected to from the upload */}
      <Route path="/dashboard" element={<DashboardPage />} />
      
      {/* The pipeline builder page */}
      {/* <Route path="/pipeline" element={<PipelineBuilderPage />} /> // <-- 2. DELETE OR COMMENT OUT THIS LINE */}
    </Routes>
  );
}

export default App;