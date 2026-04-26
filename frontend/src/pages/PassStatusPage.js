import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Search, 
    Calendar, 
    MapPin, 
    ChevronLeft,
    CreditCard,
    Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

const PassStatusPage = () => {
    const [requests, setRequests] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPass, setSelectedPass] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [passRes, routesRes] = await Promise.all([
                api.get('/passes/my-requests'),
                api.get('/public/routes')
            ]);
            setRequests(passRes.data);
            setRoutes(routesRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = (pass) => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("JanSafar Smart Pass", 20, 20);
        doc.setFontSize(12);
        doc.text(`Request ID: #REQ-${pass.id}`, 20, 30);
        doc.text(`Route: ${getRouteName(pass.routeId)}`, 20, 40);
        doc.text(`Bus Type: ${pass.busType}`, 20, 50);
        doc.text(`Valid Until: ${new Date(new Date(pass.approvedAt).getTime() + 30*24*60*60*1000).toLocaleDateString()}`, 20, 60);
        doc.text("-----------------------------------", 20, 70);
        doc.text("Verify this pass at any UPSRTC counter.", 20, 80);
        doc.save(`Pass_${pass.id}.pdf`);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getRouteName = (id) => {
        const route = routes.find(r => r.id === id);
        return route ? `${route.source} ➔ ${route.destination}` : `Route #${id}`;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return { bg: '#dcfce7', color: '#166534', icon: <CheckCircle2 size={16} /> };
            case 'REJECTED': return { bg: '#fef2f2', color: '#991b1b', icon: <XCircle size={16} /> };
            default: return { bg: '#fef9c3', color: '#854d0e', icon: <Clock size={16} /> };
        }
    };

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
        </div>
    );

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="module-hero" style={{ height: '240px', background: 'var(--secondary)' }}>
                <div className="module-hero-overlay"></div>
                <div className="container module-content">
                    <Link to="/passes/apply" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontSize: '12px', fontWeight: '800', marginBottom: '20px' }}>
                        <ChevronLeft size={16} /> NEW APPLICATION
                    </Link>
                    <h1 className="module-title">Application Tracker</h1>
                    <p className="module-subtitle">Monitor the approval status of your Monthly Pass and Smart Card requests.</p>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-40px' }}>
                {requests.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                        {requests.map((req, idx) => {
                            const style = getStatusStyle(req.status);
                            return (
                                <motion.div 
                                    key={req.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-panel"
                                    style={{ padding: '24px', background: 'white' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px' }}>
                                                <CreditCard size={20} color="var(--primary)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--secondary)' }}>{req.requestType.replace('_', ' ')}</h3>
                                                <p style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8' }}>ID: #REQ-{req.id}</p>
                                            </div>
                                        </div>
                                        <span style={{ 
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            padding: '6px 12px', borderRadius: '20px', 
                                            fontSize: '10px', fontWeight: '900', 
                                            background: style.bg, color: style.color
                                        }}>
                                            {style.icon} {req.status}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        {[
                                            { label: 'Applied', status: 'COMPLETED', icon: <CheckCircle2 size={12} /> },
                                            { label: 'Paid', status: req.paymentStatus === 'PAID' ? 'COMPLETED' : 'PENDING', icon: <CheckCircle2 size={12} /> },
                                            { label: 'Review', status: req.status === 'PENDING' ? 'CURRENT' : 'COMPLETED', icon: <Clock size={12} /> },
                                            { label: 'Active', status: req.status === 'APPROVED' ? 'COMPLETED' : 'PENDING', icon: <Zap size={12} /> }
                                        ].map((step, sIdx) => (
                                            <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                                                <div style={{ 
                                                    width: '24px', height: '24px', borderRadius: '50%', 
                                                    background: step.status === 'COMPLETED' ? '#16a34a' : step.status === 'CURRENT' ? 'var(--primary)' : '#f1f5f9',
                                                    color: step.status === 'PENDING' ? '#94a3b8' : 'white',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
                                                }}>
                                                    {step.icon}
                                                </div>
                                                <span style={{ fontSize: '9px', fontWeight: '800', marginTop: '6px', color: step.status === 'PENDING' ? '#94a3b8' : 'var(--secondary)' }}>{step.label}</span>
                                                {sIdx < 3 && (
                                                    <div style={{ position: 'absolute', left: '60%', right: '-40%', top: '12px', height: '2px', background: step.status === 'COMPLETED' ? '#16a34a' : '#f1f5f9', zIndex: 1 }}></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Selected Route</p>
                                        <p style={{ fontSize: '14px', fontWeight: '900', color: 'var(--secondary)' }}>{getRouteName(req.routeId)}</p>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)' }}>₹{req.price}</span>
                                        {req.status === 'APPROVED' ? (
                                            <button 
                                                onClick={() => setSelectedPass(req)}
                                                className="btn btn-primary" 
                                                style={{ padding: '8px 16px', fontSize: '11px' }}
                                            >
                                                VIEW DIGITAL PASS
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                                                {req.status === 'PENDING' ? 'Awaiting Admin Review' : 'Application Rejected'}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                        <Search size={48} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
                        <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--secondary)' }}>No Active Applications</h3>
                        <p style={{ color: 'var(--text-light)', marginTop: '8px', fontSize: '14px', fontWeight: '600' }}>You haven't applied for any pass or smart card yet.</p>
                        <Link to="/passes/apply" className="btn btn-primary" style={{ marginTop: '24px' }}>Start Application</Link>
                    </div>
                )}
            </div>

            {/* DIGITAL PASS MODAL */}
            <AnimatePresence>
                {selectedPass && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ 
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                            background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                            padding: '20px'
                        }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{ 
                                background: 'white', width: '100%', maxWidth: '380px', 
                                borderRadius: '32px', overflow: 'hidden', position: 'relative'
                            }}
                        >
                            {/* Pass Header */}
                            <div style={{ background: 'var(--secondary)', padding: '30px 24px', color: 'white', textAlign: 'center', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }} onClick={() => setSelectedPass(null)}>
                                    <XCircle size={24} opacity={0.6} />
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '4px' }}>JanSafar Smart Pass</h3>
                                <p style={{ fontSize: '11px', fontWeight: '700', opacity: 0.7, letterSpacing: '2px' }}>OFFICIAL TRANSPORT CREDENTIAL</p>
                            </div>

                            {/* Pass Body */}
                            <div style={{ padding: '30px 24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                                    <div style={{ padding: '16px', border: '2px solid #f1f5f9', borderRadius: '16px' }}>
                                        {/* Mock QR Code */}
                                        <div style={{ width: '160px', height: '160px', background: '#f8fafc', display: 'flex', flexWrap: 'wrap' }}>
                                            {Array(64).fill(0).map((_, i) => (
                                                <div key={i} style={{ width: '20px', height: '20px', background: Math.random() > 0.5 ? '#0f172a' : 'white' }}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                        <div>
                                            <p style={styles.passLabel}>ROUTE</p>
                                            <p style={styles.passValue}>{getRouteName(selectedPass.routeId)}</p>
                                        </div>
                                    <div>
                                        <p style={styles.passLabel}>VALID UNTIL</p>
                                        <p style={styles.passValue}>{new Date(new Date(selectedPass.approvedAt).getTime() + 30*24*60*60*1000).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p style={styles.passLabel}>BUS CATEGORY</p>
                                        <p style={styles.passValue}>{selectedPass.busType}</p>
                                    </div>
                                    <div>
                                        <p style={styles.passLabel}>INSTRUMENT</p>
                                        <p style={styles.passValue}>{selectedPass.requestType.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleDownloadPDF(selectedPass)}
                                    className="btn btn-primary" 
                                    style={{ width: '100%', height: '56px', borderRadius: '16px', fontSize: '15px' }}
                                >
                                    DOWNLOAD SECURE PDF
                                </button>
                            </div>
                            
                            {/* Pass Footer */}
                            <div style={{ padding: '20px', background: '#f8fafc', textAlign: 'center', borderTop: '1px dashed #e2e8f0' }}>
                                <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>UPSRTC SMART PASS • VERIFY AT JANSAFAR HUB</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    th: { padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' },
    td: { padding: '20px 24px' },
    passLabel: { fontSize: '9px', fontWeight: '900', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' },
    passValue: { fontSize: '14px', fontWeight: '900', color: 'var(--secondary)' }
};

export default PassStatusPage;
