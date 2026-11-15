"use client";

export default function CuyDorado({ size = 52, showCrown = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        {/* Cuy fur gradient */}
        <radialGradient id="cuyFur" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#f5ca68" />
          <stop offset="60%" stopColor="#d89a32" />
          <stop offset="100%" stopColor="#9e6616" />
        </radialGradient>

        {/* Snout gradient */}
        <radialGradient id="cuySnout" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffe6b8" />
          <stop offset="100%" stopColor="#f3be6e" />
        </radialGradient>

        {/* Crown gradient */}
        <linearGradient id="cuyCrown" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff3a8" />
          <stop offset="40%" stopColor="#e5a828" />
          <stop offset="100%" stopColor="#9c660c" />
        </linearGradient>

        {/* Ruby gem */}
        <radialGradient id="crownRuby" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ff7878" />
          <stop offset="60%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>

        {/* Glow */}
        <filter id="cuyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#d89a32" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#cuyGlow)">
        {/* Left Ear */}
        <ellipse cx="28" cy="38" rx="10" ry="12" fill="#c48524" transform="rotate(-20 28 38)" />
        <ellipse cx="28" cy="39" rx="6" ry="8" fill="#e89e7a" transform="rotate(-20 28 39)" />

        {/* Right Ear */}
        <ellipse cx="72" cy="38" rx="10" ry="12" fill="#c48524" transform="rotate(20 72 38)" />
        <ellipse cx="72" cy="39" rx="6" ry="8" fill="#e89e7a" transform="rotate(20 72 39)" />

        {/* Head/Body */}
        <ellipse cx="50" cy="58" rx="36" ry="32" fill="url(#cuyFur)" />

        {/* Cheeks/Whiskers highlight */}
        <ellipse cx="32" cy="64" rx="7" ry="5" fill="#f87171" opacity="0.45" />
        <ellipse cx="68" cy="64" rx="7" ry="5" fill="#f87171" opacity="0.45" />

        {/* Snout Area */}
        <ellipse cx="50" cy="66" rx="16" ry="13" fill="url(#cuySnout)" />

        {/* Cute Nose */}
        <path d="M47 62 C48 60, 52 60, 53 62 C54 64, 52 66, 50 67 C48 66, 46 64, 47 62 Z" fill="#993b22" />

        {/* Mouth */}
        <path d="M50 67 L50 70 M47 70 Q50 72 53 70" stroke="#782d18" strokeWidth="1.5" strokeLinecap="round" />

        {/* Whiskers Left */}
        <line x1="36" y1="65" x2="22" y2="63" stroke="#8c581e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="36" y1="68" x2="21" y2="70" stroke="#8c581e" strokeWidth="1.2" strokeLinecap="round" />

        {/* Whiskers Right */}
        <line x1="64" y1="65" x2="78" y2="63" stroke="#8c581e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="64" y1="68" x2="79" y2="70" stroke="#8c581e" strokeWidth="1.2" strokeLinecap="round" />

        {/* Left Eye */}
        <ellipse cx="37" cy="52" rx="4.5" ry="5.5" fill="#1e1104" />
        <circle cx="36" cy="50" r="1.8" fill="#ffffff" />
        <circle cx="39" cy="54" r="0.8" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="63" cy="52" rx="4.5" ry="5.5" fill="#1e1104" />
        <circle cx="62" cy="50" r="1.8" fill="#ffffff" />
        <circle cx="65" cy="54" r="0.8" fill="#ffffff" />

        {/* Golden Crown */}
        {showCrown && (
          <g>
            <path
              d="M36 28 L40 16 L50 22 L60 16 L64 28 Z"
              fill="url(#cuyCrown)"
              stroke="#804e04"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Crown Base */}
            <path d="M35 28 Q50 30 65 28 L64 31 Q50 33 36 31 Z" fill="#b07a16" />
            
            {/* Crown Jewels */}
            <circle cx="40" cy="16" r="2" fill="url(#crownRuby)" />
            <circle cx="50" cy="22" r="2.5" fill="url(#crownRuby)" />
            <circle cx="60" cy="16" r="2" fill="url(#crownRuby)" />
            
            {/* Center Crown Sparkle */}
            <circle cx="50" cy="27" r="1.5" fill="#fff" opacity="0.9" />
          </g>
        )}
      </g>
    </svg>
  );
}
