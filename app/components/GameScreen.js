"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CuyDorado from "./CuyDorado";

export default function GameScreen({ user, sala, onBackToMenu }) {
  // Phase management:
  // 1. "banner" (5 seconds: "Elija una opción solo cuando sea su turno")
  // 2. "countdown" (3 seconds: 3, 2, 1)
  // 3. "playing" (the game screen)
  const [phase, setPhase] = useState("banner");
  const [bannerSecondsLeft, setBannerSecondsLeft] = useState(5);
  const [countdownNum, setCountdownNum] = useState(3);

  // Room & game state from polling
  const [roomState, setRoomState] = useState(sala);
  const [players, setPlayers] = useState([]);

  // Active question modal for the player who pressed "Pregunta"
  const [myQuestion, setMyQuestion] = useState(null);
  const [selectedAlt, setSelectedAlt] = useState(null);
  const [answering, setAnswering] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [showAcertijoPicker, setShowAcertijoPicker] = useState(false);

  // Steal confirmation modal for the player attempting to steal
  const [showStealConfirm, setShowStealConfirm] = useState(false);
  const [showVictimPicker, setShowVictimPicker] = useState(false);
  const [selectedVictimId, setSelectedVictimId] = useState(null);
  const [selectedCardType, setSelectedCardType] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Global game over state
  const [winner, setWinner] = useState(null);
  const [endCountdown, setEndCountdown] = useState(30);

  // Error toast
  const [toastMsg, setToastMsg] = useState("");

  const busy = useRef(false);
  const actionEpoch = useRef(0);
  const revision = useRef(-1);
  const endTimerRef = useRef(null);
  const serverOffsetRef = useRef(0);

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  }

  // Initial 5-second banner timer
  useEffect(() => {
    if (roomState.inicioPartida || phase !== "banner") return;
    const interval = setInterval(() => {
      setBannerSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("countdown");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, roomState.inicioPartida]);

  // 3-second countdown timer
  useEffect(() => {
    if (roomState.inicioPartida || phase !== "countdown") return;
    const interval = setInterval(() => {
      setCountdownNum((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("playing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, roomState.inicioPartida]);

  useEffect(() => {
    if (!roomState.inicioPartida) return;

    function syncPhase() {
      const remaining = roomState.inicioPartida - (Date.now() + serverOffsetRef.current);
      if (remaining > 3000) {
        setPhase("banner");
        setBannerSecondsLeft(Math.ceil((remaining - 3000) / 1000));
      } else if (remaining > 0) {
        setPhase("countdown");
        setCountdownNum(Math.ceil(remaining / 1000));
      } else {
        setPhase("playing");
        setCountdownNum(0);
      }
    }

    syncPhase();
    const interval = setInterval(syncPhase, 100);
    return () => clearInterval(interval);
  }, [roomState.inicioPartida]);

  // Polling game room state every 1.5 seconds
  const fetchGameState = useCallback(async () => {
    const epoch = actionEpoch.current;
    try {
      const res = await fetch(`/api/rooms/lobby?salaId=${sala.id}&jugador=${encodeURIComponent(user.id)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (epoch !== actionEpoch.current || busy.current || data.revision < revision.current) return;
      revision.current = data.revision;
      const question = data.sala?.preguntaActiva;
      if (question?.jugadorId === user.id && question.alternativas) {
        setMyQuestion(question);
        setShowAcertijoPicker(!!question.esperandoAcertijo);
      } else {
        setMyQuestion(null);
        setShowAcertijoPicker(false);
        setAnswering(false);
      }
      if (typeof data.serverNow === "number") {
        serverOffsetRef.current = data.serverNow - Date.now();
      }
      setPlayers(data.jugadores || []);
      if (data.sala) {
        setRoomState(data.sala);
        if (data.sala.ganador) {
          setWinner(data.sala.ganador);
        } else {
          setWinner(null);
        }
      }
    } catch (e) {
      console.error("Error polling game:", e);
    }
  }, [sala.id, user.id]);

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 1500);
    return () => clearInterval(interval);
  }, [fetchGameState]);

  // 30-second return to menu countdown when game ends
  useEffect(() => {
    if (winner) {
      setEndCountdown(30);
      endTimerRef.current = setInterval(() => {
        setEndCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(endTimerRef.current);
            onBackToMenu();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (endTimerRef.current) clearInterval(endTimerRef.current);
    }
    return () => {
      if (endTimerRef.current) clearInterval(endTimerRef.current);
    };
  }, [winner, onBackToMenu]);

  // Is it current user's turn?
  const isMyTurn = roomState.turnoActual === user.id;
  const isCreator = roomState.creadorId === user.id;
  const turnActionLocked = !!roomState.preguntaActiva || !!roomState.alertaRobo?.activo;

  // Active question from someone else
  const otherPlayerAnswering =
    roomState.preguntaActiva && roomState.preguntaActiva.jugadorId !== user.id
      ? roomState.preguntaActiva
      : null;

  // Global steal alert from someone else
  const stealAlertActive =
    roomState.alertaRobo && roomState.alertaRobo.activo && roomState.alertaRobo.ladronId !== user.id
      ? roomState.alertaRobo
      : null;

  // --------------------------------------------------------------------------
  // ACTION 1: PREGUNTA
  // --------------------------------------------------------------------------
  async function handlePressPregunta() {
    if (!isMyTurn) {
      showToast("⏳ Espera tu turno. Solo puedes pedir pregunta cuando sea tu turno.");
      return;
    }
    if (winner) return;

    if (busy.current) return;
    actionEpoch.current++;
    busy.current = true;
    setActionLoading(true);
    try {
      const res = await fetch("/api/rooms/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: sala.id,
          userId: user.id,
          action: "PEDIR_PREGUNTA",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMyQuestion(data.pregunta);
      setAnswering(false);
      setSelectedAlt(null);
      setFeedbackMsg("");
      setShowAcertijoPicker(false);
      fetchGameState();
    } catch (e) {
      showToast(e.message);
    } finally {
      actionEpoch.current++;
      busy.current = false;
      setActionLoading(false);
    }
  }

  async function handleAnswerSubmit(altText, index) {
    if (!myQuestion || answering || busy.current) return;
    actionEpoch.current++;
    busy.current = true;
    setAnswering(true);
    setSelectedAlt(index);

    const letterMap = ["A", "B", "C", "D"];
    const chosenLetter = letterMap[index];

    try {
      const res = await fetch("/api/rooms/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: sala.id,
          userId: user.id,
          action: "RESPONDER_PREGUNTA",
          data: { alternativaSeleccionada: chosenLetter },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.correcto) {
        setFeedbackMsg("¡CORRECTO! 🌟 Has respondido bien.");
        setShowAcertijoPicker(true);
      } else {
        setFeedbackMsg("❌ RESPUESTA INCORRECTA. Tu turno ha terminado.");
        showToast(data.mensaje);
        setMyQuestion(null);
        setAnswering(false);
      }
    } catch (e) {
      showToast(e.message);
      setAnswering(false);
    } finally {
      actionEpoch.current++;
      busy.current = false;
    }
  }

  async function handlePickAcertijo(tipo) {
    if (busy.current) return;
    actionEpoch.current++;
    busy.current = true;
    setActionLoading(true);
    try {
      const res = await fetch("/api/rooms/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: sala.id,
          userId: user.id,
          action: "ELEGIR_ACERTIJO",
          data: { tipoAcertijo: tipo },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMyQuestion(null);
      setShowAcertijoPicker(false);
      setAnswering(false);

      if (data.gano) {
        setWinner(data.ganador);
        showToast("👑 ¡HAS GANADO LA PARTIDA! Has reunido la tríada sagrada: Sol, Río y Montaña.");
      } else {
        showToast(`✨ ¡Carta ${tipo.toUpperCase()} añadida a tu inventario!`);
      }
      fetchGameState();
    } catch (e) {
      showToast(e.message);
    } finally {
      actionEpoch.current++;
      busy.current = false;
      setActionLoading(false);
    }
  }

  // --------------------------------------------------------------------------
  // ACTION 2: ROBAR
  // --------------------------------------------------------------------------
  async function handlePressRobar() {
    if (!isMyTurn) {
      showToast("⏳ Espera tu turno. Solo puedes robar cuando sea tu turno.");
      return;
    }
    if (winner) return;

    // Check if any other player has at least 1 card to steal
    const otherPlayersWithCards = players.filter(
      (p) => p.id !== user.id && p.cartas && (p.cartas.sol > 0 || p.cartas.rio > 0 || p.cartas.montana > 0)
    );

    if (otherPlayersWithCards.length === 0) {
      showToast("Ningún otro explorador tiene cartas de acertijo para robar todavía.");
      return;
    }

    if (busy.current) return;
    actionEpoch.current++;
    busy.current = true;
    setActionLoading(true);
    try {
      const res = await fetch("/api/rooms/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: sala.id,
          userId: user.id,
          action: "ALERTA_ROBAR",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setShowStealConfirm(true);
      fetchGameState();
    } catch (e) {
      showToast(e.message);
    }
    finally {
      actionEpoch.current++;
      busy.current = false;
      setActionLoading(false);
    }
  }

  async function handlePassTurn() {
    if (!isMyTurn || turnActionLocked || winner) return;
    if (busy.current) return;
    actionEpoch.current++;
    busy.current = true;
    setActionLoading(true);
    try {
      const res = await fetch("/api/rooms/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salaId: sala.id, userId: user.id, action: "PASAR_TURNO" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("Turno pasado al siguiente jugador.");
      fetchGameState();
    } catch (e) {
      showToast(e.message);
    } finally {
      actionEpoch.current++;
      busy.current = false;
      setActionLoading(false);
    }
  }

  async function handleCancelSteal() {
    setShowStealConfirm(false);
    setShowVictimPicker(false);
    try {
      const res = await fetch("/api/rooms/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: sala.id,
          userId: user.id,
          action: "CANCELAR_ROBO",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      fetchGameState();
    } catch (e) {
      showToast(e.message);
    }
  }

  function handleConfirmSteal() {
    setShowStealConfirm(false);
    setShowVictimPicker(true);
  }

  async function handleExecuteSteal(victimaId, tipoCarta) {
    if (busy.current) return;
    actionEpoch.current++;
    busy.current = true;
    setActionLoading(true);
    try {
      const res = await fetch("/api/rooms/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: sala.id,
          userId: user.id,
          action: "EJECUTAR_ROBO",
          data: {
            victimaId,
            tipoAcertijo: tipoCarta,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowVictimPicker(false);
      setSelectedVictimId(null);
      setSelectedCardType(null);

      if (data.gano) {
        setWinner(data.ganador);
        showToast("👑 ¡HAS GANADO AL ROBAR LA ÚLTIMA CARTA! Completaste Sol, Río y Montaña.");
      } else {
        showToast(`🦹 ¡Le has robado con éxito la carta ${data.cartaRobada?.toUpperCase()}!`);
      }
      fetchGameState();
    } catch (e) {
      showToast(e.message);
    } finally {
      actionEpoch.current++;
      busy.current = false;
      setActionLoading(false);
    }
  }

  // --------------------------------------------------------------------------
  // ACTION 3: REVANCHA
  // --------------------------------------------------------------------------
  async function handleRevancha() {
    if (busy.current) return;
    actionEpoch.current++;
    busy.current = true;
    setActionLoading(true);
    try {
      const res = await fetch("/api/rooms/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: sala.id,
          userId: user.id,
          action: "REVANCHA",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setWinner(null);
      setMyQuestion(null);
      setShowAcertijoPicker(false);
      setShowStealConfirm(false);
      setShowVictimPicker(false);
      setPhase("banner");
      setBannerSecondsLeft(5);
      setCountdownNum(3);
      showToast("🔥 ¡REVANCHA INICIADA! Nueva partida con las cartas limpias.");
      fetchGameState();
    } catch (e) {
      showToast(e.message);
    } finally {
      actionEpoch.current++;
      busy.current = false;
      setActionLoading(false);
    }
  }

  // --------------------------------------------------------------------------
  const startingPlayerIndex = players.findIndex((player) => player.id === roomState.turnoActual);
  const turnOrder = roomState.ordenTurnos?.length
    ? roomState.ordenTurnos.map((playerId) => players.find((player) => player.id === playerId)).filter(Boolean)
    : startingPlayerIndex < 0
      ? players
      : [...players.slice(startingPlayerIndex), ...players.slice(0, startingPlayerIndex)];

  // RENDER: PHASE 1 (5s Banner)
  // --------------------------------------------------------------------------
  if (phase === "banner") {
    return (
      <div className="screen-wrapper fade-in">
        <div className="hud-card initial-banner-card">
          <div className="cuy-badge-container">
            <div className="cuy-badge">
              <CuyDorado size={58} />
            </div>
          </div>
          <h2 className="banner-alert-title">¡ATENCIÓN EXPLORADORES!</h2>
          <div className="banner-message-box">
            <p className="banner-main-text">
              "Elija una opción solo cuando sea su turno"
            </p>
          </div>
          <p className="banner-timer-note">
            Iniciando la partida en {bannerSecondsLeft}s...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: PHASE 2 (3s Countdown)
  // --------------------------------------------------------------------------
  if (phase === "countdown") {
    return (
      <div className="screen-wrapper fade-in">
        <div className="hud-card countdown-card">
          <div className="cuy-badge" style={{ margin: "0 auto 16px" }}>
            <CuyDorado size={48} />
          </div>
          <h3 className="countdown-label">LA PARTIDA COMIENZA EN</h3>
          <div className="countdown-big-number">{countdownNum}</div>
          <div style={{ marginTop: "14px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            {turnOrder.map((player, index) => (
              <span key={player.id} className="lobby-room-badge">
                Turno {index + 1}: {player.id === user.id ? "Tú" : player.nombre}
              </span>
            ))}
          </div>
          <p className="countdown-sub">¡Prepárense para responder o robar!</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: PHASE 3 (Main Game Board)
  // --------------------------------------------------------------------------
  const currentTurnPlayer = players.find((p) => p.id === roomState.turnoActual);
  const currentTurnName = currentTurnPlayer ? currentTurnPlayer.nombre.split(" ")[0] : "Explorador";

  return (
    <div className="screen-wrapper fade-in">
      <div className="hud-card game-board-card">
        {/* Top Header */}
        <div className="game-top-bar">
          <div className="game-brand">
            <CuyDorado size={38} />
            <div>
              <span className="game-room-code">SALA #{roomState.codigo}</span>
              <span className="game-category-tag">
                {roomState.categoria ? roomState.categoria.replace("_", " ").toUpperCase() : "QUIZPEKUY"}
              </span>
            </div>
          </div>

          {/* Current Turn Badge */}
          <div className={`turn-indicator-pill ${isMyTurn ? "turn-is-mine" : "turn-is-other"}`}>
            <span className="turn-pulse-dot"></span>
            <span>
              {isMyTurn ? "✨ ¡ES TU TURNO!" : `👉 Turno de: ${currentTurnName}`}
            </span>
          </div>
        </div>

        {/* Global Toast / Alert */}
        {toastMsg && (
          <div className="game-toast fade-in">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* GLOBAL ALERT: Someone else is stealing! */}
        {stealAlertActive && (
          <div className="steal-global-alert fade-in">
            <span className="alert-siren">🚨</span>
            <div className="steal-alert-text">
              <strong>¡ALERTA EN LA SALA!</strong>
              <p>{stealAlertActive.mensaje}</p>
            </div>
          </div>
        )}

        {/* GLOBAL ALERT: Someone else is answering a question! */}
        {otherPlayerAnswering && (
          <div className="other-answering-banner fade-in">
            <div className="answering-tag">
              <span>📜</span>
              <span>{otherPlayerAnswering.jugadorNombre} está respondiendo:</span>
            </div>
            <p className="other-question-text">"{otherPlayerAnswering.texto}"</p>
            <span className="alternatives-hidden-tag">
              🔒 Alternativas ocultas para los demás exploradores
            </span>
          </div>
        )}

        {/* WINNER SCREEN / CELEBRATION */}
        {winner && (
          <div className="winner-overlay-card fade-in">
            <div className="cuy-badge-container">
              <div className="cuy-badge">
                <CuyDorado size={68} />
              </div>
            </div>
            <div className="winner-crown-icon">👑</div>
            <h1 className="winner-headline">¡TENEMOS UN GANADOR!</h1>
            <p className="winner-player-name">{winner.nombre}</p>
            <p className="winner-lore">
              Ha conseguido la sagrada tríada andina: <strong>Sol ☀️, Río 🌊 y Montaña ⛰️</strong>
            </p>

            <div className="winner-triad-display">
              <div className="triad-badge gold-glow">☀️ SOL</div>
              <div className="triad-badge blue-glow">🌊 RÍO</div>
              <div className="triad-badge green-glow">⛰️ MONTAÑA</div>
            </div>

            <p className="auto-redirect-note">
              Volviendo al menú en <strong>{endCountdown}</strong> segundos automáticamente...
            </p>

            <div className="winner-actions-row">
              {isCreator && (
                <button
                  type="button"
                  className="btn-revancha"
                  onClick={handleRevancha}
                  disabled={actionLoading}
                >
                  🔄 ¡Revancha! (Volver a jugar)
                </button>
              )}
              <button
                type="button"
                className="secondary-back-btn"
                onClick={onBackToMenu}
              >
                Volver al menú principal
              </button>
            </div>
          </div>
        )}

        {/* ALL PLAYERS DISPLAY (Circles with name on top, cards below) */}
        <div className="players-horizontal-roster">
          {players.map((p) => {
            const isTurn = roomState.turnoActual === p.id;
            const isMe = p.id === user.id;
            const rawName = (isMe && user.name) ? user.name : (p.nombre || "Explorador");
            const firstName = rawName.split(" ")[0];
            const displayPhoto = (isMe && user.picture) ? user.picture : p.foto;
            const cartas = p.cartas || { sol: 0, rio: 0, montana: 0 };

            return (
              <div
                key={p.id}
                className={`player-circle-item ${isTurn ? "item-active-turn" : ""} ${isMe ? "item-is-me" : ""}`}
              >
                {/* Player Name ON TOP of circle as requested */}
                <span className="player-roster-name" title={rawName}>
                  {firstName} {isMe ? "(Tú)" : ""}
                </span>

                {/* Profile Circle */}
                <div className="player-circle-avatar-wrapper">
                  {displayPhoto ? (
                    <img
                      className="player-circle-avatar"
                      src={displayPhoto}
                      alt={rawName}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="player-circle-fallback">
                      <CuyDorado size={36} />
                    </div>
                  )}

                  {isTurn && <span className="turn-crown-tag">⚡</span>}
                </div>

                {/* Acertijo Cards Acquired (Sol, Río, Montaña) */}
                <div className="player-cards-row">
                  <div
                    className={`card-acertijo-chip ${cartas.sol > 0 ? "chip-obtained-sol" : "chip-empty"}`}
                    title={`Sol: ${cartas.sol}`}
                  >
                    ☀️ {cartas.sol > 0 && <span className="card-qty">{cartas.sol}</span>}
                  </div>
                  <div
                    className={`card-acertijo-chip ${cartas.rio > 0 ? "chip-obtained-rio" : "chip-empty"}`}
                    title={`Río: ${cartas.rio}`}
                  >
                    🌊 {cartas.rio > 0 && <span className="card-qty">{cartas.rio}</span>}
                  </div>
                  <div
                    className={`card-acertijo-chip ${cartas.montana > 0 ? "chip-obtained-montana" : "chip-empty"}`}
                    title={`Montaña: ${cartas.montana}`}
                  >
                    ⛰️ {cartas.montana > 0 && <span className="card-qty">{cartas.montana}</span>}
                  </div>
                </div>

                {/* Victory Progress Indicator */}
                <span className="triad-progress-text">
                  {cartas.sol >= 1 && cartas.rio >= 1 && cartas.montana >= 1
                    ? "¡Tríada completa! 🏆"
                    : `${(cartas.sol > 0 ? 1 : 0) + (cartas.rio > 0 ? 1 : 0) + (cartas.montana > 0 ? 1 : 0)} / 3 tipos`}
                </span>
              </div>
            );
          })}
        </div>

        {/* MAIN GAME ACTIONS (Pregunta y Robar) */}
        {!winner && (
          <div className="main-game-actions-panel">
            <div className="action-hint-banner">
              {isMyTurn ? (
                <span className="hint-highlight">
                  🎯 Es tu turno: ¡Pide una pregunta para ganar una carta o roba la carta de otro explorador!
                </span>
              ) : (
                <span>Espera tu turno para seleccionar una opción.</span>
              )}
            </div>

            <div className="two-buttons-grid">
              {/* BUTTON 1: PREGUNTA */}
              <button
                type="button"
                className={`game-big-btn btn-pregunta ${isMyTurn && !turnActionLocked ? "btn-active-glow" : "btn-muted"}`}
                onClick={handlePressPregunta}
                disabled={!isMyTurn || turnActionLocked || actionLoading || !!myQuestion || !!winner}
              >
                <div className="btn-icon-circle">📜</div>
                <div className="btn-label-group">
                  <span className="btn-action-name">{actionLoading ? "Procesando…" : "Pregunta"}</span>
                  <span className="btn-action-sub">Responde y gana un acertijo</span>
                </div>
              </button>

              {/* BUTTON 2: ROBAR */}
              <button
                type="button"
                className={`game-big-btn btn-robar ${isMyTurn && !turnActionLocked ? "btn-active-glow" : "btn-muted"}`}
                onClick={handlePressRobar}
                disabled={!isMyTurn || turnActionLocked || actionLoading || !!myQuestion || !!winner}
              >
                <div className="btn-icon-circle">🦹</div>
                <div className="btn-label-group">
                  <span className="btn-action-name">Robar</span>
                  <span className="btn-action-sub">Róbale una carta a un rival</span>
                </div>
              </button>
            </div>
            <button type="button" className="secondary-back-btn" onClick={handlePassTurn} disabled={!isMyTurn || turnActionLocked || actionLoading || !!winner} style={{ marginTop: "14px" }}>Pasar turno</button>
          </div>
        )}

        {/* MODAL 1: PREGUNTA ACTIVA CON 4 ALTERNATIVAS (Solo para quien la pidió) */}
        {myQuestion && (
          <div className="modal-backdrop fade-in">
            <div className="question-modal-card">
              <div className="modal-header">
                <span className="modal-badge-number">PREGUNTA #{myQuestion.numero}</span>
                <span className="modal-rule-tag">Solo visible para ti</span>
              </div>

              <h2 className="modal-question-text">{myQuestion.texto}</h2>

              {/* 4 Alternatives */}
              <div className="alternatives-grid">
                {myQuestion.alternativas.map((alt, idx) => {
                  const letter = ["A", "B", "C", "D"][idx];
                  const isSelected = selectedAlt === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`alt-option-btn ${isSelected ? "alt-selected" : ""}`}
                      onClick={() => handleAnswerSubmit(alt, idx)}
                      disabled={answering || showAcertijoPicker}
                    >
                      <span className="alt-letter">{letter}</span>
                      <span className="alt-text">{alt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback text */}
              {feedbackMsg && (
                <div className={`answer-feedback ${showAcertijoPicker ? "feedback-success" : "feedback-error"}`}>
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {/* PICK ACERTIJO: Sol, Río o Montaña */}
              {showAcertijoPicker && (
                <div className="acertijo-picker-box fade-in">
                  <h3 className="picker-title">¿Qué carta acertijo eliges para tu inventario?</h3>
                  <p className="picker-hint">
                    Recuerda: Para ganar necesitas 1 de cada tipo (Sol, Río y Montaña). ¡No ganas con repetidos!
                  </p>
                  <div className="picker-buttons-row">
                    <button
                      type="button"
                      className="btn-card-choose btn-choose-sol"
                      onClick={() => handlePickAcertijo("sol")}
                      disabled={actionLoading}
                    >
                      <span className="choose-icon">☀️</span>
                      <span className="choose-name">Sol</span>
                    </button>

                    <button
                      type="button"
                      className="btn-card-choose btn-choose-rio"
                      onClick={() => handlePickAcertijo("rio")}
                      disabled={actionLoading}
                    >
                      <span className="choose-icon">🌊</span>
                      <span className="choose-name">Río</span>
                    </button>

                    <button
                      type="button"
                      className="btn-card-choose btn-choose-montana"
                      onClick={() => handlePickAcertijo("montana")}
                      disabled={actionLoading}
                    >
                      <span className="choose-icon">⛰️</span>
                      <span className="choose-name">Montaña</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: CONFIRMACIÓN DE ROBO (Paso o Estoy seguro) */}
        {(showStealConfirm || (roomState.alertaRobo?.activo && roomState.alertaRobo.ladronId === user.id && !showVictimPicker)) && (
          <div className="modal-backdrop fade-in">
            <div className="steal-confirm-dialog">
              <div className="steal-dialog-icon">🦹</div>
              <h2 className="steal-dialog-title">¿Seguro que quiere robar?</h2>
              <p className="steal-dialog-desc">
                Se notificará a todos en la sala que vas a realizar un robo de carta acertijo.
              </p>

              <div className="steal-dialog-buttons">
                <button
                  type="button"
                  className="btn-step-pass"
                  onClick={handleCancelSteal}
                >
                  Paso (Cancelar)
                </button>
                <button
                  type="button"
                  className="btn-step-sure"
                  onClick={handleConfirmSteal}
                >
                  Estoy seguro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: ELEGIR A QUÉ JUGADOR Y QUÉ CARTA ROBAR */}
        {showVictimPicker && (
          <div className="modal-backdrop fade-in">
            <div className="victim-picker-dialog">
              <h2 className="victim-picker-title">Elige a qué jugador robar</h2>
              <p className="victim-picker-subtitle">
                Puedes robar una carta de cualquier usuario que tenga al menos un acertijo:
              </p>

              <div className="victim-list">
                {players
                  .filter((p) => p.id !== user.id)
                  .map((p) => {
                    const cartas = p.cartas || { sol: 0, rio: 0, montana: 0 };
                    const hasCards = cartas.sol > 0 || cartas.rio > 0 || cartas.montana > 0;

                    return (
                      <div
                        key={p.id}
                        className={`victim-item-card ${!hasCards ? "victim-no-cards" : ""}`}
                      >
                        <div className="victim-item-info">
                          <span className="victim-name">{p.nombre}</span>
                          <span className="victim-cards-count">
                            {hasCards
                              ? `Tiene: ${cartas.sol > 0 ? `☀️ Sol(${cartas.sol}) ` : ""}${cartas.rio > 0 ? `🌊 Río(${cartas.rio}) ` : ""}${cartas.montana > 0 ? `⛰️ Montaña(${cartas.montana})` : ""}`
                              : "No tiene cartas"}
                          </span>
                        </div>

                        {hasCards ? (
                          <div className="victim-card-options">
                            {cartas.sol > 0 && (
                              <button
                                type="button"
                                className="steal-card-btn"
                                onClick={() => handleExecuteSteal(p.id, "sol")}
                                disabled={actionLoading}
                              >
                                Robar ☀️ Sol
                              </button>
                            )}
                            {cartas.rio > 0 && (
                              <button
                                type="button"
                                className="steal-card-btn"
                                onClick={() => handleExecuteSteal(p.id, "rio")}
                                disabled={actionLoading}
                              >
                                Robar 🌊 Río
                              </button>
                            )}
                            {cartas.montana > 0 && (
                              <button
                                type="button"
                                className="steal-card-btn"
                                onClick={() => handleExecuteSteal(p.id, "montana")}
                                disabled={actionLoading}
                              >
                                Robar ⛰️ Montaña
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="no-cards-tag">Sin cartas</span>
                        )}
                      </div>
                    );
                  })}
              </div>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button
                  type="button"
                  className="secondary-back-btn"
                  onClick={handleCancelSteal}
                >
                  Cancelar robo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Back Button */}
        <div className="game-footer-bar">
          <button
            type="button"
            className="secondary-back-btn"
            onClick={onBackToMenu}
          >
            ← Salir al menú principal
          </button>
        </div>
      </div>
    </div>
  );
}
