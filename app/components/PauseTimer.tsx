"use client";

import React, { useState, useEffect } from 'react';

// Componente ThemeToggle
const ThemeToggle: React.FC<{ isDark: boolean; toggleTheme: () => void }> = ({ 
  isDark, 
  toggleTheme 
}) => {
  return (
    <div className="absolute top-4 right-4 flex items-center">
      <label htmlFor="theme-toggle" className="flex items-center cursor-pointer">
        <div className="relative">
          <input 
            type="checkbox" 
            id="theme-toggle" 
            checked={isDark}
            onChange={toggleTheme}
            className="hidden"
          />
          <div className={`toggle-line w-12 h-6 bg-gray-400 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`}>
            <div className={`toggle-circle w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${isDark ? 'transform translate-x-6' : ''}`} />
          </div>
        </div>
      </label>
      <div className="ml-2">
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </div>
    </div>
  );
};

// Componente per l'input della durata della pausa
const PauseDurationInput: React.FC<{ 
  onStartPause: (duration: number) => void;
  isDark: boolean;
}> = ({ onStartPause, isDark }) => {
  const [duration, setDuration] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDuration = parseInt(duration, 10);
    if (!isNaN(parsedDuration) && parsedDuration > 0) {
      onStartPause(parsedDuration);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input 
          type="number" 
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Inserisci la durata della tua pausa"
          min="1"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                     text-2xl ${isDark ? 'text-white bg-gray-800 border-gray-700' : 'text-black bg-white border-gray-300'} font-sans
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          required
        />
        <button 
          type="submit" 
          className="w-full text-white py-2 rounded-md hover:opacity-90 transition duration-300 text-xl"
          style={{ backgroundColor: 'oklch(0.592 0.249 0.584)' }}
        >
          Avvia Pausa
        </button>
      </form>
    </div>
  );
};

// Componente per il conto alla rovescia
const PauseCountdown: React.FC<{ 
  duration: number;
  isDark: boolean;
}> = ({ duration, isDark }) => {
  const [remainingTime, setRemainingTime] = useState(duration * 60);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (remainingTime > 0 && !isPaused) {
      const timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
    if (remainingTime === 0) {
      setIsPaused(true); // Set isPaused to true when the timer reaches 0
      // Puoi aggiungere un'azione qui, per esempio, una notifica o reset
    }
  }, [remainingTime, isPaused]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="w-full h-full flex items-center justify-center p-6 font-sans">
      <div className="text-center">
        {isPaused ? (
          <div className={`text-6xl font-bold mb-8 ${isDark ? 'text-white' : 'text-black'}`}>
            Pausa terminata!
          </div>
        ) : (
          <>
            <h2 className={`text-6xl font-bold mb-8 ${isDark ? 'text-white' : 'text-black'}`}>Sono in pausa</h2>
            <div className={`text-4xl ${isDark ? 'text-white' : 'text-black'}`}>
              <div>La mia pausa termina tra:</div>
              <div className="mt-6">
                <span style={{ color: 'oklch(0.592 0.249 0.584)' }} className="text-7xl font-mono font-bold">
                  {minutes}m {seconds.toString().padStart(2, '0')}s
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Componente principale per gestire lo stato
export default function Page() {
  const [pauseDuration, setPauseDuration] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Controlla la preferenza del sistema
    if (typeof window !== 'undefined') {
      const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersColorScheme);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleStartPause = (duration: number) => {
    setPauseDuration(duration);
  };

  return (
    <div className={`w-screen h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
        body {
          font-family: 'Montserrat', sans-serif;
          margin: 0;
          padding: 0;
        }
      `}</style>
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      {pauseDuration === null ? (
        <PauseDurationInput onStartPause={handleStartPause} isDark={isDark} />
      ) : (
        <PauseCountdown duration={pauseDuration} isDark={isDark} />
      )}
    </div>
  );
}
