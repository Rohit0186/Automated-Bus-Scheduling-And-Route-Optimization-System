import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Calendar, Clock, Bus, User, Plus, Trash2, ArrowLeft } from 'lucide-react';

const ScheduleManagement = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    routeId: '', busId: '', driverId: '', conductorId: '', 
    departureDate: '', departureTime: '', estimatedArrivalTime: '', price: ''
  });
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [conductors, setConductor] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sRes, rRes, bRes, dRes, cRes] = await Promise.all([
        api.get('/admin/schedules'),
        api.get('/admin/routes'),
        api.get('/admin/buses'),
        api.get('/admin/drivers'),
        api.get('/admin/conductors')
      ]);
      setSchedules(sRes.data);
      setRoutes(rRes.data);
      setBuses(bRes.data);
      setDrivers(dRes.data);
      setConductor(cRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.routeId || !formData.busId || !formData.driverId || !formData.conductorId) {
      alert('Please select all required fields (Route, Bus, Driver, Conductor)');
      return;
    }

    try {
      await api.post('/admin/schedules', {
        route: { id: parseInt(formData.routeId) },
        bus: { id: parseInt(formData.busId) },
        driver: { id: parseInt(formData.driverId) },
        conductor: { id: parseInt(formData.conductorId) },
        departureDate: formData.departureDate,
        departureTime: formData.departureTime,
        estimatedArrivalTime: formData.estimatedArrivalTime,
        price: parseFloat(formData.price)
      });
      alert('Schedule created successfully!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating schedule. Check if bus/driver is already assigned at this time.');
    }
  };

  return (
    <div className="container animate-fade">
      <button
        className="btn"
        onClick={() => navigate('/admin')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', border: '1px solid var(--secondary)', color: 'var(--secondary)', cursor: 'pointer' }}
      >
        <ArrowLeft size={16} /> Back to Admin Panel
      </button>
      <h2 style={{ marginBottom: '30px' }}>Schedule Management</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        <div className="glass-morphism" style={{ padding: '25px' }}>
          <h3>Add New Schedule</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label>Select Route</label>
              <select 
                className="glass-morphism" style={{ padding: '10px', width: '100%' }}
                value={formData.routeId}
                onChange={(e) => setFormData({...formData, routeId: e.target.value})}
              >
                <option value="">Select Route</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.source} → {r.destination}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Assign Bus</label>
              <select 
                className="glass-morphism" style={{ padding: '10px', width: '100%' }}
                value={formData.busId}
                onChange={(e) => setFormData({...formData, busId: e.target.value})}
              >
                <option value="">Select Bus</option>
                {buses.map(b => <option key={b.id} value={b.id}>{b.busNumber} ({b.busType})</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Assign Driver</label>
              <select 
                className="glass-morphism" style={{ padding: '10px', width: '100%' }}
                value={formData.driverId}
                onChange={(e) => setFormData({...formData, driverId: e.target.value})}
              >
                <option value="">Select Driver</option>
                {drivers.map(d => (
                   <option key={d.id} value={d.id}>
                     {d.user?.fullName || `Driver #${d.id}`} ({d.licenseNumber})
                   </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Assign Conductor</label>
              <select 
                className="glass-morphism" style={{ padding: '10px', width: '100%' }}
                value={formData.conductorId}
                onChange={(e) => setFormData({...formData, conductorId: e.target.value})}
              >
                <option value="">Select Conductor</option>
                {conductors.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
               <label>Departure Date</label>
               <input type="date" className="glass-morphism" style={{ padding: '10px' }} onChange={(e) => setFormData({...formData, departureDate: e.target.value})} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>Dep. Time</label>
                <input type="time" className="glass-morphism" style={{ padding: '10px', width: '100%' }} onChange={(e) => setFormData({...formData, departureTime: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Arr. Time</label>
                <input type="time" className="glass-morphism" style={{ padding: '10px', width: '100%' }} onChange={(e) => setFormData({...formData, estimatedArrivalTime: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" placeholder="Price" className="glass-morphism" style={{ padding: '10px', width: '100%' }} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}><Plus size={18} /> Add Schedule</button>
          </form>
        </div>

        <div className="glass-morphism" style={{ padding: '25px' }}>
          <h3>Existing Schedules</h3>
          <div style={{ marginTop: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '10px' }}>Route</th>
                  <th>Bus</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(sch => (
                  <tr key={sch.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{sch.route.source} → {sch.route.destination}</td>
                    <td>{sch.bus.busNumber}</td>
                    <td>{sch.departureTime} - {sch.estimatedArrivalTime}</td>
                    <td>₹{sch.price}</td>
                    <td>
                      <button className="btn" style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => api.delete(`/admin/schedules/${sch.id}`).then(() => fetchData())}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
