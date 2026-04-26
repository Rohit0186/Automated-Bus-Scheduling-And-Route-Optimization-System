import React from 'react';

/**
 * JanSafar — Custom brand logo icon
 * Metaphor: A winding road path with a traveller dot — "Jan ka Safar"
 */
const JanSafarLogo = ({ size = 28, color = 'var(--primary, #d84e55)' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="JanSafar logo"
  >
    {/* Road / path lines */}
    <path
      d="M4 26 C8 26 8 18 14 18 C20 18 20 10 26 10"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    {/* Dashed centre line */}
    <path
      d="M4 26 C8 26 8 18 14 18 C20 18 20 10 26 10"
      stroke="white"
      strokeWidth="1"
      strokeDasharray="2 4"
      strokeLinecap="round"
      fill="none"
    />
    {/* Moving traveller dot */}
    <circle cx="26" cy="10" r="4" fill={color} />
    <circle cx="26" cy="10" r="2" fill="white" />
    {/* Destination flag pole */}
    <line x1="26" y1="6" x2="26" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 2 L30 3.5 L26 5 Z" fill={color} />
  </svg>
);

export default JanSafarLogo;
