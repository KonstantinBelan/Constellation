import React, { useEffect, useRef } from 'react';

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Array<{x: number, y: number, r: number, a: number, s: number}> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 8000); // Density
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.5,
          a: Math.random(),
          s: Math.random() * 0.02 + 0.005 // speed of twinkle
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Keep background transparent/white as per requirements, we just draw gray dots
      ctx.fillStyle = "#ffffff"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.a += star.s;
        if (star.a > 1 || star.a < 0) star.s = -star.s;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        // Using gray/yellow for stars
        ctx.fillStyle = `rgba(234, 179, 8, ${Math.abs(star.a)})`; // Yellow-500
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};
