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
    class Particle {
      constructor(x, y, isHeart = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || canvas.height + 20;
        this.size = isHeart ? Math.random() * 16 + 10 : Math.random() * 6 + 3;
        this.speedY = Math.random() * -1.8 - 0.8;
        this.speedX = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.rotation = Math.random() * 360;
        this.rotSpeed = Math.random() * 2 - 1;
        this.isHeart = isHeart;
        this.color = ['#FBBF24', '#F59E0B', '#FDE047', '#EAB308'][Math.floor(Math.random() * 4)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.02) * 0.5;
        this.rotation += this.rotSpeed;
        this.opacity -= 0.003;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, this.opacity);

        if (this.isHeart) {
          ctx.font = `${this.size}px serif`;
          ctx.fillText('💛', 0, 0);
        } else {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.08 && particlesRef.current.length < 50) {
        particlesRef.current.push(new Particle(null, null, Math.random() > 0.4));
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update();
        p.draw(ctx);
        if (p.opacity <= 0 || p.y < -30) {
          particlesRef.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    if (triggerBurst) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const newParticles = [];
      for (let i = 0; i < 40; i++) {
        const p = {
          x: canvas.width / 2 + (Math.random() * 100 - 50),
          y: canvas.height * 0.6,
          size: Math.random() * 16 + 12,
          speedY: Math.random() * -4 - 2,
          speedX: Math.random() * 6 - 3,
          opacity: 1,
          rotation: Math.random() * 360,
          rotSpeed: Math.random() * 4 - 2,
          isHeart: true,
          color: '#FBBF24',
          update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity -= 0.005;
          },
          draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.font = `${this.size}px serif`;
            ctx.fillText('💛', 0, 0);
            ctx.restore();
          }
        };
        newParticles.push(p);
      }
      particlesRef.current.push(...newParticles);
    }
  }, [triggerBurst]);

  return <canvas id="particleCanvas" ref={canvasRef} />;
}
