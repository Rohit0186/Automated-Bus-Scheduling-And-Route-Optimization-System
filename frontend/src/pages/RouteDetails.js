import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Map, ArrowRight, ArrowLeft, Clock, MapPin, Navigation, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RouteDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const res = await api.get(`/routes/${id}`);
                setRoute(res.data);
            } catch (err) {
                toast.error("Failed to load route details.");
            } finally {
                setLoading(false);
            }
        };
        fetchRoute();
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ color: '#f97316', fontSize: '18px', fontWeight: 'bold' }}>Loading Route Details...</div>
            </div>
        );
    }

    if (!route) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Route Not Found</h2>
                <button onClick={() => navigate('/search')} style={{ padding: '10px 20px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}>
                    Back to Routes
                </button>
            </div>
        );
    }

    const totalFare = Math.round((route.totalDistance * route.baseFarePerKm) * 100) / 100;
    const sortedStops = [...(route.stops || [])].sort((a, b) => a.stopOrder - b.stopOrder);

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                <button
                    onClick={() => navigate(-1)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#475569', cursor: 'pointer', fontWeight: '600' }}
                >
                    <ArrowLeft size={16} /> Back
                </button>

                {/* ROUTE HEADER */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'inline-flex', padding: '6px 12px', backgroundColor: '#fff7ed', color: '#ea580c', borderRadius: '24px', fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>
                                EXPRESS ROUTE
                            </div>
                            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Map color="#f97316" size={32} />
                                {route.routeName}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#334155', fontSize: '18px', fontWeight: '600' }}>
                                <span>{route.source}</span>
                                <ArrowRight size={20} color="#f97316"/>
                                <span>{route.destination}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b' }}>₹{totalFare}</div>
                            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Total Fare</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: '500' }}>
                            <Navigation size={18} color="#94a3b8"/> Distance: {route.totalDistance} KM
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: '500' }}>
                            <Tag size={18} color="#94a3b8"/> Rate: ₹{route.baseFarePerKm}/KM
                        </div>
                    </div>
                </div>

                {/* TIMELINE VIEW */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={24} color="#f97316"/> Interactive Journey Map
                    </h2>

                    <div style={{ marginLeft: '12px', borderLeft: '3px solid #fdba74', paddingLeft: '32px', position: 'relative' }}>
                        
                        {/* TERMINUS - ORIGIN */}
                        <div style={{ position: 'relative', marginBottom: '32px' }}>
                            <div style={{ position: 'absolute', left: '-42px', top: '0', width: '20px', height: '20px', backgroundColor: '#ea580c', borderRadius: '50%', border: '4px solid white', boxShadow: '0 0 0 2px #ea580c' }} />
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>{route.source}</h3>
                            <span style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>Origin Station</span>
                        </div>

                        {/* INTERMEDIATE STOPS */}
                        {sortedStops.map((stop, index) => {
                            // Calculate fare up to this point
                            const stopFare = Math.round((stop.distanceFromStart * route.baseFarePerKm) * 100) / 100;
                            return (
                                <div key={stop.id} style={{ position: 'relative', marginBottom: '32px' }}>
                                    <div style={{ position: 'absolute', left: '-39px', top: '4px', width: '14px', height: '14px', backgroundColor: 'white', borderRadius: '50%', border: '3px solid #f97316' }} />
                                    
                                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#334155' }}>{stop.stopName}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '13px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> Arr: {stop.arrivalTime ? stop.arrivalTime.substring(0,5) : '-'}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> Dep: {stop.departureTime ? stop.departureTime.substring(0,5) : '-'}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>₹{stopFare}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>from origin</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* TERMINUS - FINAL */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-42px', top: '0', width: '20px', height: '20px', backgroundColor: '#ea580c', borderRadius: '50%', border: '4px solid white', boxShadow: '0 0 0 2px #ea580c' }} />
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>{route.destination}</h3>
                            <span style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>Final Destination</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RouteDetails;
