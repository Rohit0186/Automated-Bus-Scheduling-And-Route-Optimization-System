import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Bus, Menu, X, ChevronDown } from 'lucide-react';

const MainNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`main-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        <div className="logo">
          <Bus size={32} className="bus-icon" />
          <div className="logo-text">
            <span className="brand-name">UPSRTC</span>
            <span className="brand-sub">SmartBus</span>
          </div>
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" className="nav-item">ABOUT US</NavLink>
          <div className="nav-item dropdown">
            SERVICES <ChevronDown size={14} />
            <div className="dropdown-content">
              <a href="#">e-Ticketing</a>
              <a href="#">Monthly Pass</a>
              <a href="#">Smart Cards</a>
            </div>
          </div>
          <NavLink to="/fare-enquiry" className="nav-item">FARE ENQUIRY</NavLink>
          <NavLink to="/tracking/live" className="nav-item">LIVE STATUS</NavLink>
          <NavLink to="/schedules" className="nav-item">SCHEDULES</NavLink>
          <NavLink to="/contact" className="nav-item">CONTACT US</NavLink>
        </div>

        <button 
          className="mobile-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

export default MainNavbar;
