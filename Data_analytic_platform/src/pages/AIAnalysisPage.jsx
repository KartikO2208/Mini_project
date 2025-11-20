import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Upload, BarChart3, Search, 
  TrendingUp, PieChart, Table, FileText, Loader2,
  MessageSquare, Zap, ChevronRight, Download, Settings,
  Globe, ArrowUp, Paperclip, X, File
} from 'lucide-react';

export default function AIAnalysisPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Quick action cards - without upload
  const quickActions = [
    { 
      icon: BarChart3, 
      label: 'Quantitative analysis', 
      description: 'Generate charts, tables, insights, data science models & more',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    },
    { 
      icon: Settings, 
      label: 'Qualitative analysis', 
      description: 'Add an AI-generated columns to your dataset with Enrichments',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    },
    { 
      icon: Zap, 
      label: 'Connect to external data', 
      description: 'Securely store your API keys and connect to any data source',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
    },
  ];

  // Playbook buttons
  const playbooks = [
    { icon: Sparkles, text: 'Clean data', color: '#F59E0B' },
    { icon: BarChart3, text: 'Generate charts', color: '#3B82F6' },
    { icon: Search, text: 'Exploratory analysis', color: '#8B5CF6' },
    { icon: TrendingUp, text: 'Data science', color: '#EF4444' },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Auto-send message about file upload
      const fileMessage = {
        role: 'user',
        content: `I've uploaded ${file.name}. Please analyze this file.`,
        timestamp: new Date(),
        hasFile: true,
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB'
      };
      setMessages(prev => [...prev, fileMessage]);
      
      // Simulate AI response
      setIsLoading(true);
      setTimeout(() => {
        const aiResponse = {
          role: 'assistant',
          content: `Great! I've received your file "${file.name}". Let me analyze it for you.\n\nFile Summary:\n• Format: ${file.name.split('.').pop().toUpperCase()}\n• Size: ${(file.size / 1024).toFixed(2)} KB\n• Processing...\n\nWhat would you like me to do with this data?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
  
    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: generateMockResponse(input),
        timestamp: new Date(),
        hasChart: Math.random() > 0.6
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };
  
  

  const generateMockResponse = (query) => {
    const responses = [
      "Based on your data analysis, I've identified several key insights:\n\n• The dataset contains 1,247 rows and 15 columns\n• Missing values detected in 3 columns: 'revenue' (5%), 'region' (2%)\n• Strong correlation (0.87) between marketing spend and revenue\n\nWould you like me to create visualizations for these insights?",
      
      "I've analyzed the trends in your data:\n\n• Revenue shows 23% growth over the last quarter\n• Top performing region: North America (45% of total)\n• Seasonality pattern detected with peaks in Q4\n\nShall I generate a detailed report?",
      
      "Here are the top 5 insights from your dataset:\n\n1. Customer retention rate: 78%\n2. Average order value: $234\n3. Peak sales day: Friday\n4. Conversion rate increased 12% month-over-month\n5. Mobile traffic accounts for 62% of visits\n\nWhat would you like to explore further?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickAction = (action) => {
    setInput(`Help me with ${action.label.toLowerCase()}`);
    inputRef.current?.focus();
  };

  const handlePlaybook = (playbook) => {
    setInput(playbook.text);
    inputRef.current?.focus();
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const showWelcome = messages.length === 0;

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FAFAFA',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Main Content Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 24px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '900px'
        }}>
          {/* Welcome Screen */}
          {showWelcome && (
            <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
              {/* Greeting */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '64px',
                marginTop: '60px'
              }}>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: '400',
                  color: '#1F2937',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
                }}>
                  Good Afternoon, User
                </h1>
                <p style={{
                  fontSize: '28px',
                  color: '#9CA3AF',
                  fontWeight: '400'
                }}>
                  Ready to start analyzing?
                </p>
              </div>

              {/* Quick Action Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '56px'
              }}>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action)}
                    style={{
                      padding: '28px 24px',
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: 'left',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: action.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}>
                      <action.icon size={28} color="white" strokeWidth={1.5} />
                    </div>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '10px',
                      lineHeight: '1.3'
                    }}>
                      {action.label}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {action.description}
                    </p>
                    <div style={{
                      marginTop: '16px',
                      fontSize: '14px',
                      color: action.color,
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      Watch demo →
                    </div>
                  </button>
                ))}
              </div>

              {/* Playbooks Section */}
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontSize: '15px',
                  color: '#6B7280',
                  marginBottom: '24px'
                }}>
                  or get started quickly with one of our Playbooks
                </p>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {playbooks.map((playbook, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePlaybook(playbook)}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                        e.currentTarget.style.borderColor = playbook.color;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                      }}
                    >
                      <playbook.icon size={18} strokeWidth={2} color={playbook.color} />
                      {playbook.text}
                    </button>
                  ))}
                  <button
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 
                      'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#3B82F6',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#EFF6FF';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    See all
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    marginBottom: '32px',
                    animation: 'slideUp 0.4s ease-out'
                  }}
                >
                  {msg.role === 'user' ? (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '12px'
                    }}>
                      <div style={{
                        maxWidth: '75%',
                        padding: '16px 20px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        borderRadius: '18px',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                      }}>
                        {msg.content}
                        {msg.hasFile && (
                          <div style={{
                            marginTop: '12px',
                            padding: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <File size={18} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', fontWeight: '600' }}>{msg.fileName}</div>
                              <div style={{ fontSize: '12px', opacity: 0.9 }}>{msg.fileSize}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '15px',
                        fontWeight: '600',
                        flexShrink: 0
                      }}>
                        K
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                      }}>
                        <Sparkles size={20} color="white" strokeWidth={2} />
                      </div>
                      <div style={{
                        maxWidth: '75%',
                        padding: '16px 20px',
                        backgroundColor: 'white',
                        borderRadius: '18px',
                        fontSize: '15px',
                        lineHeight: '1.7',
                        color: '#1F2937',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.content}
                        
                        {msg.hasChart && (
                          <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            backgroundColor: '#F9FAFB',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '12px'
                            }}>
                              <BarChart3 size={18} color="#3B82F6" />
                              <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                                Generated Visualization
                              </span>
                            </div>
                            <div style={{
                              height: '240px',
                              background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6366F1',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}>
                              📊 Interactive Chart Will Appear Here
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  animation: 'slideUp 0.4s ease-out'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Loader2 size={20} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                  <div style={{
                    padding: '16px 20px',
                    backgroundColor: 'white',
                    borderRadius: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    color: '#6B7280',
                    fontSize: '15px'
                  }}>
                    <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      Analyzing your data
                      <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>...</span>
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div style={{
        borderTop: '1px solid #E5E7EB',
        backgroundColor: 'white',
        padding: '20px 24px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Uploaded File Preview */}
          {uploadedFile && (
            <div style={{
              marginBottom: '12px',
              padding: '12px 16px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <File size={20} color="#3B82F6" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E40AF' }}>
                  {uploadedFile.name}
                </div>
                <div style={{ fontSize: '12px', color: '#60A5FA' }}>
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </div>
              </div>
              <button
                onClick={removeFile}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DBEAFE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={18} color="#3B82F6" />
              </button>
            </div>
          )}

          {/* Input Box */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px'
          }}>
            {/* File Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '12px',
                backgroundColor: 'white',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '52px',
                width: '52px',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.borderColor = '#3B82F6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              <Paperclip size={20} color="#6B7280" strokeWidth={2} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <div style={{
              flex: 1,
              position: 'relative'
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Formula Bot to create analysis, charts, or insights..."
                rows={1}
                style={{
                  width: '100%',
                  padding: '16px 60px 16px 16px',
                  fontSize: '15px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '14px',
                  resize: 'none',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s',
                  lineHeight: '1.5',
                  minHeight: '52px',
                  maxHeight: '150px',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              
              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                style={{
                  position: 'absolute',
                  right: '8px',
                  bottom: '8px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: input.trim() && !isLoading
                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                    : '#E5E7EB',
                  border: 'none',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: input.trim() && !isLoading
                    ? '0 2px 8px rgba(59, 130, 246, 0.4)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (input.trim() && !isLoading) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ArrowUp size={20} color="white" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}