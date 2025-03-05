"use client";

import React, { useState } from 'react';

// Componente per l'input della durata della pausa
export const PauseDurationInput: React.FC<{ 
  onStartPause: (duration: number) => void 
}> = ({ onStartPause }) => {
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
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                     text-2xl text-black font-sans
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          required
        />
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 text-xl"
        >
          Avvia Pausa
        </button>
      </form>
    </div>
  );
};

// Componente per il conto alla rovescia
export const PauseCountdown: React.FC<{ 
  duration: number 
}> = ({ duration }) => {
  const [remainingTime, setRemainingTime] = useState(duration * 60);

  React.useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="w-full h-full flex items-center justify-center p-6 font-sans">
      <div className="text-center">
        <h2 className="text-6xl font-bold mb-8 text-black">Sono in pausa</h2>
        <div className="text-4xl text-black">
          <div>La tua pausa termina tra:</div>
          <div className="mt-6">
            <span style={{ color: 'oklch(0.592 0.249 0.584)' }} className="text-7xl font-mono font-bold">
              {minutes}m {seconds.toString().padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principale per gestire lo stato
export const PauseTimer: React.FC = () => {
  const [pauseDuration, setPauseDuration] = useState<number | null>(null);

  const handleStartPause = (duration: number) => {
    setPauseDuration(duration);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
        body {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
      {pauseDuration === null ? (
        <PauseDurationInput onStartPause={handleStartPause} />
      ) : (
        <PauseCountdown duration={pauseDuration} />
      )}
    </div>
  );
};

export default PauseTimer;