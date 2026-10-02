import React from 'react';

export const CartoonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic colorful sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-sky-950" />

      {/* Floating Rainbow Glow Arc */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[360px] opacity-25 blur-3xl pointer-events-none rounded-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 to-cyan-500" 
      />

      {/* Distant Twinkling Cartoon Stars */}
      <div className="absolute inset-0 opacity-40">
        <span className="absolute top-[8%] left-[12%] text-amber-200 text-xs animate-pulse">✦</span>
        <span className="absolute top-[15%] left-[85%] text-yellow-300 text-sm animate-pulse" style={{ animationDelay: '1s' }}>★</span>
        <span className="absolute top-[22%] left-[30%] text-cyan-200 text-xs animate-pulse" style={{ animationDelay: '1.5s' }}>✦</span>
        <span className="absolute top-[18%] left-[70%] text-pink-300 text-xs animate-pulse" style={{ animationDelay: '0.7s' }}>★</span>
        <span className="absolute top-[35%] left-[8%] text-amber-300 text-xs animate-pulse" style={{ animationDelay: '2s' }}>★</span>
        <span className="absolute top-[28%] left-[92%] text-emerald-200 text-xs animate-pulse" style={{ animationDelay: '1.2s' }}>✦</span>
      </div>

      {/* Fluffy Cartoon Clouds Layer 1 (Slow) */}
      <div className="absolute top-10 left-0 right-0 w-full animate-cloud-slow opacity-20">
        <svg className="w-[600px] h-20 text-white fill-current mx-auto" viewBox="0 0 100 35">
          <path d="M20,30 Q10,30 10,20 Q10,10 25,12 Q30,5 45,7 Q55,2 65,10 Q80,7 85,18 Q95,18 95,28 Q95,30 80,30 Z" />
        </svg>
      </div>

      {/* Fluffy Cartoon Clouds Layer 2 (Faster, offset) */}
      <div className="absolute top-28 left-0 right-0 w-full animate-cloud-fast opacity-15">
        <div className="flex justify-between max-w-5xl mx-auto px-4">
          <svg className="w-44 h-14 text-sky-200 fill-current" viewBox="0 0 100 35">
            <path d="M20,30 Q10,30 10,20 Q10,10 25,12 Q30,5 45,7 Q55,2 65,10 Q80,7 85,18 Q95,18 95,28 Q95,30 80,30 Z" />
          </svg>
          <svg className="w-52 h-16 text-sky-200 fill-current" viewBox="0 0 100 35">
            <path d="M20,30 Q10,30 10,20 Q10,10 25,12 Q30,5 45,7 Q55,2 65,10 Q80,7 85,18 Q95,18 95,28 Q95,30 80,30 Z" />
          </svg>
        </div>
      </div>

      {/* Distant Whimsical Castle Silhouette in Horizon */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
        <svg className="w-56 sm:w-80 h-28 text-indigo-400 fill-current" viewBox="0 0 200 80">
          {/* Main Castle base */}
          <rect x="75" y="45" width="50" height="35" rx="3" />
          {/* Central Tower */}
          <rect x="85" y="25" width="30" height="25" />
          <polygon points="85,25 100,5 115,25" />
          {/* Left Tower */}
          <rect x="60" y="35" width="20" height="40" />
          <polygon points="60,35 70,18 80,35" />
          {/* Right Tower */}
          <rect x="120" y="35" width="20" height="40" />
          <polygon points="120,35 130,18 140,35" />
          {/* Flag */}
          <line x1="100" y1="5" x2="100" y2="0" stroke="currentColor" strokeWidth="2" />
          <polygon points="100,0 110,3 100,6" />
        </svg>
      </div>

      {/* Whimsical Rolling Cartoon Hills Layer (Distant) */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 opacity-35">
        <svg className="w-full h-full text-emerald-950 fill-current preserve-3d" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,80 Q300,10 600,60 T1200,40 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Whimsical Rolling Cartoon Hills Layer (Foreground with Trees) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 opacity-50">
        <svg className="w-full h-full text-emerald-900 fill-current" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path d="M0,40 Q250,75 500,30 T1000,50 Q1100,30 1200,45 L1200,80 L0,80 Z" />
        </svg>
      </div>

      {/* Tiny Cartoon Trees on the Hills */}
      <div className="absolute bottom-2 left-6 opacity-30 text-emerald-300 text-lg hidden sm:block">🌲 🌳 🌲</div>
      <div className="absolute bottom-2 right-8 opacity-30 text-emerald-300 text-lg hidden sm:block">🌳 🌲 🌳</div>
    </div>
  );
};
