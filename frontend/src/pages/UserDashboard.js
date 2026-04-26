import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Ticket, Calendar, IndianRupee, MapPin, Search, ChevronRight, XCircle, Clock, CheckCircle2, CreditCard, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [passes, setPasses] = useState([]);
  const [activeTab, setActiveTab] = useState('UPCOMING');
  const [stats, setStats] = useState({ upcomingTrips: 0, pastTrips: 0, cancelledTrips: 0, totalTrips: 0, activePasses: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    // Real-time polling: refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookRes, passRes, statsRes] = await Promise.all([
        api.get('/bookings/my'),
        api.get('/passes/my-requests'),
        api.get('/bookings/stats')
      ]);
      setBookings(Array.isArray(bookRes.data) ? bookRes.data : []);
      setPasses(Array.isArray(passRes.data) ? passRes.data : []);
      setStats(statsRes.data || { upcomingTrips: 0, pastTrips: 0, cancelledTrips: 0, totalTrips: 0, activePasses: 0 });
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchDashboardData();
    } catch (err) {
      toast.error("Cancellation failed");
    }
  };

  const filteredBookings = Array.isArray(bookings) ? bookings.filter(b => {
      const status = b.status || 'CONFIRMED';
      if (activeTab === 'CANCELLED') return status === 'CANCELLED';
      if (status === 'CANCELLED') return false;
      
      // For UPCOMING and PAST, we'll show based on simple comparison if possible,
      // but we will NOT hide the trip if comparison fails.
      try {
          let dateStr = b.travelDate;
          if (dateStr && typeof dateStr === 'object') {
              dateStr = `${dateStr.year}-${String(dateStr.monthValue || dateStr.month).padStart(2, '0')}-${String(dateStr.dayOfMonth || dateStr.day).padStart(2, '0')}`;
          }
          if (!dateStr && b.bookingTime) dateStr = b.bookingTime.split('T')[0];
          
          if (!dateStr) return activeTab === 'UPCOMING';

          const jDate = new Date(dateStr).setHours(0,0,0,0);
          const today = new Date().setHours(0,0,0,0);
          
          if (activeTab === 'UPCOMING') return jDate >= today;
          if (activeTab === 'PAST') return jDate < today;
      } catch (e) {
          return activeTab === 'UPCOMING';
      }
      return true;
  }) : [];

  return (
    <div className="container animate-fade" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      
      {/* CINEMATIC PROFILE HEADER */}
      <div className="glass-morphism" style={{ 
          padding: '40px', marginBottom: '40px', 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderLeft: '5px solid var(--primary)'
      }}>
        <div>
            <h1 style={{ color: '#1a2a4b', fontWeight: '900', marginBottom: '8px', fontSize: '32px', letterSpacing: '-1px' }}>
                👋 Passenger Dashboard
            </h1>
            <p style={{ color: '#64748b', fontWeight: '600' }}>Manage your trips, passes, and account settings from one place.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ ...styles.statMini, borderBottom: '3px solid #3b82f6' }}>
                <span style={styles.statLabel}>UPCOMING</span>
                <span style={{ ...styles.statVal, color: '#3b82f6' }}>{stats.upcomingTrips}</span>
            </div>
            <div style={{ ...styles.statMini, borderBottom: '3px solid #10b981' }}>
                <span style={styles.statLabel}>COMPLETED</span>
                <span style={{ ...styles.statVal, color: '#10b981' }}>{stats.pastTrips}</span>
            </div>
            <div style={{ ...styles.statMini, borderBottom: '3px solid #ef4444' }}>
                <span style={styles.statLabel}>CANCELLED</span>
                <span style={{ ...styles.statVal, color: '#ef4444' }}>{stats.cancelledTrips}</span>
            </div>
            <div style={{ ...styles.statMini, borderBottom: '3px solid #f59e0b' }}>
                <span style={styles.statLabel}>ACTIVE PASS</span>
                <span style={{ ...styles.statVal, color: '#f59e0b' }}>{stats.activePasses}</span>
            </div>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <ActionCard 
            icon={<Ticket size={24} color="white" />} 
            title="Book Journey" 
            desc="Find routes and reserve your seat instantly" 
            onClick={() => navigate('/journey-planner')}
            color="#0f2b5b"
        />
        <ActionCard 
            icon={<MapPin size={24} color="white" />} 
            title="Live Tracking" 
            desc="See real-time bus locations on map" 
            onClick={() => navigate('/track-bus')}
            color="#10b981"
        />
        <ActionCard 
            icon={<CreditCard size={24} color="white" />} 
            title="Passes & Cards" 
            desc="Apply for Monthly Pass or Smart Card" 
            onClick={() => navigate('/passes/apply')}
            color="#f97316"
        />
      </div>

      {/* DASHBOARD TABS */}
      <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a2a4b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Calendar size={22} color="var(--primary)" /> My Recent Travels
      </h2>
      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        {['UPCOMING', 'PAST', 'CANCELLED'].map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                    background: 'none', border: 'none', padding: '10px 0',
                    fontSize: '14px', fontWeight: '800',
                    color: activeTab === tab ? 'var(--primary)' : '#94a3b8',
                    cursor: 'pointer', position: 'relative',
                    borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                    transition: 'all 0.2s'
                }}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* BOOKING LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>Syncing with transport servers...</div>
        ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
                <div key={booking.id} className="glass-morphism booking-card" style={{ padding: '0', overflow: 'hidden', display: 'grid', gridTemplateColumns: '8px 1fr' }}>
                    <div style={{ background: booking.status === 'CANCELLED' ? '#ef4444' : 'var(--primary)' }}></div>
                    <div style={{ padding: '25px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '30px', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', marginBottom: '8px' }}>PNR: #{booking.id}</div>
                            <div style={{ fontSize: '20px', fontWeight: '900', color: '#1a2a4b', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {booking.busSchedule?.route?.source || booking.bus?.route?.source || 'N/A'} 
                                <ChevronRight size={18} color="#94a3b8" /> 
                                {booking.busSchedule?.route?.destination || booking.bus?.route?.destination || 'N/A'}
                            </div>
                            <div style={{ marginTop: '12px', display: 'flex', gap: '15px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14}/> {booking.travelDate || 'N/A'}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14}/> {booking.busSchedule?.departureTime || booking.bus?.departureTime || 'N/A'}</span>
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', marginBottom: '8px' }}>BUS & FARE</div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>{booking.bus?.busType} • {booking.bus?.busNumber}</div>
                            <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>₹{booking.totalAmount}</div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '6px', 
                                padding: '6px 14px', borderRadius: '50px', 
                                fontSize: '10px', fontWeight: '900', marginLeft: 'auto',
                                background: booking.status === 'CONFIRMED' ? '#dcfce7' : '#fee2e2',
                                color: booking.status === 'CONFIRMED' ? '#16a34a' : '#ef4444'
                            }}>
                                {booking.status === 'CONFIRMED' ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {booking.status}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                {booking.status === 'CONFIRMED' && (
                                    <>
                                        <button 
                                            onClick={() => navigate(`/ticket/${booking.id}`)} 
                                            className="btn" 
                                            style={{ fontSize: '11px', padding: '8px 16px', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent', fontWeight: '800' }}
                                        >
                                            <Ticket size={14} /> VIEW TICKET
                                        </button>
                                        <button 
                                            onClick={() => handleCancel(booking.id)} 
                                            className="btn" 
                                            style={{ fontSize: '11px', padding: '8px 16px', border: '1px solid #fee2e2', color: '#ef4444', background: 'transparent', fontWeight: '800' }}
                                        >
                                            CANCEL
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))
          ) : (
            <div className="glass-morphism" style={{ padding: '80px', textAlign: 'center' }}>
                <Ticket size={50} color="#e2e8f0" style={{ margin: '0 auto 20px' }} />
                <h3 style={{ color: '#64748b', fontWeight: '700' }}>No {activeTab.toLowerCase()} trips found.</h3>
                <button onClick={() => navigate('/journey-planner')} className="btn" style={{ marginTop: '20px', color: 'var(--primary)', fontWeight: '800' }}>SEARCH BUSES NOW</button>
            </div>
          )}
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, desc, onClick, color }) => (
    <motion.div 
        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        onClick={onClick}
        className="glass-morphism"
        style={{ padding: '24px', cursor: 'pointer', display: 'flex', gap: '20px', alignItems: 'center' }}
    >
        <div style={{ 
            background: color, width: '56px', height: '56px', 
            borderRadius: '16px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', boxShadow: `0 8px 16px -4px ${color}44` 
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a2a4b', marginBottom: '4px' }}>{title}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', lineHeight: '1.4' }}>{desc}</p>
        </div>
    </motion.div>
);

const styles = {
    statMini: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '10px 20px', background: '#f8fafc', borderRadius: '12px',
        border: '1px solid #e2e8f0', minWidth: '100px'
    },
    statLabel: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', letterSpacing: '1px' },
    statVal: { fontSize: '20px', fontWeight: '900', color: '#1a2a4b' },
    badge: {
        background: 'var(--primary)',
        color: 'white',
        fontSize: '10px',
        padding: '2px 6px',
        borderRadius: '10px',
        marginLeft: '5px'
    }
};

export default UserDashboard;
