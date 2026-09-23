import React from 'react';

// Leaf attachment definitions along the stem
// stemOffset: distance from dirt surface (y=336) going upwards
const LEAF_NODES = [
  { stemOffset: 40, side: 'left', angle: -25, scale: 0.9, reqHeight: 65 },
  { stemOffset: 90, side: 'right', angle: 25, scale: 0.95, reqHeight: 115 },
  { stemOffset: 140, side: 'left', angle: -28, scale: 1.0, reqHeight: 165 },
  { stemOffset: 190, side: 'right', angle: 28, scale: 1.0, reqHeight: 215 },
  { stemOffset: 235, side: 'left', angle: -30, scale: 0.9, reqHeight: 265 }
];

export function PlantSvg({ stage, stemHeight, bloomSunflower }) {
  const yBase = 336; // Y coordinate of pot dirt surface
  const yTop = yBase - stemHeight; // Top endpoint of growing stem

  // Generate 16 back petals and 16 front petals for realistic Sunflower head
  const totalPetals = 16;
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
        <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
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

        {/* Sunflower Center & Petals Gradients */}
        <radialGradient id="sunflowerCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6E3A1A" />
          <stop offset="65%" stopColor="#4A230C" />
          <stop offset="100%" stopColor="#2B1104" />
        </radialGradient>
        <linearGradient id="petalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FDE047" />
        </linearGradient>
        <linearGradient id="petalGradBack" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#3C2415" floodOpacity="0.15"/>
        </filter>
      </defs>

      {/* Pot Base Shadow */}
      <ellipse cx="150" cy="392" rx="75" ry="12" fill="#291A10" opacity="0.12" />

      {/* PLANT GROUP (Stem + Leaves + Sunflower Head) */}
      <g id="plantGroup">
        {/* 1. Green Stem Line (drawn continuously from pot dirt up to yTop) */}
        <line
          x1="150"
          y1={yBase}
          x2="150"
          y2={yTop}
          stroke="url(#stemGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          className="plant-stem"
        />

        {/* 2. Leaves Group attached explicitly to stem */}
        <g id="leavesGroup">
          {LEAF_NODES.map((node, index) => {
            // Only render leaf if stem has grown enough to reach this leaf node
            if (stemHeight < node.reqHeight) return null;

            const leafY = yBase - node.stemOffset;
            const isLeft = node.side === 'left';
            const grad = isLeft ? "url(#leafGradLeft)" : "url(#leafGradRight)";
            const pathD = isLeft 
              ? "M 0 0 C -25 -10, -45 -5, -54 6 C -40 22, -18 20, 0 0 Z"
              : "M 0 0 C 25 -10, 45 -5, 54 6 C 40 22, 18 20, 0 0 Z";
            const veinD = isLeft ? "M 0 0 C -20 -2, -38 3, -48 5" : "M 0 0 C 20 -2, 38 3, 48 5";

            return (
              <g
                key={index}
                transform={`translate(150, ${leafY}) rotate(${node.angle}) scale(${node.scale})`}
                className="leaf-group"
              >
                <path d={pathD} fill={grad} stroke="#286D26" strokeWidth="1" />
                <path d={veinD} stroke="#235B21" strokeWidth="1.5" fill="none" opacity="0.6" />
              </g>
            );
          })}
        </g>

        {/* 3. Sunflower Head Group (Anchored precisely at the top tip of stem: (150, yTop)) */}
        <g
          className={`sunflower-head ${bloomSunflower ? 'blooming' : ''}`}
          transform={`translate(150, ${yTop}) scale(${bloomSunflower ? 1 : 0})`}
          style={{ '--sunflower-y': `${yTop}px` }}
        >
          {/* Back Petals Layer */}
          <g className="back-petals">
            {Array.from({ length: totalPetals }).map((_, i) => {
              const angle = i * petalAngleStep + (petalAngleStep / 2);
              return (
                <path
                  key={`back-${i}`}
                  d="M 0 0 C -12 -30, -14 -60, 0 -85 C 14 -60, 12 -30, 0 0 Z"
                  fill="url(#petalGradBack)"
                  transform={`rotate(${angle}) scale(0.92)`}
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
                  d="M 0 0 C -11 -28, -13 -56, 0 -80 C 13 -56, 11 -28, 0 0 Z"
                  fill="url(#petalGrad)"
                  transform={`rotate(${angle})`}
                />
              );
            })}
          </g>

          {/* Sunflower Disk Center */}
          <circle cx="0" cy="0" r="32" fill="url(#sunflowerCenter)" stroke="#8B4513" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="26" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
          <circle cx="0" cy="0" r="9" fill="#3D1D09" />
          <circle cx="-6" cy="-8" r="2" fill="#FFF" opacity="0.6" />
        </g>
      </g>

      {/* 4. Terracotta Pot (Drawn ON TOP of stem base so stem emerges from inside dirt) */}
      <g id="pot" filter="url(#softShadow)">
        {/* Dirt Surface */}
        <ellipse cx="150" cy="336" rx="56" ry="10" fill="#422517" />
        <ellipse cx="150" cy="336" rx="52" ry="7" fill="#2E180E" />

        {/* Pot Body */}
        <path d="M 95 342 C 96 385, 108 402, 122 406 C 132 409, 168 409, 178 406 C 192 402, 204 385, 205 342 Z" fill="url(#potGrad)" />
        {/* Pot Rim */}
        <rect x="88" y="328" width="124" height="20" rx="9" fill="url(#potRimGrad)" />
        {/* Rim Highlight */}
        <path d="M 94 332 L 206 332" stroke="#FFAE8A" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <path d="M 98 344 C 110 347, 190 347, 202 344" stroke="#5C230B" strokeWidth="2" opacity="0.3" fill="none"/>
      </g>
    </svg>
  );
}

