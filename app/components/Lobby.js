"use client";

import { useState, useEffect, useCallback } from "react";
import CuyDorado from "./CuyDorado";

const CATEGORIAS_MAP = {
  cultura_peruana: { nombre: "Cultura Peruana", emoji: "🇵🇪" },
  doble_sentido: { nombre: "Doble sentido", emoji: "😏🔥" },
  cotidiano: { nombre: "Cotidiano", emoji: "☕" },
  animales: { nombre: "Animales", emoji: "🐾" },
};

export default function Lobby({ user, sala, onStartGame, onBack }) {
  const [players, setPlayers] = useState([]);
  const [roomInfo, setRoomInfo] = useState(sala);
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);
  const [turnOrderIds, setTurnOrderIds] = useState([]);
  const [error, setError] = useState("");

  const fetchLobbyData = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/lobby?salaId=${sala.id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar sala");

      setError("");
      setPlayers(data.jugadores || []);
      setTurnOrderIds((current) =>
        current.filter((playerId) => data.jugadores?.some((player) => player.id === playerId))
      );
      if (data.sala) {
        setRoomInfo(data.sala);
        // If the room state changed to 'jugando', transition to GameScreen!
        if (data.sala.estado === 'jugando' && onStartGame) {
          onStartGame(data.sala);
        }
      }
    } catch (e) {
      setError(e.message);
    }
  }, [sala.id, onStartGame]);

  useEffect(() => {
    fetchLobbyData();
    // Poll every 1.5s for snappy multiplayer synchronization
    const interval = setInterval(fetchLobbyData, 1500);
    return () => clearInterval(interval);
  }, [fetchLobbyData]);

  function handleCopy(code) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleStartGame() {
    if (players.length < 2) return;
    setError("");
    setStarting(true);

    try {
      const res = await fetch("/api/rooms/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: sala.id,
          userId: user.id,
          turnOrderIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar partida");

      if (onStartGame) {
        onStartGame({ ...roomInfo, ...data.sala, estado: 'jugando' });
      }
    } catch (e) {
      setError(e.message);
      setStarting(false);
    }
  }

  // Build 4 slots
  const slots = [0, 1, 2, 3].map((idx) => {
    const player = players[idx] || null;
    return {
      slotNumber: idx + 1,
      player,
    };
  });

  const catMeta = CATEGORIAS_MAP[roomInfo.categoria] || CATEGORIAS_MAP.cultura_peruana;
  const isCreator = (roomInfo.creadorId === user.id) || (sala.creadorId === user.id);
  const turnNumberFor = (playerId) => turnOrderIds.indexOf(playerId);
  const canStart = players.length >= 2 && turnOrderIds.length === players.length;

  // Determine button color state for the creator:
  // < 2 players: disabled
  // == 2 players: verde opaco (opaque green)
  // >= 3 players: verde intenso (intense vibrant green)
  const isIntenseGreen = players.length >= 3;

  return (
    <div className="screen-wrapper fade-in">
      <div className="hud-card lobby-card">
        {/* Lobby Top Bar */}
        <div className="lobby-header-bar">
          <div className="lobby-brand">
            <CuyDorado size={44} />
            <div className="lobby-titles">
              <h1 className="lobby-main-title">SALA DE ESPERA</h1>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                <span className="lobby-room-badge">
                  {catMeta.emoji} {catMeta.nombre}
                </span>
                <span className="lobby-room-badge" style={{ background: "#25180e", color: "var(--text-dim)" }}>
                  {roomInfo.cantidadPreguntas || sala.cantidadPreguntas} preguntas
                </span>
              </div>
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
            {players.length < 2
              ? "Esperando que se una al menos 1 jugador más para poder iniciar la partida..."
            : isCreator
              ? "Asigna el orden tocando Turno junto a cada jugador."
              : `Esperando que el anfitrión (${roomInfo.creadorNombre || "el anfitrión"}) inicie la partida...`}
          </span>
        </div>

        {/* 4 Players Slots Grid */}
        <div className="players-slots-grid">
          {slots.map(({ slotNumber, player }) => {
            // Resolve player name robustly (support Google user name, state name, fallback)
            let displayName = `Jugador ${slotNumber}`;
            let displayPhoto = null;

            if (player) {
              if (player.id === user.id && user.name) {
                displayName = user.name;
                displayPhoto = user.picture || player.foto;
              } else if (player.nombre && !player.nombre.startsWith("Jugador ")) {
                displayName = player.nombre;
                displayPhoto = player.foto;
              } else {
                displayName = player.nombre || `Jugador ${slotNumber}`;
                displayPhoto = player.foto;
              }
            }

            return (
              <div
                key={slotNumber}
                className={`player-card-slot ${player ? "slot-occupied" : "slot-waiting"}`}
              >
                <div className="slot-badge-number">Slot {slotNumber}</div>
                {player && isCreator && (
                  <button
                    type="button"
                    aria-pressed={turnNumberFor(player.id) >= 0}
                    title={turnNumberFor(player.id) >= 0 ? "Quitar del orden" : "Asignar siguiente turno"}
                    onClick={() => setTurnOrderIds((current) =>
                      current.includes(player.id)
                        ? current.filter((id) => id !== player.id)
                        : [...current, player.id]
                    )}
                    style={{ position: "absolute", top: "34px", right: "12px", padding: "5px 10px", borderRadius: "8px", border: "1px solid var(--gold-accent)", background: turnNumberFor(player.id) >= 0 ? "rgba(242, 186, 76, 0.22)" : "#25180e", color: "var(--gold-primary)", cursor: "pointer" }}
                  >
                    {turnNumberFor(player.id) >= 0 ? `Turno ${turnNumberFor(player.id) + 1}` : "Turno"}
                  </button>
                )}
                {player && !isCreator && turnNumberFor(player.id) >= 0 && (
                  <span className="slot-badge-number" style={{ left: "12px", right: "auto" }}>Turno {turnNumberFor(player.id) + 1}</span>
                )}

                {player ? (
                  <div className="player-slot-content">
                    <div className="player-avatar-wrapper">
                      {displayPhoto ? (
                        <img
                          className="player-photo"
                          src={displayPhoto}
                          alt={displayName}
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
                      {player.id === (roomInfo.creadorId || sala.creadorId) && (
                        <span className="host-pill" title="Anfitrión de la sala">👑</span>
                      )}
                    </div>

                    {/* PLAYER FULL NAME DISPLAYED CLEARLY */}
                    <h3 className="player-display-name" title={displayName}>
                      {displayName}
                    </h3>

                  </div>
                ) : (
                  <div className="empty-slot-content">
                    <div className="empty-slot-icon">
                      <span>+</span>
                    </div>
                    <p className="empty-slot-label">Esperando explorador {slotNumber}...</p>
                    <p className="empty-slot-sub">Código: {roomInfo.codigo}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="login-error-msg" style={{ margin: "14px 0" }}>
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ACTION AREA: ONLY THE CREATOR CAN START THE GAME */}
        <div className="lobby-actions-center">
          {isCreator ? (
            <button
              type="button"
              className={`btn-start-game ${!canStart ? "btn-start-disabled" : isIntenseGreen ? "btn-start-intense" : "btn-start-opaque"}`}
              onClick={handleStartGame}
              disabled={!canStart || starting}
            >
              {starting ? (
                <span className="btn-spinner-content">
                  <span className="btn-spinner"></span>
                  <span>Iniciando partida...</span>
                </span>
              ) : players.length < 2 ? (
                "Esperando mínimo 2 jugadores para empezar"
              ) : turnOrderIds.length !== players.length ? (
                "Asigna el turno de cada jugador para empezar"
              ) : isIntenseGreen ? (
                `🔥 ¡Empezar partida! (${players.length} jugadores listos)`
              ) : (
                `Empezar partida (${players.length} jugadores)`
              )}
            </button>
          ) : (
            <div className="waiting-host-notice">
              <span className="waiting-host-crown">👑</span>
              <div className="waiting-host-texts">
                <strong>Esperando al anfitrión de la sala</strong>
                <p>Solo la persona que creó la sala ({roomInfo.creadorNombre || "el anfitrión"}) puede iniciar la partida.</p>
              </div>
            </div>
          )}
        </div>

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
