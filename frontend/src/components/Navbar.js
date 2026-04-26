import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, LogOut, LayoutDashboard, Database, 
  Map as MapIcon, Truck, Phone, ChevronDown, Globe, Menu, X, CreditCard
} from 'lucide-react';
import JanSafarLogo from './JanSafarLogo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeout = useRef(null);

  const handleMouseEnter = (menu) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250); // 250ms delay for smoothness
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'SEARCH', path: '/' },
    { name: 'FARE ENQUIRY', path: '/fare-enquiry' },
    { name: 'LIVE STATUS', path: '/track-bus' },
    { name: 'STATIONS', path: '/depots-stations' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={14} /> },
    { name: 'Fleet', path: '/admin/buses', icon: <Truck size={14} /> },
    { name: 'Routes', path: '/admin/routes', icon: <MapIcon size={14} /> },
    { name: 'Passes', path: '/admin/passes', icon: <CreditCard size={14} /> },
    { name: 'ERP', path: '/admin/erp', icon: <Database size={14} /> },
  ];

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000, 
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
    }}>
      {/* TOP UTILITY BAR */}
      {!isScrolled && (
        <div style={{ 
          background: '#0b1e42', 
          color: 'rgba(255,255,255,0.7)', 
          padding: '8px 0', 
          fontSize: '11px', 
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} /> 1800-180-2877 (24x7)</span>
              <span className="hidden md:inline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={12} /> ENQUIRY_NUMBER</span>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>YATRA DARPAN</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>GRIEVANCES</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>HINDI VERSION</a>
            </div>
          </div>
        </div>
      )}

      {/* MAIN NAVIGATION */}
      <nav className="glass-panel" style={{ 
        margin: isScrolled ? '12px 24px' : '0',
        borderRadius: isScrolled ? '16px' : '0',
        padding: isScrolled ? '10px 0' : '15px 0',
        transition: 'all 0.4s ease'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* LOGO */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ 
              background: 'rgba(249, 115, 22, 0.1)', 
              padding: '8px', 
              borderRadius: '12px' 
            }}>
              <JanSafarLogo size={28} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ 
                color: '#1a2a4b', 
                fontSize: '20px', 
                fontWeight: '900', 
                letterSpacing: '-1px',
                lineHeight: 1
              }}>
                Jan<span style={{ color: 'var(--primary)' }}>Safar</span>
              </span>
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent)', marginTop: '2px' }}>UPSRTC SMART HUB</span>
            </div>
          </Link>

          {/* NAV LINKS - FIXED SPACING */}
          <div className="nav-menu" style={{ 
            display: 'flex', 
            gap: '32px', 
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {/* PUBLIC LINKS: ONLY FOR NON-ADMINS OR VISITORS */}
            {user?.role !== 'ADMIN' && navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.8px' }}
              >
                {link.name}
              </Link>
            ))}

            {user?.role !== 'ADMIN' && (
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter('serv')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="nav-btn" onClick={() => setActiveDropdown(activeDropdown === 'serv' ? null : 'serv')}>
                  SERVICES <ChevronDown size={14} style={{ transform: activeDropdown === 'serv' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                </button>
                {activeDropdown === 'serv' && (
                  <div 
                    className="glass-panel" 
                    onMouseEnter={() => handleMouseEnter('serv')}
                    onMouseLeave={handleMouseLeave}
                    style={{ 
                      position: 'absolute', top: '100%', left: 0, width: '220px',
                      padding: '12px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px',
                      border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                      zIndex: 1000
                    }}
                  >
                    {/* PUBLIC SERVICES */}
                    <Link to="/journey-planner" className="nav-link" style={{ fontSize: '12px', padding: '10px' }} onClick={() => setActiveDropdown(null)}>e-Ticketing (QR)</Link>
                    <Link to="/track-bus" className="nav-link" style={{ fontSize: '12px', padding: '10px' }} onClick={() => setActiveDropdown(null)}>Track My Bus</Link>
                    <Link to="/conductor/scan" className="nav-link" style={{ fontSize: '12px', padding: '10px', color: 'var(--primary)' }} onClick={() => setActiveDropdown(null)}>Boarding Scan</Link>
                    
                    {/* PASSENGER SERVICES (Conditional) */}
                    {user && user.role === 'USER' && (
                      <>
                        <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }}></div>
                        <Link to="/passes/apply" className="nav-link" style={{ fontSize: '12px', padding: '10px', fontWeight: '800' }} onClick={() => setActiveDropdown(null)}>Apply for Pass</Link>
                        <Link to="/passes/status" className="nav-link" style={{ fontSize: '12px', padding: '10px' }} onClick={() => setActiveDropdown(null)}>My Pass Status</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {user && user.role === 'USER' && (
                <Link to="/dashboard" className="nav-link" style={{ fontWeight: '800', color: 'var(--primary)' }}>MY DASHBOARD</Link>
            )}

            {/* ADMIN FAST ACCESS: SHOW FULL MODULE LIST WHEN LOGGED IN AS ADMIN */}
            {user?.role === 'ADMIN' && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/admin" className="nav-link" style={{ fontWeight: '900', color: 'var(--primary)', whiteSpace: 'nowrap' }}>CONTROL CENTER</Link>
                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' }}></div>
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.05)', padding: '4px', borderRadius: '12px' }}>
                  {adminLinks.map(link => (
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                        padding: '8px 12px', borderRadius: '10px', fontSize: '10.5px', fontWeight: '800',
                        color: location.pathname === link.path ? 'white' : '#64748b',
                        background: location.pathname === link.path ? 'var(--secondary)' : 'transparent',
                        transition: 'all 0.2s',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        boxShadow: location.pathname === link.path ? '0 4px 10px rgba(15, 23, 42, 0.15)' : 'none'
                      }}
                    >
                      {link.icon} <span className="hidden lg:inline">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* USER ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '20px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 4px 4px 14px', borderRadius: '50px', background: 'white', border: '1px solid #e2e8f0' }}>
                <div className="hidden sm:flex flex-col text-right">
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-dark)' }}>{user.username}</span>
                  <span style={{ fontSize: '9px', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase' }}>{user.role}</span>
                </div>
                <button 
                  onClick={() => navigate('/dashboard')}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--secondary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <UserIcon size={16} />
                </button>
                <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }}></div>
                <button 
                  onClick={handleLogout}
                  style={{ padding: '8px', color: '#94a3b8', border: 'none', background: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Link to="/register" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-light)', textDecoration: 'none' }}>Join</Link>
                <Link to="/login" className="btn btn-primary" style={{ padding: '12px 30px', borderRadius: '12px', fontSize: '13px' }}>Login</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
