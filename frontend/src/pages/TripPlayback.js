import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Play, Pause, ArrowLeft, Clock, MapPin, Gauge } from 'lucide-react';

const busIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    background: linear-gradient(135deg, #1a2a4b, #2a4365);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(26,42,75,0.5);
    border: 2px solid white;
  ">
    <span style="transform: rotate(45deg); font-size: 16px;">🚌</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

function UpdateMapCenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 0.5 });
  }, [lat, lng, map]);
  return null;
}

const TripPlayback = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Scrubber state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const playTimer = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/tracking/history/${scheduleId}`);
        setHistory(res.data || []);
      } catch (err) {
        console.error('History fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [scheduleId]);

  useEffect(() => {
    if (isPlaying && history.length > 0) {
      playTimer.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= history.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(playTimer.current);
    }
    return () => clearInterval(playTimer.current);
  }, [isPlaying, history.length, playbackSpeed]);

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '100px'}}>Loading Trip Matrix DVR...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="container animate-fade" style={{ paddingTop: '40px', textAlign: 'center' }}>
        <h2>No Recorded History Found</h2>
        <p>There are no historical breadcrumbs stored for schedule #{scheduleId}. This trip might not have started yet.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const currentPoint = history[currentIndex];
  // Calculate a polyline array of all footprints
  const fullPolyline = history.map(h => [h.latitude, h.longitude]);
  // The polyline up to the current scrubber index
  const traveledPolyline = history.slice(0, currentIndex + 1).map(h => [h.latitude, h.longitude]);

  return (
    <div className="container animate-fade" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
        <button className="btn" onClick={() => navigate(-1)} style={{ border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2 style={{ margin: 0, color: '#1a2a4b', fontWeight: '800' }}>📹 Historical Trip Playback DVR</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Schedule #{scheduleId} • {history.length} Data Points Recorded</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* DVR Controls Sidebar */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="glass-morphism" style={{ padding: '24px' }}>
            
            {/* Playback Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button 
                onClick={() => {
                  if (currentIndex >= history.length - 1) setCurrentIndex(0);
                  setIsPlaying(!isPlaying);
                }} 
                style={{
                  background: isPlaying ? '#ef4444' : '#1a2a4b', 
                  color: 'white', border: 'none', borderRadius: '50%',
                  width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
              >
                {isPlaying ? <Pause fill="white" /> : <Play fill="white" />}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>Speed:</span>
                {[1, 2, 5, 10].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    style={{
                      background: playbackSpeed === speed ? '#1a2a4b' : '#f1f5f9',
                      color: playbackSpeed === speed ? 'white' : '#64748b',
                      border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer'
                    }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Scrubber Timeline */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                <span>Start</span>
                <span>{Math.round((currentIndex / (history.length - 1)) * 100)}%</span>
                <span>End</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={history.length - 1} 
                value={currentIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentIndex(parseInt(e.target.value));
                }}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* Current Point Meta data */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Snapshot Metadata</h4>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <Clock size={16} color="#64748b" />
                <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>
                  {new Date(currentPoint.recordedAt).toLocaleString()}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <Gauge size={16} color="#0284c7" />
                <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>
                  {Math.round(currentPoint.speed)} km/h
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={16} color="#d84e55" style={{ marginTop: '2px' }} />
                <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace' }}>
                  Lat: {currentPoint.latitude.toFixed(6)}<br/>
                  Lng: {currentPoint.longitude.toFixed(6)}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Playback Map */}
        <div style={{ flex: 2 }}>
          <div style={{ height: '550px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <MapContainer center={[history[0].latitude, history[0].longitude]} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              <UpdateMapCenter lat={currentPoint.latitude} lng={currentPoint.longitude} />

              {/* Entire route mapped faintly */}
              <Polyline positions={fullPolyline} pathOptions={{ color: '#cbd5e1', weight: 4 }} />
              
              {/* Highlight route traveled up to scrubber */}
              <Polyline positions={traveledPolyline} pathOptions={{ color: '#d84e55', weight: 6 }} />

              <Marker position={[currentPoint.latitude, currentPoint.longitude]} icon={busIcon}>
                <Popup>
                  Histroical Footprint #{currentIndex + 1}<br/>
                  {new Date(currentPoint.recordedAt).toLocaleTimeString()}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlayback;
