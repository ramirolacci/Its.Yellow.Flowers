import React, { useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { PlantSvg } from './components/PlantSvg';
import { WaterDroplets } from './components/WaterDroplets';
import { FinalCard } from './components/FinalCard';
import { ParticleCanvas } from './components/ParticleCanvas';
import { audioSynth } from './utils/audio';

const STAGES = [
  {
    // Stage 0: Maceta + tallo verde base (sin hojas)
    stemHeight: 50,
    visibleLeaves: 0,
    reasons: [],
    showTitle: false,
    showSpecial: false,
    btnText: "Regar con amor",
    btnEmoji: "💛"
  },
  {
    // Stage 1: Tallo igual, aparece 1° hoja
    stemHeight: 50,
    visibleLeaves: 1,
    reasons: ["Sos hermosa"],
    showTitle: true,
    showSpecial: false,
    btnText: "Otro poquito",
    btnEmoji: "💧"
  },
  {
    // Stage 2: Crece el tallo y aparece 2° hoja
    stemHeight: 110,
    visibleLeaves: 2,
    reasons: ["Sos hermosa", "Sos divertida"],
    showTitle: true,
    showSpecial: false,
    btnText: "Está creciendo",
    btnEmoji: "🌱"
  },
  {
    // Stage 3: Crece el tallo, mantiene 2° hoja (NO aparece hoja nueva)
    stemHeight: 170,
    visibleLeaves: 2,
    reasons: ["Sos hermosa", "Sos divertida", "Sos mi hogar"],
    showTitle: true,
    showSpecial: false,
    btnText: "Está creciendo",
    btnEmoji: "🌱"
  },
  {
    // Stage 4: Tallo igual, aparece 3° hoja
    stemHeight: 170,
    visibleLeaves: 3,
    reasons: ["Sos hermosa", "Sos divertida", "Sos mi hogar", "Sos auténtica"],
    showTitle: true,
    showSpecial: false,
    btnText: "Está creciendo",
    btnEmoji: "🌱"
  },
  {
    // Stage 5: Crece el tallo y aparece 4° hoja
    stemHeight: 235,
    visibleLeaves: 4,
    reasons: ["Sos hermosa", "Sos divertida", "Sos mi hogar", "Sos auténtica", "Sos inspiradora"],
    showTitle: true,
    showSpecial: true,
    btnText: "Regar con mas amor",
    btnEmoji: "💛",
    triggersModal: true
  }
];

export function App() {
  const [currentStage, setCurrentStage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bloomSunflower, setBloomSunflower] = useState(false);
  const [dropsKey, setDropsKey] = useState(0);
  const [showRipple, setShowRipple] = useState(false);
  const [triggerBurst, setTriggerBurst] = useState(false);

  const stage = STAGES[currentStage];

  const handleWater = () => {
    audioSynth.playWaterSound();
    
    // Trigger water drop animation
    const newKey = Date.now();
    setDropsKey(newKey);
    setShowRipple(false);
    setTimeout(() => setShowRipple(true), 650);

    if (stage.triggersModal) {
      setTimeout(() => {
        setShowModal(true);
      }, 400);
      return;
    }

    if (currentStage < STAGES.length - 1) {
      const nextStage = currentStage + 1;
      setTimeout(() => {
        setCurrentStage(nextStage);
        audioSynth.playGrowSound(nextStage);
      }, 350);
    }
  };

  const handleRevealFlower = () => {
    setShowModal(false);
    setBloomSunflower(true);
    setTriggerBurst(true);
    audioSynth.playFanfareSound();
  };

  return (
    <>
      <div className="background-decorations">
        <div className="bg-sun-glow"></div>
        <ParticleCanvas triggerBurst={triggerBurst} />
      </div>

      <main className="app-container">
        <Header
          showTitle={stage.showTitle}
          reasons={stage.reasons}
          showSpecial={stage.showSpecial}
        />

        <section className="plant-section">
          <WaterDroplets dropsKey={dropsKey} showRipple={showRipple} />
          <PlantSvg
            stage={currentStage}
            stemHeight={stage.stemHeight}
            visibleLeaves={stage.visibleLeaves}
            bloomSunflower={bloomSunflower}
          />
        </section>

        <FinalCard
          show={showModal}
          onRevealFlower={handleRevealFlower}
        />

        <footer className="footer-section">
          <button className="water-button" onClick={handleWater}>
            <span>{bloomSunflower ? "¡Floreció! 💛" : stage.btnText}</span>
            <span className="btn-emoji">{bloomSunflower ? "✨" : stage.btnEmoji}</span>
          </button>
        </footer>
      </main>
    </>
  );
}

export default App;
