import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
    CreditCard, 
    MapPin, 
    Bus, 
    Zap, 
    ChevronRight, 
    Info,
    Calendar,
    ArrowRightLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PassApplyPage = () => {
    const [routes, setRoutes] = useState([]);
    const [availableBusTypes, setAvailableBusTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        routeId: '',
        busType: '',
        requestType: 'MONTHLY_PASS'
    });
    const [estimation, setEstimation] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                // Corrected endpoint mapping to hit PublicBusController
                const res = await api.get('/public/routes');
                setRoutes(res.data);
            } catch (err) {
                console.error("Failed to fetch routes", err);
            }
        };
        fetchRoutes();
    }, []);

    // FETCH DYNAMIC BUS TYPES BASED ON ROUTE SELECTION
    useEffect(() => {
        const fetchBusTypes = async () => {
            if (formData.routeId) {
                try {
                    const res = await api.get(`/public/routes/${formData.routeId}/bus-types`);
                    setAvailableBusTypes(res.data);
                    // Reset busType if the current one isn't in the new list
                    if (res.data.length > 0 && !res.data.includes(formData.busType)) {
                        setFormData(prev => ({ ...prev, busType: res.data[0] }));
                    } else if (res.data.length === 0) {
                        setFormData(prev => ({ ...prev, busType: '' }));
                    }
                } catch (err) {
                    console.error("Failed to fetch bus types", err);
                }
            } else {
                setAvailableBusTypes([]);
            }
        };
        fetchBusTypes();
    }, [formData.routeId]);

    useEffect(() => {
        if (formData.routeId && formData.busType) {
            const route = routes.find(r => r.id === parseInt(formData.routeId));
            if (route) {
                let multiplier = formData.busType === 'AC' ? 1.5 : 1.0;
                if (formData.busType === 'SLEEPER') multiplier = 2.0;
                
                let price = (route.totalDistance * route.farePerKm * 20) * multiplier;
                if (formData.requestType === 'SMART_CARD') price = 500;
                setEstimation(Math.round(price));
            }
        }
    }, [formData, routes]);

    const [showPayment, setShowPayment] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            toast.error("Please login to apply for a pass.");
            navigate('/login');
            return;
        }

        if (!formData.routeId || !formData.busType) {
            toast.error("Please select route and bus category.");
            return;
        }
        setShowPayment(true);
    };

    const handlePaymentSuccess = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
            
            const payload = {
                ...formData,
                userId: user.id,
                price: estimation,
                transactionId: txnId,
                paymentStatus: 'PAID',
                status: 'PENDING'
            };

            await api.post('/passes/apply', payload);
            toast.success("Payment Confirmed! Your application is under review.", {
                duration: 5000,
                icon: '🎫'
            });
            setTimeout(() => navigate('/passes/status'), 1500);
        } catch (err) {
            console.error("Pass submission error:", err);
            toast.error(err.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setLoading(false);
            setShowPayment(false);
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="module-hero" style={{ height: '300px', background: 'var(--secondary)' }}>
                <div className="module-hero-overlay"></div>
                <div className="container module-content">
                    <span className="breadcrumb">CERTIFIED ACCESS SYSTEM</span>
                    <h1 className="module-title">Identity & Pass Hub</h1>
                    <p className="module-subtitle">Apply for official JanSafar Monthly Passes and Smart Cards for seamless travel.</p>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                    
                    {/* FORM SECTION */}
                    <div className="glass-panel" style={{ padding: '40px', background: 'white' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '32px' }}>New Application</h2>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><MapPin size={14} /> SELECT FREQUENT ROUTE</label>
                                <select 
                                    className="glass-morphism"
                                    style={styles.input}
                                    value={formData.routeId}
                                    onChange={(e) => setFormData({...formData, routeId: e.target.value})}
                                    required
                                >
                                    <option value="">Choose a route...</option>
                                    {routes.map(r => (
                                        <option key={r.id} value={r.id}>{r.source} ➔ {r.destination} ({r.totalDistance} km)</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}><Bus size={14} /> BUS CATEGORY</label>
                                    <select 
                                        className="glass-morphism"
                                        style={styles.input}
                                        value={formData.busType}
                                        onChange={(e) => setFormData({...formData, busType: e.target.value})}
                                        required
                                        disabled={availableBusTypes.length === 0}
                                    >
                                        <option value="">{availableBusTypes.length === 0 ? "No buses scheduled" : "Choose category..."}</option>
                                        {availableBusTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type === 'AC' ? 'AC (Shatabdi)' : 
                                                 type === 'SLEEPER' ? 'Sleeper (Inter-State)' : 
                                                 type.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}><CreditCard size={14} /> INSTRUMENT TYPE</label>
                                    <select 
                                        className="glass-morphism"
                                        style={styles.input}
                                        value={formData.requestType}
                                        onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                                    >
                                        <option value="MONTHLY_PASS">Monthly Pass</option>
                                        <option value="SMART_CARD">Digital Smart Card</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ background: '#f1f5f9', padding: '24px', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <p style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Estimated Charge</p>
                                        <p style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)' }}>₹{estimation}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '4px' }}>OFFICIAL UPSRTC MST RATE</span>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                                    <p>Breakdown: 20 Single Fares (Monthly standard)</p>
                                    <p style={{ marginTop: '4px' }}>Base Fare × Route Distance × Multiplier</p>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: '60px', marginTop: '10px' }}>
                                {loading ? "PROCESSING..." : "SUBMIT APPLICATION FOR REVIEW"} <ChevronRight size={20} />
                            </button>
                        </form>
                    </div>

                    {/* RULES SECTION */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Info size={18} color="var(--primary)" /> Guidelines
                            </h3>
                            <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <li style={styles.li}>
                                    <Zap size={14} style={{ marginTop: '2px' }} /> 
                                    <span>Approval takes **24-48 hours** from administrative review.</span>
                                </li>
                                <li style={styles.li}>
                                    <Calendar size={14} style={{ marginTop: '2px' }} /> 
                                    <span>Monthly passes are valid for **30 days** from the approval date.</span>
                                </li>
                                <li style={styles.li}>
                                    <ArrowRightLeft size={14} style={{ marginTop: '2px' }} /> 
                                    <span>Applicable for **unlimited trips** on the selected route.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="glass-panel" style={{ padding: '20px', background: 'var(--secondary)', color: 'white', textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', opacity: 0.7 }}>SUPPORT HOTLINE</p>
                            <h4 style={{ fontSize: '20px', fontWeight: '900' }}>1800-180-2877</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAYMENT MODAL OVERLAY */}
            <AnimatePresence>
                {showPayment && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ 
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                            background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                            padding: '20px'
                        }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="glass-panel"
                            style={{ background: 'white', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}
                        >
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#16a34a' }}>
                                <CreditCard size={40} />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '8px' }}>Secure Payment</h2>
                            <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '32px' }}>
                                Finalize your application by completing the digital transaction.
                            </p>
                            
                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Total Amount</p>
                                <p style={{ fontSize: '36px', fontWeight: '900', color: 'var(--primary)' }}>₹{estimation}</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button 
                                    onClick={handlePaymentSuccess}
                                    disabled={loading}
                                    className="btn btn-primary" 
                                    style={{ width: '100%', height: '56px', fontSize: '16px' }}
                                >
                                    {loading ? "PROCESSING..." : "CONFIRM & PAY NOW"}
                                </button>
                                <button 
                                    onClick={() => setShowPayment(false)}
                                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontWeight: '800', fontSize: '13px', padding: '10px', cursor: 'pointer' }}
                                >
                                    CANCEL TRANSACTION
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '11px', fontWeight: '900', color: '#94a3b8', letterSpacing: '0.5px' },
    input: { width: '100%', padding: '16px', borderRadius: '12px', border: '1.5px solid #f1f5f9', background: '#f8fafc', fontWeight: '700', fontSize: '14px', outline: 'none' },
    li: { display: 'flex', gap: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--text-light)', lineHeight: '1.5' }
};

export default PassApplyPage;
