import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  PenTool, Droplets, AlertCircle, TrendingUp, 
  ArrowLeft, ChevronRight, Bus, DollarSign, CreditCard 
} from 'lucide-react';

const ErpDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ maintenanceCount: 0, fuelTotal: 0, workshopCount: 0 });
  const [workshopBuses, setWorkshopBuses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const alertsRef = React.useRef(null);

  const refreshData = async () => {
    try {
      // Senior Update: Adding timestamp to bypass browser caching
      const ts = new Date().getTime();
      const [sRes, wRes, aRes] = await Promise.all([
        api.get(`/erp/stats?t=${ts}`),
        api.get(`/erp/workshop?t=${ts}`),
        api.get(`/erp/alerts?t=${ts}`)
      ]);
      setStats(sRes.data);
      setWorkshopBuses(wRes.data);
      setAlerts(aRes.data);
      setLoading(false);
    } catch (err) {
      console.error('ERP Stats Refresh Failed:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // 30-Second Heartbeat Polling
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container animate-fade" style={{ paddingTop: '120px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button className="btn" onClick={() => navigate('/admin')} style={{ border: '1px solid #ddd', color: '#666' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2 style={{ margin: 0, color: '#1a2a4b', fontWeight: '800' }}>Fleet ERP & Management</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Maintenance, Fuel & Workshop Ledger</p>
        </div>
      </div>

      {/* Top Ledger Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-morphism" style={styles.statCard} onClick={() => navigate('/admin/maintenance')}>
          <div style={{ ...styles.iconCircle, background: '#fef3c7' }}>
            <PenTool size={24} color="#d97706" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.statLabel}>Service Records</div>
            <div style={styles.statValue}>{stats.maintenanceCount} Logs</div>
          </div>
          <ChevronRight size={20} color="#cbd5e1" />
        </div>

        <div className="glass-morphism" style={styles.statCard} onClick={() => navigate('/admin/fuel')}>
          <div style={{ ...styles.iconCircle, background: '#dcfce7' }}>
            <TrendingUp size={24} color="#16a34a" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.statLabel}>Fuel Expenditure</div>
            <div style={styles.statValue}>₹{stats.fuelTotal.toLocaleString()}</div>
          </div>
          <ChevronRight size={20} color="#cbd5e1" />
        </div>

        <div 
          className="glass-morphism" 
          style={styles.statCard} 
          onClick={() => alertsRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div style={{ ...styles.iconCircle, background: '#fee2e2' }}>
            <AlertCircle size={24} color="#dc2626" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.statLabel}>Fleet Alerts</div>
            <div style={styles.statValue}>{alerts.length} Tasks Pending</div>
          </div>
          <ChevronRight size={20} color="#cbd5e1" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
        <div className="glass-morphism" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px', color: '#1a2a4b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bus size={20} color="var(--primary)" /> Workshop Status
          </h3>
          <div style={styles.list}>
            {workshopBuses.length > 0 ? workshopBuses.map((bus, i) => (
              <div key={bus.id} style={styles.listItem}>
                <div style={{ fontWeight: '600' }}>{bus.busNumber} ({bus.busName})</div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <span style={styles.maintenanceBadge}>Under Maintenance</span>
                  <span style={{ color: '#94a3b8' }}>Ref #{bus.id}</span>
                </div>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
                All clear. No assets currently in workshop.
              </div>
            )}
          </div>
        </div>

        <div className="glass-morphism" style={{ padding: '32px' }} ref={alertsRef}>
          <h3 style={{ marginBottom: '24px', color: '#1a2a4b' }}>Intelligent Fleet Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((alert, i) => (
              <div key={i} style={{ ...styles.listItem, background: alert.severity === 'HIGH' ? '#fff1f2' : '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={16} color={alert.severity === 'HIGH' ? '#e11d48' : '#64748b'} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{alert.title}</span>
                </div>
                <span style={{ fontSize: '11px', color: alert.severity === 'HIGH' ? '#e11d48' : '#64748b', fontWeight: '800' }}>{alert.severity}</span>
              </div>
            ))}
            <div style={{ height: '1px', background: '#f1f5f9', margin: '8px 0' }} />
            <button 
              className="btn" 
              onClick={() => navigate('/admin/maintenance')}
              style={styles.navBtn}
            >
              <PenTool size={18} /> Maintenance Module
            </button>
            <button 
              className="btn" 
              onClick={() => navigate('/admin/fuel')}
              style={styles.navBtn}
            >
              <Droplets size={18} /> Fuel Management
            </button>
            <button 
              className="btn" 
              onClick={() => navigate('/admin/passes')}
              style={{ ...styles.navBtn, borderLeft: '4px solid var(--primary)' }}
            >
              <CreditCard size={18} /> Pass Management Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  statCard: { padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' },
  iconCircle: { width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  statValue: { fontSize: '22px', fontWeight: '800', color: '#1e293b', marginTop: '4px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  listItem: { padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: { width: '100%', justifyContent: 'flex-start', border: '1px solid #e2e8f0', background: 'white', color: '#1a2a4b', padding: '16px' },
  maintenanceBadge: { color: '#d97706', background: '#fffbeb', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px' }
};

export default ErpDashboard;
