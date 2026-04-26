import React from 'react';

const WebsiteStrip = () => {
  const websites = [
    { name: 'Govt. of Uttar Pradesh', logo: '/assets/logos/up_govt.png' },
    { name: 'Transport Department', logo: '/assets/logos/up_transport.png' },
    { name: 'India.gov.in', logo: '/assets/logos/india_portal.png' },
    { name: 'UP Metro Rail', logo: '/assets/logos/up_metro.png' }
  ];

  return (
    <div className="website-strip">
      <div className="container strip-content">
        <h3 className="strip-title">Important Websites</h3>
        <div className="logo-grid">
          {websites.map((site, index) => (
            <div key={index} className="site-card">
              <img src={site.logo} alt={site.name} />
              <span>{site.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteStrip;
