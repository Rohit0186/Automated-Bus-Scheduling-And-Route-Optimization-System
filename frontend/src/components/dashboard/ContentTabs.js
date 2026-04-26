import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const ContentTabs = () => {
  const { activeTab, setActiveTab } = useDashboard();

  const tabs = [
    { id: 'AC', name: 'Premium AC Fleet' },
    { id: 'LONG_ROUTE', name: 'Long Distance' },
    { id: 'INTER_REGIONAL', name: 'Inter-Regional' },
    { id: 'REGIONAL', name: 'City & Regional' }
  ];

  return (
    <div style={{ padding: '0' }}>
      <div style={{ 
        display: 'flex', 
        background: '#f1f5f9', 
        borderRadius: '0',
        borderBottom: '1px solid #e2e8f0'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '16px 20px',
              border: 'none',
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-light)',
              fontWeight: '800',
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
              boxShadow: activeTab === tab.id ? '0 -4px 12px rgba(0,0,0,0.02)' : 'none'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div style={{ 
        padding: '24px 30px 0', 
        fontSize: '20px', 
        fontWeight: '900', 
        color: 'var(--secondary)',
        letterSpacing: '-0.5px'
      }}>
        {tabs.find(t => t.id === activeTab)?.name}
      </div>
    </div>
  );
};

export default ContentTabs;
