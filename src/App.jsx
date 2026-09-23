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
    stemHeight: 25,
    reasons: [],
    showTitle: false,
    showSpecial: false,
    btnText: "Regar con amor",
    btnEmoji: "💛"
  },
  {
    stemHeight: 85,
    reasons: ["Sos hermosa"],
    showTitle: true,
    showSpecial: false,
    btnText: "Otro poquito",
    btnEmoji: "💧"
  },
  {
    stemHeight: 145,
    reasons: ["Sos hermosa", "Sos divertida"],
    showTitle: true,
    showSpecial: false,
    btnText: "Está creciendo",
    btnEmoji: "🌱"
  },
  {
    stemHeight: 205,
    reasons: ["Sos hermosa", "Sos divertida", "Sos mi hogar"],
    showTitle: true,
    showSpecial: false,
    btnText: "Un poco más",
    btnEmoji: "✨"
  },
  {
    stemHeight: 265,
    reasons: ["Sos hermosa", "Sos divertida", "Sos mi hogar", "Sos auténtica"],
    showTitle: true,
    showSpecial: false,
    btnText: "Ya casi...",
    btnEmoji: "🌻"
  },
  {
    stemHeight: 305,
    reasons: ["Sos hermosa", "Sos divertida", "Sos mi hogar", "Sos auténtica", "Sos inspiradora"],
    showTitle: true,
    showSpecial: true,
    btnText: "Ver el final",
    btnEmoji: "💛"
  },
  {
    stemHeight: 310,
    reasons: ["Sos hermosa", "Sos divertida", "Sos mi hogar", "Sos auténtica", "Sos inspiradora"],
    showTitle: true,
    showSpecial: true,
    bloomSunflower: true,
    btnText: "¡Floreció! 💛",
    btnEmoji: "✨"
  }
];

export function App() {
  const [currentStage, setCurrentStage] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
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

    if (currentStage < STAGES.length - 1) {
      const nextStage = currentStage + 1;
      setTimeout(() => {
        setCurrentStage(nextStage);
        audioSynth.playGrowSound(nextStage);

        if (STAGES[nextStage].bloomSunflower) {
          audioSynth.playFanfareSound();
          setTriggerBurst(true);
        }
      }, 350);
    }
  };

  const handleReplay = () => {
    setCurrentStage(0);
    setTriggerBurst(false);
  };

  const toggleSound = () => {
    const isEnabled = audioSynth.toggleSound();
    setSoundEnabled(isEnabled);
  };

  return (
    <>
      <div className="background-decorations">
        <div className="bg-sun-glow"></div>
        <ParticleCanvas triggerBurst={triggerBurst} />
      </div>

      <main className="app-container">
        <button className="sound-toggle-btn" onClick={toggleSound} aria-label="Sonido">
          {soundEnabled ? '🔊' : '🔇'}
        </button>

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
            bloomSunflower={stage.bloomSunflower}
          />
        </section>

        <FinalCard
          show={!!stage.bloomSunflower}
          onReplay={handleReplay}
        />

        <footer className="footer-section">
          <button className="water-button" onClick={handleWater}>
            <span>{stage.btnText}</span>
            <span className="btn-emoji">{stage.btnEmoji}</span>
          </button>
        </footer>
      </main>
    </>
  );
}

export default App;
