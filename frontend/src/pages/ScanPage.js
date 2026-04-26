import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, 
    XCircle, 
    User, 
    MapPin, 
    AlertCircle, 
    Camera,
    RefreshCw,
    ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ScanPage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: { width: 250, height: 250 },
            fps: 10,
        });

        scanner.render(onScanSuccess, onScanError);

        function onScanSuccess(result) {
            scanner.clear();
            handleValidation(result);
            setIsScanning(false);
        }

        function onScanError(err) {
            // Silence common scanning errors
        }

        return () => scanner.clear();
    }, []);

    const handleValidation = async (qrData) => {
        setLoading(true);
        try {
            const res = await api.post('/conductor/validate-ticket', { qrCodeData: qrData });
            setScanResult(res.data);
            
            // Play success sound if valid
            if (res.data.status === 'VALID') {
                new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3').play().catch(() => {});
            }
        } catch (err) {
            setScanResult({ status: 'INVALID', error: 'Server connection failed' });
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setIsScanning(true);
        window.location.reload(); // Simplest way to re-init full scanner
    };

    return (
        <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white' }}>
            {/* COMPACT HEADER */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Link to="/admin" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                    <ChevronLeft size={18} /> PANEL
                </Link>
                <h2 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '1px' }}>CONDUCTOR SCANNER</h2>
                <div style={{ width: '40px' }}></div>
            </div>

            <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                <AnimatePresence mode="wait">
                    {isScanning ? (
                        <motion.div 
                            key="scanner"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '32px' }}>
                                <div id="reader" style={{ borderRadius: '24px', overflow: 'hidden', background: 'black' }}></div>
                                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'rgba(255,255,255,0.5)' }}>
                                    <Camera size={20} />
                                    <p style={{ fontSize: '13px', fontWeight: '600' }}>Position ticket QR within the frame</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="result"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ textAlign: 'center' }}
                        >
                            {loading ? (
                                <div style={{ padding: '100px' }}>
                                    <div className="animate-spin" style={{ width: '50px', height: '50px', border: '5px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
                                    <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>VALIDATING TOKEN...</p>
                                </div>
                            ) : (
                                <div className="glass-panel" style={{ 
                                    padding: '40px', 
                                    borderRadius: '32px', 
                                    background: scanResult?.status === 'VALID' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    border: `2px solid ${scanResult?.status === 'VALID' ? '#22c55e' : '#ef4444'}`
                                }}>
                                    
                                    <div style={{ marginBottom: '30px' }}>
                                        {scanResult?.status === 'VALID' ? (
                                            <CheckCircle2 size={80} color="#22c55e" style={{ margin: '0 auto' }} />
                                        ) : (
                                            <XCircle size={80} color="#ef4444" style={{ margin: '0 auto' }} />
                                        )}
                                        <h2 style={{ fontSize: '32px', fontWeight: '900', marginTop: '20px', color: scanResult?.status === 'VALID' ? '#22c55e' : '#ef4444' }}>
                                            {scanResult?.status}
                                        </h2>
                                    </div>

                                    {scanResult?.passengerInfo && (
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px', textAlign: 'left', marginBottom: '32px' }}>
                                            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <User size={20} color="var(--primary)" />
                                                <p style={{ fontWeight: '800', fontSize: '18px' }}>{scanResult.passengerInfo}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <MapPin size={20} color="var(--primary)" />
                                                <p style={{ fontWeight: '700', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{scanResult.routeInfo}</p>
                                            </div>
                                        </div>
                                    )}

                                    <button 
                                        onClick={resetScanner} 
                                        className="btn btn-primary" 
                                        style={{ width: '100%', height: '60px', fontSize: '16px' }}
                                    >
                                        <RefreshCw size={20} /> SCAN NEXT TICKET
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ScanPage;
