import React from 'react';
import { Phone, Globe, ExternalLink, User } from 'lucide-react';

const HeaderTop = () => {
  return (
    <div className="header-top">
      <div className="container header-top-content">
        <div className="helpline">
          <Phone size={14} />
          <span>24x7 Helpline: 1800-180-2877</span>
        </div>
        <div className="utility-links">
          <a href="#"><Globe size={14} /> Yatra Darpan</a>
          <a href="#">Grievances</a>
          <a href="#">Employee Portals</a>
          <button className="enquiry-btn">ENQUIRY NUMBER</button>
          <div className="search-mini">
            <input type="text" placeholder="Search..." />
          </div>
          <button className="lang-toggle">Hindi Version</button>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
