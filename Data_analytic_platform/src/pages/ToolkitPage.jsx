import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, SlidersHorizontal, FileText, Repeat2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import UploadModal from '../components/UploadModal';

import '../styles/ToolkitPage.css';

const tools = [
  {
    title: "AI-Powered Analysis",
    description: "Automatically analyze your data and surface key trends in seconds",
    icon: <BarChart />,
    action: 'navigate', // Direct navigation - NO MODAL
    destination: '/ai-analysis', // Must match route in App.jsx
  },
  {
    title: "Visual Pipeline Builder",
    description: "Build custom workflows to clean, transform, and analyze data.",
    icon: <SlidersHorizontal />,
    action: 'openModal', // Shows upload modal first
    destination: '/pipeline',
  },
  {
    title: "Quick Data Profiler",
    description: "Get a fast overview of your file's columns, data types, and missing values.",
    icon: <FileText />,
    action: 'openModal', // Shows upload modal first
    destination: '/dashboard',
  },
  {
    title: "File Converter",
    description: "Convert between CSV, JSON, and Parquet. (Coming Soon)",
    icon: <Repeat2 />,
    action: 'disabled',
    destination: null,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNavTarget, setModalNavTarget] = useState(null);

  const handleCardClick = (tool) => {
    console.log('🔍 Tool clicked:', tool.title);
    console.log('📍 Action:', tool.action);
    console.log('🎯 Destination:', tool.destination);
    
    if (tool.action === 'navigate') {
      // Direct navigation for AI Analysis - NO MODAL
      console.log('✅ Navigating directly to:', tool.destination);
      navigate(tool.destination);
    } else if (tool.action === 'openModal') {
      // Open modal for other tools
      console.log('📤 Opening modal for:', tool.title);
      setModalNavTarget(tool.destination);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="tk-page">
        <main className="tk-main">
          {/* Header */}
          <header className="tk-header">
            <motion.h1
              className="tk-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to your Toolkit
            </motion.h1>
            <motion.p
              className="tk-subtitle"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Select a tool below to start analyzing your data.
            </motion.p>
          </header>

          {/* Tools Grid */}
          <section className="tk-tools-section">
            <motion.div
              className="tk-tools-grid"
              initial="hidden"
              animate="visible"
            >
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  className="tk-tool-card"
                  style={{ 
                    opacity: tool.action === 'disabled' ? 0.7 : 1
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  whileHover={{
                    y: -6,
                    boxShadow: "0px 12px 28px rgba(38, 28, 26, 0.08)"
                  }}
                >
                  <div>
                    <div className="tk-tool-top">
                      <div className="tk-tool-icon">{tool.icon}</div>
                    </div>
                    <div className="tk-tool-body">
                      <h3 className="tk-tool-title">{tool.title}</h3>
                      <p className="tk-tool-desc">{tool.description}</p>
                    </div>
                  </div>
                  <div className="tk-tool-footer">
                    <button
                      className="tk-cta-button"
                      onClick={() => handleCardClick(tool)}
                      disabled={tool.action === 'disabled'}
                    >
                      {tool.action === 'disabled' ? 'Coming Soon' : 'Launch Tool'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Recent Activity */}
          <motion.section
            className="tk-activity"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="activity-title">Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot"><Clock size={16} /></div>
                <div className="activity-name">You analyzed <strong>dirty_demo_data.csv</strong></div>
                <div className="activity-meta">10m ago</div>
              </div>
              <div className="activity-item">
                <div className="activity-dot"><Clock size={16} /></div>
                <div className="activity-name">You ran a pipeline with <strong>"Remove Duplicates"</strong></div>
                <div className="activity-meta">1h ago</div>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
      
      {/* Upload Modal - Only for Pipeline & Profiler */}
      <UploadModal 
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        destination={modalNavTarget}
      />
    </>
  );
}