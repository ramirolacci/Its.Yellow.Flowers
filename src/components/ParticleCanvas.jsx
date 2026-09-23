import React, { useEffect, useRef } from 'react';

// Pre-rendered GPU Offscreen Canvas Sprites for 100x Faster Performance
let cachedHeartSprite = null;
let cachedSunflowerSprite = null;

function getHeartSprite() {
  if (!cachedHeartSprite) {
    const c = document.createElement('canvas');
    c.width = 40;
    c.height = 40;
    const ctx = c.getContext('2d');
    ctx.font = '26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💛', 20, 20);
    cachedHeartSprite = c;
  }
  return cachedHeartSprite;
}

function getSunflowerSprite() {
  if (!cachedSunflowerSprite) {
    const c = document.createElement('canvas');
    c.width = 48;
    c.height = 48;
    const ctx = c.getContext('2d');
    ctx.font = '34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌻', 24, 24);
    cachedSunflowerSprite = c;
  }
  return cachedSunflowerSprite;
}

export function ParticleCanvas({ triggerBurst }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let animId;

    class FloatingHeart {
      constructor(x, y) {
        this.type = 'heart';
        this.x = x ?? Math.random() * canvas.width;
        this.y = y ?? (canvas.height + 20 + Math.random() * 30);
        this.speedY = -(Math.random() * 0.9 + 0.5);
        this.speedX = Math.random() * 0.6 - 0.3;
        this.swaySpeed = Math.random() * 0.003 + 0.001;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.5 + 0.25;
        this.fadeSpeed = 0.0015;
        this.rotation = (Math.random() * 20 - 10) * (Math.PI / 180);
        this.rotSpeed = (Math.random() * 0.4 - 0.2) * (Math.PI / 180);
      }

      update(time) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(time * this.swaySpeed + this.swayOffset) * 0.4;
        this.rotation += this.rotSpeed;
        this.opacity -= this.fadeSpeed;
      }

      draw(ctx) {
        if (this.opacity <= 0) return;
        const sprite = getHeartSprite();
        ctx.save();
        ctx.translate(this.x | 0, this.y | 0);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.drawImage(sprite, -20, -20, 40, 40);
        ctx.restore();
      }
    }

    // Seed initial ambient floating hearts
    const isMobile = canvas.width < 500;
    const initialHearts = isMobile ? 10 : 18;
    for (let i = 0; i < initialHearts; i++) {
      particlesRef.current.push(
        new FloatingHeart(Math.random() * canvas.width, Math.random() * canvas.height)
      );
    }

    const render = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maxHearts = isMobile ? 16 : 30;
      if (Math.random() < 0.04 && particlesRef.current.length < maxHearts) {
        particlesRef.current.push(new FloatingHeart());
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update(now);
        p.draw(ctx);

        const isHeart = p.type === 'heart';
        const isExpired = p.opacity <= 0;
        const isOffBottom = p.y > canvas.height + 60;
        const isOffTop = isHeart && p.y < -40;

        if (isExpired || isOffBottom || isOffTop) {
          particlesRef.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Spawn instant 60FPS burst of mini sunflowers 🌻
  useEffect(() => {
    if (triggerBurst) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const burstParticles = [];
      const isMobile = canvas.width < 500;
      const totalSunflowers = isMobile ? 30 : 45;

      for (let i = 0; i < totalSunflowers; i++) {
        const startX = canvas.width / 2 + (Math.random() * 180 - 90);
        const startY = canvas.height * 0.42;
        const sprite = getSunflowerSprite();

        burstParticles.push({
          type: 'sunflower',
          x: startX,
          y: startY,
          speedY: -(Math.random() * 5 + 2.5),
          speedX: Math.random() * 8 - 4,
          gravity: 0.14,
          swaySpeed: Math.random() * 0.004 + 0.002,
          swayOffset: Math.random() * Math.PI * 2,
          opacity: 1,
          fadeSpeed: Math.random() * 0.003 + 0.0015,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() * 6 - 3) * (Math.PI / 180),
          update(time) {
            this.speedY += this.gravity;
            this.x += this.speedX * 0.98 + Math.sin((time || 0) * this.swaySpeed + this.swayOffset) * 0.5;
            this.y += this.speedY;
            this.rotation += this.rotSpeed;
            this.opacity -= this.fadeSpeed;
          },
          draw(ctx) {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.translate(this.x | 0, this.y | 0);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.drawImage(sprite, -24, -24, 48, 48);
            ctx.restore();
          }
        });
      }
      particlesRef.current.push(...burstParticles);
    }
  }, [triggerBurst]);

  return <canvas id="particleCanvas" ref={canvasRef} />;
}
