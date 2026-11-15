"use client";

export default function HudFrame() {
  return (
    <>
      {/* Left HUD Bracket */}
      <div className="hud-bracket hud-left" aria-hidden="true">
        <svg viewBox="0 0 120 700" fill="none" preserveAspectRatio="none">
          <path
            d="M 60 40 
               L 15 40 
               L 15 260 
               L 45 310 
               L 45 390 
               L 15 440 
               L 15 660 
               L 60 660"
            stroke="#a36e22"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          />
          {/* Subtle accent notches */}
          <line x1="15" y1="200" x2="25" y2="200" stroke="#d49b38" strokeWidth="2" opacity="0.8" />
          <line x1="15" y1="500" x2="25" y2="500" stroke="#d49b38" strokeWidth="2" opacity="0.8" />
          <circle cx="45" cy="350" r="3" fill="#e5aa3c" opacity="0.9" />
        </svg>
      </div>

      {/* Right HUD Bracket */}
      <div className="hud-bracket hud-right" aria-hidden="true">
        <svg viewBox="0 0 120 700" fill="none" preserveAspectRatio="none">
          <path
            d="M 60 40 
               L 105 40 
               L 105 260 
               L 75 310 
               L 75 390 
               L 105 440 
               L 105 660 
               L 60 660"
            stroke="#a36e22"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          />
          <line x1="105" y1="200" x2="95" y2="200" stroke="#d49b38" strokeWidth="2" opacity="0.8" />
          <line x1="105" y1="500" x2="95" y2="500" stroke="#d49b38" strokeWidth="2" opacity="0.8" />
          <circle cx="75" cy="350" r="3" fill="#e5aa3c" opacity="0.9" />
        </svg>
      </div>
    </>
  );
}
