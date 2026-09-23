import React, { useEffect, useRef } from 'react';

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

    class HeartParticle {
      constructor(x, y, isBurst = false) {
        this.x = x ?? Math.random() * canvas.width;
        this.y = y ?? (canvas.height + 20 + Math.random() * 30);
        this.size = isBurst ? Math.random() * 18 + 14 : Math.random() * 14 + 10;
        this.speedY = isBurst ? -(Math.random() * 3 + 2) : -(Math.random() * 0.9 + 0.5);
        this.speedX = isBurst ? (Math.random() * 4 - 2) : (Math.random() * 0.6 - 0.3);
        this.swaySpeed = Math.random() * 0.003 + 0.001;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.opacity = isBurst ? 1 : Math.random() * 0.5 + 0.25;
        this.fadeSpeed = isBurst ? 0.008 : 0.0015;
        this.rotation = Math.random() * 20 - 10;
        this.rotSpeed = Math.random() * 0.4 - 0.2;
      }

      update(time) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(time * this.swaySpeed + this.swayOffset) * 0.4;
        this.rotation += this.rotSpeed;
        this.opacity -= this.fadeSpeed;
      }

      draw(ctx) {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.font = `${Math.round(this.size)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💛', 0, 0);
        ctx.restore();
      }
    }

    // Seed initial ambient floating hearts across the screen height
    for (let i = 0; i < 18; i++) {
      const p = new HeartParticle(Math.random() * canvas.width, Math.random() * canvas.height);
      particlesRef.current.push(p);
    }

    let lastTime = performance.now();

    const render = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn ambient gentle floating hearts periodically (max 30 hearts on screen)
      if (Math.random() < 0.04 && particlesRef.current.length < 35) {
        particlesRef.current.push(new HeartParticle());
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update(now);
        p.draw(ctx);
        if (p.opacity <= 0 || p.y < -40) {
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

  // Spawn extra burst of hearts when final bloom occurs
  useEffect(() => {
    if (triggerBurst) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const burstHearts = [];
      for (let i = 0; i < 45; i++) {
        const x = canvas.width / 2 + (Math.random() * 120 - 60);
        const y = canvas.height * 0.55;
        // Access class constructor dynamically inside canvas ref context
        const heart = {
          x,
          y,
          size: Math.random() * 18 + 12,
          speedY: -(Math.random() * 3.5 + 1.5),
          speedX: Math.random() * 5 - 2.5,
          opacity: 1,
          fadeSpeed: 0.006,
          rotation: Math.random() * 30 - 15,
          rotSpeed: Math.random() * 0.6 - 0.3,
          update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;
            this.opacity -= this.fadeSpeed;
          },
          draw(ctx) {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.font = `${Math.round(this.size)}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💛', 0, 0);
            ctx.restore();
          }
        };
        burstHearts.push(heart);
      }
      particlesRef.current.push(...burstHearts);
    }
  }, [triggerBurst]);

  return <canvas id="particleCanvas" ref={canvasRef} />;
}
