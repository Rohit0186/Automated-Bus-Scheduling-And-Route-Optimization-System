import React, { useState, useEffect } from 'react';
import api from '../api';
import { MapPin, Clock, ArrowDown, Info } from 'lucide-react';

const RouteExplorer = ({ routeId }) => {
    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!routeId) return;
            try {
                const res = await api.get(`/api/enquiry/route/${routeId}/details`);
                setStops(res.data);
            } catch (err) {
                console.error("Failed to load route details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [routeId]);

    if (loading) return <div style={{ padding: '20px', color: '#666' }}>Loading route sequence...</div>;
    if (stops.length === 0) return <div style={{ padding: '20px', color: '#94a3b8' }}>No stop information available for this route.</div>;

    return (
        <div className="animate-fade" style={{ background: '#f8fafc', borderRadius: '15px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '24px', color: '#1a2a4b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={18} color="var(--primary)" /> Route Sequence & Timing
            </h4>

            <div style={{ position: 'relative', paddingLeft: '30px' }}>
                {/* Vertical Line */}
                <div style={{ 
                    position: 'absolute', left: '14px', top: '10px', bottom: '10px', 
                    width: '2px', background: 'linear-gradient(180deg, var(--primary), var(--secondary))',
                    opacity: 0.3
                }} />

                {stops.map((rs, index) => (
                    <div key={rs.id} style={{ marginBottom: '24px', position: 'relative' }}>
                        {/* Bullet */}
                        <div style={{ 
                            position: 'absolute', left: '-25px', top: '4px',
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: index === 0 || index === stops.length - 1 ? 'var(--primary)' : 'white',
                            border: `2px solid var(--primary)`,
                            zIndex: 2
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>
                                    {rs.stop?.stopName}
                                </div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                                    {index === 0 ? 'Origin Station' : index === stops.length - 1 ? 'Terminal Destination' : `Stop #${rs.stopOrder}`}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                {index > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                            <ArrowDown size={12} /> +{rs.distanceDeltaKm} KM
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                            <Clock size={12} /> {rs.timeDeltaMinutes} mins
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                * Distance and timing are estimates based on standard driving conditions.
            </div>
        </div>
    );
};

export default RouteExplorer;
