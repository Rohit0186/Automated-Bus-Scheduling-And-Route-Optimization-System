import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { CreditCard, Smartphone, ShieldCheck, Loader2, IndianRupee, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSimulator = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingData } = location.state || {};
    const [processing, setProcessing] = useState(false);
    const [method, setMethod] = useState('CARD');
    const [success, setSuccess] = useState(false);

    if (!bookingData) {
        return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>No booking data found. Redirecting...</div>;
    }

    const handlePayment = async () => {
        setProcessing(true);
        setTimeout(async () => {
            try {
                const bookingPayload = {
                    busId: bookingData.busId,
                    scheduleId: bookingData.scheduleId,
                    totalAmount: bookingData.totalAmount,
                    seatNumbers: bookingData.seatNumbers,
                    sourceStop: bookingData.sourceStop,
                    destinationStop: bookingData.destinationStop,
                    travelDate: bookingData.travelDate
                };

                const res = await api.post('/bookings/create', bookingPayload);
                setSuccess(true);
                toast.success("Payment Successful! Ticket Generated.");
                
                setTimeout(() => {
                    navigate(`/ticket/${res.data.id}`);
                }, 1500);
            } catch (err) {
                console.error(err);
                const resp = err.response;
                if (resp) {
                    if (resp.status === 409) {
                        const msg = resp.headers['x-error'] || resp.data?.message || 'Seat already booked';
                        toast.error(msg);
                    } else if (resp.status === 400) {
                        const msg = resp.headers['x-error'] || resp.data?.message || 'Invalid booking request';
                        toast.error(msg);
                    } else {
                        toast.error('Booking Failed. Please try again.');
                    }
                } else {
                    toast.error('Network error. Check connectivity.');
                }
                setProcessing(false);
            }
        }, 2000);
    };

    return (
        <div className="container animate-fade" style={{ maxWidth: '900px', paddingTop: '40px', paddingBottom: '60px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                
                {/* LEFT: PAYMENT METHODS */}
                <div className="glass-morphism" style={{ padding: '40px' }}>
                    <h2 style={{ marginBottom: '32px', color: '#1a2a4b', fontWeight: '800' }}>Secure Checkout</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div 
                            onClick={() => setMethod('CARD')}
                            style={{ ...styles.methodCard, border: method === 'CARD' ? '2px solid var(--primary)' : '1px solid #e2e8f0', background: method === 'CARD' ? '#f0f9ff' : 'white' }}
                        >
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={styles.iconBox}><CreditCard /></div>
                                <div>
                                    <div style={{ fontWeight: '700' }}>Credit / Debit Card</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Visa, Mastercard, RuPay</div>
                                </div>
                            </div>
                            <input type="radio" checked={method === 'CARD'} readOnly />
                        </div>

                        <div 
                            onClick={() => setMethod('UPI')}
                            style={{ ...styles.methodCard, border: method === 'UPI' ? '2px solid var(--primary)' : '1px solid #e2e8f0', background: method === 'UPI' ? '#f0f9ff' : 'white' }}
                        >
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={styles.iconBox}><Smartphone /></div>
                                <div>
                                    <div style={{ fontWeight: '700' }}>UPI Payment</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>GPay, PhonePe, Paytm</div>
                                </div>
                            </div>
                            <input type="radio" checked={method === 'UPI'} readOnly />
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', background: '#f8fafc', padding: '24px', borderRadius: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#16a34a', fontWeight: '600', marginBottom: '10px' }}>
                            <ShieldCheck size={20} /> 100% Secure Payment
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Your transaction is encrypted with 256-bit SSL security. UPSRTC does not store your card details.</p>
                    </div>
                </div>

                {/* RIGHT: ORDER SUMMARY */}
                <div>
                    <div className="glass-morphism" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Order Summary</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '20px' }}>
                            <div style={styles.summaryRow}>
                                <span>Base Fare</span>
                                <span>₹{bookingData.totalAmount - 45}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Service Fee</span>
                                <span>₹25</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>GST (5%)</span>
                                <span>₹20</span>
                            </div>
                        </div>

                        <div style={{ ...styles.summaryRow, fontWeight: '800', fontSize: '20px', marginBottom: '32px' }}>
                            <span>Total Amount</span>
                            <span style={{ color: 'var(--primary)' }}>₹{bookingData.totalAmount}</span>
                        </div>

                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '16px', fontSize: '16px', position: 'relative', overflow: 'hidden' }}
                            onClick={handlePayment}
                            disabled={processing || success}
                        >
                            {processing ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <Loader2 className="animate-spin" size={20} /> Processing...
                                </div>
                            ) : success ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <CheckCircle2 size={20} /> Paid Successfully
                                </div>
                            ) : (
                                <>Pay ₹{bookingData.totalAmount} <ArrowRight size={18} style={{ marginLeft: '10px' }} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* FULLSCREEN PROCESSING OVERLAY */}
            {processing && !success && (
                <div style={styles.overlay}>
                    <div className="glass-morphism animate-fade" style={{ background: 'white', padding: '50px', textAlign: 'center', width: '400px' }}>
                        <Loader2 className="animate-spin" size={60} color="var(--primary)" style={{ margin: '0 auto 30px' }} />
                        <h2 style={{ color: '#1a2a4b' }}>Verifying Transaction</h2>
                        <p style={{ color: '#64748b', marginTop: '10px' }}>Please do not refresh or close the window.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    methodCard: {
        padding: '20px',
        borderRadius: '15px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.2s'
    },
    iconBox: {
        width: '45px',
        height: '45px',
        borderRadius: '12px',
        background: 'var(--primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)'
    }
};

export default PaymentSimulator;
