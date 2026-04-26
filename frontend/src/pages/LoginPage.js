import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, LogIn, ChevronRight } from 'lucide-react';
import JanSafarLogo from '../components/JanSafarLogo';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = await login(credentials.username, credentials.password);
            if (data && data.token) {
                if (data.role === 'ADMIN') {
                    navigate('/admin');
                } else if (data.role === 'DRIVER') {
                    navigate('/driver');
                } else {
                    // Redirect regular passengers to their personalized dashboard center
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            // Error handled in context
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* BACKGROUND DECOR */}
            <div style={styles.bgDecor}></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={styles.loginCard}
            >
                <div style={styles.brandHeader}>
                    <div style={styles.logoBox}>
                        <JanSafarLogo size={32} color="var(--primary)" />
                    </div>
                    <h1 style={styles.brandTitle}>Jan<span style={{ color: 'var(--primary)' }}>Safar</span></h1>
                </div>

                <div style={styles.welcomeText}>
                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Secure access to your transport ecosystem</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Identifier (Email or UID)</label>
                        <input 
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            placeholder="username..."
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={styles.label}>Access Key</label>
                            <Link to="/forgot-password" style={styles.forgotLink}>Reset Key?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                style={styles.input}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isSubmitting}
                        style={styles.submitBtn}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="animate-spin" size={18} /> Authenticating...</>
                        ) : (
                            <><LogIn size={18} /> Enter System <ChevronRight size={16} /></>
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        New to the ecosystem? 
                        <Link to="/register" style={styles.registerLink}> Register Account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--secondary)',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden'
    },
    bgDecor: {
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0
    },
    loginCard: {
        width: '100%',
        maxWidth: '440px',
        padding: '48px',
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    brandHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '32px'
    },
    logoBox: {
        background: '#f8fafc',
        padding: '8px',
        borderRadius: '12px',
        display: 'flex',
        border: '1px solid #e2e8f0'
    },
    brandTitle: {
        fontSize: '24px',
        fontWeight: '900',
        color: 'var(--secondary)',
        letterSpacing: '-0.5px'
    },
    welcomeText: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '900',
        color: 'var(--secondary)',
        marginBottom: '6px',
        letterSpacing: '-1px'
    },
    subtitle: {
        fontSize: '14px',
        color: 'var(--text-light)',
        fontWeight: '600'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        fontSize: '11px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#94a3b8',
        marginBottom: '8px'
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        background: '#f8fafc',
        fontSize: '14px',
        fontWeight: '600',
        outline: 'none',
        transition: 'all 0.2s',
        color: 'var(--secondary)'
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        display: 'flex'
    },
    forgotLink: {
        fontSize: '11px',
        fontWeight: '800',
        color: 'var(--primary)',
        textDecoration: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    submitBtn: {
        width: '100%',
        padding: '16px',
        fontSize: '15px',
        marginTop: '8px'
    },
    footer: {
        marginTop: '32px',
        textAlign: 'center',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '32px'
    },
    footerText: {
        fontSize: '14px',
        color: 'var(--text-light)',
        fontWeight: '600'
    },
    registerLink: {
        color: 'var(--primary)',
        textDecoration: 'none',
        fontWeight: '800',
        marginLeft: '4px'
    }
};

export default LoginPage;
