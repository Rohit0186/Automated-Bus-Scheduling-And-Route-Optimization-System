import React from 'react';
import { motion } from 'framer-motion';
import JourneyPlanner from '../components/planner/JourneyPlanner';
import MainFooter from '../components/dashboard/MainFooter';
import PlannerInfoSection from '../components/planner/PlannerInfoSection';

const BookingPage = () => {
  return (
    <div className="booking-page-root">
      <main className="booking-main">
        {/* MODULE HERO */}
        <section className="module-hero">
          <div className="module-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069')" }}></div>
          <div className="module-hero-overlay"></div>
          
          <div className="container module-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="breadcrumb">Services &gt; Booking</span>
              <h1 className="module-title">Plan Your Journey</h1>
              <p className="module-subtitle">Book your bus tickets and travel with confidence across our extensive network.</p>
            </motion.div>
          </div>
        </section>
        
        {/* CONTENT AREA */}
        <div className="container content-wrapper">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{ width: '100%', maxWidth: '700px' }}
            >
              <div className="glass-panel" style={{ padding: '40px' }}>
                <JourneyPlanner />
              </div>
            </motion.div>
          </div>

          <div style={{ marginTop: '60px' }}>
            <PlannerInfoSection />
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
};

export default BookingPage;
