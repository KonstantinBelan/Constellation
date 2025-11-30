import React from 'react';
import { ZodiacSign } from '../types';

interface Props {
  sign: ZodiacSign;
  className?: string;
}

export const ZodiacIcon: React.FC<Props> = ({ sign, className = "w-6 h-6" }) => {
  // Simple geometric representations
  const getPath = (s: ZodiacSign) => {
    switch (s) {
      case ZodiacSign.Aries:
        return <path d="M12 21a9 9 0 0 0 9-9h-2a7 7 0 0 1-7 7 7 7 0 0 1-7-7H3a9 9 0 0 0 9 9z M12 3v6 M7 6l5 3 5-3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />;
      case ZodiacSign.Taurus:
        return <path d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 6V3 M6 8a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Gemini:
        return <path d="M8 3v18 M16 3v18 M5 3h14 M5 21h14" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Cancer:
        return <path d="M6 12a4 4 0 1 1 4-4 M18 12a4 4 0 1 1-4 4" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Leo:
        return <path d="M12 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 0c2 0 3 2 4 4s3 3 5 3" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Virgo:
        return <path d="M5 5v14c0 2 2 2 2 2s2 0 2-2V9c0-2 2-3 4-3s4 1 4 3v10c0 2 2 2 2 2" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Libra:
        return <path d="M4 18h16 M4 21h16 M12 14a5 5 0 0 1 5-5h-2a3 3 0 0 0-6 0H7a5 5 0 0 1 5 5z" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Scorpio:
        return <path d="M5 5v14 M5 9c0-2 2-3 4-3s4 1 4 3v10 M13 9c0-2 2-3 4-3s4 1 4 3v8l2 2" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Sagittarius:
        return <path d="M4 20L20 4 M20 4v8 M20 4h-8 M8 16l-4 4" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Capricorn:
        return <path d="M7 6c0 3 2 5 2 9s4 4 4 4s4-2 4-5c0-4-6-4-6-8" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Aquarius:
        return <path d="M3 10c2-2 4-2 6 0s4 2 6 0s4-2 6 0 M3 14c2-2 4-2 6 0s4 2 6 0s4-2 6 0" stroke="currentColor" strokeWidth="2" fill="none" />;
      case ZodiacSign.Pisces:
        return <path d="M5 5c4 4 4 10 0 14 M19 5c-4 4-4 10 0 14 M5 12h14" stroke="currentColor" strokeWidth="2" fill="none" />;
      default:
        return <circle cx="12" cy="12" r="10" />;
    }
  };

  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {getPath(sign)}
    </svg>
  );
};
