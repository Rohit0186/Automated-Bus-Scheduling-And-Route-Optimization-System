import React, { useState, useEffect } from 'react';
import { MapPin, Bus, Save, Play, Plus, Trash2, Map as MapIcon, Navigation } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';
import LiveMap from '../components/LiveMap';
import '../styles/AdminDashboard.css';
import './AdminStyles.css';

const AdminRouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [stops, setStops] = useState([]);
    const [selectedBusId, setSelectedBusId] = useState('');
    const [loading, setLoading] = useState(false);
    
    // New Route Form
    const [newRoute, setNewRoute] = useState({ routeName: '', source: '', destination: '', totalDistance: 0 });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [routesRes, busesRes] = await Promise.all([
                api.get('/admin/routes'),
                api.get('/admin/buses')
            ]);
            setRoutes(routesRes.data);
            setBuses(busesRes.data);
        } catch (err) {
            toast.error("Failed to load management data");
        }
    };

    const handleCreateRoute = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/routes', newRoute);
            setRoutes([...routes, res.data]);
            setNewRoute({ routeName: '', source: '', destination: '', totalDistance: 0 });
            toast.success("Route created successfully");
        } catch (err) {
            toast.error("Error creating route");
        }
    };

    const handleSelectRoute = async (route) => {
        setSelectedRoute(route);
        try {
            const res = await api.get(`/routes/${route.id}/stops`);
            setStops(res.data);
        } catch (err) {
            setStops([]);
        }
    };

    const addStopField = () => {
        setStops([...stops, { stopName: '', latitude: 26.8467, longitude: 80.9462, orderIndex: stops.length }]);
    };

    const removeStopField = (index) => {
        const updated = stops.filter((_, i) => i !== index);
        setStops(updated.map((s, i) => ({ ...s, orderIndex: i })));
    };

    const handleStopChange = (index, field, value) => {
        const updated = [...stops];
        updated[index][field] = value;
        setStops(updated);
    };

    const saveStops = async () => {
        if (!selectedRoute) return;
        setLoading(true);
        try {
            await api.post(`/admin/stops/${selectedRoute.id}`, stops);
            toast.success("Stops updated successfully");
        } catch (err) {
            toast.error("Error saving stops");
        } finally {
            setLoading(false);
        }
    };

    const handleStartTrip = async () => {
        if (!selectedRoute || !selectedBusId) {
            toast.error("Please select both a Route and a Bus");
            return;
        }
        try {
            await api.post('/admin/trip/start', {
                busId: parseInt(selectedBusId),
                routeId: selectedRoute.id
            });
            toast.success("⚡ Trip Started! Live tracking is now active.", { duration: 5000 });
        } catch (err) {
            toast.error("Failed to start trip. Check console.");
        }
    };

    return (
        <div className="admin-container" style={{ padding: '24px' }}>
            <div className="admin-header">
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Navigation className="text-primary" /> Transport Control Center
                    </h1>
                    <p>Manage routes, stops, and real-time fleet deployment</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: '24px' }}>
                
                {/* LEFT COLUMN: Route Creation & Selection */}
                <div className="sidebar-section">
                    <div className="glass-morphism" style={{ padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: '#0f2b5b' }}>1. CREATE NEW ROUTE</h3>
                        <form onSubmit={handleCreateRoute}>
                            <input 
                                className="form-control" 
                                placeholder="Route Name (e.g. LKO-DEL-01)" 
                                value={newRoute.routeName}
                                onChange={e => setNewRoute({...newRoute, routeName: e.target.value})}
                                required
                                style={{ marginBottom: '12px' }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <input 
                                    className="form-control" 
                                    placeholder="Source" 
                                    value={newRoute.source}
                                    onChange={e => setNewRoute({...newRoute, source: e.target.value})}
                                    required
                                />
                                <input 
                                    className="form-control" 
                                    placeholder="Destination" 
                                    value={newRoute.destination}
                                    onChange={e => setNewRoute({...newRoute, destination: e.target.value})}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                                <Plus size={18} /> Create Route
                            </button>
                        </form>
                    </div>

                    <div className="glass-morphism" style={{ padding: '20px', borderRadius: '16px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: '#0f2b5b' }}>2. SELECT ROUTE TO MANAGE</h3>
                        <div className="route-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {routes.map(r => (
                                <div 
                                    key={r.id} 
                                    className={`route-item ${selectedRoute?.id === r.id ? 'active' : ''}`}
                                    onClick={() => handleSelectRoute(r)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: selectedRoute?.id === r.id ? '#0f2b5b10' : 'transparent'
                                    }}
                                >
                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{r.routeName}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{r.source} → {r.destination}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Stop Management & Trip Control */}
                <div className="main-content-section">
                    {selectedRoute ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="glass-morphism" style={{ padding: '24px', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f2b5b' }}>CONFIGURE STOPS: {selectedRoute.routeName}</h3>
                                    <button className="btn btn-primary" onClick={addStopField}><Plus size={18} /> Add Stop</button>
                                </div>

                                <div className="stops-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {stops.map((stop, index) => (
                                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 50px', gap: '12px', alignItems: 'center' }}>
                                            <input 
                                                className="form-control" 
                                                placeholder="Stop Name" 
                                                value={stop.stopName}
                                                onChange={e => handleStopChange(index, 'stopName', e.target.value)}
                                            />
                                            <input 
                                                className="form-control" 
                                                type="number" 
                                                step="0.0001"
                                                placeholder="Latitude" 
                                                value={stop.latitude}
                                                onChange={e => handleStopChange(index, 'latitude', parseFloat(e.target.value))}
                                            />
                                            <input 
                                                className="form-control" 
                                                type="number" 
                                                step="0.0001"
                                                placeholder="Longitude" 
                                                value={stop.longitude}
                                                onChange={e => handleStopChange(index, 'longitude', parseFloat(e.target.value))}
                                            />
                                            <button className="btn text-danger" onClick={() => removeStopField(index)}><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    className="btn btn-primary" 
                                    style={{ marginTop: '20px', width: '200px' }} 
                                    onClick={saveStops}
                                    disabled={loading}
                                >
                                    <Save size={18} /> {loading ? "Saving..." : "Save Route Stops"}
                                </button>
                            </div>

                            <div className="glass-morphism" style={{ padding: '24px', borderRadius: '16px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f2b5b', marginBottom: '20px' }}>3. TRIP CONTROL CENTER</h3>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px', display: 'block' }}>ASSIGN BUS</label>
                                        <select 
                                            className="form-control"
                                            value={selectedBusId}
                                            onChange={e => setSelectedBusId(e.target.value)}
                                        >
                                            <option value="">Select an active bus...</option>
                                            {buses.map(b => (
                                                <option key={b.id} value={b.id}>{b.busNumber} ({b.busType})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ height: '42px', backgroundColor: '#22c55e', borderColor: '#22c55e', padding: '0 32px' }}
                                        onClick={handleStartTrip}
                                    >
                                        <Play size={18} /> START LIVE TRIP
                                    </button>
                                </div>
                                <div style={{ marginTop: '24px' }}>
                                    <LiveMap 
                                        routeStops={stops} 
                                        autoCenter={false} 
                                        height="300px" 
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-morphism" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', padding: '40px' }}>
                            <MapIcon size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                            <h3>Select a Route to Begin</h3>
                            <p>Choose an existing route from the left sidebar to manage stops and initiate live tracking.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRouteManagement;
