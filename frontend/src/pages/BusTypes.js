import React from 'react';
import MainFooter from '../components/dashboard/MainFooter';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart, Crown, ChevronRight } from 'lucide-react';

const BusTypes = () => {
  const busTypes = [
    {
      type: "Ordinary Non-AC (Roadways)",
      tag: "MOST POPULAR",
      fare: "Economical / KM based",
      features: "Reliable daily transit, 3x2 seating, strictly maintained safety standards.",
      coverage: "Connects all villages, towns and district headquarters across UP.",
      icon: <Zap size={24} />,
      color: "#64748b"
    },
    {
      type: "Janrath (Economical AC)",
      tag: "COMFORTABLE",
      fare: "Affordable AC travel",
      features: "Fully air-conditioned, 2+2 seating, reading lights, and mobile charging.",
      coverage: "Inter-city travel connecting major hubs like Lucknow, Kanpur, and Noida.",
      icon: <Heart size={24} />,
      color: "#0ea5e9"
    },
    {
      type: "Shatabdi (Semi-Deluxe AC)",
      tag: "PREMIUM RIDE",
      fare: "Intermediate premium rates",
      features: "Premium push-back seats with thigh support, air suspension for smooth travel.",
      coverage: "Fast inter-city connections between major tourist and industrial hubs.",
      icon: <StarSrip size={24} />,
      color: "#8b5cf6"
    },
    {
      type: "Pink Express (Ladies Special)",
      tag: "SAFE & SECURE",
      fare: "Dedicated safety corridors",
      features: "CCTV surveillance, Panic Buttons (112), Woman conductors, and monitoring.",
      coverage: "Main security corridors connecting safe zones across the state.",
      icon: <Shield size={24} />,
      color: "#ec4899"
    },
    {
      type: "Volvo / Scania Luxury",
      tag: "EXECUTIVE EXPERIENCE",
      fare: "Premium luxury rates",
      features: "Executive recliner seats, calf rests, non-stop services, and GPS tracking.",
      coverage: "Direct Expressways: Lucknow-Delhi, Agra-Varanasi, and Prayagraj routes.",
      icon: <Crown size={24} />,
      color: "#f97316"
    }
  ];

  return (
    <div className="bus-types-page">
      <main className="bus-main">
        {/* MODULE HERO */}
        <section className="module-hero">
          <div className="module-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069')" }}></div>
          <div className="module-hero-overlay"></div>
          <div className="container module-content">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="breadcrumb">Services &gt; Fleet</span>
              <h1 className="module-title">Types of Bus Services</h1>
              <p className="module-subtitle">Explore our diverse fleet designed for every journey, budget, and comfort level.</p>
            </motion.div>
          </div>
        </section>

        <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10, paddingBottom: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
            {busTypes.map((bus, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel"
                style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }}
              >
                {/* Header with accent color */}
                <div style={{ padding: '30px', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ 
                      width: '50px', height: '50px', borderRadius: '14px', 
                      background: `${bus.color}15`, color: bus.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {bus.icon}
                    </div>
                    <span style={{ 
                      fontSize: '10px', fontWeight: '900', letterSpacing: '1px',
                      background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '50px' 
                    }}>
                      {bus.tag}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                    {bus.type}
                  </h3>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', marginBottom: '20px' }}>
                    {bus.fare}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Key Features</h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.6' }}>{bus.features}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>Network Coverage</h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.6' }}>{bus.coverage}</p>
                    </div>
                  </div>
                </div>
                
                {/* Footer action */}
                <div style={{ padding: '16px 30px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                   <button style={{ 
                     background: 'none', border: 'none', color: 'var(--secondary)', 
                     fontSize: '13px', fontWeight: '800', cursor: 'pointer',
                     display: 'flex', alignItems: 'center', gap: '4px'
                   }}>
                     View Schedule <ChevronRight size={16} />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
};

// Mock for StarSrip as it might not be in lucide version or user preferred
const StarSrip = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default BusTypes;
