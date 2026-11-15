"use client";

import { useState, useEffect, useCallback } from "react";
import CuyDorado from "./CuyDorado";

export default function Lobby({ user, sala, onBack }) {
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [roomInfo, setRoomInfo] = useState(sala);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const fetchLobbyData = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/lobby?salaId=${sala.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar sala");

      setPlayers(data.jugadores || []);
      setQuestions(data.preguntas || []);
      if (data.sala) setRoomInfo(data.sala);
    } catch (e) {
      setError(e.message);
    }
  }, [sala.id]);

  useEffect(() => {
    fetchLobbyData();
    // Poll every 2 seconds for real-time multiplayer updates
    const interval = setInterval(fetchLobbyData, 2000);
    return () => clearInterval(interval);
  }, [fetchLobbyData]);

  function handleCopy(code) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Build 4 slots
  const slots = [0, 1, 2, 3].map((idx) => {
    const player = players[idx] || null;
    let assignedQuestion = null;
    if (player) {
      assignedQuestion = questions.find((q) => q.asignadaA === player.id);
    }
    return {
      slotNumber: idx + 1,
      player,
      assignedQuestion,
    };
  });

  return (
    <div className="screen-wrapper fade-in">
      <div className="hud-card lobby-card">
        {/* Lobby Top Bar */}
        <div className="lobby-header-bar">
          <div className="lobby-brand">
            <CuyDorado size={42} />
            <div className="lobby-titles">
              <h1 className="lobby-main-title">SALA DE ESPERA</h1>
              <span className="lobby-room-badge">
                Partida de {roomInfo.cantidadPreguntas || sala.cantidadPreguntas} preguntas
              </span>
            </div>
          </div>

          <div className="lobby-code-pill" onClick={() => handleCopy(roomInfo.codigo)}>
            <span className="code-pill-label">CÓDIGO:</span>
            <span className="code-pill-number">{roomInfo.codigo}</span>
            <span className="code-pill-copy">{copied ? "✓ Copiado" : "📋"}</span>
          </div>
        </div>

        {/* Player Count & Instructions */}
        <div className="lobby-status-banner">
          <div className="status-indicator">
            <span className="status-dot-pulse"></span>
            <span className="status-text">
              Jugadores conectados: <strong>{players.length} / 4</strong>
            </span>
          </div>
          <span className="status-hint">
            {players.length < 4
              ? `Esperando ${4 - players.length} jugador${4 - players.length > 1 ? "es" : ""} más para completar la sala...`
              : "¡Sala completa! Todos los exploradores están listos."}
          </span>
        </div>

        {/* 4 Players Slots Grid */}
        <div className="players-slots-grid">
          {slots.map(({ slotNumber, player, assignedQuestion }) => (
            <div
              key={slotNumber}
              className={`player-card-slot ${player ? "slot-occupied" : "slot-waiting"}`}
            >
              <div className="slot-badge-number">Slot {slotNumber}</div>

              {player ? (
                <div className="player-slot-content">
                  <div className="player-avatar-wrapper">
                    {player.foto ? (
                      <img
                        className="player-photo"
                        src={player.foto}
                        alt={player.nombre}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="player-photo-cuy">
                        <CuyDorado size={44} />
                      </div>
                    )}
                    {player.id === user.id && (
                      <span className="you-pill">TÚ</span>
                    )}
                  </div>

                  <h3 className="player-display-name">
                    {player.nombre}
                  </h3>

                  {/* Question Section - ONLY question text, NO alternatives */}
                  <div className="player-question-container">
                    <div className="question-header-tag">
                      <span>📜</span>
                      <span>Pregunta asignada #{assignedQuestion ? assignedQuestion.numero : slotNumber}</span>
                    </div>

                    {assignedQuestion ? (
                      <div className="question-text-box">
                        <p className="question-text">
                          "{assignedQuestion.texto}"
                        </p>
                        <span className="alternatives-hidden-tag">
                          🔒 Alternativas ocultas durante la espera
                        </span>
                      </div>
                    ) : (
                      <p className="question-assigning-note">
                        Asignando pregunta del banco...
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="empty-slot-content">
                  <div className="empty-slot-icon">
                    <span>+</span>
                  </div>
                  <p className="empty-slot-label">Esperando explorador {slotNumber}...</p>
                  <p className="empty-slot-sub">Comparte el código {roomInfo.codigo}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="login-error-msg" style={{ margin: "16px 0 0" }}>
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Lobby Actions */}
        <div className="lobby-footer-actions">
          <button
            type="button"
            className="secondary-back-btn"
            onClick={onBack}
          >
            ← Salir de la sala
          </button>
        </div>
      </div>
    </div>
  );
}
