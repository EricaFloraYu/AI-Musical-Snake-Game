import React from "react";
import MusicPlayer from "./components/MusicPlayer";
import SnakeGame from "./components/SnakeGame";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] font-sans overflow-x-hidden relative flex flex-col items-center justify-start p-4 pt-12 static-noise">
      {/* Background Neon Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none mix-blend-screen opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#0ff_2px,#0ff_4px)]"></div>
      
      <header className="mb-8 text-center z-10 screen-tear">
        <h1 className="text-7xl font-black tracking-tighter text-[#f0f] glitch-text uppercase">
          SYSTEM.SNAKE_
        </h1>
        <p className="text-[#0ff] font-mono text-2xl tracking-widest mt-2 uppercase">
          [ AUDIO_MATRIX_SYNC_ESTABLISHED ]
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        {/* Left Column: Music Player */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <MusicPlayer />
          
          {/* Decorative Element */}
          <div className="hidden lg:block p-6 border-2 border-[#f0f] bg-black shadow-[4px_4px_0px_#0ff]">
            <h3 className="text-[#f0f] font-mono text-2xl uppercase tracking-widest mb-4 glitch-text">DIAGNOSTICS</h3>
            <div className="space-y-3 font-mono text-xl text-[#0ff]">
              <div className="flex justify-between border-b border-[#0ff]/30 pb-1">
                <span>MEM_ALLOC</span>
                <span className="text-[#f0f]">0xFA4B</span>
              </div>
              <div className="flex justify-between border-b border-[#0ff]/30 pb-1">
                <span>NEURAL_LINK</span>
                <span className="text-[#0ff] animate-pulse">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-[#0ff]/30 pb-1">
                <span>CORRUPTION</span>
                <span className="text-[#f0f]">99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Game */}
        <div className="lg:col-span-8 flex justify-center">
          <SnakeGame />
        </div>
      </main>
    </div>
  );
}
