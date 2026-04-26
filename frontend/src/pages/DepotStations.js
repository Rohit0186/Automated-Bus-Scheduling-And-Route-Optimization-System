import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, MapPin, Building2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import MainFooter from '../components/dashboard/MainFooter';
import { motion } from 'framer-motion';

const DepotStations = () => {
    const [stations, setStations] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [stationsRes, regionsRes] = await Promise.all([
                api.get('/stations'),
                api.get('/regions')
            ]);
            setStations(stationsRes.data);
            setRegions(regionsRes.data);
        } catch (err) {
            console.error("Error fetching station data:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStations = stations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             station.region?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = selectedRegion === "all" || station.region?.id === parseInt(selectedRegion);
        const matchesType = selectedType === "all" || station.type === selectedType;
        return matchesSearch && matchesRegion && matchesType;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStations.length / itemsPerPage);

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="depots-page-root">
            <main className="depots-main">
                {/* MODULE HERO */}
                <section className="module-hero">
                    <div className="module-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069')" }}></div>
                    <div className="module-hero-overlay"></div>
                    <div className="container module-content">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="breadcrumb">Services &gt; Infrastructure</span>
                            <h1 className="module-title">Depots & Stations</h1>
                            <p className="module-subtitle">Unified directory of all transport infrastructure and points of interest across Uttar Pradesh.</p>
                        </motion.div>
                    </div>
                </section>

                <div className="container content-wrapper">
                    {/* FILTER BAR */}
                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                        <div style={{ flex: 2, position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by station name..." 
                                style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', outline: 'none' }}
                                value={searchTerm}
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
                        </div>

                        <select 
                            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '800', outline: 'none', cursor: 'pointer', fontSize: '13px' }}
                            value={selectedRegion}
                            onChange={(e) => {setSelectedRegion(e.target.value); setCurrentPage(1);}}
                        >
                            <option value="all">All Regions</option>
                            {regions.map(r => <option key={r.id} value={r.id}>{r.name || `Region #${r.id}`}</option>)}
                        </select>

                        <select 
                            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '800', outline: 'none', cursor: 'pointer', fontSize: '13px' }}
                            value={selectedType}
                            onChange={(e) => {setSelectedType(e.target.value); setCurrentPage(1);}}
                        >
                            <option value="all">All Categories</option>
                            <option value="BUS_STATION">Owned Station</option>
                            <option value="BUS_STOP">Rented / Stop</option>
                        </select>

                        <button className="btn btn-primary" onClick={handleDownload} style={{ padding: '14px 24px' }}>
                            <Download size={18} /> Download Info
                        </button>
                    </div>

                    {/* DATA TABLE */}
                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '24px 30px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--secondary)', letterSpacing: '0.5px' }}>STATION DIRECTORY</h3>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-light)' }}>{filteredStations.length} Total Records</span>
                        </div>
                        
                        <div style={{ padding: '20px 30px' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left' }}>
                                        <th style={{ padding: '12px 10px', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Region</th>
                                        <th style={{ padding: '12px 10px', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Station Name</th>
                                        <th style={{ padding: '12px 10px', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Reporting Depot</th>
                                        <th style={{ padding: '12px 10px', color: 'var(--text-light)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Synchronizing station data...</td></tr>
                                    ) : currentItems.map((station) => (
                                        <tr key={station.id} style={{ background: '#f8fafc', transition: 'all 0.2s ease' }}>
                                            <td style={{ padding: '16px 16px', borderRadius: '12px 0 0 12px', fontWeight: '800', color: 'var(--text-light)', fontSize: '13px' }}>
                                                {station.region?.name || "Unassigned"}
                                            </td>
                                            <td style={{ padding: '16px 10px', fontWeight: '800', color: 'var(--secondary)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <MapPin size={16} color="var(--primary)" />
                                                    {station.name}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 10px', fontWeight: '700', color: 'var(--text-light)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Building2 size={16} color="#cbd5e1" />
                                                    {station.depot?.name}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 10px', borderRadius: '0 12px 12px 0' }}>
                                                <span style={{ 
                                                    fontSize: '9px', fontWeight: '900', 
                                                    background: station.type === 'BUS_STATION' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(15, 23, 42, 0.05)',
                                                    color: station.type === 'BUS_STATION' ? 'var(--primary)' : 'var(--secondary)',
                                                    padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase'
                                                }}>
                                                    {station.type === 'BUS_STATION' ? 'OWNED' : 'RENTED'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div style={{ padding: '20px 30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>
                                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStations.length)} of {filteredStations.length}
                            </span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', margin: '0 12px', fontSize: '13px', fontWeight: '800' }}>
                                    Page <span style={{ color: 'var(--primary)' }}>{currentPage}</span> of {totalPages}
                                </div>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <MainFooter />
        </div>
    );
};

export default DepotStations;
