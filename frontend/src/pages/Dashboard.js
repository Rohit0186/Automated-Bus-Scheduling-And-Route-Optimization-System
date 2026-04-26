import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SidebarServices from '../components/dashboard/SidebarServices';
import ContentTabs from '../components/dashboard/ContentTabs';
import DataTable from '../components/dashboard/DataTable';
import WebsiteStrip from '../components/dashboard/WebsiteStrip';
import MainFooter from '../components/dashboard/MainFooter';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-root" style={{ paddingTop: '80px' }}>
      <main className="dashboard-main">
        {/* HERO SECTION - REBUILT FOR ADVANCED THEME */}
        <section className="hero-section" style={{ 
          minHeight: '600px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: '#0f172a'
        }}>
          {/* Background Bus Image with Gradient Overlay */}
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
            zIndex: 0
          }}></div>
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%)',
            zIndex: 1
          }}></div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container"
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div style={{ maxWidth: '700px' }}>
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)',
                padding: '6px 16px', borderRadius: '50px', marginBottom: '24px'
              }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>INDIA'S SMARTEST BUS NETWORK</span>
              </div>
              
              <h1 style={{ 
                fontSize: 'clamp(40px, 6vw, 72px)', 
                fontWeight: '900', 
                color: 'white', 
                lineHeight: '1.1',
                marginBottom: '24px',
                letterSpacing: '-2px'
              }}>
                Welcome to <span style={{ color: 'var(--primary)' }}>Smart Bus</span> Transport System
              </h1>
              
              <p style={{ 
                fontSize: '18px', 
                color: 'rgba(255,255,255,0.7)', 
                marginBottom: '40px',
                lineHeight: '1.8'
              }}>
                Real-time Tracking, Booking & Public Enquiry. Experience the future of travel across Uttar Pradesh with UPSRTC's modernized fleet.
              </p>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '16px 36px', fontSize: '16px' }}
                  onClick={() => navigate('/journey-planner')}
                >
                  Book My Trip
                </button>
                {localStorage.getItem('token') ? (
                  <button 
                    className="btn" 
                    style={{ 
                      padding: '16px 36px', 
                      fontSize: '16px', 
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      fontWeight: '800'
                    }}
                    onClick={() => {
                        const user = JSON.parse(localStorage.getItem('user'));
                        navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
                    }}
                  >
                    Go to My Dashboard
                  </button>
                ) : (
                  <button 
                    className="btn" 
                    style={{ 
                      padding: '16px 36px', 
                      fontSize: '16px', 
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Login to Dashboard
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* MAIN MODULES SECTION - ENHANCED GRID */}
        <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10, paddingBottom: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
            <aside>
              <SidebarServices />
            </aside>

            <section>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel" 
                style={{ padding: '0', overflow: 'hidden' }}
              >
                <ContentTabs />
                <div style={{ padding: '30px' }}>
                  <DataTable />
                </div>
              </motion.div>
            </section>
          </div>
        </div>

        <WebsiteStrip />
      </main>

      <MainFooter />
    </div>
  );
};

export default Dashboard;
