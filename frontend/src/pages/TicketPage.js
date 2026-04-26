import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { 
    Download, 
    Printer, 
    ChevronLeft, 
    MapPin, 
    Calendar, 
    User, 
    ArrowRight,
    Bus,
    CreditCard
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const TicketPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await api.get(`/user/ticket/${id}`);
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch ticket", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);

    const handleDownload = async () => {
        const element = document.getElementById('ticket-receipt');
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`JanSafar_Ticket_${id}.pdf`);
    };

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
        </div>
    );

    if (!data) return (
        <div style={{ padding: '80px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--accent)' }}>Ticket Not Found</h2>
            <Link to="/home" className="btn btn-primary" style={{ marginTop: '20px' }}>Return Home</Link>
        </div>
    );

    const { ticket, qrCode } = data;

    return (
        <div className="animate-fade" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* HERO SECTION */}
            <div className="module-hero" style={{ height: '240px', background: 'var(--secondary)' }}>
                <div className="module-hero-overlay"></div>
                <div className="container module-content">
                    <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontSize: '12px', fontWeight: '800', marginBottom: '20px' }}>
                        <ChevronLeft size={16} /> BACK TO DASHBOARD
                    </Link>
                    <h1 className="module-title">Your Digital Ticket</h1>
                    <p className="module-subtitle">Present this QR code to the conductor during boarding for instant verification.</p>
                </div>
            </div>

            <div className="container content-wrapper">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px', alignItems: 'start' }}>
                    
                    {/* TICKET DETAILS */}
                    <div id="ticket-receipt" className="glass-panel" style={{ padding: '40px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px dashed #e2e8f0', paddingBottom: '30px' }}>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--secondary)' }}>Jan<span style={{ color: 'var(--primary)' }}>Safar</span> Express</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>Electronic Boarding Pass</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Ticket ID</p>
                                <p style={{ fontSize: '20px', fontWeight: '900', color: 'var(--secondary)' }}>#{ticket.id}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ background: '#f1f5f9', p: '12px', borderRadius: '12px', height: 'fit-content', padding: '12px' }}>
                                    <MapPin size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <p style={styles.label}>Route Information</p>
                                    <p style={styles.value}>{ticket.source} <ArrowRight size={14} /> {ticket.destination}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ background: '#f1f5f9', p: '12px', borderRadius: '12px', height: 'fit-content', padding: '12px' }}>
                                    <Calendar size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <p style={styles.label}>Journey Date</p>
                                    <p style={styles.value}>{ticket.journeyDate}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '24px', background: '#f8fafc', borderRadius: '16px', marginBottom: '40px' }}>
                            <div>
                                <p style={styles.smallLabel}>Bus ID</p>
                                <p style={{ ...styles.value, fontSize: '16px' }}><Bus size={16} /> {ticket.busId}</p>
                            </div>
                            <div>
                                <p style={styles.smallLabel}>Seat Number</p>
                                <p style={{ ...styles.value, fontSize: '16px' }}><User size={16} /> {ticket.seatNumber}</p>
                            </div>
                            <div>
                                <p style={styles.smallLabel}>Total Fare</p>
                                <p style={{ ...styles.value, fontSize: '16px', color: 'var(--primary)' }}>₹{ticket.fare}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p style={styles.label}>Status</p>
                                <span style={{ 
                                    padding: '6px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '11px', 
                                    fontWeight: '900', 
                                    background: ticket.status === 'BOOKED' ? '#dcfce7' : '#fef2f2',
                                    color: ticket.status === 'BOOKED' ? '#166534' : '#991b1b'
                                }}>
                                    {ticket.status}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={styles.label}>Booked On</p>
                                <p style={{ fontSize: '13px', fontWeight: '700' }}>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* QR SECTION */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', marginBottom: '20px' }}>
                            <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-light)', marginBottom: '24px' }}>BOARDING QR CODE</p>
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ background: 'white', padding: '20px', borderRadius: '20px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '24px' }}
                            >
                                <img src={qrCode} alt="Ticket QR" style={{ width: '200px', height: '200px' }} />
                            </motion.div>
                            <p style={{ fontSize: '12px', color: 'var(--text-light)', lineHeight: '1.5', padding: '0 20px' }}>
                                Keep this screen open when approaching the bus for a smooth boarding experience.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button onClick={handleDownload} className="btn btn-primary" style={{ width: '100%' }}>
                                <Download size={18} /> Download Receipt
                            </button>
                            <button onClick={() => window.print()} className="btn" style={{ width: '100%', background: 'white', border: '1.5px solid #e2e8f0', color: 'var(--secondary)' }}>
                                <Printer size={18} /> Print Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    label: {
        fontSize: '11px',
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '4px'
    },
    smallLabel: {
        fontSize: '10px',
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: '6px'
    },
    value: {
        fontSize: '18px',
        fontWeight: '900',
        color: 'var(--secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    }
};

export default TicketPage;
