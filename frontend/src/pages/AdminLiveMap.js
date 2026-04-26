import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import LiveMap from '../components/LiveMap';
import { Bus, MapPin, AlertTriangle, CheckCircle, RefreshCw, X, Play, Search } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';

const AdminLiveMap = () => {
  const navigate = useNavigate();
  const [activeBuses, setActiveBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(true);

  const [busSearch, setBusSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!busSearch.trim()) return;
    setSearchLoading(true);
    try {
      const res = await api.get(`/tracking/bus/${busSearch}`);
      const dataItems = res.data;
      if (dataItems && dataItems.length > 0) {
        const found = dataItems[0];
        if (found.status === 'INACTIVE') {
           setActiveBuses(prev => {
             if (prev.find(b => b.busNumber === found.busNumber)) return prev;
             found.currentLat = found.lastKnownLocation?.lat || 26.8521;
             found.currentLng = found.lastKnownLocation?.lng || 80.9363;
             return [found, ...prev];
           });
        }
        setSelectedBus(found);
      } else {
        alert("No bus found");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  // Initial HTTP fetch
  const fetchActiveBuses = useCallback(async () => {
    try {
      const res = await api.get('/tracking/all-active');
      setActiveBuses(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Admin tracking fetch error', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveBuses();
  }, [fetchActiveBuses]);

  // LIVE WEBSOCKET SUBSCRIPTION FOR MULTI-BUS
  useWebSocket('/topic/admin/active-buses', (buses) => {
    setActiveBuses(buses);
    if (selectedBus) {
      const updatedMatch = buses.find(b => b.busId === selectedBus.busId);
      if (updatedMatch) setSelectedBus(updatedMatch);
    }
  });

  return (
    <div style={{ padding: '0', position: 'relative' }}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bus size={20} color="#d84e55" />
          <h3 style={styles.title}>Live Fleet Map</h3>
          <span style={styles.badge}>{activeBuses.length} Active Trips</span>
        </div>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input 
             type="text" 
             value={busSearch} 
             onChange={e => setBusSearch(e.target.value)} 
             placeholder="Search Bus Number..."
             style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', width: '180px' }}
          />
          <button type="submit" disabled={searchLoading} className="btn btn-primary" style={{ padding: '6px 12px' }}>
             {searchLoading ? '...' : <Search size={14} />} 
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>
          <div style={{width:'8px',height:'8px',background:'#22c55e',borderRadius:'50%',animation:'pulse 1.5s infinite'}}></div>
          Connected via WebSockets
        </div>
      </div>

      <div style={styles.layout}>
        {/* Map - Now passes cluster={true} */}
        <div style={{ flex: 1.6 }}>
          {loading ? (
            <div style={styles.mapPlaceholder}>Loading fleet topology...</div>
          ) : activeBuses.length === 0 ? (
            <div style={styles.mapPlaceholder}>
              <Bus size={48} color="#cbd5e1" />
              <p style={{ color: '#94a3b8', marginTop: '12px' }}>No buses are actively moving right now</p>
            </div>
          ) : (
            <LiveMap
              currentLat={null}
              currentLng={null}
              routeStops={selectedBus?.routeStops || []}
              polyline={selectedBus?.polyline || activeBuses[0]?.polyline || []}
              allBuses={activeBuses}
              onBusClick={(b) => setSelectedBus(b)}
              height="420px"
              autoCenter={false}
              cluster={true}
            />
          )}
        </div>

        {/* Bus list */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={styles.busList}>
            {activeBuses.length === 0 && !loading && (
               <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No trips actively broadcasting</p>
            )}
            {activeBuses.map((bus, i) => (
              <div key={bus.busId || i} style={styles.busCard(selectedBus?.busId === bus.busId)} onClick={() => setSelectedBus(bus)}>
                <div style={styles.busCardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={styles.busIndicator(bus.status)} />
                    <strong style={{ fontSize: '13px', color: '#1a2a4b' }}>{bus.busNumber}</strong>
                  </div>
                  <span style={styles.statusPill(bus.status)}>{bus.status}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                  <div>📍 {bus.currentStop}</div>
                  <div>➡ {bus.nextStop}</div>
                  <div style={{ color: '#ff8c00', fontWeight: '600', marginTop: '4px' }}>⏱ ETA {bus.etaMinutes} min</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected bus detail panel - Now includes Playback button */}
      {selectedBus && (
        <div style={styles.detailPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <strong style={{ color: '#d84e55', fontSize: '16px' }}>🚌 {selectedBus.busNumber} Routing Info</strong>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setSelectedBus(null)}><X size={18} /></button>
          </div>
          <div style={styles.detailGrid}>
            <div style={styles.detailItem}><span style={styles.detailLabel}>Schedule</span><span style={styles.detailValue}>#{selectedBus.scheduleId}</span></div>
            <div style={styles.detailItem}><span style={styles.detailLabel}>Speed Traffic</span><span style={styles.detailValue}>{Math.round(selectedBus.speed)} km/h</span></div>
            <div style={styles.detailItem}><span style={styles.detailLabel}>Local Status</span><span style={styles.detailValue}>{selectedBus.currentStop}</span></div>
            <div style={styles.detailItem}><span style={styles.detailLabel}>Current ETA</span><span style={{ ...styles.detailValue, color: '#ff8c00' }}>{selectedBus.etaMinutes} min</span></div>
          </div>
          {selectedBus.delayInfo && (<div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginTop: '12px' }}>⚠️ {selectedBus.delayInfo}</div>)}
          
          <button 
            onClick={() => navigate(`/admin/playback/${selectedBus.scheduleId}`)}
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
          >
             <Play size={16} /> Open Trip Playback DVR
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  title: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a2a4b' },
  badge: { background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  layout: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  mapPlaceholder: { height: '420px', background: '#f8fafc', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' },
  busList: { display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' },
  busCard: (selected) => ({ padding: '14px', borderRadius: '10px', cursor: 'pointer', background: selected ? '#fff5f5' : '#f8fafc', border: `2px solid ${selected ? '#d84e55' : '#e2e8f0'}`, transition: 'all 0.2s' }),
  busCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  busIndicator: (status) => ({ width: '8px', height: '8px', borderRadius: '50%', background: status === 'ON_TIME' ? '#22c55e' : '#f59e0b', boxShadow: `0 0 0 3px ${status === 'ON_TIME' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}` }),
  statusPill: (status) => ({ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: status === 'ON_TIME' ? '#dcfce7' : '#fef3c7', color: status === 'ON_TIME' ? '#16a34a' : '#92400e' }),
  detailPanel: { marginTop: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  detailLabel: { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  detailValue: { fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' },
};

export default AdminLiveMap;
