import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import LiveMap from '../components/LiveMap';
import { Play, Square, MapPin, Send, ArrowLeft, Bus, Navigation } from 'lucide-react';

// Lucknow → Delhi sample polyline for simulation (matches route 1 DB data)
const DEMO_POLYLINE = [
  [26.8521, 80.9363], [26.8350, 80.8900], [26.7800, 80.7500], [26.6900, 80.5800],
  [26.5800, 80.4800], [26.4900, 80.3700], [26.4499, 80.3319], [26.4200, 80.2500],
  [26.3800, 80.1200], [26.3200, 79.9800], [26.2500, 79.7500], [26.1500, 79.5000],
  [26.7770, 79.0220], [26.8900, 78.9000], [27.0000, 78.7500], [27.0800, 78.6000],
  [27.1200, 78.3000], [27.1700, 78.1000], [27.2140, 77.9351], [27.3000, 77.8000],
  [27.5000, 77.5000], [27.8000, 77.3500], [28.0000, 77.3200], [28.4000, 77.2800],
  [28.6675, 77.2285],
];

const DriverPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tripStarted, setTripStarted] = useState(false);
  const [location, setLocation] = useState({ lat: 26.8521, lng: 80.9363 });
  const [busId, setBusId] = useState(1);
  const [scheduleId, setScheduleId] = useState(1);
  const [simIndex, setSimIndex] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gpsSync, setGpsSync] = useState(false);
  const simRef = useRef(null);

  // Fetch schedules for driver
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get('/admin/schedules');
        setSchedules(res.data || []);
      } catch (err) {
        console.error('Could not load schedules');
      }
    };
    fetchSchedules();
  }, []);

  // Simulation: advance along polyline every 3s when trip is started
  useEffect(() => {
    if (tripStarted) {
      simRef.current = setInterval(() => {
        setSimIndex(prev => {
          const nextIdx = Math.min(prev + 1, DEMO_POLYLINE.length - 1);
          const [lat, lng] = DEMO_POLYLINE[nextIdx];
          setLocation({ lat, lng });
          return nextIdx;
        });
      }, 3000);
    } else {
      clearInterval(simRef.current);
    }
    return () => clearInterval(simRef.current);
  }, [tripStarted]);

  // Send location to backend whenever it changes (if trip active)
  useEffect(() => {
    if (!tripStarted) return;
    const sendLoc = async () => {
      try {
        await api.post(
          `/driver/update-location?busId=${busId}&scheduleId=${scheduleId}&lat=${location.lat}&lng=${location.lng}`
        );
        setGpsSync(true);
        setTimeout(() => setGpsSync(false), 800);
      } catch (err) {
        console.error('Location update failed');
      }
    };
    sendLoc();
  }, [location]);

  const handleStart = async () => {
    setLoading(true);
    try {
      await api.post(`/driver/start-trip?busId=${busId}&scheduleId=${scheduleId}`);
      setSimIndex(0);
      setLocation({ lat: DEMO_POLYLINE[0][0], lng: DEMO_POLYLINE[0][1] });
      setTripStarted(true);
    } catch (err) {
      alert('Failed to start trip. Please check your bus/schedule selection.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      await api.post(`/driver/end-trip?busId=${busId}&scheduleId=${scheduleId}`);
    } catch (err) {
      // still stop locally
    }
    setTripStarted(false);
    setSimIndex(0);
  };

  const [sosActive, setSosActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const stompClient = useRef(null);

  // WebSocket for SOS and Chat
  useEffect(() => {
    const SockJS = require('sockjs-client');
    const Stomp = require('@stomp/stompjs');
    
    const client = new Stomp.Client({
      brokerURL: 'ws://localhost:8085/ws-tracking', // Fallback for pure WebSocket
      webSocketFactory: () => new SockJS('http://localhost:8085/ws-tracking'),
      onConnect: () => {
        console.log('Connected to Driver Signal Hub');
        client.subscribe('/topic/chat', (message) => {
          const newMsg = JSON.parse(message.body);
          setMessages(prev => [...prev, newMsg]);
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => client.deactivate();
  }, []);

  const handleSOS = async () => {
    try {
      await api.post('/notifications/sos', {
        scheduleId,
        message: `EMERGENCY SOS: Bus ${busId} requires immediate assistance at ${location.lat}, ${location.lng}`,
      });
      setSosActive(true);
      toast.error("SOS Signal Transmitted!", { icon: '🚨', duration: 5000 });
    } catch (err) {
      console.error("SOS Failed");
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    try {
      await api.post('/notifications/chat', {
        scheduleId,
        message: chatInput,
        type: 'INFO'
      });
      setChatInput("");
    } catch (err) {
      console.error("Chat Failed");
    }
  };

  const progressPct = Math.round((simIndex / (DEMO_POLYLINE.length - 1)) * 100);

  return (
    <div className="container animate-fade" style={{ maxWidth: '1200px', paddingTop: '20px', paddingBottom: '40px' }}>
      
      {/* SOS FLASH OVERLAY (Visual only) */}
      {sosActive && <div className="sos-overlay" />}

      {user?.role === 'ADMIN' && (
        <button
          className="btn"
          onClick={() => navigate('/admin')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', border: '1px solid var(--secondary)', color: 'var(--secondary)' }}
        >
          <ArrowLeft size={16} /> Back to Admin Panel
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1a2a4b', fontWeight: '800', fontSize: '26px' }}>🚌 Driver Console</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
            <button 
                onClick={() => setShowChat(!showChat)}
                className="btn" 
                style={{ background: '#f1f5f9', color: '#1a2a4b', position: 'relative' }}
            >
                <Send size={18} /> Chat {messages.length > 0 && <span style={styles.chatBadge}>{messages.length}</span>}
            </button>
            <button 
                onClick={handleSOS}
                className="btn" 
                style={{ background: '#ef4444', color: 'white', fontWeight: '800', border: '2px solid #b91c1c' }}
            >
                ⚠️ SOS PANIC
            </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showChat ? '1fr 2fr 1fr' : '1fr 1.6fr', gap: '24px', transition: 'all 0.3s' }}>
        {/* Control Panel */}
        <div>
          <div className="glass-morphism" style={{ padding: '28px', border: sosActive ? '3px solid #ef4444' : 'none' }}>
            {/* Bus Config */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Bus ID</label>
              <select
                value={busId}
                onChange={e => setBusId(Number(e.target.value))}
                disabled={tripStarted}
                style={selectStyle}
              >
                <option value={1}>1 — UP32-AT-1234</option>
                <option value={2}>2 — UP78-BN-5678</option>
                <option value={3}>3 — DL01-CS-9012</option>
              </select>
            </div>

            {/* Same as before... */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Schedule</label>
              <select
                value={scheduleId}
                onChange={e => setScheduleId(Number(e.target.value))}
                disabled={tripStarted}
                style={selectStyle}
              >
                {schedules.map(s => <option key={s.id} value={s.id}>#{s.id} — {s.route?.source} → {s.route?.destination}</option>)}
              </select>
            </div>

            <div style={statusBox(tripStarted)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: tripStarted ? '#22c55e' : '#ef4444',
                  animation: tripStarted ? 'pulse 1.5s infinite' : 'none',
                }} />
                <strong>{tripStarted ? 'Trip In Progress' : 'Idle'}</strong>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {!tripStarted ? (
                <button onClick={handleStart} className="btn btn-primary" style={{ gridColumn: '1 / -1', padding: '16px' }}>
                   START TRIP
                </button>
              ) : (
                <>
                  <button onClick={handleStop} className="btn" style={{ background: '#ef4444', color: 'white' }}>
                    END TRIP
                  </button>
                  <button className="btn" style={{ border: '1px solid #ddd' }} onClick={() => setSosActive(false)}>
                    RESOLVE SOS
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mini Map */}
        <div>
          <LiveMap
            currentLat={location.lat}
            currentLng={location.lng}
            polyline={DEMO_POLYLINE}
            status={sosActive ? "EMERGENCY" : "ON_TIME"}
            height="500px"
          />
        </div>

        {/* CHAT SIDEBAR */}
        {showChat && (
            <div className="glass-morphism animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '500px', padding: '0' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee', background: 'var(--primary)', color: 'white', borderRadius: '15px 15px 0 0' }}>
                    <strong>Control Center Chat</strong>
                </div>
                <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.map((m, idx) => (
                        <div key={idx} style={{ 
                            alignSelf: m.type === 'SOS' ? 'center' : 'flex-start',
                            background: m.type === 'SOS' ? '#fee2e2' : '#f1f5f9',
                            padding: '10px',
                            borderRadius: '10px',
                            fontSize: '13px'
                        }}>
                            {m.message}
                        </div>
                    ))}
                </div>
                <div style={{ padding: '15px', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                            placeholder="Type message..."
                            style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '8px' }}
                        />
                        <button onClick={sendChatMessage} className="btn btn-primary" style={{ padding: '8px' }}><Send size={16} /></button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: '600',
  color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
  marginBottom: '6px',
};
const selectStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '8px',
  border: '1px solid #e2e8f0', fontSize: '14px', color: '#1e293b',
  background: 'white', outline: 'none',
};
const statusBox = (active) => ({
  background: active ? '#f0fdf4' : '#fef2f2',
  border: `1px solid ${active ? '#86efac' : '#fca5a5'}`,
  borderRadius: '10px', padding: '14px', marginBottom: '16px',
});

// Keyframes
const style = document.createElement('style');
style.textContent = `@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`;
document.head.appendChild(style);

export default DriverPanel;
