/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SnakeGame } from "./components/SnakeGame";
import { MusicPlayer } from "./components/MusicPlayer";

export default function App() {
  return (
    <div className="min-h-screen w-full flex justify-center bg-[#020205] text-[#e0e0e0] font-mono selection:bg-[#39ff14]/30 overflow-x-hidden md:overflow-hidden lg:h-screen p-4 md:p-6">
      <div className="w-full max-w-6xl flex flex-col gap-6 h-full">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/10 pb-4 gap-4 flex-shrink-0 relative">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-50">System Interface v4.0</span>
            <h1 className="text-4xl font-bold neon-text uppercase tracking-wider text-[#39ff14] m-0">SYNTH // SNAKE</h1>
          </div>
          <div id="score-portal-target" className="flex gap-12 font-mono transition-all empty:hidden md:empty:flex"></div>
        </header>

        <main className="flex flex-col lg:flex-row flex-1 gap-6 overflow-hidden min-h-0">
          <section className="flex-1 flex flex-col gap-4 overflow-hidden min-h-[400px]">
             <SnakeGame />
          </section>

          <aside className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0 lg:overflow-y-auto">
             <div className="flex-1 glass neon-border flex flex-col p-4">
               <MusicPlayer />
             </div>
             
            <div className="hidden lg:flex h-24 glass border border-white/10 p-4 flex-col justify-center flex-shrink-0 mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] uppercase opacity-50">System Load</span>
                <span className="text-[10px] neon-text">Optimal</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                {[...Array(5)].map((_, i) => <div key={i} className="h-2 bg-green-500/40 rounded-sm"></div>)}
                {[...Array(2)].map((_, i) => <div key={i+5} className="h-2 bg-green-500/20 rounded-sm"></div>)}
                {[...Array(5)].map((_, i) => <div key={i+7} className="h-2 bg-white/5 rounded-sm"></div>)}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
