import React, { useState } from 'react';
import { 
    Phone, 
    Mail, 
    MessageSquare, 
    MapPin, 
    Clock, 
    ShieldAlert, 
    Send, 
    Headphones,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Thank you for reaching out! Our team will contact you soon.");
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    };

    const contactMethods = [
        { 
            icon: <Phone size={24} />, 
            title: "24/7 Helpline", 
            value: "1800-180-2877", 
            desc: "Toll-free national enquiry number",
            color: "#3b82f6" 
        },
        { 
            icon: <Mail size={24} />, 
            title: "Email Support", 
            value: "support@jansafar.gov.in", 
            desc: "Response within 24 business hours",
            color: "#10b981" 
        },
        { 
            icon: <MessageSquare size={24} />, 
            title: "WhatsApp Bot", 
            value: "+91 94150 49606", 
            desc: "Instant automated assistance",
            color: "#25d366" 
        }
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* HERO SECTION */}
            <div className="module-hero" style={{ height: '350px', background: 'var(--secondary)', position: 'relative', overflow: 'hidden' }}>
                <div className="module-hero-overlay"></div>
                <div className="container module-content" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="breadcrumb"
                    >
                        REACHABLE 24/7
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="module-title"
                    >
                        Connect With JanSafar
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="module-subtitle"
                    >
                        Experience seamless communication with UPSRTC's advanced support ecosystem.
                    </motion.p>
                </div>
                
                {/* DECORATIVE ELEMENTS */}
                <div style={{ position: 'absolute', right: '-50px', top: '20%', opacity: 0.1 }}>
                    <Headphones size={300} color="white" />
                </div>
            </div>

            <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                {/* QUICK REACH CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '50px' }}>
                    {contactMethods.map((method, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="glass-panel"
                            style={{ 
                                padding: '30px', 
                                background: 'white', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                textAlign: 'center' 
                            }}
                        >
                            <div style={{ 
                                background: `${method.color}15`, 
                                color: method.color, 
                                padding: '16px', 
                                borderRadius: '16px', 
                                marginBottom: '20px' 
                            }}>
                                {method.icon}
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '8px' }}>{method.title}</h3>
                            <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>{method.value}</p>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{method.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
                    {/* GRIEVANCE FORM */}
                    <div className="glass-panel" style={{ padding: '40px', background: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                            <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                                <ShieldAlert size={20} color="white" />
                            </div>
                            <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--secondary)' }}>Grievance Redressal</h2>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>FULL NAME</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your name"
                                        style={styles.input}
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>EMAIL ADDRESS</label>
                                    <input 
                                        type="email" 
                                        placeholder="your@email.com"
                                        style={styles.input}
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>SUBJECT / CATEGORY</label>
                                <select 
                                    style={styles.input}
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                >
                                    <option>General Inquiry</option>
                                    <option>Ticket Cancellation/Refund</option>
                                    <option>Bus Delay/Schedule Issue</option>
                                    <option>Staff Behavior</option>
                                    <option>Lost & Found</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>DETAILED MESSAGE</label>
                                <textarea 
                                    placeholder="Describe your concern in detail..."
                                    style={{ ...styles.input, height: '150px', resize: 'none' }}
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ height: '56px' }}>
                                SUBMIT GRIEVANCE <Send size={18} style={{ marginLeft: '10px' }} />
                            </button>
                        </form>
                    </div>

                    {/* CORPORATE INFO & SOCIAL */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="glass-panel" style={{ padding: '30px', background: 'white' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin size={18} color="var(--primary)" /> Registered Office
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', height: 'fit-content' }}>
                                        <Clock size={16} color="#64748b" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--secondary)' }}>Operational Hours</p>
                                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Mon - Sat: 10:00 AM - 06:00 PM</p>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', lineHeight: '1.6' }}>
                                        UPSRTC Headquarters,<br />
                                        Tehri Kothi, MG Marg,<br />
                                        Lucknow, Uttar Pradesh - 226001
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '30px', background: 'white' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '24px' }}>Social Connect</h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <SocialBtn icon={<Facebook size={18} />} color="#1877f2" />
                                <SocialBtn icon={<Twitter size={18} />} color="#1da1f2" />
                                <SocialBtn icon={<Instagram size={18} />} color="#e4405f" />
                                <SocialBtn icon={<Youtube size={18} />} color="#ff0000" />
                            </div>
                        </div>

                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            style={{ 
                                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', 
                                padding: '24px', 
                                borderRadius: '20px', 
                                color: 'white',
                                boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <ShieldAlert size={24} />
                                <h4 style={{ fontSize: '18px', fontWeight: '900' }}>Emergency SOS</h4>
                            </div>
                            <p style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9, marginBottom: '20px' }}>
                                Immediate medical or security assistance during journey.
                            </p>
                            <a href="tel:112" style={{ 
                                background: 'white', color: '#b91c1c', 
                                padding: '12px 24px', borderRadius: '12px', 
                                textDecoration: 'none', fontWeight: '900', 
                                display: 'inline-block', fontSize: '14px' 
                            }}>
                                CALL 112 NOW
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* FAQ LINK SECTION */}
                <div className="glass-panel" style={{ 
                    marginTop: '50px', 
                    padding: '30px 40px', 
                    background: 'white', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '50%' }}>
                            <HelpCircle size={24} color="#d97706" />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--secondary)' }}>Looking for instant answers?</h4>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Check our frequently asked questions for quick resolutions.</p>
                        </div>
                    </div>
                    <button style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        BROWSE FAQS <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const SocialBtn = ({ icon, color }) => (
    <motion.button 
        whileHover={{ scale: 1.1, backgroundColor: color, color: 'white' }}
        style={{ 
            width: '44px', height: '44px', borderRadius: '12px', 
            border: '1.5px solid #f1f5f9', background: 'white', 
            color: '#64748b', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' 
        }}
    >
        {icon}
    </motion.button>
);

const styles = {
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '10px', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' },
    input: { 
        width: '100%', 
        padding: '14px 16px', 
        borderRadius: '12px', 
        border: '1.5px solid #f1f5f9', 
        background: '#f8fafc', 
        fontWeight: '700', 
        fontSize: '14px', 
        outline: 'none',
        transition: 'border-color 0.2s',
        '&:focus': { borderColor: 'var(--primary)' }
    }
};

export default ContactPage;
