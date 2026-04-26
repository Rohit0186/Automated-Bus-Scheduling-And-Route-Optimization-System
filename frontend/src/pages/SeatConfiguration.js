import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api';
import './AdminStyles.css';

const SeatConfiguration = () => {
  const { busId } = useParams();
  const [searchParams] = useSearchParams();
  const busNumber = searchParams.get('number') || `ID: ${busId}`;
  
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    seatNumber: '',
    seatType: 'SEATER',
    position: 'WINDOW',
    price: 500
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchSeats();
  }, [busId]);

  const fetchSeats = async () => {
    try {
      // Corrected path to match SeatController @RequestMapping("/api/public/seats") + @GetMapping("/admin/{busId}")
      const response = await api.get(`/public/seats/admin/${busId}`);
      setSeats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch seats configuration.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSeat = async (e) => {
    e.preventDefault();
    try {
      // Corrected path to match SeatController @PostMapping("/admin")
      await api.post(`/public/seats/admin?busId=${busId}`, formData);
      fetchSeats();
      setFormData({ ...formData, seatNumber: '' }); // reset only seat number for easy multi-add
      setError('');
    } catch (err) {
      setError('Failed to add seat. It might already exist.');
    }
  };

  const handleDeleteSeat = async (seatId) => {
    if (!window.confirm("Are you sure you want to remove this seat?")) return;
    try {
      // Corrected path to match SeatController @DeleteMapping("/admin/delete/{seatId}")
      await api.delete(`/public/seats/admin/delete/${seatId}`);
      fetchSeats();
    } catch (err) {
      setError('Failed to delete seat. It might be linked to existing bookings.');
    }
  };

  // Group seats by type for visualization demo (simple layout)
  const renderSeatVisuals = () => {
    return seats.map(s => (
      <div 
        key={s.id} 
        className={`seat-box ${s.seatType.toLowerCase()} ${s.position.toLowerCase()}`}
        title={`${s.seatNumber} | ${s.seatType} | ₹${s.price}`}
      >
        <span className="seat-num">{s.seatNumber}</span>
        <button className="del-seat-btn" onClick={() => handleDeleteSeat(s.id)}>×</button>
      </div>
    ));
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="back-btn" onClick={() => navigate('/admin/seat-analytics')}>
          &larr; Back to Analytics
        </button>
        <h2>Seat Configuration</h2>
        <p>Bus {busNumber}</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="seat-config-grid">
        <div className="form-pane panel">
          <h3>Add New Seat</h3>
          <form onSubmit={handleAddSeat}>
            <div className="form-group">
              <label>Seat Number (e.g. 1A)</label>
              <input type="text" name="seatNumber" value={formData.seatNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Seat Type</label>
              <select name="seatType" value={formData.seatType} onChange={handleInputChange}>
                <option value="SEATER">Seater</option>
                <option value="SLEEPER">Sleeper</option>
              </select>
            </div>
            <div className="form-group">
              <label>Position</label>
              <select name="position" value={formData.position} onChange={handleInputChange}>
                <option value="WINDOW">Window</option>
                <option value="MIDDLE">Middle</option>
                <option value="AISLE">Aisle</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
            </div>
            <button type="submit" className="action-btn add-btn" style={{ width: '100%' }}>
              Add Seat
            </button>
          </form>
        </div>

        <div className="visual-pane panel">
          <h3>Seat Layout Map</h3>
          {loading ? <p>Loading map...</p> : (
            <div className="seat-layout-visual">
              {seats.length === 0 ? <p>No seats configured.</p> : renderSeatVisuals()}
            </div>
          )}
          
          <div className="legend">
            <span className="legend-item"><div className="color-box seater window"></div> Seater Window</span>
            <span className="legend-item"><div className="color-box seater aisle"></div> Seater Aisle</span>
            <span className="legend-item"><div className="color-box sleeper window"></div> Sleeper</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatConfiguration;
