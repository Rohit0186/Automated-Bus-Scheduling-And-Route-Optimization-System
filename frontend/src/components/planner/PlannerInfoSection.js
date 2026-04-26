import React from 'react';
import { Info, ShieldCheck, Headphones, Zap, Mail, PhoneCall } from 'lucide-react';
import '../../styles/PlannerInfoSection.css';

const PlannerInfoSection = () => {
  const infoCards = [
    {
      title: "SMART TRAVEL SYSTEM",
      text: "Passengers can plan their journey efficiently using real-time bus tracking, ensuring accurate arrival times and reduced waiting at bus stops.",
      icon: <Zap className="card-icon" />,
      color: "#f97316"
    },
    {
      title: "ADVANCED TRACKING",
      text: "Our system integrates live GPS tracking with intelligent scheduling, allowing users to track buses at specific stops and administrators to manage routes seamlessly.",
      icon: <ShieldCheck className="card-icon" />,
      color: "#f97316"
    },
    {
      title: "USER CONVENIENCE",
      text: "Users can search buses by route, stop, or bus number, view live updates, and experience a safe and reliable transport system with continuous monitoring.",
      icon: <Info className="card-icon" />,
      color: "#f97316"
    }
  ];

  return (
    <section className="planner-info-section">
      <div className="container info-grid">
        <div className="cards-area">
          {infoCards.map((card, index) => (
            <div key={index} className="info-message-card">
              <div className="icon-wrapper" style={{ color: card.color }}>
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>

        <div className="support-sidebar">
          <div className="support-card glass-morphism">
            <div className="support-header">
              <Headphones size={32} color="#f97316" />
              <h3>24x7 Helpdesk</h3>
            </div>
            <div className="support-details">
              <div className="support-item">
                <PhoneCall size={18} />
                <a href="tel:1800-180-2877">1800-180-2877</a>
              </div>
              <div className="support-item">
                <Mail size={18} />
                <a href="mailto:support@upsrtc.com">support@upsrtc.com</a>
              </div>
            </div>
            <button className="chat-btn">Start Live Chat</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlannerInfoSection;
