import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/ToolkitPage';
import DashboardPage from './pages/DashboardPage'; // <-- 1. IMPORT
import PipelinePage from './pages/PipelinePage';   // <-- 2. IMPORT
import AIAnalysisPage from './pages/AIAnalysisPage';
import FileConverterPage from './pages/FileConverterPage';

// In your routes section:

// We use 'export default' to match your project's pattern
export default function App() {
  return (
    // No layout here, each page is full-screen
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      
      {/* --- 3. DEFINE THE NEW ROUTES --- */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pipeline" element={<PipelinePage />} />
      <Route path="/ai-analysis" element={<AIAnalysisPage />} />
      <Route path="/file-converter" element={<FileConverterPage />} />
      
      {/* Placeholder routes */}
      <Route path="/support" element={<div>Support Page</div>} />
      <Route path="/settings" element={<div>Settings Page</div>} />
    </Routes>
  );
}