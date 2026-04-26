import React from 'react';

const ModernInput = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  type = "text", 
  placeholder = " ", 
  readOnly = false,
  onClick
}) => {
  return (
    <div className="modern-input-wrapper" onClick={onClick}>
      <div className="input-icon">
        {Icon && <Icon size={20} />}
      </div>
      <div className="input-field-container">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className="modern-input-field"
        />
        <label className="modern-input-label">{label}</label>
      </div>
    </div>
  );
};

export default ModernInput;
