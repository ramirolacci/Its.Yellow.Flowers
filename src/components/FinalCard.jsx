import React from 'react';

export function FinalCard({ show, onRevealFlower }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>¡Feliz Día de la Primavera! 🌻✨</h2>
        <p className="modal-original-text">
          Sos el sol de todos mis días y mi persona favorita en el mundo. ¡Gracias por llenar mi vida de luz y alegría!
        </p>
        <div className="card-hearts">💛 🌻 💛</div>
        <button onClick={onRevealFlower} className="modal-action-btn">
          <span>Ver la flor de mi amor</span>
          <span className="btn-emoji">🌻</span>
        </button>
      </div>
    </div>
  );
}
