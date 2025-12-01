import React from 'react';
import { HoroscopeScores } from '../types';

interface Props {
  scores: HoroscopeScores;
}

export const HoroscopeChart: React.FC<Props> = ({ scores }) => {
  // Chart configuration
  const size = 420; // Increased canvas size to prevent clipping (was 360)
  const center = size / 2;
  const radius = 80; // Keep chart radius moderate
  const maxScore = 100;

  // Data points
  const categories = [
    { key: 'general', label: 'Удача', value: scores.general, color: '#000000' },
    { key: 'career', label: 'Карьера', value: scores.career, color: '#CA8A04' }, // yellow-600
    { key: 'love', label: 'Любовь', value: scores.love, color: '#EF4444' }, // red-500
    { key: 'health', label: 'Здоровье', value: scores.health, color: '#16A34A' }, // green-600
  ];

  const totalPoints = categories.length;
  
  // Calculate coordinates for a point on the radar
  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / totalPoints - Math.PI / 2; // Start from top
    const r = (value / maxScore) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points string
  const polygonPoints = categories.map((cat, i) => {
    const { x, y } = getCoordinates(cat.value, i);
    return `${x},${y}`;
  }).join(' ');

  // Background webs (25%, 50%, 75%, 100%)
  const webs = [0.25, 0.5, 0.75, 1].map(scale => {
    return categories.map((_, i) => {
      const { x, y } = getCoordinates(maxScore * scale, i);
      return `${x},${y}`;
    }).join(' ');
  });

  return (
    <div className="flex flex-col items-center justify-center py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Энергетический баланс</h3>
      <div className="relative w-full max-w-[280px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
          {/* Background Webs */}
          {webs.map((points, i) => (
            <polygon 
              key={i} 
              points={points} 
              fill="none" 
              stroke="#e5e7eb" 
              strokeWidth="1.5" 
              strokeDasharray={i === 3 ? "0" : "4 3"}
            />
          ))}

          {/* Axis Lines */}
          {categories.map((_, i) => {
            const { x, y } = getCoordinates(maxScore, i);
            return (
              <line 
                key={i} 
                x1={center} 
                y1={center} 
                x2={x} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="1.5" 
              />
            );
          })}

          {/* Data Polygon */}
          <polygon 
            points={polygonPoints} 
            fill="rgba(239, 68, 68, 0.05)"
            stroke="#ef4444" 
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {categories.map((cat, i) => {
            const { x, y } = getCoordinates(cat.value, i);
            return (
              <circle 
                key={i} 
                cx={x} 
                cy={y} 
                r="6" 
                fill={cat.color} 
                stroke="white" 
                strokeWidth="2.5"
              />
            );
          })}

          {/* Labels */}
          {categories.map((cat, i) => {
            // Push labels out further
            const angle = (Math.PI * 2 * i) / totalPoints - Math.PI / 2;
            const labelRadius = radius + 55; // Increased padding for labels
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle); 
            
            // Adjust anchor based on position
            // Explicit types to fix TS errors
            let anchor: "start" | "middle" | "end" = 'middle';
            let baseline: "auto" | "middle" | "hanging" = 'middle';
            
            // Fine-tuning position based on index (Top, Right, Bottom, Left)
            if (i === 0) { // Top (General)
                anchor = 'middle';
                baseline = 'auto'; // sit on top of point
            } else if (i === 1) { // Right (Career)
                anchor = 'start';
                baseline = 'middle';
            } else if (i === 2) { // Bottom (Love)
                anchor = 'middle';
                baseline = 'hanging';
            } else if (i === 3) { // Left (Health)
                anchor = 'end';
                baseline = 'middle';
            }

            return (
              <text 
                key={i} 
                x={x} 
                y={y} 
                textAnchor={anchor} 
                dominantBaseline={baseline}
                fontSize="11" 
                fontWeight="700"
                fill="#374151"
                className="uppercase"
                style={{ letterSpacing: '0.05em' }}
              >
                {cat.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
