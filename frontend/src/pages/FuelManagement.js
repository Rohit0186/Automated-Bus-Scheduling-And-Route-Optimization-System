import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Droplets, Plus, Calendar, DollarSign, Bus, TrendingUp, Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const FuelManagement = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newLog, setNewLog] = useState({
    bus: { id: 1 },
    date: new Date().toISOString().split('T')[0],
    liters: 0,
    totalCost: 0,
    receiptNumber: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const lRes = await api.get('/erp/fuel');
      const bRes = await api.get('/admin/buses');
      setLogs(lRes.data || []);
      setBuses(bRes.data || []);

      // Senior Update: Auto-select the first available bus instead of hardcoding ID 1
      if (bRes.data && bRes.data.length > 0) {
        setNewLog(prev => ({ ...prev, bus: { id: bRes.data[0].id } }));
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/erp/fuel', {
        ...newLog,
        date: new Date(newLog.date).toISOString()
      });
      toast.success('Fuel record saved');
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to log fuel');
    }
  };

  const totalSpent = logs.reduce((acc, l) => acc + (l.totalCost || 0), 0);
  const totalLiters = logs.reduce((acc, l) => acc + (l.liters || 0), 0);

  return (
    <div className="container animate-fade" style={{ paddingTop: '120px', paddingBottom: '40px' }}>
      <Toaster />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn" onClick={() => navigate('/admin/erp')} style={{ border: '1px solid #ddd', color: '#666' }}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <h2 style={{ margin: 0, color: '#1a2a4b', fontWeight: '800' }}>Fuel Consumption Management</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Receipt Entry
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-morphism" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '12px' }}>
             <DollarSign size={32} color="#059669" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Refill Expenditure</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>₹{totalSpent.toLocaleString()}</div>
          </div>
        </div>
        <div className="glass-morphism" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px' }}>
             <Droplets size={32} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Volume Consumed</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>{totalLiters.toFixed(2)} Liters</div>
          </div>
        </div>
      </div>

      <div className="glass-morphism" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Bus Number</th>
              <th style={styles.th}>Fuel (Liters)</th>
              <th style={styles.th}>Total Cost</th>
              <th style={styles.th}>Rate (₹/L)</th>
              <th style={styles.th}>Receipt #</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={styles.td}>{new Date(log.date).toLocaleDateString()}</td>
                <td style={styles.td}><Bus size={14} style={{ marginRight: '6px' }} /> {log.bus?.busNumber}</td>
                <td style={styles.td}><strong>{log.liters?.toFixed(2)} L</strong></td>
                <td style={styles.td}>₹{log.totalCost?.toLocaleString()}</td>
                <td style={styles.td}>₹{(log.totalCost / (log.liters || 1)).toFixed(2)}</td>
                <td style={styles.td}><span style={styles.receiptBadge}>{log.receiptNumber}</span></td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  No fuel logs recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-morphism animate-fade" style={styles.modal}>
             <h3 style={{ marginBottom: '24px' }}>Record Fuel Refill</h3>
             <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>Bus Selection</label>
                    <select 
                      style={styles.input} 
                      value={newLog.bus.id} 
                      onChange={e => setNewLog({...newLog, bus: { id: Number(e.target.value) }})}
                    >
                      {buses.map(b => (
                        <option key={b.id} value={b.id}>{b.busNumber}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Log Date</label>
                    <input type="date" style={styles.input} value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} />
                  </div>
                  <div>
                    <label style={styles.label}>Liters</label>
                    <input type="number" step="0.01" style={styles.input} value={newLog.liters} onChange={e => setNewLog({...newLog, liters: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label style={styles.label}>Total Cost (₹)</label>
                    <input type="number" style={styles.input} value={newLog.totalCost} onChange={e => setNewLog({...newLog, totalCost: Number(e.target.value)})} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={styles.label}>Receipt / Voucher Number</label>
                    <input placeholder="REF-XXXX" style={styles.input} value={newLog.receiptNumber} onChange={e => setNewLog({...newLog, receiptNumber: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Login Record</button>
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid #ddd' }}>Cancel</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  th: { padding: '16px 20px', fontSize: '13px', color: '#64748b' },
  td: { padding: '16px 20px', fontSize: '14px', color: '#1e293b' },
  receiptBadge: { padding: '4px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', paddingTop: '80px' },
  modal: { width: '100%', maxWidth: '500px', padding: '32px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { display: 'block', margin: '0 0 6px 0', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }
};

export default FuelManagement;
