import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    MapPin, 
    Calendar, 
    Search, 
    Zap, 
    Navigation, 
    ShieldCheck, 
    ArrowRight,
    Bus,
    Map,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const [search, setSearch] = useState({ 
        source: 'Lucknow', 
        destination: 'Delhi', 
        date: new Date().toISOString().split('T')[0] 
    });
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?source=${search.source}&destination=${search.destination}&date=${search.date}`);
    };

    const modules = [
        { 
            title: 'Live Tracking', 
            desc: 'Real-time GPS fleet monitoring', 
            icon: <Navigation size={24} />, 
            path: '/track-bus',
            color: 'var(--primary)'
        },
        { 
            title: 'Inter-City Routes', 
            desc: 'Explore UP state network', 
            icon: <Map size={24} />, 
            path: '/depots-stations',
            color: '#3b82f6'
        },
        { 
            title: 'Smart Ticketing', 
            desc: 'Instant QR code generation', 
            icon: <Zap size={24} />, 
            path: '/journey-planner',
            color: '#10b981'
        },
        { 
            title: 'Fare Calculator', 
            desc: 'Distance-based price estimator', 
            icon: <CreditCard size={24} />, 
            path: '/fare-enquiry',
            color: '#f43f5e'
        }
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* LARGE HERO SECTION */}
            <div className="module-hero" style={{ height: '550px', background: 'var(--secondary)' }}>
                <div className="module-hero-overlay"></div>
                <div 
                    className="module-hero-bg" 
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80")' }}
                ></div>
                
                <div className="container module-content" style={{ textAlign: 'center' }}>
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="breadcrumb" 
                        style={{ color: 'var(--primary)', marginBottom: '20px' }}
                    >
                        UPSRTC OFFICIAL SMART HUB
                    </motion.span>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="module-title" 
                        style={{ fontSize: '64px', letterSpacing: '-3px', lineHeight: 0.9, marginBottom: '24px' }}
                    >
                        India's Most Advanced<br/>
                        <span style={{ color: 'var(--primary)' }}>Bus Ecosystem.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="module-subtitle" 
                        style={{ margin: '0 auto 40px', fontSize: '18px', opacity: 0.8 }}
                    >
                        Experience JanSafar: Seamless digital booking, real-time tracking, 
                        and premium inter-city transport management.
                    </motion.p>
                </div>
            </div>

            <div className="container content-wrapper">
                {/* SEARCH PANEL */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel" 
                    style={{ padding: '40px', background: 'white', marginTop: '-120px', position: 'relative', zIndex: 100 }}
                >
                    <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '24px', alignItems: 'end' }}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}><MapPin size={12} /> DEPARTURE CITY</label>
                            <input 
                                type="text" 
                                className="glass-morphism" 
                                style={styles.input}
                                value={search.source}
                                onChange={(e) => setSearch({...search, source: e.target.value})}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}><MapPin size={12} /> ARRIVAL CITY</label>
                            <input 
                                type="text" 
                                className="glass-morphism" 
                                style={styles.input}
                                value={search.destination}
                                onChange={(e) => setSearch({...search, destination: e.target.value})}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Calendar size={12} /> TRAVEL DATE</label>
                            <input 
                                type="date" 
                                className="glass-morphism" 
                                style={styles.input}
                                value={search.date}
                                onChange={(e) => setSearch({...search, date: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '16px 48px', height: '58px', fontSize: '14px' }}>
                            <Search size={20} /> SEARCH FLEET
                        </button>
                    </form>
                </motion.div>

                {/* FEATURE MODULES */}
                <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {modules.map((m, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ y: -8 }}
                            onClick={() => navigate(m.path)}
                            className="glass-panel"
                            style={{ padding: '32px', cursor: 'pointer', transition: 'all 0.3s' }}
                        >
                            <div style={{ 
                                width: '60px', height: '60px', borderRadius: '16px', 
                                background: 'rgba(15, 23, 42, 0.05)', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
                                color: m.color
                            }}>
                                {m.icon}
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '8px' }}>{m.title}</h3>
                            <p style={{ color: 'var(--text-light)', fontSize: '14px', fontWeight: '600', lineHeight: 1.5, marginBottom: '20px' }}>{m.desc}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '800', fontSize: '12px' }}>
                                EXPLORE MODULE <ArrowRight size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* TRUST SECTION */}
                <div className="glass-panel" style={{ marginTop: '24px', padding: '40px', textAlign: 'center', background: 'var(--secondary)', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                        <div style={styles.statBox}>
                            <h4 style={styles.statNum}>12K+</h4>
                            <p style={styles.statLabel}>Active Buses</p>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={styles.statBox}>
                            <h4 style={styles.statNum}>1.2M</h4>
                            <p style={styles.statLabel}>Monthly Travelers</p>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={styles.statBox}>
                            <h4 style={styles.statNum}>75</h4>
                            <p style={styles.statLabel}>UP Regions Covered</p>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={styles.statBox}>
                            <h4 style={styles.statNum}>24/7</h4>
                            <p style={styles.statLabel}>Operations Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: '900',
        color: '#94a3b8', // text-light equivalent for dark mode
        marginBottom: '10px',
        letterSpacing: '0.5px'
    },
    input: {
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        border: '1.5px solid #f1f5f9',
        fontSize: '14px',
        fontWeight: '700',
        background: '#f8fafc',
        outline: 'none',
        transition: 'all 0.2s'
    },
    statBox: {
        textAlign: 'center'
    },
    statNum: {
        fontSize: '28px',
        fontWeight: '900',
        color: 'white',
        letterSpacing: '-1px'
    },
    statLabel: {
        fontSize: '11px',
        fontWeight: '800',
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    }
};

export default Home;
