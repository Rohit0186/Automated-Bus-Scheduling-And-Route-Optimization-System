import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import LiveMap from '../components/LiveMap';
import { MapPin, Clock, Zap, AlertTriangle, CheckCircle, ArrowLeft, RefreshCw, Search } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import toast, { Toaster } from 'react-hot-toast';

const Tracking = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        setTracking(dataItems[0]); 
        setError(null);
        if (dataItems[0].status === 'INACTIVE') {
           toast(dataItems[0].message || 'Bus is inactive', { icon: 'ℹ️' });
        }
      } else {
        toast.error("No bus found");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  // Initial fetch for baseline sync
  const fetchBaseline = useCallback(async () => {
    try {
      const res = await api.get(`/tracking/live/${scheduleId}`);
      setTracking(res.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError('Unable to fetch live tracking data.');
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchBaseline();
  }, [fetchBaseline]);

  // LIVE WEBSOCKET SUBSCRIPTION
  const topic = `/topic/tracking/${scheduleId}`;
  useWebSocket(topic, (message) => {
    setTracking(message); // Instant seamless update
  });

  // GEOFENCING NOTIFICATION SUB
  useWebSocket(`/topic/notifications/${scheduleId}`, (noti) => {
    if (noti.type === 'WARNING') {
      toast.error(noti.message, { duration: 6000, icon: '⚠️' });
    } else {
      toast.success(noti.message, { duration: 5000, icon: '🚏' });
    }
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <p style={{ color: '#1a2a4b', marginTop: '16px', fontWeight: '600' }}>Starting Real-Time Sync...</p>
      </div>
    );
  }

  if (error && !tracking) {
    return (
      <div className="container animate-fade" style={{ paddingTop: '40px' }}>
        <div className="glass-morphism" style={{ padding: '40px', textAlign: 'center' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h3>{error}</h3>
          <p style={{ color: '#666', marginTop: '8px' }}>Schedule ID: {scheduleId}</p>
          <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </div>
    );
  }

  const isDelayed = tracking?.status === 'DELAYED';

  return (
    <div className="container animate-fade" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <div style={styles.header}>
        <button className="btn" onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2 style={styles.title}>🚌 Live Bus Tracking</h2>
          <p style={styles.subtitle}>Schedule #{scheduleId} • {tracking?.busNumber}</p>
        </div>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
          <input 
             type="text" 
             value={busSearch} 
             onChange={e => setBusSearch(e.target.value)} 
             placeholder="Search Bus Number..."
             style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
          />
          <button type="submit" disabled={searchLoading} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
             <Search size={16} /> 
          </button>
        </form>

        <div style={{...styles.statusBadge(isDelayed), marginLeft: 'auto'}}>
          {isDelayed ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
          {tracking?.status || 'ON_TIME'}
        </div>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        <div className="glass-morphism" style={styles.statCard}>
          <MapPin size={20} color="#d84e55" />
          <div>
            <div style={styles.statLabel}>Current Local</div>
            <div style={styles.statValue}>{tracking?.currentStop || '—'}</div>
          </div>
        </div>
        <div className="glass-morphism" style={styles.statCard}>
          <Zap size={20} color="#1a2a4b" />
          <div>
            <div style={styles.statLabel}>Next Stop</div>
            <div style={styles.statValue}>{tracking?.nextStop || '—'}</div>
          </div>
        </div>
        <div className="glass-morphism" style={styles.statCard}>
          <Clock size={20} color="#ff8c00" />
          <div>
            <div style={styles.statLabel}>ETA to Next Stop</div>
            <div style={{ ...styles.statValue, color: '#ff8c00' }}>
              {tracking?.etaMinutes ?? '—'} min
            </div>
          </div>
        </div>
        <div className="glass-morphism" style={styles.statCard}>
          <RefreshCw size={20} color="#22c55e" className="spin-slow" />
          <div>
            <div style={styles.statLabel}>Live Connection</div>
            <div style={{ ...styles.statValue, fontSize: '13px', color: '#22c55e' }}>
              WebSockets Active
            </div>
          </div>
        </div>
      </div>

      {/* Map + Stop List */}
      <div style={styles.mapLayout}>
        <div style={{ flex: 2 }}>
          <LiveMap
            currentLat={tracking?.currentLat}
            currentLng={tracking?.currentLng}
            routeStops={tracking?.routeStops || []}
            polyline={tracking?.polyline || []}
            busNumber={tracking?.busNumber}
            nextStop={tracking?.nextStop}
            etaMinutes={tracking?.etaMinutes}
            status={tracking?.status}
            height="500px"
            autoCenter={true}
          />
          {isDelayed && (
            <div style={styles.delayBanner}>
              <AlertTriangle size={16} color="#dc2626" />
              Traffic/Delay Alert: {tracking?.delayInfo}
            </div>
          )}
        </div>

        {/* Stop List Panel */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div className="glass-morphism" style={styles.stopPanel}>
            <h3 style={styles.stopPanelTitle}>
              <MapPin size={16} color="#d84e55" /> Route Timeline
            </h3>
            <div style={styles.stopList}>
              {(tracking?.routeStops || []).map((stop, i) => (
                <div key={stop.stopId || i} style={styles.stopItem(stop)}>
                  <div style={styles.timelineDot(stop)} />
                  {i < (tracking?.routeStops?.length - 1) && <div style={styles.timelineLine} />}
                  <div style={styles.stopContent}>
                    <div style={styles.stopName(stop)}>{stop.stopName}</div>
                    <div style={styles.stopMeta(stop)}>
                      {stop.isPassed && '✅ Passed'}
                      {stop.isCurrentStop && '🚌 Arrived / Stopped Here'}
                      {stop.isNextStop && `⏱ Next • ${stop.etaMinutes} min`}
                      {!stop.isPassed && !stop.isCurrentStop && !stop.isNextStop && `ETA: ${stop.etaMinutes} min`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Styles ──────────────────────────────────────────────
const styles = {
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' },
  loadingSpinner: { width: '48px', height: '48px', borderRadius: '50%', border: '5px solid #f3f3f3', borderTop: '5px solid #d84e55', animation: 'spin 1s linear infinite' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' },
  backBtn: { border: '1px solid #ddd', color: '#666', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 },
  title: { fontSize: '24px', fontWeight: '800', color: '#1a2a4b', margin: 0 },
  subtitle: { color: '#666', fontSize: '14px', margin: 0 },
  statusBadge: (delayed) => ({ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '24px', fontWeight: '700', fontSize: '13px', background: delayed ? '#fee2e2' : '#dcfce7', color: delayed ? '#dc2626' : '#16a34a' }),
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' },
  statLabel: { fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' },
  statValue: { fontSize: '15px', fontWeight: '700', color: '#1a2a4b', marginTop: '2px' },
  mapLayout: { display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' },
  delayBanner: { marginTop: '12px', background: '#fee2e2', color: '#dc2626', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' },
  stopPanel: { padding: '20px', height: '500px', overflowY: 'auto' },
  stopPanelTitle: { display: 'flex', alignItems: 'center', gap: '8px', color: '#1a2a4b', marginBottom: '16px', fontSize: '15px', fontWeight: '700' },
  stopList: { position: 'relative', paddingLeft: '28px' },
  stopItem: (stop) => ({ position: 'relative', paddingBottom: '20px', opacity: stop.isPassed ? 0.7 : 1 }),
  timelineDot: (stop) => ({ position: 'absolute', left: '-28px', top: '3px', width: stop.isCurrentStop || stop.isNextStop ? '14px' : '10px', height: stop.isCurrentStop || stop.isNextStop ? '14px' : '10px', borderRadius: '50%', background: stop.isCurrentStop ? '#d84e55' : stop.isNextStop ? '#ff8c00' : stop.isPassed ? '#22c55e' : '#c8d0e0', border: '2px solid white', boxShadow: '0 0 0 2px ' + (stop.isCurrentStop ? '#d84e55' : stop.isNextStop ? '#ff8c00' : stop.isPassed ? '#22c55e' : '#c8d0e0'), marginLeft: stop.isCurrentStop || stop.isNextStop ? '-2px' : '0', zIndex: 1 }),
  timelineLine: { position: 'absolute', left: '-22px', top: '16px', width: '2px', height: 'calc(100% - 6px)', background: '#e2e8f0', zIndex: 0 },
  stopContent: { paddingLeft: '4px' },
  stopName: (stop) => ({ fontWeight: stop.isCurrentStop || stop.isNextStop ? '700' : '500', fontSize: '13px', color: stop.isCurrentStop ? '#d84e55' : stop.isNextStop ? '#ff8c00' : '#334155' }),
  stopMeta: (stop) => ({ fontSize: '11px', marginTop: '2px', color: stop.isCurrentStop ? '#d84e55' : stop.isNextStop ? '#ff8c00' : stop.isPassed ? '#22c55e' : '#94a3b8' }),
};

export default Tracking;
