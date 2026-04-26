import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, UserPlus, ChevronRight } from 'lucide-react';
import JanSafarLogo from '../components/JanSafarLogo';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        inviteCode: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!userData.fullName.trim()) newErrors.fullName = 'Required';
        if (!userData.username.trim()) newErrors.username = 'Required';
        if (!userData.email.trim()) newErrors.email = 'Required';
        if (!userData.password) newErrors.password = 'Required';
        else if (userData.password.length < 6) newErrors.password = 'Min 6 chars';
        if (userData.password !== userData.confirmPassword) newErrors.confirmPassword = 'Mismatch';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const success = await register(userData, userData.inviteCode);
            if (success) navigate('/login');
        } catch (error) {
            // Error toast handled in context
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.bgDecor}></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={styles.regCard}
            >
                <div style={styles.brandHeader}>
                    <JanSafarLogo size={28} color="var(--primary)" />
                    <h1 style={styles.brandTitle}>Jan<span style={{ color: 'var(--primary)' }}>Safar</span></h1>
                </div>

                <div style={styles.headerText}>
                    <h2 style={styles.title}>Join JanSafar</h2>
                    <p style={styles.subtitle}>Create your credentials to access the fleet</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input 
                                name="fullName"
                                value={userData.fullName}
                                onChange={handleChange}
                                placeholder="E.g. Rahul Singh"
                                style={{...styles.input, borderColor: errors.fullName ? 'var(--accent)' : '#e2e8f0'}}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input 
                                name="username"
                                value={userData.username}
                                onChange={handleChange}
                                placeholder="rahul_01"
                                style={{...styles.input, borderColor: errors.username ? 'var(--accent)' : '#e2e8f0'}}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="rahul@example.com"
                            style={{...styles.input, borderColor: errors.email ? 'var(--accent)' : '#e2e8f0'}}
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Create Password</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={userData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={{...styles.input, paddingRight: '40px', borderColor: errors.password ? 'var(--accent)' : '#e2e8f0'}}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Key</label>
                            <input 
                                type="password"
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{...styles.input, borderColor: errors.confirmPassword ? 'var(--accent)' : '#e2e8f0'}}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Invite Code <span style={{ color: '#94a3b8', fontSize: '9px' }}>(Optional)</span></label>
                        <input 
                            name="inviteCode"
                            value={userData.inviteCode}
                            onChange={handleChange}
                            placeholder="Enter code for Admin/Driver roles"
                            style={styles.input}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isSubmitting}
                        style={styles.submitBtn}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="animate-spin" size={18} /> Creating Account...</>
                        ) : (
                            <><UserPlus size={18} /> Join Ecosystem <ChevronRight size={16} /></>
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already a member? 
                        <Link to="/login" style={styles.link}> Sign In Instead</Link>
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
        bottom: '-10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0
    },
    regCard: {
        width: '100%',
        maxWidth: '560px',
        padding: '40px',
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    brandHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '24px'
    },
    brandTitle: {
        fontSize: '20px',
        fontWeight: '900',
        color: 'var(--secondary)'
    },
    headerText: {
        marginBottom: '32px'
    },
    title: {
        fontSize: '26px',
        fontWeight: '900',
        color: 'var(--secondary)',
        marginBottom: '4px'
    },
    subtitle: {
        fontSize: '14px',
        color: 'var(--text-light)',
        fontWeight: '600'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        fontSize: '10px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#94a3b8',
        marginBottom: '6px'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1.5px solid #e2e8f0',
        background: '#f8fafc',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--secondary)',
        outline: 'none',
        transition: 'all 0.2s'
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer'
    },
    submitBtn: {
        width: '100%',
        padding: '16px',
        marginTop: '10px'
    },
    footer: {
        marginTop: '32px',
        textAlign: 'center',
        paddingTop: '24px',
        borderTop: '1px solid #f1f5f9'
    },
    footerText: {
        fontSize: '14px',
        color: 'var(--text-light)',
        fontWeight: '600'
    },
    link: {
        color: 'var(--primary)',
        textDecoration: 'none',
        fontWeight: '800',
        marginLeft: '4px'
    }
};

export default RegisterPage;
