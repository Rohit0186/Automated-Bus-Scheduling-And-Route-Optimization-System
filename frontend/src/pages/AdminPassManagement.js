import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
    Check, 
    X, 
    User, 
    MapPin, 
    Bus, 
    ShieldCheck,
    Loader2,
    Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPassManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await api.get('/admin/passes/pending');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setActionLoading(id);
        try {
            await api.put(`/admin/passes/${id}/status`, {
                status,
                remarks: status === 'APPROVED' ? 'Verified by Admin' : 'Incomplete documentation'
            });
            toast.success(`Request ${status.toLowerCase()} successfully`);
            setRequests(requests.filter(r => r.id !== id));
        } catch (err) {
            toast.error("Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="container animate-fade" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--secondary)' }}>Pass Management</h1>
                    <p style={{ color: 'var(--text-light)', fontWeight: '600' }}>Review and authenticate transport pass applications.</p>
                </div>
                <div style={{ background: 'white', padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={20} color="#16a34a" />
                    <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--secondary)' }}>{requests.length} Pending Actions</span>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--primary)" style={{ margin: '0 auto' }} />
                </div>
            ) : (
                <div className="glass-panel" style={{ background: 'white', overflow: 'hidden' }}>
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                            <tr>
                                <th style={styles.th}>USER / ID</th>
                                <th style={styles.th}>ROUTE & TYPE</th>
                                <th style={styles.th}>PAYMENT STATUS</th>
                                <th style={styles.th}>ESTIMATED FARE</th>
                                <th style={styles.th}>APPLIED ON</th>
                                <th style={styles.th}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {requests.length > 0 ? (
                                    requests.map((req) => (
                                        <motion.tr 
                                            key={req.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            style={{ borderBottom: '1px solid #f1f5f9' }}
                                        >
                                            <td style={styles.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ background: '#f1f5f9', p: '8px', borderRadius: '8px', padding: '8px' }}>
                                                        <User size={16} color="#64748b" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '800', color: 'var(--secondary)', fontSize: '13px' }}>User ID: #{req.userId}</div>
                                                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>APP-ID: {req.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                        <MapPin size={12} color="var(--primary)" />
                                                        <span style={{ fontWeight: '800', fontSize: '13px' }}>Route #{req.routeId}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Bus size={12} color="#64748b" />
                                                        <span style={{ fontWeight: '700', fontSize: '11px', color: '#64748b' }}>{req.busType} • {req.requestType}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <div>
                                                    <span style={{ 
                                                        fontSize: '10px', fontWeight: '900', 
                                                        color: req.paymentStatus === 'PAID' ? '#166534' : '#991b1b',
                                                        background: req.paymentStatus === 'PAID' ? '#dcfce7' : '#fef2f2',
                                                        padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px'
                                                    }}>
                                                        {req.paymentStatus}
                                                    </span>
                                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>{req.transactionId || 'No Transaction'}</div>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '16px' }}>₹{req.price}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text-light)' }}>
                                                    {new Date(req.appliedAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button 
                                                        onClick={() => handleAction(req.id, 'APPROVED')}
                                                        disabled={actionLoading === req.id}
                                                        className="btn" 
                                                        style={{ background: '#dcfce7', color: '#166534', padding: '8px 16px', fontSize: '11px', fontWeight: '900', border: 'none' }}
                                                    >
                                                        {actionLoading === req.id ? "..." : <><Check size={14} /> APPROVE</>}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(req.id, 'REJECTED')}
                                                        disabled={actionLoading === req.id}
                                                        className="btn" 
                                                        style={{ background: '#fef2f2', color: '#991b1b', padding: '8px 16px', fontSize: '11px', fontWeight: '900', border: 'none' }}
                                                    >
                                                        {actionLoading === req.id ? "..." : <><X size={14} /> REJECT</>}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '60px', textAlign: 'center' }}>
                                            <Search size={40} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
                                            <p style={{ fontWeight: '800', color: '#94a3b8' }}>All caught up! No pending pass requests.</p>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const styles = {
    th: { padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' },
    td: { padding: '20px 24px' }
};

export default AdminPassManagement;
