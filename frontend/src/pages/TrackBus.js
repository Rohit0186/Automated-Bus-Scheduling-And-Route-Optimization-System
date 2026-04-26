import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Navigation, Info, Clock, MapPin, Bus, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import api from '../api';
import LiveMap from '../components/LiveMap';
import { motion } from 'framer-motion';

const TrackBus = () => {
  const [busNumber, setBusNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [history, setHistory] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const stompClient = useRef(null);
  const pollingInterval = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentBusTrackings');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const saveSearch = (num) => {
    const updated = [num, ...recentSearches.filter(s => s !== num)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentBusTrackings', JSON.stringify(updated));
  };

  const clearTracking = useCallback(() => {
    if (stompClient.current) stompClient.current.deactivate();
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    setTrackingData(null);
    setHistory([]);
  }, []);

  const startLiveTracking = useCallback((busId) => {
    const socket = new SockJS('http://localhost:8085/ws-tracking');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.current.subscribe(`/topic/bus-location/${busId}`, (message) => {
          const update = JSON.parse(message.body);
          setTrackingData(prev => ({ 
            ...prev, 
            ...update,
            currentLat: update.latitude,
            currentLng: update.longitude,
            timestamp: Date.now() 
          }));
        });
      },
      onStompError: (frame) => {
        toast.error("Live connection failed. Reconnecting...");
      }
    });
    stompClient.current.activate();
  }, []);

  const handleSearch = async (num) => {
    const targetBus = typeof num === 'string' ? num : busNumber;
    if (!targetBus.trim()) return;

    setLoading(true);
    clearTracking();

    try {
      const res = await api.get(`/tracking/bus/${targetBus}`);
      if (res.data && res.data.status === 'ONGOING') {
        const data = res.data;
        const initialData = { ...data, currentLat: data.latitude, currentLng: data.longitude };
        setTrackingData(initialData);
        saveSearch(targetBus);
        startLiveTracking(data.busId);
        toast.success(`Tracking ${targetBus} live!`);
      } else {
        toast.error(res.data?.message || "Bus is not currently active.");
      }
    } catch (err) {
      toast.error("Error searching for bus.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => clearTracking();
  }, [clearTracking]);

  return (
    <div className="track-bus-root" style={{ height: 'calc(100vh - 80px)', display: 'flex', overflow: 'hidden' }}>
      {/* CONTROL SIDEBAR */}
      <div style={{ width: '400px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', zIndex: 20, boxShadow: '10px 0 30px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '30px', background: 'var(--secondary)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
             <div style={{ padding: '8px', background: 'rgba(249, 115, 22, 0.2)', borderRadius: '10px' }}>
                <Navigation size={20} color="var(--primary)" />
             </div>
             <h2 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px' }}>Fleet Tracking</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Live spatial intelligence engine</p>
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {/* SEARCH BOX */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                <input 
                  type="text" 
                  placeholder="Bus Number (UP32-XXXX)" 
                  style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', fontWeight: '700', outline: 'none' }}
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value.toUpperCase())}
                />
              </div>
              <button 
                onClick={() => handleSearch()}
                disabled={loading}
                style={{ padding: '12px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {loading ? "..." : <Navigation size={16} />}
              </button>
            </div>

            {recentSearches.length > 0 && !trackingData && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>History</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {recentSearches.map(s => (
                    <button 
                      key={s} 
                      onClick={() => { setBusNumber(s); handleSearch(s); }}
                      style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '800', color: '#475569', cursor: 'pointer' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!trackingData ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Bus size={32} opacity={0.5} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--secondary)', marginBottom: '8px' }}>Ready for Telemetry</h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6' }}>Enter a system-recognized bus number to begin receiving real-time spatial updates.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--primary)' }}>
                <div style={{ background: 'var(--primary)', padding: '12px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '1px' }}>LIVE TELEMETRY</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                    <span style={{ fontSize: '10px', fontWeight: '800' }}>CONNECTED</span>
                  </div>
                </div>
                
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '4px' }}>{trackingData.busNumber}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px', fontWeight: '700', marginBottom: '20px' }}>
                    <LayoutDashboard size={14} /> {trackingData.routeCode}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '4px' }}>VELOCITY</span>
                      <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--secondary)' }}>{Math.round(trackingData.speed || 0)} <small style={{ fontSize: '10px' }}>km/h</small></span>
                    </div>
                    <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '800', display: 'block', marginBottom: '4px' }}>TIME TO ARRIVAL</span>
                      <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--primary)' }}>{trackingData.etaMinutes} <small style={{ fontSize: '10px' }}>mins</small></span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} /> Segment Timeline
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', paddingLeft: '10px', borderLeft: '2px solid #f1f5f9' }}>
                  {trackingData.routeStops?.map((stop, i) => (
                    <div key={i} style={{ 
                      position: 'relative', paddingLeft: '24px', paddingBottom: '24px',
                      opacity: stop.isPassed ? 0.4 : 1
                    }}>
                      <div style={{ 
                        position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', 
                        borderRadius: '50%', background: stop.isNextStop ? 'var(--primary)' : stop.isPassed ? '#cbd5e1' : 'white',
                        border: `2px solid ${stop.isNextStop ? 'var(--primary)' : '#cbd5e1'}`,
                        boxShadow: stop.isNextStop ? '0 0 0 4px rgba(249, 115, 22, 0.2)' : 'none'
                      }}></div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: stop.isNextStop ? 'var(--primary)' : 'var(--secondary)' }}>{stop.stopName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>
                        {stop.isPassed ? "DEPARTED" : stop.isNextStop ? `TERMINAL APPROACHING` : `SCHEDULED ACCESS`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* MAP AREA */}
      <div style={{ flex: 1, position: 'relative' }}>
        {trackingData && (
          <div style={{ 
            position: 'absolute', top: '30px', left: '30px', zIndex: 10,
            background: 'white', padding: '12px 24px', borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <Bus size={18} color="var(--primary)" />
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--secondary)' }}>
              Current: <span style={{ color: 'var(--primary)' }}>{trackingData.currentStop || "Tracking..." }</span>
            </span>
          </div>
        )}
        <LiveMap 
          currentLat={trackingData?.currentLat} 
          currentLng={trackingData?.currentLng}
          routeStops={trackingData?.routeStops}
          polyline={trackingData?.polyline}
          busNumber={trackingData?.busNumber}
          nextStop={trackingData?.nextStop}
          etaMinutes={trackingData?.etaMinutes}
          status={trackingData?.status}
          height="100%"
        />
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default TrackBus;
