import React from 'react';

interface InnovexaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  animated?: boolean;
}

export const InnovexaLogo: React.FC<InnovexaLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  className = '',
  animated = false,
}) => {
  // Dimensions map
  const dimensions = {
    xs: { icon: 24, text: 'text-sm', badge: 'text-[9px]', tag: 'text-[8px]' },
    sm: { icon: 32, text: 'text-lg', badge: 'text-[10px]', tag: 'text-[9px]' },
    md: { icon: 42, text: 'text-2xl', badge: 'text-[10px]', tag: 'text-[10px]' },
    lg: { icon: 54, text: 'text-3xl', badge: 'text-xs', tag: 'text-[11px]' },
    xl: { icon: 68, text: 'text-4xl', badge: 'text-xs', tag: 'text-xs' },
    hero: { icon: 84, text: 'text-5xl', badge: 'text-sm', tag: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Vibrant Vector Icon */}
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        {/* Ambient Vibrant Glow Ring */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />

        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full relative z-10 drop-shadow-xl ${animated ? 'animate-[spin_20s_linear_infinite]' : ''}`}
        >
          <defs>
            {/* Gradient 1: Electric Cyan to Royal Blue */}
            <linearGradient id="innovexa-cyan-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5FF" />
              <stop offset="50%" stopColor="#0080FF" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>

            {/* Gradient 2: Neon Emerald to Teal */}
            <linearGradient id="innovexa-emerald-teal" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            {/* Gradient 3: Vibrant Violet & Magenta Accent */}
            <linearGradient id="innovexa-violet-pink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="60%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>

            {/* Gradient 4: Core Radiant Beacon */}
            <radialGradient id="innovexa-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#38BDF8" />
              <stop offset="70%" stopColor="#2563EB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0" />
            </radialGradient>

            {/* Drop Shadow Filter */}
            <filter id="innovexa-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00E5FF" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Outer Rounded Hexagonal Facet 1 (Left wing) */}
          <path
            d="M 50 8 
               L 86 28 
               L 86 72 
               L 50 92 
               L 14 72 
               L 14 28 Z"
            fill="#090D1A"
            stroke="url(#innovexa-cyan-blue)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Facet Top-Right Shard */}
          <path
            d="M 50 8 
               L 86 28 
               L 50 50 Z"
            fill="url(#innovexa-cyan-blue)"
            opacity="0.9"
          />

          {/* Facet Right Wing Ribbon */}
          <path
            d="M 86 28 
               L 86 72 
               L 50 50 Z"
            fill="url(#innovexa-violet-pink)"
            opacity="0.85"
          />

          {/* Facet Bottom-Center Wing */}
          <path
            d="M 86 72 
               L 50 92 
               L 50 50 Z"
            fill="url(#innovexa-cyan-blue)"
            opacity="0.75"
          />

          {/* Facet Bottom-Left Wing Ribbon */}
          <path
            d="M 50 92 
               L 14 72 
               L 50 50 Z"
            fill="url(#innovexa-emerald-teal)"
            opacity="0.9"
          />

          {/* Facet Top-Left Ribbon */}
          <path
            d="M 14 72 
               L 14 28 
               L 50 50 Z"
            fill="url(#innovexa-emerald-teal)"
            opacity="0.75"
          />

          {/* Inner Geometric Star Nexus */}
          <polygon
            points="50,22 62,38 78,50 62,62 50,78 38,62 22,50 38,38"
            fill="#050B14"
            stroke="url(#innovexa-cyan-blue)"
            strokeWidth="2"
            opacity="0.95"
          />

          {/* Dynamic Pinpoint Civic Beacon / Node (Center) */}
          <circle cx="50" cy="50" r="14" fill="url(#innovexa-core-glow)" filter="url(#innovexa-glow)" />
          <circle cx="50" cy="50" r="6" fill="#FFFFFF" />

          {/* Satellite Coordinate Reticle Accents */}
          <circle cx="50" cy="50" r="34" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.6" />
          <line x1="50" y1="12" x2="50" y2="20" stroke="#00F5FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="80" x2="50" y2="88" stroke="#00F5FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="50" x2="24" y2="50" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="76" y1="50" x2="84" y2="50" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />

          {/* Precision Micro Nodes */}
          <circle cx="50" cy="16" r="2.5" fill="#FFFFFF" />
          <circle cx="84" cy="50" r="2.5" fill="#FFFFFF" />
          <circle cx="50" cy="84" r="2.5" fill="#FFFFFF" />
          <circle cx="16" cy="50" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography: INNOVEXA */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight ${dimensions.text} text-white flex items-center`}>
              <span>INNOV</span>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                EXA
              </span>
            </span>
            <span
              className={`font-mono font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 ${dimensions.badge}`}
            >
              CIVIC
            </span>
          </div>
          {showTagline && (
            <p className={`text-slate-400 font-medium tracking-wide mt-0.5 ${dimensions.tag}`}>
              Civic Intelligence & Infrastructure
            </p>
          )}
        </div>
      )}
    </div>
  );
};
