import React, { useState, useEffect } from 'react';
import api from '../api';
import { Map as MapIcon, MapPin, Bus, Save, Plus, Trash2, Upload, Activity, Power, PowerOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import '../styles/AdminDashboard.css';
import './AdminStyles.css';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  const [formData, setFormData] = useState({
    routeName: '',
    source: '',
    destination: '',
    totalDistance: '',
    farePerKm: '',
    isActive: true,
    stops: []
  });

  const [buses, setBuses] = useState([]);
  const [selectedBuses, setSelectedBuses] = useState([]);

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/routes');
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch routes');
    }
  };

  const fetchBuses = async () => {
    try {
      const res = await api.get('/buses');
      setBuses(res.data);
    } catch (err) {
      console.error('Buses might not be available yet', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { stopName: '', stopOrder: prev.stops.length + 1, durationFromStart: '', distanceFromStart: '' }]
    }));
  };

  const updateStop = (index, field, value) => {
    const updatedStops = [...formData.stops];
    updatedStops[index][field] = value;
    setFormData({ ...formData, stops: updatedStops });
  };

  const removeStop = (index) => {
    const updatedStops = formData.stops.filter((_, i) => i !== index);
    updatedStops.forEach((stop, idx) => stop.stopOrder = idx + 1);
    setFormData({ ...formData, stops: updatedStops });
  };

  const handleBusSelection = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        values.push(parseInt(options[i].value));
      }
    }
    setSelectedBuses(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedData = {
        ...formData,
        totalDistance: parseFloat(formData.totalDistance),
        farePerKm: parseFloat(formData.farePerKm),
        stops: formData.stops.map(stop => ({
          ...stop,
          durationFromStart: parseInt(stop.durationFromStart),
          distanceFromStart: parseFloat(stop.distanceFromStart),
          stopOrder: parseInt(stop.stopOrder)
        }))
      };

      const res = await api.post('/admin/routes', formattedData);
      
      if (selectedBuses.length > 0) {
        await api.post(`/admin/routes/${res.data.id}/assign-bus`, {
          busIds: selectedBuses
        });
      }

      toast.success('Route saved successfully!');
      fetchRoutes();
      setFormData({
        routeName: '', source: '', destination: '', totalDistance: '', farePerKm: '', isActive: true, stops: []
      });
      setSelectedBuses([]);
    } catch (err) {
      toast.error('Error saving route: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      toast.error("Please select a file first");
      return;
    }
    const data = new FormData();
    data.append('file', excelFile);
    setLoading(true);
    try {
      await api.post('/admin/routes/upload-excel', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Excel uploaded successfully!');
      fetchRoutes();
    } catch (err) {
      toast.error('Error uploading excel: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
      setExcelFile(null);
    }
  };

  const toggleRoute = async (id) => {
    try {
      await api.put(`/admin/routes/${id}/toggle`);
      toast.success('Route status updated');
      fetchRoutes();
    } catch (err) {
      console.error(err);
      toast.error('Error updating status');
    }
  };

  return (
    <div className="admin-container" style={{ padding: '24px' }}>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MapIcon className="text-primary" size={32} /> Route Management
          </h1>
          <p>Architect new paths, manage dynamic stops, and assign fleet vehicles seamlessly.</p>
        </div>
        <div className="glass-morphism" style={{ padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}>BULK IMPORT (EXCEL)</label>
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={(e) => setExcelFile(e.target.files[0])}
              style={{ fontSize: '13px' }}
            />
          </div>
          <button 
            onClick={handleExcelUpload}
            disabled={loading || !excelFile}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Upload size={18} /> Upload Data
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginTop: '24px' }}>
        
        {/* ROUTE CREATION FORM */}
        <div className="glass-morphism" style={{ padding: '32px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#0f2b5b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} className="text-primary" /> CREATE NEW ROUTE
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Route Name</label>
                <input required type="text" name="routeName" value={formData.routeName} onChange={handleInputChange} className="form-control" placeholder="e.g. Express Line 1" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Source</label>
                <input required type="text" name="source" value={formData.source} onChange={handleInputChange} className="form-control" placeholder="e.g. Lucknow" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Destination</label>
                <input required type="text" name="destination" value={formData.destination} onChange={handleInputChange} className="form-control" placeholder="e.g. Delhi" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Total Distance (KM)</label>
                <input required type="number" step="0.1" name="totalDistance" value={formData.totalDistance} onChange={handleInputChange} className="form-control" placeholder="e.g. 500" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Fare Per KM (₹)</label>
                <input required type="number" step="0.01" name="farePerKm" value={formData.farePerKm} onChange={handleInputChange} className="form-control" placeholder="e.g. 1.50" />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} style={{ width: '20px', height: '20px', accentColor: '#d84e55' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f2b5b' }}>Route is Active</span>
                </label>
              </div>
            </div>

            <hr style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

            {/* DYNAMIC STOP BUILDER */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f2b5b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={20} className="text-primary" /> DYNAMIC STOP BUILDER
                </h3>
                <button type="button" onClick={addStop} className="btn" style={{ backgroundColor: '#1e293b', color: '#fff', fontSize: '13px', display: 'flex', gap: '8px' }}>
                  <Plus size={16} /> Add Stop
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {formData.stops.map((stop, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 60px', gap: '16px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '800', color: '#94a3b8', fontSize: '16px', textAlign: 'center' }}>#{stop.stopOrder}</div>
                    <input required placeholder="Stop Name (e.g. Kanpur Central)" value={stop.stopName} onChange={(e) => updateStop(idx, 'stopName', e.target.value)} className="form-control" style={{ margin: 0 }} />
                    <input required type="number" placeholder="Duration from start (mins)" value={stop.durationFromStart} onChange={(e) => updateStop(idx, 'durationFromStart', e.target.value)} className="form-control" style={{ margin: 0 }} />
                    <input required type="number" step="0.1" placeholder="Distance (KM)" value={stop.distanceFromStart} onChange={(e) => updateStop(idx, 'distanceFromStart', e.target.value)} className="form-control" style={{ margin: 0 }} />
                    <button type="button" onClick={() => removeStop(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                {formData.stops.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
                    <MapPin size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p style={{ fontWeight: '600' }}>No stops added yet. Click "+ Add Stop" to begin mapping the route.</p>
                  </div>
                )}
              </div>
            </div>

            <hr style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

            {/* ASSIGN BUSES */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f2b5b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bus size={20} className="text-primary" /> ASSIGN FLEET (OPTIONAL)
              </h3>
              <select multiple value={selectedBuses} onChange={handleBusSelection} className="form-control" style={{ height: '120px', padding: '12px' }}>
                {buses.map(b => (
                  <option key={b.id} value={b.id} style={{ padding: '8px', borderRadius: '4px', marginBottom: '4px' }}>
                    🚌 {b.busNumber} - {b.busName} ({b.busType})
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>* Hold Ctrl (Windows) or Cmd (Mac) to select multiple buses.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Save size={20} /> {loading ? 'Saving Route...' : 'Save Complete Route Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* EXISTING ROUTES */}
        <div className="glass-morphism" style={{ padding: '32px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#0f2b5b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={22} className="text-primary" /> ACTIVE NETWORK ARCHITECTURE
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0 16px 12px', textAlign: 'left' }}>ROUTE ID</th>
                  <th style={{ padding: '0 16px 12px', textAlign: 'left' }}>ROUTE NAME</th>
                  <th style={{ padding: '0 16px 12px', textAlign: 'left' }}>PATHWAY</th>
                  <th style={{ padding: '0 16px 12px', textAlign: 'left' }}>METRICS</th>
                  <th style={{ padding: '0 16px 12px', textAlign: 'left' }}>ASSIGNED FLEET</th>
                  <th style={{ padding: '0 16px 12px', textAlign: 'center' }}>STATUS</th>
                  <th style={{ padding: '0 16px 12px', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {routes.map(r => (
                  <tr key={r.id} style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <td style={{ padding: '16px', borderRadius: '8px 0 0 8px', fontWeight: 'bold', color: '#94a3b8' }}>#{r.id}</td>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#0f2b5b' }}>{r.routeName}</td>
                    <td style={{ padding: '16px', color: '#475569', fontWeight: '500' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#d84e55' }}>{r.source}</span>
                        <span style={{ color: '#cbd5e1' }}>→</span>
                        <span style={{ color: '#10b981' }}>{r.destination}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '700', color: '#334155' }}>{r.totalDistance} KM</div>
                      <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '700' }}>₹{r.farePerKm}/km</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {r.buses && r.buses.length > 0 ? r.buses.map(b => (
                          <span key={b.id} style={{ 
                            fontSize: '10px', 
                            backgroundColor: '#e2e8f0', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            fontWeight: '700',
                            color: '#475569'
                          }}>
                            {b.busNumber}
                          </span>
                        )) : (
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>None assigned</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                        backgroundColor: r.isActive ? '#dcfce7' : '#fee2e2',
                        color: r.isActive ? '#166534' : '#991b1b'
                      }}>
                        {r.isActive ? <Power size={12} /> : <PowerOff size={12} />}
                        {r.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', borderRadius: '0 8px 8px 0', textAlign: 'center' }}>
                      <button 
                        onClick={() => toggleRoute(r.id)} 
                        className="btn"
                        style={{ 
                          backgroundColor: 'transparent', 
                          border: '1px solid #e2e8f0', 
                          color: '#475569',
                          padding: '6px 16px',
                          fontSize: '12px'
                        }}
                      >
                        Toggle State
                      </button>
                    </td>
                  </tr>
                ))}
                {routes.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No routes established in the network.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteManagement;
