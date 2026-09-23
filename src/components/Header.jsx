import React from 'react';

export function Header({ showTitle, reasons, showSpecial }) {
  return (
    <header className="header-section">
      <h1 className={`main-title ${showTitle ? 'visible' : ''}`}>
        Me encantas porque:
      </h1>

      <div className="reasons-list">
        {reasons.map((reason, idx) => (
          <div
            key={`${reason}-${idx}`}
            className="reason-item"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            {reason}
          </div>
        ))}
      </div>

      <div className={`special-phrase ${showSpecial ? 'visible' : ''}`}>
        <span>Pero sobre todo te amo</span>
      </div>
    </header>
  );
}
