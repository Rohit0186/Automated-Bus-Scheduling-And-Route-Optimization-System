import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, PenTool, Plus, Calendar, User, DollarSign, Bus, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const MaintenanceTracking = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newLog, setNewLog] = useState({
    bus: { id: 1 },
    serviceType: '',
    serviceDate: new Date().toISOString().split('T')[0],
    description: '',
    cost: 0,
    mechanicName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const lRes = await api.get('/erp/maintenance');
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
      await api.post('/erp/maintenance', {
        ...newLog,
        serviceDate: new Date(newLog.serviceDate).toISOString()
      });
      toast.success('Maintenance record logged successfully');
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to log maintenance');
    }
  };

  return (
    <div className="container animate-fade" style={{ paddingTop: '120px', paddingBottom: '40px' }}>
      <Toaster />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn" onClick={() => navigate('/admin/erp')} style={{ border: '1px solid #ddd', color: '#666' }}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <h2 style={{ margin: 0, color: '#1a2a4b', fontWeight: '800' }}>Workshop Maintenance</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Log Service Task
        </button>
      </div>

      <div className="glass-morphism" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Bus</th>
              <th style={styles.th}>Service Type</th>
              <th style={styles.th}>Mechanic</th>
              <th style={styles.th}>Cost</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={styles.td}>{new Date(log.serviceDate).toLocaleDateString()}</td>
                <td style={styles.td}><Bus size={14} style={{ marginRight: '6px' }} /> {log.bus?.busNumber}</td>
                <td style={styles.td}><strong>{log.serviceType}</strong></td>
                <td style={styles.td}>{log.mechanicName}</td>
                <td style={styles.td}>₹{log.cost?.toLocaleString()}</td>
                <td style={styles.td}>
                   <span style={styles.statusBadge}><CheckCircle size={12} /> Completed</span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  No maintenance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={styles.modalCard}>

            {/* ── Modal Header ── */}
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={styles.headerIcon}>
                  <PenTool size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1a2a4b' }}>Log Maintenance Task</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Fill in the service details below</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>✕</button>
            </div>

            {/* ── Divider ── */}
            <div style={{ height: '1px', background: '#e2e8f0' }} />

            {/* ── Modal Body (scrollable) ── */}
            <div style={styles.modalBody}>
              <form onSubmit={handleSubmit}>

                {/* Row 1: Bus + Date */}
                <div style={styles.formRow}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}><Bus size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Bus Number</label>
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
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}><Calendar size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Service Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={newLog.serviceDate}
                      onChange={e => setNewLog({...newLog, serviceDate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Row 2: Service Type + Mechanic */}
                <div style={styles.formRow}>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}><PenTool size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Service Type</label>
                    <input
                      placeholder="e.g. Engine Overhaul"
                      style={styles.input}
                      value={newLog.serviceType}
                      onChange={e => setNewLog({...newLog, serviceType: e.target.value})}
                    />
                  </div>
                  <div style={styles.fieldWrap}>
                    <label style={styles.label}><User size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Mechanic Name</label>
                    <input
                      placeholder="e.g. Ramesh Kumar"
                      style={styles.input}
                      value={newLog.mechanicName}
                      onChange={e => setNewLog({...newLog, mechanicName: e.target.value})}
                    />
                  </div>
                </div>

                {/* Row 3: Total Cost (full width) */}
                <div style={styles.fieldWrapFull}>
                  <label style={styles.label}><DollarSign size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Total Cost (₹)</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={newLog.cost}
                    onChange={e => setNewLog({...newLog, cost: Number(e.target.value)})}
                  />
                </div>

                {/* Row 4: Description (full width) */}
                <div style={styles.fieldWrapFull}>
                  <label style={styles.label}>Detailed Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the work performed..."
                    style={{ ...styles.input, resize: 'vertical', minHeight: '96px' }}
                    value={newLog.description}
                    onChange={e => setNewLog({...newLog, description: e.target.value})}
                  />
                </div>

                {/* ── Footer Buttons ── */}
                <div style={styles.modalFooter}>
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={styles.saveBtn}>
                    <CheckCircle size={16} /> Save Record
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  th: { padding: '16px 20px', fontSize: '13px', color: '#64748b' },
  td: { padding: '16px 20px', fontSize: '14px', color: '#1e293b' },
  statusBadge: {
    padding: '4px 10px', borderRadius: '20px', background: '#dcfce7',
    color: '#16a34a', fontSize: '12px', fontWeight: '700',
    display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content'
  },

  /* Overlay */
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    zIndex: 1000, backdropFilter: 'blur(6px)', padding: '80px 20px 20px 20px'
  },

  /* Card */
  modalCard: {
    width: '100%', maxWidth: '620px',
    background: '#ffffff', borderRadius: '16px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
    display: 'flex', flexDirection: 'column',
    maxHeight: '90vh', overflow: 'hidden'
  },

  /* Header */
  modalHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '24px 28px'
  },
  headerIcon: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #d84e55, #b53b40)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  closeBtn: {
    background: '#f1f5f9', border: 'none', borderRadius: '8px',
    width: '36px', height: '36px', cursor: 'pointer',
    fontSize: '16px', color: '#64748b', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s'
  },

  /* Body */
  modalBody: {
    padding: '24px 28px 8px',
    overflowY: 'auto', flex: 1
  },

  /* Form layout */
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  fieldWrap: { display: 'flex', flexDirection: 'column' },
  fieldWrapFull: { display: 'flex', flexDirection: 'column', marginBottom: '16px' },

  label: {
    display: 'block', marginBottom: '7px',
    fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em'
  },
  input: {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#1e293b',
    background: '#f8fafc', outline: 'none', transition: 'border 0.2s',
    boxSizing: 'border-box'
  },

  /* Footer */
  modalFooter: {
    display: 'flex', gap: '12px', padding: '20px 0 8px',
    borderTop: '1px solid #f1f5f9', marginTop: '8px'
  },
  cancelBtn: {
    flex: 1, border: '1.5px solid #e2e8f0', color: '#475569',
    background: '#f8fafc', borderRadius: '10px', fontWeight: '600'
  },
  saveBtn: {
    flex: 1, borderRadius: '10px', fontWeight: '700',
    background: 'linear-gradient(135deg, #d84e55, #b53b40)',
    boxShadow: '0 4px 14px rgba(216,78,85,0.35)'
  }
};

export default MaintenanceTracking;
