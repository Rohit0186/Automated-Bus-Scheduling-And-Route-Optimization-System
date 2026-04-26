import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { IndianRupee, Star, ChevronRight, Clock, MapPin } from 'lucide-react';
import RouteExplorer from './RouteExplorer';
import { motion } from 'framer-motion';

const SearchResults = () => {
  const [buses, setBuses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const source = query.get('source');
  const destination = query.get('destination');
  const date = query.get('date');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await api.get(`/bus/search?source=${source}&destination=${destination}&date=${date}`);
        setBuses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBuses();
  }, [source, destination, date]);

  return (
    <div className="search-results-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* COMPACT SEARCH HEADER */}
      <div style={{ background: 'var(--secondary)', color: 'white', padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>{source} <span style={{ color: 'var(--primary)', margin: '0 8px' }}>➔</span> {destination}</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>
              {date} • {buses.length} Premium Services Available
            </p>
          </div>
          <button 
            onClick={() => navigate('/journey-planner')} 
            className="btn" 
            style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontSize: '13px' }}
          >
            Modify Search
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {buses.length > 0 ? (
            buses.map((bus, idx) => (
              <motion.div 
                key={bus.busId} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel" 
                style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}
              >
                <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', alignItems: 'center' }}>
                  {/* Bus Detail */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '900', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px' }}>{bus.busType}</span>
                      <span style={{ fontSize: '10px', fontWeight: '900', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '4px' }}>GPS ENABLED</span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '4px' }}>JanSafar {bus.busType}</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '12px', fontWeight: '800' }}>{bus.busNumber}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                       <span style={{ fontSize: '11px', fontWeight: '800', color: bus.availableSeats > 5 ? '#16a34a' : '#ef4444' }}>
                        {bus.availableSeats} Seats Left
                       </span>
                    </div>
                  </div>
                  
                  {/* Times */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '900', fontSize: '20px', color: 'var(--secondary)' }}>{bus.arrivalAtSource}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', marginTop: '4px' }}>{source}</div>
                  </div>

                  <div style={{ textAlign: 'center', position: 'relative' }}>
                     <div style={{ position: 'relative', width: '80px', height: '2px', background: '#e2e8f0', margin: '0 auto' }}>
                        <div style={{ position: 'absolute', right: 0, top: '-3px', width: '8px', height: '8px', background: '#e2e8f0', borderRadius: '50%' }}></div>
                     </div>
                     <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--primary)', marginTop: '8px' }}>SMART SERVICE</div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '900', fontSize: '20px', color: 'var(--secondary)' }}>{bus.arrivalTimeAtDest}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', marginTop: '4px' }}>{destination}</div>
                  </div>

                  {/* Price & Action */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
                      <IndianRupee size={20} /> {bus.fare}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button 
                        onClick={() => navigate(`/seats/${bus.tripId}?source=${source}&destination=${destination}&date=${date}`)}
                        className="btn btn-primary" 
                        style={{ padding: '12px', fontSize: '13px', borderRadius: '10px' }}
                      >
                        Select Seats
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
              <Clock size={64} style={{ opacity: 0.2, margin: '0 auto 24px' }} />
              <h2 style={{ color: 'var(--secondary)', fontWeight: '900', marginBottom: '10px' }}>No Buses Found</h2>
              <p style={{ fontWeight: '600' }}>No JanSafar buses pass through {source} to {destination} on this date.</p>
              <button 
                onClick={() => navigate('/journey-planner')} 
                className="btn btn-primary" 
                style={{ marginTop: '32px' }}
              >
                Modify Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
