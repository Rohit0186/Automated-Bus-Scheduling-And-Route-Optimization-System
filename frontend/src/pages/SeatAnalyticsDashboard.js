import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './AdminStyles.css';

const SeatAnalyticsDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeatAnalytics();
  }, []);

  const fetchSeatAnalytics = async () => {
    try {
      const response = await api.get('/admin/buses/seat-status');
      setBuses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch seat analytics.');
      setLoading(false);
    }
  };

  const getOccupancyColor = (percentage) => {
    if (percentage < 50) return '#4caf50'; // Green
    if (percentage <= 80) return '#ff9800'; // Yellow
    return '#f44336'; // Red
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="back-btn" onClick={() => navigate('/admin')}>
          &larr; Back to Admin Panel
        </button>
        <h2>Seat Analytics Dashboard</h2>
        <p>Real-time bus occupancy and seat utilization</p>
      </div>

      {loading && <p>Loading analytics...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="analytics-grid">
        {buses.map((bus) => (
          <div key={bus.busId} className="analytics-card">
            <div className="card-header">
              <h3>Bus {bus.busNumber}</h3>
              <span className="bus-typeBadge">{bus.busType}</span>
            </div>
            
            <div className="occupancy-section">
              <div className="occupancy-header">
                <span>Occupancy</span>
                <span style={{ color: getOccupancyColor(bus.occupancyPercentage), fontWeight: 'bold' }}>
                  {bus.occupancyPercentage}%
                </span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${bus.occupancyPercentage}%`,
                    backgroundColor: getOccupancyColor(bus.occupancyPercentage)
                  }}
                ></div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-label">Total Seats</span>
                <span className="stat-value">{bus.totalSeats}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Booked</span>
                <span className="stat-value" style={{ color: '#f44336' }}>{bus.bookedSeats}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Available</span>
                <span className="stat-value" style={{ color: '#4caf50' }}>{bus.availableSeats}</span>
              </div>
            </div>
            
            <div className="card-actions">
              <button 
                className="config-btn"
                onClick={() => navigate(`/admin/seats/${bus.busId}?number=${bus.busNumber}`)}
              >
                Configure Seats
              </button>
            </div>
          </div>
        ))}
        {buses.length === 0 && !loading && (
          <p>No active buses found to display analytics.</p>
        )}
      </div>
    </div>
  );
};

export default SeatAnalyticsDashboard;
