import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { FileDown, Loader2, AlertCircle } from 'lucide-react';

const DataTable = () => {
  const { data, loading, error, searchQuery } = useDashboard();

  if (loading) {
    return (
      <div style={{ 
        padding: '80px', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', gap: '20px', color: 'var(--text-light)' 
      }}>
        <Loader2 className="spinner" size={48} style={{ animation: 'rotate 2s linear infinite', color: 'var(--primary)' }} />
        <p style={{ fontWeight: '700', fontSize: '15px' }}>Retrieving Live Fleet Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '60px', textAlign: 'center', color: 'var(--accent)',
        background: 'rgba(216, 78, 85, 0.05)', borderRadius: '16px'
      }}>
        <AlertCircle size={40} style={{ marginBottom: '16px' }} />
        <p style={{ fontWeight: '800' }}>{error}</p>
      </div>
    );
  }

  const filteredData = data.filter(item => {
    const searchStr = searchQuery.toLowerCase();
    return (
      (item.busNumber && item.busNumber.toLowerCase().includes(searchStr)) ||
      (item.name && item.name.toLowerCase().includes(searchStr)) ||
      (item.source && item.source.toLowerCase().includes(searchStr)) ||
      (item.destination && item.destination.toLowerCase().includes(searchStr))
    );
  });

  if (filteredData.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-light)' }}>
        <h3 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>No Results Found</h3>
        <p>No transport data matches your current search criteria.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th style={{ padding: '12px 20px', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Index</th>
            <th style={{ padding: '12px 20px', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Fleet Identity</th>
            <th style={{ padding: '12px 20px', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Route Metrics</th>
            <th style={{ padding: '12px 20px', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Export</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id} style={{ background: '#f8fafc', transition: 'all 0.2s ease' }} className="table-row-hover">
              <td style={{ padding: '20px', borderRadius: '12px 0 0 12px', fontWeight: '800', color: 'var(--text-light)', fontSize: '14px' }}>
                {String(index + 1).padStart(2, '0')}
              </td>
              <td style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: '800', color: 'var(--secondary)', fontSize: '15px' }}>{item.busNumber || item.name}</span>
                  {item.busType && (
                    <span style={{ 
                      fontSize: '9px', fontWeight: '900', background: 'rgba(15, 23, 42, 0.05)', 
                      color: 'var(--secondary)', padding: '2px 8px', borderRadius: '4px', width: 'fit-content'
                    }}>
                      {item.busType}
                    </span>
                  )}
                </div>
              </td>
              <td style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {item.source && (
                    <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-dark)' }}>
                      {item.source} <span style={{ color: 'var(--primary)', margin: '0 4px' }}>➔</span> {item.destination}
                    </span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: '600', color: 'var(--text-light)' }}>
                    <span>{item.distanceKm || '0'} KM</span>
                    <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                    <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{item.status || 'Active'}</span>
                  </div>
                </div>
              </td>
              <td style={{ padding: '20px', borderRadius: '0 12px 12px 0' }}>
                <button className="btn" style={{ 
                  padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0',
                  color: 'var(--secondary)', fontSize: '12px', fontWeight: '800'
                }}>
                  <FileDown size={14} /> PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .table-row-hover:hover {
          background: white !important;
          box-shadow: 0 10px 20px rgba(0,0,0,0.03);
          transform: scale(1.005);
          z-index: 10;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DataTable;
