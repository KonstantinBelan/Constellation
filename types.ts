export enum ZodiacSign {
  Aries = 'Овен',
  Taurus = 'Телец',
  Gemini = 'Близнецы',
  Cancer = 'Рак',
  Leo = 'Лев',
  Virgo = 'Дева',
  Libra = 'Весы',
  Scorpio = 'Скорпион',
  Sagittarius = 'Стрелец',
  Capricorn = 'Козерог',
  Aquarius = 'Водолей',
  Pisces = 'Рыбы',
}

export enum Gender {
  Male = 'Мужской',
  Female = 'Женский',
  Other = 'Другой'
}

export type HoroscopePeriod = 'Today' | 'Tomorrow' | 'Week' | 'Month';
export type HoroscopeStyle = 'Serious' | 'Humorous';

export interface UserProfile {
  name: string;
  sign: ZodiacSign | null;
  gender: Gender;
  focus: string; // 'Общий', 'Любовь', 'Карьера', 'Здоровье'
  period: HoroscopePeriod;
  style: HoroscopeStyle;
}

export interface HoroscopeScores {
  love: number;
  career: number;
  health: number;
  general: number;
}

export interface HoroscopeResponse {
  date: string;
  general: string;
  love: string;
  career: string;
  health: string;
  luckyColor: string;
  luckyNumber: string;
  mood: string;
  advice: string;
  scores: HoroscopeScores;
}

export interface HistoryItem extends HoroscopeResponse {
  id: string;
  timestamp: number;
  profile: UserProfile;
}