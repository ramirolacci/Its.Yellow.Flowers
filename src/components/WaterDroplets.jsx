import React from 'react';

export function WaterDroplets({ dropsKey, showRipple }) {
  if (!dropsKey) return null;

  return (
    <div className="water-drops-container" key={dropsKey}>
      <div className="water-drop" style={{ left: '48%', top: '20%', animationDelay: '0s' }}></div>
      <div className="water-drop" style={{ left: '52%', top: '20%', animationDelay: '0.12s' }}></div>
      <div className="water-drop" style={{ left: '50%', top: '20%', animationDelay: '0.24s' }}></div>
      {showRipple && <div className="splash-ripple"></div>}
    </div>
  );
}
