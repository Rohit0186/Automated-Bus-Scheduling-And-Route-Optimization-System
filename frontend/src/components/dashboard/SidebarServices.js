import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { Map, MapPin, Bus, Navigation } from 'lucide-react';

const SidebarServices = () => {
  const { activeModule, setActiveModule } = useDashboard();
  const navigate = useNavigate();

  const services = [
    { id: 'journey_planner', name: 'Journey Planner', icon: <Map size={18} />, route: '/journey-planner' },
    { id: 'depots', name: 'Depot & Bus Stations', icon: <MapPin size={18} />, route: '/depots-stations' },
    { id: 'bus_types', name: 'Type of Bus Services', icon: <Bus size={18} />, route: '/bus-types' },
    { id: 'track_bus', name: 'Track My Bus', icon: <Navigation size={18} />, route: '/track-bus' },
  ];

  const handleServiceClick = (service) => {
    setActiveModule(service.id);
    if (service.route) {
      navigate(service.route);
    }
  };

  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      <div style={{ 
        background: 'var(--secondary)', color: 'white', 
        padding: '20px', fontSize: '14px', fontWeight: '800',
        letterSpacing: '1px', textAlign: 'center', textTransform: 'uppercase'
      }}>
        Quick Services
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {services.map((item) => (
          <button
            key={item.id}
            onClick={() => handleServiceClick(item)}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 20px', border: 'none', background: 'none',
              width: '100%', textAlign: 'left', cursor: 'pointer',
              color: activeModule === item.id ? 'var(--primary)' : 'var(--text-dark)',
              fontWeight: '700', fontSize: '13px',
              borderLeft: `4px solid ${activeModule === item.id ? 'var(--primary)' : 'transparent'}`,
              background: activeModule === item.id ? 'rgba(249, 115, 22, 0.05)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ 
              color: activeModule === item.id ? 'var(--primary)' : 'var(--text-light)',
              display: 'flex', alignItems: 'center'
            }}>
              {item.icon}
            </span>
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarServices;
