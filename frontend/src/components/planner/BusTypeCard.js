import React from 'react';
import { CreditCard, Zap, MapPin } from 'lucide-react';

const BusTypeCard = ({ type, fare, features, coverage, image, tag }) => {
  return (
    <div className="bus-type-card">
      <div className="bus-type-content">
        {tag && <span className="tag">{tag}</span>}
        <h2>{type}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <div className="icon-box">
              <CreditCard size={20} />
            </div>
            <div>
              <h4>Fare Details</h4>
              <p>{fare}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="icon-box">
              <Zap size={20} />
            </div>
            <div>
              <h4>Premium Features</h4>
              <p>{features}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="icon-box">
              <MapPin size={20} />
            </div>
            <div>
              <h4>Coverage Area</h4>
              <p>{coverage}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bus-type-image-side">
        <img src={image} alt={type} loading="lazy" />
      </div>
    </div>
  );
};

export default BusTypeCard;
