import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { Armchair, ChevronRight, IndianRupee } from 'lucide-react';
import './AdminStyles.css'; // Reuse styles for seats

const SeatSelection = () => {
  const { scheduleId, busId: routeBusId } = useParams();
  const effectiveBusId = routeBusId || scheduleId;
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const source = query.get('source');
  const destination = query.get('destination');
  const date = query.get('date') || new Date().toISOString().split('T')[0];

  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [activeDeck, setActiveDeck] = useState("LOWER");

    useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Parallel fetch for better performance
        const [seatsRes, scheduleRes] = await Promise.all([
          api.get(`/public/seats/${scheduleId}`),
          api.get(`/bus/schedule/${scheduleId}`)
        ]);

        if (seatsRes.data) {
          setSeats(seatsRes.data);
        }
        
        if (scheduleRes.data && scheduleRes.data.bus) {
          setBus(scheduleRes.data.bus);
        } else {
          throw new Error("Bus information not found for this schedule.");
        }
        
        setErrorMsg('');
      } catch (err) {
        console.error("Seat selection load error:", err);
        setErrorMsg(err.response?.data?.message || 'Unable to load seat layout. The schedule might be unavailable or expired.');
      } finally {
        setLoading(false);
      }
    };
    if (scheduleId) fetchData();
  }, [scheduleId]);

  const toggleSeat = (seatId) => {
    const seat = seats.find(s => s.seatId === seatId);
    if (!seat.available) return;

    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds(selectedSeatIds.filter(id => id !== seatId));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  const handleBook = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to proceed with ticket booking.");
      navigate('/login', { state: { from: location } });
      return;
    }

    const selectedSeatNumbersList = selectedSeatIds.map(id => {
      const s = seats.find(seat => seat.seatId === id);
      return s ? s.seatNumber : '';
    });

    const bookingData = {
      scheduleId: parseInt(scheduleId),
      busId: bus.id,
      seatNumbers: selectedSeatNumbersList,
      totalAmount: calculateTotal(),
      sourceStop: source,
      destinationStop: destination,
      travelDate: date
    };
    navigate('/payment', { state: { bookingData } });
  };

  const calculateTotal = () => {
    return selectedSeatIds.reduce((total, id) => {
      const s = seats.find(seat => seat.seatId === id);
      return total + (s ? s.price : 0);
    }, 0);
  };

  const selectedSeatNumbers = selectedSeatIds.map(id => {
    const s = seats.find(seat => seat.seatId === id);
    return s ? s.seatNumber : '';
  });

  const renderSeatGrid = () => {
    const filteredSeats = seats.filter(s => s.deck === activeDeck);
    
    if (filteredSeats.length === 0) return <p style={{ textAlign: 'center', padding: '20px' }}>No seats available on this deck.</p>;

    return (
      <div className="seat-layout-visual" style={{ background: 'transparent' }}>
        {filteredSeats.map(seat => {
          const isSelected = selectedSeatIds.includes(seat.seatId);
          
          let baseClass = "seat-box";
          if (!seat.available) {
            baseClass += " booked";
          } else {
            baseClass += ` ${seat.seatType.toLowerCase()} ${seat.position.toLowerCase()}`;
          }

          const inlineStyle = isSelected ? { border: '3px solid #ff9800', transform: 'scale(1.05)' } : {};
          
          if (!seat.available) {
            inlineStyle.background = '#9e9e9e'; 
            inlineStyle.cursor = 'not-allowed';
          } else {
            inlineStyle.cursor = 'pointer';
          }

          return (
            <div 
              key={seat.seatId}
              className={baseClass}
              style={inlineStyle}
              title={`${seat.seatNumber} | ${seat.seatType} | ₹${seat.price}`}
              onClick={() => toggleSeat(seat.seatId)}
            >
              <span className="seat-num">{seat.seatNumber}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="container">Loading seat layout...</div>;
  if (errorMsg) return <div className="container" style={{ textAlign: 'center', padding: '40px' }}>{errorMsg}</div>;

  const hasUpperDeck = seats.some(s => s.deck === 'UPPER');

  return (
    <div className="container animate-fade" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
      <div className="glass-morphism" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Select Seats</h2>
        
        <div className="legend" style={{ justifyContent: 'flex-start', marginBottom: '30px' }}>
          <span className="legend-item"><div className="color-box" style={{background: '#9e9e9e'}}></div> Booked</span>
          <span className="legend-item"><div className="color-box seater"></div> Seater</span>
          <span className="legend-item"><div className="color-box sleeper"></div> Sleeper</span>
          <span className="legend-item"><div className="color-box" style={{border: '3px solid #ff9800', background: 'transparent'}}></div> Selected</span>
        </div>

        {/* Deck Tabs */}
        {hasUpperDeck && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              className={`btn ${activeDeck === 'LOWER' ? 'btn-primary' : ''}`}
              style={{ flex: 1, background: activeDeck === 'LOWER' ? '#f97316' : '#eee', color: activeDeck === 'LOWER' ? 'white' : '#666' }}
              onClick={() => setActiveDeck('LOWER')}
            >
              Lower Deck
            </button>
            <button 
              className={`btn ${activeDeck === 'UPPER' ? 'btn-primary' : ''}`}
              style={{ flex: 1, background: activeDeck === 'UPPER' ? '#f97316' : '#eee', color: activeDeck === 'UPPER' ? 'white' : '#666' }}
              onClick={() => setActiveDeck('UPPER')}
            >
              Upper Deck
            </button>
          </div>
        )}

        <div style={{ background: '#eee', padding: '40px', borderRadius: '15px', margin: '0 auto' }}>
          <div style={{ borderBottom: '2px solid #ccc', marginBottom: '30px', paddingBottom: '10px', textAlign: 'right' }}>
             <small>STEERING</small>
          </div>
          {renderSeatGrid()}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-morphism" style={{ padding: '25px' }}>
          <h3>Booking Summary</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Route</span>
                <strong>{source} → {destination}</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Bus</span>
                <strong>{bus?.busNumber}</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Seats</span>
                <strong>{selectedSeatNumbers.join(', ') || 'None'}</strong>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px', fontSize: '18px' }}>
                <span>Total Amount</span>
                <strong style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                  <IndianRupee size={18} /> {calculateTotal()}
                </strong>
             </div>
          </div>
          <button 
            disabled={selectedSeatIds.length === 0}
            onClick={handleBook}
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '20px', height: '50px' }}
          >
            PROCEED TO PAY <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
