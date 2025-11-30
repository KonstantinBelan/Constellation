import React, { useState, useEffect } from 'react';
import { generateHoroscope } from './services/geminiService';
import { UserProfile, ZodiacSign, Gender, HoroscopeResponse, HoroscopePeriod, HoroscopeStyle, HistoryItem } from './types';
import { ZodiacIcon } from './components/ZodiacIcon';
import { Starfield } from './components/Starfield';

// --- Icons ---

const HistoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

// --- Components ---

const Header: React.FC<{ onHistoryClick: () => void, showHistoryBtn: boolean }> = ({ onHistoryClick, showHistoryBtn }) => (
  <header className="w-full py-4 px-4 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
    <div className="w-8"></div> {/* Spacer for centering */}
    <div className="text-center">
      <h1 className="text-xl font-extrabold uppercase tracking-widest text-black leading-none">
        Созвездие <span className="text-red-600">Мысли</span>
      </h1>
      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Персональный гороскоп</p>
    </div>
    <div className="w-8 flex justify-end">
      {showHistoryBtn && (
        <button onClick={onHistoryClick} className="text-gray-600 hover:text-black transition-colors">
          <HistoryIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  </header>
);

const Button: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}> = ({ onClick, children, disabled, variant = 'primary', className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
      ${variant === 'primary' 
        ? 'bg-black text-white shadow-lg shadow-gray-300 hover:bg-gray-800' 
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      } ${className}`}
  >
    {children}
  </button>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">{title}</label>
);

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<'intro' | 'form' | 'loading' | 'result' | 'history'>('intro');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    sign: null,
    gender: Gender.Male,
    focus: 'Общий',
    period: 'Today',
    style: 'Serious'
  });
  const [horoscope, setHoroscope] = useState<HoroscopeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('horoscope_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  // Auto-advance from intro
  useEffect(() => {
    if (step === 'intro') {
      const timer = setTimeout(() => setStep('form'), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const saveToHistory = (result: HoroscopeResponse, userProfile: UserProfile) => {
    const newItem: HistoryItem = {
      ...result,
      id: Date.now().toString(),
      timestamp: Date.now(),
      profile: userProfile
    };
    const updated = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(updated);
    localStorage.setItem('horoscope_history', JSON.stringify(updated));
  };

  const handleSignSelect = (sign: ZodiacSign) => {
    setProfile(prev => ({ ...prev, sign }));
  };

  const handleSubmit = async () => {
    if (!profile.sign) return;
    
    setStep('loading');
    setError(null);
    
    try {
      const result = await generateHoroscope(profile);
      setHoroscope(result);
      saveToHistory(result, profile);
      setStep('result');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при связи со звездами.');
      setStep('form');
    }
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    setHoroscope(item);
    // When viewing history, we might want to know it's a history item, 
    // but reusing 'result' step is easiest. 
    // We can just restore the profile to what it was for that item to display correct icon/name.
    setProfile(item.profile); 
    setStep('result');
  };

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-[80vh] fade-in px-6 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-black mb-2">Звезды говорят</h2>
      <p className="text-gray-500">Ваш путь начинается здесь.</p>
    </div>
  );

  const renderForm = () => (
    <div className="w-full max-w-md mx-auto px-4 pb-28 fade-in space-y-8 pt-4">
      {/* Name Input */}
      <div className="space-y-2">
        <SectionTitle title="Ваше имя" />
        <input 
          type="text" 
          value={profile.name}
          onChange={(e) => setProfile({...profile, name: e.target.value})}
          placeholder="Как к вам обращаться?"
          className="w-full bg-gray-50 border-b-2 border-gray-200 focus:border-black py-3 px-2 outline-none transition-colors text-lg rounded-t-lg"
        />
      </div>

      {/* Zodiac Grid */}
      <div className="space-y-2">
        <SectionTitle title="Знак Зодиака" />
        <div className="grid grid-cols-4 gap-2">
          {Object.values(ZodiacSign).map((sign) => (
            <button
              key={sign}
              onClick={() => handleSignSelect(sign)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-200 
                ${profile.sign === sign 
                  ? 'bg-black text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-black' 
                  : 'bg-white border border-gray-200 text-gray-400 hover:border-gray-400'
                }`}
            >
              <ZodiacIcon sign={sign} className="w-5 h-5 mb-1" />
              <span className="text-[8px] uppercase font-bold text-center leading-none">{sign}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Period Selection */}
      <div className="space-y-2">
        <SectionTitle title="Период" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { id: 'Today', label: 'Сегодня' },
            { id: 'Tomorrow', label: 'Завтра' },
            { id: 'Week', label: 'Неделя' },
            { id: 'Month', label: 'Месяц' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setProfile({...profile, period: p.id as HoroscopePeriod})}
              className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all
                ${profile.period === p.id
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Focus Selection */}
      <div className="space-y-2">
        <SectionTitle title="Что вас волнует?" />
        <div className="flex flex-wrap gap-2">
          {['Общий', 'Любовь', 'Карьера', 'Здоровье'].map(focus => (
            <button
              key={focus}
              onClick={() => setProfile({...profile, focus})}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${profile.focus === focus
                  ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-200'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'
                }`}
            >
              {focus}
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="space-y-2">
        <SectionTitle title="Стиль гороскопа" />
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'Serious', label: 'Серьезный' },
            { id: 'Humorous', label: 'Шуточный' }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setProfile({...profile, style: s.id as HoroscopeStyle})}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${profile.style === s.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="fixed bottom-6 left-0 w-full px-4 max-w-md mx-auto right-0 z-20">
        <Button onClick={handleSubmit} disabled={!profile.sign}>
           Узнать Судьбу
        </Button>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="w-full max-w-md mx-auto px-4 pb-20 fade-in pt-4">
      <div className="flex items-center mb-6">
        <button onClick={() => setStep('form')} className="p-2 -ml-2 text-gray-600 hover:text-black">
          <BackIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold ml-2">История звезд</h2>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p>История пуста.</p>
          <p className="text-sm">Получите свой первый гороскоп!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleHistoryItemClick(item)}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-black">
                  {item.profile.sign && <ZodiacIcon sign={item.profile.sign} className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-bold text-sm text-black">{item.date}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{item.profile.sign}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{item.profile.focus}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                 <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                   item.profile.style === 'Humorous' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                 }`}>
                   {item.profile.style === 'Humorous' ? 'Шутк' : 'Серьез'}
                 </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] fade-in px-6 text-center space-y-6">
       <div className="relative w-20 h-20">
         <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
         <div className="absolute inset-0 border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            {profile.sign && <ZodiacIcon sign={profile.sign} className="w-8 h-8 text-black opacity-50" />}
         </div>
       </div>
       <div>
         <h3 className="text-xl font-bold mb-2">Связь с космосом...</h3>
         <p className="text-sm text-gray-400 max-w-[250px] mx-auto">
            ИИ анализирует положение звезд для {profile.sign} на период "{profile.period === 'Today' ? 'Сегодня' : profile.period === 'Tomorrow' ? 'Завтра' : profile.period === 'Week' ? 'Неделю' : 'Месяц'}".
         </p>
       </div>
    </div>
  );

  const renderResult = () => {
    if (!horoscope) return null;

    return (
      <div className="w-full max-w-md mx-auto px-4 pb-24 fade-in pt-4 space-y-6">
        <button 
          onClick={() => setStep('form')}
          className="absolute top-20 left-4 p-2 bg-white/50 backdrop-blur rounded-full text-gray-600 hover:text-black z-10"
        >
          <BackIcon className="w-5 h-5" />
        </button>

        {/* Date Header */}
        <div className="text-center mb-6 pt-2">
           <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
             {horoscope.date}
           </div>
           <h2 className="text-3xl font-extrabold text-black flex items-center justify-center gap-2">
             {profile.sign && <ZodiacIcon sign={profile.sign} className="w-8 h-8 text-black" />}
             {profile.sign}
           </h2>
           <p className="text-gray-500 text-sm mt-1">
             {profile.name ? `${profile.name}` : 'Персональный прогноз'} • {profile.focus}
           </p>
        </div>

        {/* Mood Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
           <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Настроение</p>
           <p className="text-2xl font-bold">{horoscope.mood}</p>
        </div>

        {/* Lucky Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
             <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Цвет удачи</span>
             <span className="text-lg font-bold text-red-500 mt-1">{horoscope.luckyColor}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
             <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Число удачи</span>
             <span className="text-3xl font-black text-yellow-500 mt-1">{horoscope.luckyNumber}</span>
          </div>
        </div>

        {/* Content Blocks */}
        <div className="space-y-4">
           {/* General Section */}
           <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${profile.focus === 'Общий' ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'}`}>
              <h3 className="font-bold text-lg mb-2 flex items-center text-black">
                <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                Общее
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">{horoscope.general}</p>
           </div>
           
           {/* Love Section */}
           <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${profile.focus === 'Любовь' ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'}`}>
              <h3 className="font-bold text-lg mb-2 flex items-center text-red-500">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                Любовь и Отношения
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">{horoscope.love}</p>
           </div>

           {/* Career Section */}
           <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${profile.focus === 'Карьера' ? 'border-yellow-200 ring-1 ring-yellow-100' : 'border-gray-100'}`}>
              <h3 className="font-bold text-lg mb-2 flex items-center text-yellow-600">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                Карьера
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">{horoscope.career}</p>
           </div>

           {/* Health Section */}
           <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${profile.focus === 'Здоровье' ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-100'}`}>
              <h3 className="font-bold text-lg mb-2 flex items-center text-green-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Здоровье
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">{horoscope.health}</p>
           </div>

           {/* Advice Card */}
           <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-yellow-400">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Совет Звезд</p>
              <p className="text-gray-800 font-medium italic">"{horoscope.advice}"</p>
           </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
            <Button onClick={() => setStep('form')} variant="secondary">
              Новый прогноз
            </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Starfield />
      {step !== 'intro' && <Header onHistoryClick={() => setStep('history')} showHistoryBtn={step === 'form'} />}
      
      <main className="w-full mx-auto relative z-10">
        {step === 'intro' && renderIntro()}
        {step === 'form' && renderForm()}
        {step === 'loading' && renderLoading()}
        {step === 'result' && renderResult()}
        {step === 'history' && renderHistory()}
      </main>
    </div>
  );
}