import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Download, Printer, Home, MapPin, Calendar, Clock, Bus, User, Ticket, CheckCircle2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const TicketView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await api.get(`/api/bookings/${id}/ticket`);
                setTicket(res.data);
            } catch (err) {
                console.error("Failed to load ticket");
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary)" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '20px', color: '#64748b' }}>Generating your E-Ticket...</p>
        </div>
    );

    if (!ticket) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Ticket not found.</div>;

    return (
        <div className="container animate-fade" style={{ maxWidth: '800px', paddingBottom: '60px' }}>
            {/* ACTION BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingTop: '20px' }} className="hide-on-print">
                <button onClick={() => navigate('/dashboard')} className="btn" style={{ background: '#f1f5f9', color: '#1a2a4b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Home size={18} /> My Dashboard
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Printer size={18} /> Print Ticket
                    </button>
                </div>
            </div>

            {/* THE TICKET CARD */}
            <div id="printable-ticket" className="glass-morphism" style={{ padding: '0', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                {/* Header */}
                <div style={{ background: 'var(--primary)', color: 'white', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '5px' }}>UPSRTC E-TICKET</h2>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>State Transport Department, Uttar Pradesh</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Booking ID / PNR</div>
                        <div style={{ fontSize: '20px', fontWeight: '800' }}>#{ticket.bookingId}</div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ padding: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                        
                        {/* Journey Details */}
                        <div>
                            <div style={{ marginBottom: '32px' }}>
                                <div style={styles.label}>Journey Information</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={styles.cityText}>{ticket.source}</div>
                                        <div style={styles.timeText}>{new Date(ticket.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ height: '2px', background: '#e2e8f0', width: '100%' }}></div>
                                        <Bus size={20} color="var(--primary)" style={{ position: 'absolute', background: 'white', padding: '0 10px' }} />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={styles.cityText}>{ticket.destination}</div>
                                        <div style={styles.timeText}>Exp. Arrival</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={styles.label}>Date of Journey</div>
                                    <div style={styles.valText}><Calendar size={16} /> {new Date(ticket.departureTime).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div style={styles.label}>Seat Numbers</div>
                                    <div style={{ ...styles.valText, color: 'var(--secondary)' }}><Ticket size={16} /> {ticket.seatNumbers.join(", ")}</div>
                                </div>
                                <div>
                                    <div style={styles.label}>Bus Number</div>
                                    <div style={styles.valText}><Bus size={16} /> {ticket.busNumber}</div>
                                </div>
                                <div>
                                    <div style={styles.label}>Passenger</div>
                                    <div style={styles.valText}><User size={16} /> {ticket.username}</div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code / Status */}
                        <div style={{ borderLeft: '1px dashed #e2e8f0', paddingLeft: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '150px', height: '150px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UPSRTC-PNR-${ticket.bookingId}`} alt="Ticket QR" />
                            </div>
                            <div style={{ 
                                padding: '8px 20px', 
                                borderRadius: '20px', 
                                background: ticket.status === 'CONFIRMED' ? '#dcfce7' : '#fee2e2', 
                                color: ticket.status === 'CONFIRMED' ? '#16a34a' : '#ef4444',
                                fontWeight: '800',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                {ticket.status === 'CONFIRMED' && <CheckCircle2 size={16} />} {ticket.status}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={styles.label}>Total Fare Paid</div>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>₹{ticket.totalAmount}.00</div>
                        </div>
                        <div style={{ textAlign: 'right', color: '#94a3b8', fontSize: '11px' }}>
                            Booked on: {new Date(ticket.bookingDate).toLocaleString()}<br />
                            * This is a computer generated E-Ticket. Original ID proof required for boarding.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    label: { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontWeight: '700' },
    cityText: { fontSize: '20px', fontWeight: '800', color: '#1a2a4b' },
    timeText: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
    valText: { fontSize: '15px', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }
};

export default TicketView;
