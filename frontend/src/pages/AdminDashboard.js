import React, { useState, useEffect, useRef } from 'react';
import { 
  Bus, MapPin, Users, Milestone, TrendingUp, AlertTriangle, 
  Activity, DollarSign, Plus, UserPlus, Play, Navigation 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { toast } from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Link } from 'react-router-dom';
import api from '../api';
import LiveMap from '../components/LiveMap';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [liveBuses, setLiveBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const stompClient = useRef(null);
    const [lastSynced, setLastSynced] = useState(new Date());

    useEffect(() => {
        fetchDashboardData();
        initWebSocket();
        
        // Heartbeat synchronization: Every 30 seconds
        const pollInterval = setInterval(() => {
            fetchDashboardData();
        }, 30000);

        return () => {
            if (stompClient.current) stompClient.current.deactivate();
            clearInterval(pollInterval);
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [sumRes, anaRes, liveRes] = await Promise.all([
                api.get('/admin/dashboard/summary'),
                api.get('/admin/dashboard/analytics'),
                api.get('/admin/dashboard/live-status')
            ]);
            setSummary(sumRes.data);
            setAnalytics(anaRes.data);
            setLiveBuses(liveRes.data);
            setLastSynced(new Date());
        } catch (err) {
            console.error(err);
            // Non-intrusive error for polling
        } finally {
            setLoading(false);
        }
    };

    const initWebSocket = () => {
        const socket = new SockJS('http://localhost:8085/ws-tracking');
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                stompClient.current.subscribe('/topic/admin/active-buses', (message) => {
                    const update = JSON.parse(message.body);
                    setLiveBuses(update);
                });
            }
        });
        stompClient.current.activate();
    };

    if (loading) return <div className="admin-dashboard">Loading Control Center...</div>;

    const COLORS = ['#0f2b5b', '#f97316', '#10b981', '#ef4444'];

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header animate-fade-in" style={{ 
                background: 'white', 
                padding: '24px 32px', 
                margin: '-24px -24px 30px -24px', 
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ fontSize: '26px', margin: 0, color: 'var(--secondary)', fontWeight: '900' }}>Control Center</h1>
                    <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                        Real-time fleet intelligence & oversight
                    </p>
                </div>
                <div className="actions-panel" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link to="/admin/buses" className="btn-action" style={{ whiteSpace: 'nowrap' }}><Plus size={16} /> Add Bus</Link>
                    <Link to="/admin/routes" className="btn-action" style={{ whiteSpace: 'nowrap' }}><Milestone size={16} /> New Route</Link>
                    <Link to="/admin/schedules" className="btn-action primary" style={{ whiteSpace: 'nowrap' }}><Play size={16} /> Dispatch Trip</Link>
                </div>
            </div>

            {/* KPI STATS */}
            <div className="kpi-grid">
                <StatCard icon={<Bus color="#0f2b5b" />} label="Total Buses" value={summary?.totalBuses || 0} trend={summary?.busesTrend} bg="#e0e7ff" />
                <StatCard icon={<Activity color="#10b981" />} label="Active Now" value={summary?.activeBuses || 0} trend={summary?.activeTrend} bg="#dcfce7" />
                <StatCard icon={<Milestone color="#f97316" />} label="Total Routes" value={summary?.totalRoutes || 0} trend={summary?.routesTrend} bg="#ffedd5" />
                <StatCard icon={<Navigation color="#6366f1" />} label="Running Trips" value={summary?.runningTrips || 0} trend={summary?.tripsTrend} bg="#ede9fe" />
                <StatCard icon={<Users color="#0ea5e9" />} label="Total Users" value={summary?.totalUsers || 0} trend={summary?.usersTrend} bg="#e0f2fe" />
                <StatCard icon={<DollarSign color="#8b5cf6" />} label="Today Revenue" value={`₹${(summary?.todayRevenue || 0).toLocaleString()}`} trend={summary?.revenueTrend} bg="#f5f3ff" />
            </div>

            {/* CHARTS */}
            <div className="charts-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '20px' }}>
                <div className="chart-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2>Daily Revenue Performance</h2>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800' }}>LAST 7 DAYS</span>
                    </div>
                    <div style={{ height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics?.revenueChart}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={4} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2>Pass Analytics</h2>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800' }}>APPROVAL FLOW</span>
                    </div>
                    <div style={{ height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={analytics?.passStats} 
                                    innerRadius={70} 
                                    outerRadius={90} 
                                    paddingAngle={8} 
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {analytics?.passStats?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#f59e0b', '#10b981', '#ef4444'][index % 3]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '-20px' }}>
                            {analytics?.passStats?.map((entry, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ['#f59e0b', '#10b981', '#ef4444'][index % 3] }}></div>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="chart-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2>Top Routes</h2>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800' }}>BY VOLUME</span>
                    </div>
                    <div style={{ height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics?.routeUsage} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} style={{ fontSize: '11px', fontWeight: 600 }} />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {analytics?.routeUsage?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* LIVE FLEET */}
            <div className="live-grid">
                <div className="status-list animate-slide-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Live Fleet Status</h2>
                        <span className="status-indicator running">{liveBuses.length} Running</span>
                    </div>
                    {liveBuses.map((bus, idx) => (
                        <div key={idx} className="status-item">
                            <div className="status-bus-info">
                                <h4>{bus.busNumber}</h4>
                                <p>Next: {bus.nextStop}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700' }}>{Math.round(bus.speed)} km/h</div>
                                <span className={`status-indicator ${bus.status === 'DELAYED' ? 'delayed' : 'running'}`}>
                                    {bus.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {liveBuses.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No active trips found.</p>}
                </div>
                <div className="chart-container" style={{ padding: 0, overflow: 'hidden' }}>
                    <LiveMap 
                        allBuses={liveBuses} 
                        cluster={true} 
                        height="500px" 
                        autoCenter={false} 
                    />
                </div>
            </div>

            {/* ALERTS & RECENT */}
            <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="chart-container">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={18} color="#ef4444" /> Smart Alerts</h2>
                    <div className="alert-item" style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
                        <strong style={{ fontSize: '14px', color: '#991b1b' }}>Minor Delay: UP32-AT-1234</strong>
                        <p style={{ fontSize: '12px', color: '#b91c1c' }}>Bus is running 12 mins behind schedule on Delhi-Agra route.</p>
                    </div>
                </div>
                <div className="chart-container">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} color="#0f2b5b" /> Recent Activity</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      <ActivityLogItem time="2 mins ago" text="Bus UP78-BT-5566 started trip to Kanpur" />
                      <ActivityLogItem time="15 mins ago" text="User 'rohit_01' booked 2 seats on Exp-404" />
                      <ActivityLogItem time="1 hour ago" text="New route Lucknow-Gorakhpur created" />
                    </ul>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, bg }) => (
    <div className="kpi-card">
        <div className="kpi-icon" style={{ background: bg }}>
            {icon}
        </div>
        <div className="kpi-content">
            <h3>{label}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="kpi-value">{value}</span>
                <span className={`kpi-trend ${(trend || "").startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                    {trend || "0"}
                </span>
            </div>
        </div>
    </div>
);

const ActivityLogItem = ({ time, text }) => (
    <li style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
        <span>{text}</span>
        <span style={{ color: '#94a3b8', fontSize: '11px' }}>{time}</span>
    </li>
);

export default AdminDashboard;
