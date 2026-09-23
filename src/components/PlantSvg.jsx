import React from 'react';

const LEAF_NODES = [
  { stemOffset: 45, side: 'left', angle: -25, scale: 0.9 },
  { stemOffset: 95, side: 'right', angle: 25, scale: 0.95 },
  { stemOffset: 145, side: 'left', angle: -28, scale: 1.0 },
  { stemOffset: 195, side: 'right', angle: 28, scale: 0.95 }
];

export function PlantSvg({ stage, stemHeight, visibleLeaves = 0, bloomSunflower }) {
  const yBase = 336; // Y coordinate of pot dirt surface
  const yTop = yBase - stemHeight; // Top endpoint of growing stem

  const totalPetals = 20;
  const petalAngleStep = 360 / totalPetals;

  return (
    <svg viewBox="0 0 300 420" className="flower-svg" preserveAspectRatio="xMidYMax meet">
      <defs>
        {/* Pot Gradients */}
        <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E88355" />
          <stop offset="35%" stopColor="#DD7343" />
          <stop offset="70%" stopColor="#C85F31" />
          <stop offset="100%" stopColor="#A9481E" />
        </linearGradient>
        <linearGradient id="potRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F29165" />
          <stop offset="50%" stopColor="#E27849" />
          <stop offset="100%" stopColor="#B85329" />
        </linearGradient>

        {/* Stem Gradient */}
        <linearGradient id="stemGrad" x1="145" y1="0" x2="155" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#54B051" />
          <stop offset="50%" stopColor="#3D963A" />
          <stop offset="100%" stopColor="#2D7A2A" />
        </linearGradient>

        {/* Leaf Gradients */}
        <linearGradient id="leafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#69C466" />
          <stop offset="100%" stopColor="#368C33" />
        </linearGradient>
        <linearGradient id="leafGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#69C466" />
          <stop offset="100%" stopColor="#368C33" />
        </linearGradient>

        {/* Sepal Green Gradient */}
        <linearGradient id="sepalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>

        {/* Sunflower Petals Gradients */}
        <linearGradient id="petalGradFront" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#EAB308" />
          <stop offset="35%" stopColor="#FACC15" />
          <stop offset="80%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
        <linearGradient id="petalGradBack" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#CA8A04" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>

        {/* Seed Center Radial Gradients */}
        <radialGradient id="sunflowerDisk" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B1C0A" />
          <stop offset="55%" stopColor="#2E1406" />
          <stop offset="85%" stopColor="#1E0A02" />
          <stop offset="100%" stopColor="#120501" />
        </radialGradient>
      </defs>

      {/* Pot Base Shadow */}
      <ellipse cx="150" cy="392" rx="75" ry="12" fill="#291A10" opacity="0.12" />

      {/* PLANT GROUP (Stem + Leaves + Sunflower Head) */}
      <g id="plantGroup">
        {/* 1. Green Stem Tube */}
        <rect
          x="145.5"
          y={yTop}
          width="9"
          height={stemHeight}
          rx="4.5"
          fill="url(#stemGrad)"
          className="plant-stem"
        />

        {/* 2. Leaves Group */}
        <g id="leavesGroup">
          {LEAF_NODES.map((node, index) => {
            const isVisible = index < visibleLeaves;
            const leafY = yBase - node.stemOffset;
            const isLeft = node.side === 'left';
            const grad = isLeft ? "url(#leafGradLeft)" : "url(#leafGradRight)";
            const pathD = isLeft 
              ? "M 0 0 C -25 -10, -45 -5, -54 6 C -40 22, -18 20, 0 0 Z"
              : "M 0 0 C 25 -10, 45 -5, 54 6 C 40 22, 18 20, 0 0 Z";
            const veinD = isLeft ? "M 0 0 C -20 -2, -38 3, -48 5" : "M 0 0 C 20 -2, 38 3, 48 5";

            const currentScale = isVisible ? node.scale : 0;
            const currentOpacity = isVisible ? 1 : 0;

            return (
              <g
                key={index}
                transform={`translate(150, ${leafY}) rotate(${node.angle}) scale(${currentScale})`}
                style={{
                  opacity: currentOpacity,
                  transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease'
                }}
                className="leaf-group"
              >
                <path d={pathD} fill={grad} stroke="#286D26" strokeWidth="1" />
                <path d={veinD} stroke="#235B21" strokeWidth="1.5" fill="none" opacity="0.6" />
              </g>
            );
          })}
        </g>

        {/* 3. Realistic Sunflower Head Group */}
        <g
          className="sunflower-head-anchor"
          transform={`translate(150, ${yTop})`}
        >
          <g
            className={`sunflower-bloom-wrapper ${bloomSunflower ? 'blooming' : ''}`}
          >
            {/* Green Calyx / Sepals behind petals */}
            <g className="sepals-layer">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                return (
                  <path
                    key={`sepal-${i}`}
                    d="M 0 0 C -8 -20, -10 -40, 0 -50 C 10 -40, 8 -20, 0 0 Z"
                    fill="url(#sepalGrad)"
                    stroke="#235B21"
                    strokeWidth="0.8"
                    transform={`rotate(${angle}) scale(0.95)`}
                  />
                );
              })}
            </g>

            {/* Back Petals Layer */}
            <g className="back-petals">
              {Array.from({ length: totalPetals }).map((_, i) => {
                const angle = i * petalAngleStep + (petalAngleStep / 2);
                return (
                  <path
                    key={`back-${i}`}
                    d="M 0 0 C -15 -28, -16 -58, 0 -84 C 16 -58, 15 -28, 0 0 Z"
                    fill="url(#petalGradBack)"
                    stroke="#B45309"
                    strokeWidth="0.6"
                    transform={`rotate(${angle}) scale(0.94)`}
                  />
                );
              })}
            </g>

            {/* Front Petals Layer */}
            <g className="front-petals">
              {Array.from({ length: totalPetals }).map((_, i) => {
                const angle = i * petalAngleStep;
                return (
                  <path
                    key={`front-${i}`}
                    d="M 0 0 C -14 -26, -15 -54, 0 -78 C 15 -54, 14 -26, 0 0 Z"
                    fill="url(#petalGradFront)"
                    stroke="#D97706"
                    strokeWidth="0.5"
                    transform={`rotate(${angle})`}
                  />
                );
              })}
            </g>

            {/* Realistic Sunflower Disk Center */}
            <g className="sunflower-disk">
              <circle cx="0" cy="0" r="34" fill="url(#sunflowerDisk)" stroke="#5C2D12" strokeWidth="2" />
              <circle cx="0" cy="0" r="30" fill="none" stroke="#D97706" strokeWidth="2.5" strokeDasharray="3,3" opacity="0.75" />
              <circle cx="0" cy="0" r="25" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="2.5,2.5" opacity="0.6" />
              <circle cx="0" cy="0" r="20" fill="none" stroke="#CA8A04" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.5" />
              <circle cx="0" cy="0" r="14" fill="none" stroke="#854D0E" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
              <circle cx="0" cy="0" r="9" fill="#1C0902" />
              <circle cx="-5" cy="-6" r="2" fill="#FFF" opacity="0.25" />
            </g>
          </g>
        </g>
      </g>

      {/* 4. Terracotta Pot */}
      <g id="pot">
        <ellipse cx="150" cy="336" rx="56" ry="10" fill="#422517" />
        <ellipse cx="150" cy="336" rx="52" ry="7" fill="#2E180E" />
        <path d="M 95 342 C 96 385, 108 402, 122 406 C 132 409, 168 409, 178 406 C 192 402, 204 385, 205 342 Z" fill="url(#potGrad)" />
        <rect x="88" y="328" width="124" height="20" rx="9" fill="url(#potRimGrad)" />
        <path d="M 94 332 L 206 332" stroke="#FFAE8A" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <path d="M 98 344 C 110 347, 190 347, 202 344" stroke="#5C230B" strokeWidth="2" opacity="0.3" fill="none"/>
      </g>
    </svg>
  );
}

