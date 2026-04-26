import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { IndianRupee, Bus, Calculator, Info, Navigation2, MapPin } from 'lucide-react';
import MainFooter from '../components/dashboard/MainFooter';
import { motion } from 'framer-motion';

const FareEnquiry = () => {
    const [routes, setRoutes] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState("");
    const [busType, setBusType] = useState("SEATER");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [routeRes, scheduleRes] = await Promise.all([
                api.get('/public/routes'),
                api.get('/public/schedules/today')
            ]);
            setRoutes(routeRes.data);
            setSchedules(scheduleRes.data);
        } catch (err) {
            console.error("Failed to load ecosystem data", err);
        }
    };

    const activeRoute = routes.find(r => r.id.toString() === selectedRouteId);
    const routeSchedules = schedules.filter(s => s.route.id.toString() === selectedRouteId);

    const calculateStopFare = (distanceFromStart) => {
        if (!activeRoute) return 0;
        const multiplier = busType === 'AC' ? 1.5 : busType === 'SLEEPER' ? 2.0 : 1.0;
        return Math.round(distanceFromStart * (activeRoute.farePerKm || 0) * multiplier);
    };

    return (
        <div className="fare-enquiry-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <main className="fare-main">
                {/* MODULE HERO - SLEEKER */}
                <section style={{ 
                    height: '240px', position: 'relative', overflow: 'hidden', 
                    display: 'flex', alignItems: 'center', background: 'var(--secondary)' 
                }}>
                    <div style={{ 
                        position: 'absolute', inset: 0, opacity: 0.3, 
                        backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069')",
                        backgroundSize: 'cover', backgroundPosition: 'center'
                    }}></div>
                    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '900', letterSpacing: '1px' }}>ADMINISTRATION CONNECTED</span>
                            <h1 style={{ color: 'white', fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', marginTop: '8px' }}>Trip Itinerary & Fare Hub</h1>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600', maxWidth: '600px' }}>Explore detailed connectivity, stoppage timings, and fare breakdowns assigned by the fleet management.</p>
                        </motion.div>
                    </div>
                </section>

                <div className="container" style={{ marginTop: '-40px', paddingBottom: '80px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
                        
                        {/* LEFT: CALCULATOR CONTROL */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel" 
                            style={{ padding: '32px', position: 'sticky', top: '100px' }}
                        >
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)', fontWeight: '900', marginBottom: '24px' }}>
                                <Calculator size={20} color="var(--primary)" /> Configure Search
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={styles.label}>Select Defined Route</label>
                                    <select 
                                        style={styles.select}
                                        value={selectedRouteId}
                                        onChange={(e) => setSelectedRouteId(e.target.value)}
                                    >
                                        <option value="">-- Choose Assigned Route --</option>
                                        {routes.map(r => (
                                            <option key={r.id} value={r.id}>{r.source} ➔ {r.destination}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={styles.label}>Service Category</label>
                                    <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '14px' }}>
                                        {['SEATER', 'AC', 'SLEEPER'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setBusType(type)}
                                                style={{
                                                    flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                                                    background: busType === type ? 'white' : 'transparent',
                                                    color: busType === type ? 'var(--secondary)' : '#64748b',
                                                    fontWeight: '800', fontSize: '11px', cursor: 'pointer',
                                                    boxShadow: busType === type ? '0 4px 10px rgba(0,0,0,0.05)' : 'none',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {activeRoute && (
                                <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(249, 115, 22, 0.05)', borderRadius: '16px', border: '1px solid rgba(249, 115, 22, 0.1)' }}>
                                    <h4 style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px' }}>Route Summary</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: 'var(--secondary)' }}>
                                        <span>Total Distance:</span>
                                        <span>{activeRoute.totalDistance} KM</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: 'var(--secondary)', marginTop: '8px' }}>
                                        <span>Total Fares (Est):</span>
                                        <span style={{ color: 'var(--primary)', fontSize: '16px' }}>₹{calculateStopFare(activeRoute.totalDistance)}</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* RIGHT: DYNAMIC ITINERARY & CONNECTIVITY */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {activeRoute ? (
                                <>
                                    {/* TRAVEL TIMELINE */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '40px' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)', fontWeight: '900', marginBottom: '40px' }}>
                                            <Navigation2 size={20} color="var(--primary)" /> Detailed Trip Itinerary
                                        </h3>
                                        
                                        <div style={{ position: 'relative' }}>
                                            {/* DYNAMIC ITINERARY FROM BACKEND */}
                                            {activeRoute.stops && activeRoute.stops.map((stop, idx) => (
                                                <TimelineStep 
                                                    key={stop.id}
                                                    name={stop.stopName}
                                                    time={stop.arrivalTime || "--:--"}
                                                    dist={stop.distanceFromStart}
                                                    fare={calculateStopFare(stop.distanceFromStart)}
                                                    isFirst={idx === 0}
                                                    isLast={idx === activeRoute.stops.length - 1}
                                                />
                                            ))}
                                            
                                            {(!activeRoute.stops || activeRoute.stops.length === 0) && (
                                                <>
                                                    <TimelineStep 
                                                        name={activeRoute.source} 
                                                        time="10:00 AM" 
                                                        dist="0" 
                                                        fare="0" 
                                                        isFirst 
                                                    />
                                                    <TimelineStep 
                                                        name={activeRoute.destination} 
                                                        time="FINAL" 
                                                        dist={activeRoute.totalDistance} 
                                                        fare={calculateStopFare(activeRoute.totalDistance)} 
                                                        isLast 
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* ASSIGNED BUSES SECTION */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: '32px' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)', fontWeight: '900', marginBottom: '24px' }}>
                                            <Bus size={20} color="var(--primary)" /> Assigned Fleet & Schedules
                                        </h3>
                                        {routeSchedules.length > 0 ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                                {routeSchedules.map(sch => (
                                                    <div key={sch.id} style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                                        <div style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', marginBottom: '8px' }}>BUS: {sch.bus.busNumber}</div>
                                                        <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--secondary)' }}>{sch.departureTime}</div>
                                                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', marginTop: '4px' }}>Starts from {activeRoute.source}</div>
                                                        <button 
                                                            onClick={() => navigate(`/seats/${sch.id}?source=${activeRoute.source}&destination=${activeRoute.destination}`)}
                                                            style={{ 
                                                                marginTop: '16px', width: '100%', padding: '10px', 
                                                                background: 'var(--secondary)', color: 'white', 
                                                                borderRadius: '10px', border: 'none', fontWeight: '800', 
                                                                fontSize: '11px', cursor: 'pointer' 
                                                            }}
                                                        >
                                                            BOOK SEATS
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
                                                <Info size={30} color="#e2e8f0" style={{ marginBottom: '10px' }} />
                                                <br/>No buses currently assigned by administration for this route.
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* DETAILED FARE BREAKDOWN TABLE */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: '32px' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)', fontWeight: '900', marginBottom: '24px' }}>
                                            <IndianRupee size={20} color="var(--primary)" /> Complete Fare Breakdown
                                        </h3>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                                        <th style={styles.th}>Stoppage Name</th>
                                                        <th style={styles.th}>Distance (KM)</th>
                                                        <th style={styles.th}>Category</th>
                                                        <th style={styles.th}>Exact Fare</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {activeRoute.stops && activeRoute.stops.map((stop, idx) => (
                                                        <tr key={stop.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                            <td style={{ 
                                                                ...styles.td, 
                                                                fontWeight: (idx === 0 || idx === activeRoute.stops.length - 1) ? '900' : '700' 
                                                            }}>
                                                                {stop.stopName} 
                                                                {idx === 0 ? " (Origin)" : idx === activeRoute.stops.length - 1 ? " (Final)" : ""}
                                                            </td>
                                                            <td style={styles.td}>{stop.distanceFromStart} KM</td>
                                                            <td style={styles.td}>{busType}</td>
                                                            <td style={{ 
                                                                ...styles.td, 
                                                                color: 'var(--primary)', 
                                                                fontWeight: '800',
                                                                fontSize: (idx === activeRoute.stops.length - 1) ? '18px' : '14px'
                                                            }}>
                                                                ₹{calculateStopFare(stop.distanceFromStart)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                </>
                            ) : (
                                <div style={{ 
                                    height: '500px', display: 'flex', flexDirection: 'column', 
                                    alignItems: 'center', justifyContent: 'center', 
                                    background: 'rgba(255,255,255,0.4)', borderRadius: '32px',
                                    border: '2px dashed #e2e8f0'
                                }}>
                                    <MapPin size={60} color="#e2e8f0" />
                                    <h3 style={{ color: '#94a3b8', fontWeight: '800', marginTop: '20px' }}>Select a route to view connectivity</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <MainFooter />
        </div>
    );
};

const TimelineStep = ({ name, time, dist, fare, isFirst, isLast }) => (
    <div style={{ display: 'flex', gap: '24px', paddingBottom: isLast ? '0' : '40px', position: 'relative' }}>
        {!isLast && (
            <div style={{ 
                position: 'absolute', left: '11px', top: '24px', bottom: '0', 
                width: '2px', background: 'repeating-linear-gradient(to bottom, #cbd5e1 0px, #cbd5e1 5px, transparent 5px, transparent 10px)' 
            }}></div>
        )}
        <div style={{ 
            width: '24px', height: '24px', borderRadius: '50%', 
            background: isFirst || isLast ? 'var(--primary)' : 'white',
            border: `6px solid ${isFirst || isLast ? 'rgba(249,115,22,0.2)' : '#cbd5e1'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2, flexShrink: 0
        }}></div>
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#1a2a4b' }}>{name}</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginTop: '4px' }}>
                        {isFirst ? "ORIGIN STATION" : isLast ? "DESTINATION HUB" : `STOPPAGE`} • {dist} KM from start
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary)' }}>{time}</div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--secondary)', marginTop: '4px' }}>₹{fare}</div>
                </div>
            </div>
        </div>
    </div>
);

const styles = {
    label: { display: 'block', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' },
    select: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: '700', fontSize: '14px' },
    breakdownItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' },
    breakdownLabel: { display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '14px', fontWeight: '700' },
    breakdownValue: { fontWeight: '900', color: 'var(--secondary)', fontSize: '16px' },
    th: { padding: '16px', fontSize: '12px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' },
    td: { padding: '16px', fontSize: '14px', fontWeight: '700', color: 'var(--secondary)' }
};

export default FareEnquiry;
