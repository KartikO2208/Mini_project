import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import WorkspacePage from './pages/WorkspacePage'; // <-- NEW

// We use 'export default' to match your project's pattern
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/workspace" element={<WorkspacePage />} />
    </Routes>
  );
}