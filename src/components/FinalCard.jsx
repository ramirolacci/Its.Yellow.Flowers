import React from 'react';

export function FinalCard({ show, onReplay }) {
  return (
    <section className={`final-card ${show ? 'show' : ''}`}>
      <div className="card-content">
        <h2>¡Feliz Día de la Primavera! 🌻✨</h2>
        <p>
          Sos el sol de todos mis días y mi persona favorita en el mundo. ¡Gracias por llenar mi vida de luz y alegría!
        </p>
        <div className="card-hearts">💛 🌻 💛</div>
        <button onClick={onReplay} className="replay-btn">
          Volver a regar ↺
        </button>
      </div>
    </section>
  );
}
