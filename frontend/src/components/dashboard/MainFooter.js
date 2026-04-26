import React from 'react';
import { Facebook, Twitter, Youtube, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const MainFooter = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-content">
        <div className="footer-col">
          <h3>Policies</h3>
          <ul>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Copyright Policy</a></li>
            <li><a href="#">Hyperlinking Policy</a></li>
            <li><a href="#">Disclaimer</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Reach Us</a></li>
            <li><a href="#">Feedback</a></li>
            <li><a href="#">Sitemap</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
          <div className="social-links">
            <Facebook size={20} />
            <Twitter size={20} />
            <Youtube size={20} />
            <Instagram size={20} />
          </div>
        </div>

        <div className="footer-col">
          <h3>Contact Info</h3>
          <div className="contact-info">
            <p><MapPin size={16} /> HQ: Lucknow, Uttar Pradesh</p>
            <p><Phone size={16} /> 1800-180-2877</p>
            <p><Mail size={16} /> info@upsrtc.com</p>
          </div>
          <div className="stats">
            <p>Last Updated: Feb 20, 2026</p>
            <p>Visitors: <span className="counter">000064656138</span></p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>Official Website of Uttar Pradesh State Road Transport Corporation (UPSRTC)</p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
