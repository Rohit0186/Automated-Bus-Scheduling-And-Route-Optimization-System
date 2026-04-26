import React, { useState, useEffect } from 'react';
import { 
  Bus, Plus, Settings, Trash2, LayoutGrid, 
  DollarSign, CheckCircle, AlertTriangle, X, 
  Save, RefreshCw, ChevronRight, Eye 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api';
import '../styles/BusManagement.css';

const BusManagement = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [seats, setSeats] = useState([]);
    const [activeDeck, setActiveDeck] = useState("LOWER");
    const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
    
    // Individual Seat Price Edit State
    const [editingSeat, setEditingSeat] = useState(null);
    const [editPrice, setEditPrice] = useState("");
    const [showIndividualPriceModal, setShowIndividualPriceModal] = useState(false);
    
    const [formData, setFormData] = useState({
        busNumber: '',
        busName: '',
        busType: 'AC',
        totalSeats: 40,
        status: 'ACTIVE',
        isMultiDeck: false
    });

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const res = await api.get('/bus');
            setBuses(res.data);
        } catch (err) {
            toast.error("Failed to fetch fleet inventory");
        } finally {
            setLoading(false);
        }
    };

    const handleAddBus = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading("Processing asset registration...");
        console.log("Submitting Asset Registration:", formData);
        
        try {
            // Ensure numeric data is sent as Integer
            const payload = {
                ...formData,
                totalSeats: parseInt(formData.totalSeats)
            };
            
            const res = await api.post('/bus', payload);
            console.log("Registration Success:", res.data);
            toast.success("Bus registered successfully", { id: loadToast });
            setShowAddModal(false);
            fetchBuses();
        } catch (err) {
            console.error("Registration Error Details:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Error registering bus. Check console for details.", { id: loadToast });
        }
    };

    const handleDeleteBus = async (id) => {
        if(window.confirm("Permanent Action: Delete this bus and all its data?")) {
            try {
                await api.delete(`/bus/${id}`);
                toast.success("Bus decommissioned");
                fetchBuses();
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

    const fetchSeats = async (busId) => {
        try {
            // Updated API path as per requirement
            const res = await api.get(`/public/seats/bus/${busId}`);
            setSeats(res.data);
            console.log("Seats Fetched:", res.data);
        } catch (err) {
            toast.error("Could not load seat map");
        }
    };

    const filteredSeats = seats.filter(seat => seat.deck === activeDeck);
    console.log(`Filtered Seats (${activeDeck}):`, filteredSeats);

    const handleGenerateSeats = async (busId) => {
        try {
            await api.post(`/public/seats/admin/generate/${busId}`);
            toast.success("Seating map auto-generated");
            fetchSeats(busId);
        } catch (err) {
            toast.error("Generation failed");
        }
    };

    const handleBulkPriceUpdate = async (type, price) => {
        try {
            await api.put(`/public/seats/admin/bulk-price/${selectedBus.id}`, null, {
                params: { type, price }
            });
            toast.success("Pricing updated across fleet subset");
            fetchSeats(selectedBus.id);
            setShowBulkPriceModal(false);
        } catch (err) {
            toast.error("Price update failed");
        }
    };

    const handleSeatClick = (seat) => {
        if (seat.isBooked) {
            toast.error("Cannot edit price of a booked seat");
            return;
        }
        setEditingSeat(seat);
        setEditPrice(seat.price);
        setShowIndividualPriceModal(true);
    };

    const handleIndividualPriceUpdate = async () => {
        if (!editPrice || editPrice < 0) {
            toast.error("Please enter a valid price");
            return;
        }

        const loadToast = toast.loading("Updating seat price...");
        try {
            await api.put(`/public/seats/admin/update/${editingSeat.id}`, {
                price: parseFloat(editPrice)
            });
            toast.success(`Seat ${editingSeat.seatNumber} price updated to ₹${editPrice}`, { id: loadToast });
            fetchSeats(selectedBus.id);
            setShowIndividualPriceModal(false);
        } catch (err) {
            toast.error("Failed to update seat price", { id: loadToast });
        }
    };

    if (loading) return <div className="bus-mgmt-page">Deploying Fleet Management Systems...</div>;

    return (
        <div className="bus-mgmt-page">
            <div className="bus-grid-header animate-fade-in">
                <div>
                    <h1 style={{ fontSize: '28px', color: '#0f2b5b', fontWeight: '800' }}>Fleet Inventory</h1>
                    <p style={{ color: '#64748b' }}>Technical oversight and seating configuration</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> Register New Asset
                </button>
            </div>

            <div className="bus-inventory">
                {buses.map(bus => (
                    <div key={bus.id} className="bus-card animate-slide-in">
                        <span className={`status-chip status-${bus.status.toLowerCase()}`}>
                            {bus.status}
                        </span>
                        <div className="bus-card-icon">
                            <Bus color="#0f2b5b" size={24} />
                        </div>
                        <h3>{bus.busName}</h3>
                        <span className="bus-type-label">{bus.busNumber} • {bus.busType}</span>
                        
                        <div className="bus-stats">
                            <div className="stat-group">
                                <span className="stat-label">CAPACITY</span>
                                <span className="stat-value">{bus.totalSeats} Seats</span>
                            </div>
                            <div className="stat-group">
                                <span className="stat-label">AVAILABLE</span>
                                <span className="stat-value">{bus.availableSeats || 0}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button 
                                className="btn" 
                                style={{ flex: 1, fontSize: '12px', background: '#0f2b5b10', color: '#0f2b5b' }}
                                onClick={() => { setSelectedBus(bus); fetchSeats(bus.id); }}
                            >
                                <LayoutGrid size={14} style={{ marginRight: '6px' }} /> Configure Seats
                            </button>
                            <button className="btn" style={{ background: '#fee2e2', color: '#ef4444' }} onClick={() => handleDeleteBus(bus.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* SEAT LAYOUT VIEW */}
            {selectedBus && (
                <div className="seat-layout-viewer animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f2b5b' }}>Seating Configuration: {selectedBus.busName}</h2>
                            <p style={{ color: '#64748b', fontSize: '13px' }}>Current Map: {seats.length} positions defined</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-primary" onClick={() => setShowBulkPriceModal(true)}>
                                <DollarSign size={16} /> Bulk Price
                            </button>
                            <button className="btn" style={{ borderColor: '#0f2b5b', color: '#0f2b5b' }} onClick={() => handleGenerateSeats(selectedBus.id)}>
                                <RefreshCw size={16} /> Auto-Generate Default
                            </button>
                        </div>
                    </div>

                    <div className="seat-grid">
                        {/* DECK SELECTOR TABS (Only if multi-deck) */}
                        {selectedBus.isMultiDeck && (
                            <div style={{ gridColumn: 'span 4', display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                <button 
                                    className="btn" 
                                    style={{ 
                                        flex: 1, 
                                        background: activeDeck === 'LOWER' ? '#f97316' : '#f1f5f9',
                                        color: activeDeck === 'LOWER' ? 'white' : '#64748b',
                                        fontWeight: '700',
                                        transition: 'all 0.3s'
                                    }}
                                    onClick={() => setActiveDeck('LOWER')}
                                >
                                    Lower Deck
                                </button>
                                <button 
                                    className="btn" 
                                    style={{ 
                                        flex: 1, 
                                        background: activeDeck === 'UPPER' ? '#f97316' : '#f1f5f9',
                                        color: activeDeck === 'UPPER' ? 'white' : '#64748b',
                                        fontWeight: '700',
                                        transition: 'all 0.3s'
                                    }}
                                    onClick={() => setActiveDeck('UPPER')}
                                >
                                    Upper Deck
                                </button>
                            </div>
                        )}

                        {filteredSeats.map(seat => (
                            <div 
                                key={seat.id} 
                                className={`seat-box ${seat.seatType.toLowerCase()} ${seat.isBooked ? 'booked' : 'available'}`}
                                onClick={() => handleSeatClick(seat)}
                                title={`Click to edit price for Seat ${seat.seatNumber}`}
                            >
                                <span>{seat.seatNumber}</span>
                                <span style={{ fontSize: '9px', marginTop: '4px' }}>₹{seat.price}</span>
                            </div>
                        ))}
                        {filteredSeats.length === 0 && (
                            <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                <AlertTriangle size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                <p>No seats mapped for {activeDeck} deck.</p>
                                <button className="btn btn-primary" style={{ marginTop: '15px' }} onClick={() => handleGenerateSeats(selectedBus.id)}>Initialize Default Grid</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ADD MODAL */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Asset Registration</h2>
                            <X style={{ cursor: 'pointer' }} onClick={() => setShowAddModal(false)} />
                        </div>
                        <form onSubmit={handleAddBus}>
                            <div className="form-group">
                                <label>Asset Name (Friendly Name)</label>
                                <input type="text" className="form-control" required placeholder="e.g. Scania Gold Class" onChange={e => setFormData({...formData, busName: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Asset Number (Plate)</label>
                                <input type="text" className="form-control" required placeholder="UP32-AT-XXXX" onChange={e => setFormData({...formData, busNumber: e.target.value.toUpperCase()})} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Asset Type</label>
                                    <select className="form-control" onChange={e => setFormData({...formData, busType: e.target.value})}>
                                        <option value="AC">AC Seater</option>
                                        <option value="NON_AC">Non-AC Seater</option>
                                        <option value="SLEEPER">Full Sleeper</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Total Capacity</label>
                                    <input type="number" className="form-control" defaultValue="40" onChange={e => setFormData({...formData, totalSeats: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input 
                                    type="checkbox" 
                                    id="multiDeckToggle"
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    onChange={e => setFormData({...formData, isMultiDeck: e.target.checked})}
                                />
                                <label htmlFor="multiDeckToggle" style={{ margin: 0, cursor: 'pointer' }}>Enable Multi-Deck Configuration (Upper/Lower)</label>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                                <Save size={18} style={{ marginRight: '8px' }} /> Confirm Asset Insertion
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* BULK PRICE MODAL */}
            {showBulkPriceModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Bulk Price Adjustment</h2>
                            <X style={{ cursor: 'pointer' }} onClick={() => setShowBulkPriceModal(false)} />
                        </div>
                        <div className="alert-item" style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                            <p style={{ fontSize: '12px', color: '#1d4ed8' }}>This will overwrite the base price for all seats matched by your filter in this bus.</p>
                        </div>
                        <div className="form-group">
                            <label>Seat Class Filter</label>
                            <select id="bulkType" className="form-control">
                                <option value="">All Seat Classes</option>
                                <option value="SEATER">Seater Only</option>
                                <option value="SLEEPER">Sleeper Only</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>New Price (₹)</label>
                            <input type="number" id="bulkPrice" className="form-control" placeholder="0.00" />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn" style={{ flex: 1 }} onClick={() => setShowBulkPriceModal(false)}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                                const type = document.getElementById('bulkType').value;
                                const price = document.getElementById('bulkPrice').value;
                                if(price) handleBulkPriceUpdate(type || null, price);
                            }}>Apply Bulk Change</button>
                        </div>
                    </div>
                </div>
            )}

            {/* INDIVIDUAL PRICE MODAL */}
            {showIndividualPriceModal && editingSeat && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Edit Seat Price: {editingSeat.seatNumber}</h2>
                            <X style={{ cursor: 'pointer' }} onClick={() => setShowIndividualPriceModal(false)} />
                        </div>
                        <div className="form-group">
                            <label>Seat Type</label>
                            <input type="text" className="form-control" value={editingSeat.seatType} disabled style={{ background: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label>New Price (₹)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={editPrice} 
                                onChange={(e) => setEditPrice(e.target.value)}
                                placeholder="Enter amount"
                                autoFocus
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button className="btn" style={{ flex: 1 }} onClick={() => setShowIndividualPriceModal(false)}>Cancel</button>
                            <button 
                                className="btn btn-primary" 
                                style={{ flex: 1 }} 
                                onClick={handleIndividualPriceUpdate}
                            >
                                <Save size={18} style={{ marginRight: '8px' }} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusManagement;
