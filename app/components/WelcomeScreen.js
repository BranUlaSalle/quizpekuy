"use client";

import CuyDorado from "./CuyDorado";

export default function WelcomeScreen({ user, onCreateRoom, onJoinRoom, onLogout }) {
  // Extract user's first name
  let firstName = "Explorador";
  if (user?.name) {
    const parts = user.name.trim().split(/\s+/);
    firstName = parts[0];
  } else if (user?.email) {
    const raw = user.email.split("@")[0].split(/[._-]/)[0];
    firstName = raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  const isFirstTime = Boolean(user?.isFirstTime);

  return (
    <div className="screen-wrapper fade-in">
      <div className="hud-card welcome-card">
        {/* Cuy Dorado Icon with badge */}
        <div className="welcome-avatar-area">
          {user?.picture ? (
            <div className="avatar-ring-container">
              <img
                className="welcome-user-photo"
                src={user.picture}
                alt={user.name || "Usuario"}
                referrerPolicy="no-referrer"
              />
              <div className="cuy-mini-badge">
                <CuyDorado size={28} />
              </div>
            </div>
          ) : (
            <div className="cuy-avatar-circle">
              <CuyDorado size={68} />
            </div>
          )}
        </div>

        {/* Dynamic Welcome Heading */}
        <div className="welcome-greetings">
          <p className="welcome-subtitle-tag">
            {isFirstTime ? "¡BIENVENIDO!" : "¡BIENVENIDO DE NUEVO!"}
          </p>
          <h1 className="welcome-user-name">{firstName}</h1>
          <p className="welcome-email-badge">
            <span>🎓</span> {user?.email}
          </p>
        </div>

        <div className="welcome-divider"></div>

        {/* Action Buttons: Unirse a sala & Crear sala */}
        <div className="welcome-actions-grid">
          <button
            type="button"
            className="action-btn join-btn"
            onClick={onJoinRoom}
          >
            <div className="action-btn-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <div className="action-btn-text">
              <span className="action-title">Unirse a sala</span>
              <span className="action-desc">Ingresa un código de 4 dígitos</span>
            </div>
          </button>

          <button
            type="button"
            className="action-btn create-btn"
            onClick={onCreateRoom}
          >
            <div className="action-btn-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div className="action-btn-text">
              <span className="action-title">Crear sala</span>
              <span className="action-desc">Configura tu propia partida</span>
            </div>
          </button>
        </div>

        {/* Logout button */}
        <div className="welcome-footer">
          <button type="button" className="logout-text-btn" onClick={onLogout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
