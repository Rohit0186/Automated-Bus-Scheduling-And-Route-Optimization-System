import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSmoothMarker } from '../hooks/useSmoothMarker';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createBusIcon = (status = 'ON_TIME', busNumber = 'Bus') => new L.DivIcon({
  className: '',
  html: `<div class="bus-label" style="background: ${status === 'DELAYED' ? '#ef4444' : '#2563eb'};">🚌 ${busNumber}</div>`,
  iconSize: [100, 30],
  iconAnchor: [50, 15],
  popupAnchor: [0, -15],
});

const stopIcon = new L.DivIcon({ className: '', html: `<div style="background: #1a2a4b; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`, iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -10]});
const nextStopIcon = new L.DivIcon({ className: '', html: `<div style="background: #ff8c00; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(255,140,0,0.6); animation: pulse 1.5s infinite;"></div>`, iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -12]});
const passedStopIcon = new L.DivIcon({ className: '', html: `<div style="background: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); opacity: 0.8;"></div>`, iconSize: [12, 12], iconAnchor: [6, 6], popupAnchor: [0, -8]});

function UpdateMapCenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1.5 });
  }, [lat, lng, map]);
  return null;
}

// A wrapper for animated marker to separate state
const AnimatedBusMarker = ({ bus, onClick }) => {
  const smoothPos = useSmoothMarker([bus.currentLat, bus.currentLng], 3000);
  
  return (
    <Marker
      position={smoothPos}
      icon={createBusIcon(bus.status, bus.busNumber)}
      eventHandlers={{ click: () => onClick && onClick(bus) }}
    >
      <Popup className="uber-popup">
        <div className="popup-card">
          <div className="popup-brand">UPSRTC SMARTBUS</div>
          <div className="popup-main">
            <div className="bus-info">
              <span className="bus-no">{bus.busNumber}</span>
              <span className={`status-pill ${bus.status.toLowerCase()}`}>{bus.status.replace('_', ' ')}</span>
            </div>
            <div className="metrics-row">
              <div className="metric-item">
                <span className="m-label">SPEED</span>
                <span className="m-value">{Math.round(bus.speed || 0)} <small>km/h</small></span>
              </div>
              <div className="metric-item">
                <span className="m-label">ETA</span>
                <span className="m-value">{bus.etaMinutes} <small>mins</small></span>
              </div>
            </div>
          </div>
          <div className="popup-footer">
            Next: <strong>{bus.nextStop}</strong>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const LiveMap = ({
  currentLat, currentLng, routeStops = [], polyline = [],
  busNumber = 'Bus', nextStop = '', etaMinutes = 0, status = 'ON_TIME',
  autoCenter = true, height = '450px', allBuses = [], cluster = false, onBusClick = null
}) => {
  const center = currentLat && currentLng ? [currentLat, currentLng] : [26.8521, 80.9363];
  const polylineColor = status === 'DELAYED' ? '#ef4444' : '#1a2a4b';

  return (
    <div style={{ height, width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }} zoomControl={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {autoCenter && currentLat && currentLng && <UpdateMapCenter lat={currentLat} lng={currentLng} />}

        {polyline.length > 1 && (
          <Polyline positions={polyline} pathOptions={{ color: polylineColor, weight: 5, opacity: 0.8, dashArray: status === 'DELAYED' ? '10, 5' : null }} />
        )}

        {routeStops.map((stop, i) => (
          <Marker key={stop.stopId || i} position={[stop.latitude, stop.longitude]} icon={stop.isNextStop ? nextStopIcon : stop.isPassed ? passedStopIcon : stopIcon}>
             <Popup>
               <div style={{ minWidth: '140px', fontFamily: 'Inter, sans-serif' }}>
                 <strong style={{ color: '#1a2a4b', fontSize: '13px' }}>📍 {stop.stopName}</strong><br />
                 {stop.isPassed && <span style={{ color: '#22c55e', fontSize: '12px' }}>✅ Passed</span>}
                 {stop.isCurrentStop && <span style={{ color: '#d84e55', fontSize: '12px' }}>🚌 Bus is here</span>}
                 {stop.isNextStop && <span style={{ color: '#ff8c00', fontSize: '12px', display: 'block' }}>⏱ Next Stop — ETA: {stop.etaMinutes} min</span>}
                 {!stop.isPassed && !stop.isCurrentStop && !stop.isNextStop && <span style={{ color: '#666', fontSize: '12px' }}>ETA: {stop.etaMinutes} min</span>}
               </div>
             </Popup>
          </Marker>
        ))}

        {currentLat && currentLng && !cluster && (
           <AnimatedBusMarker 
              bus={{ currentLat, currentLng, status, busNumber, nextStop, etaMinutes }} 
           />
        )}

        {cluster ? (
          <MarkerClusterGroup chunkedLoading>
            {allBuses.map((bus, i) => 
               bus.currentLat && bus.currentLng && <AnimatedBusMarker key={`bus-${bus.busId || i}`} bus={bus} onClick={onBusClick} />
            )}
          </MarkerClusterGroup>
        ) : (
          allBuses.map((bus, i) => 
            bus.currentLat && bus.currentLng && <AnimatedBusMarker key={`bus-${bus.busId || i}`} bus={bus} onClick={onBusClick} />
          )
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
