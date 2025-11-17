import React, { useState } from 'react';
import { Search, Save, DownloadCloud, Bell, Settings, Database, ChevronDown } from 'lucide-react';

// Logo Component
const Logo = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px'
  }}>
    <div style={{
      width: '28px',
      height: '28px',
      backgroundColor: '#111827',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Database style={{ width: '16px', height: '16px', color: 'white', strokeWidth: 2.5 }} />
    </div>
    <span style={{
      fontSize: '16px',
      fontWeight: '600',
      letterSpacing: '-0.01em',
      color: '#111827'
    }}>
      DATASTREAM
    </span>
  </div>
);

export default function Navbar({ pageTitle = 'Dashboard', hasSave = false, hasExport = false, onSave, onExport }) {
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Determine current "main" section for breadcrumbs
  const path = window.location.pathname;
  let mainSection = 'Overview';
  if (path.includes('/dashboard')) {
    mainSection = 'Overview';
  } else if (path.includes('/pipeline')) {
    mainSection = 'Pipeline Builder';
  } else if (path.includes('/workspace')) {
    mainSection = 'Workspace';
  }

  return (
    <>
      {/* Import Inter font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* Top Navbar - Header Only */}
      <header style={{
        height: '56px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        {/* Left: Logo & Breadcrumbs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Logo />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              color: '#6B7280',
              fontSize: '13px',
              fontWeight: '400'
            }}>
              {mainSection}
            </span>
            <span style={{
              color: '#6B7280',
              fontSize: '13px',
              fontWeight: '400'
            }}>
              /
            </span>
            <span style={{
              color: '#111827',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              {pageTitle}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Search */}
          <div style={{
            position: 'relative',
            marginRight: '8px'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
              width: '16px',
              height: '16px',
              strokeWidth: 2
            }} />
            <input
              type="text"
              placeholder="Search anything"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: '256px',
                paddingLeft: '36px',
                paddingRight: '48px',
                paddingTop: '6px',
                paddingBottom: '6px',
                fontSize: '14px',
                backgroundColor: '#F9FAFB',
                border: searchFocused ? '1px solid #D1D5DB' : '1px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
            <kbd style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '2px 6px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#6B7280',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '4px'
            }}>
              ⌘K
            </kbd>
          </div>

          {hasSave && (
            <button 
              onClick={onSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Save size={16} strokeWidth={2} />
              Save
            </button>
          )}

          {hasExport && (
            <button 
              onClick={onExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2563EB',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
            >
              <DownloadCloud size={16} strokeWidth={2} />
              Export
            </button>
          )}

          <button 
            style={{
              padding: '8px',
              color: '#6B7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={18} strokeWidth={2} />
          </button>

          <button 
            style={{
              padding: '8px',
              color: '#6B7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Settings size={18} strokeWidth={2} />
          </button>

          
        </div>
      </header>
    </>
  );
}