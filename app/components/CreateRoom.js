"use client";

import { useState } from "react";
import CuyDorado from "./CuyDorado";

const PRESET_OPTIONS = [10, 25, 30, 40, 50];

export default function CreateRoom({ user, onRoomCreated, onBack }) {
  const [selectedCount, setSelectedCount] = useState(25); // Default is 25 as requested
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdSala, setCreatedSala] = useState(null);
  const [copied, setCopied] = useState(false);

  function handleSelectPreset(val) {
    setSelectedCount(val);
    setIsCustom(false);
    setCustomValue("");
    setError("");
  }

  function handleCustomChange(e) {
    const val = e.target.value;
    setCustomValue(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      if (parsed > 50) {
        setSelectedCount(50);
        setError("El límite máximo es de 50 preguntas");
      } else if (parsed < 1) {
        setSelectedCount(1);
        setError("El mínimo es de 1 pregunta");
      } else {
        setSelectedCount(parsed);
        setError("");
      }
    }
  }

  async function handleCreateRoomSubmit() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          cantidadPreguntas: selectedCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear la sala");

      setCreatedSala(data.sala);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopyCode(code) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Room created confirmation view
  if (createdSala) {
    return (
      <div className="screen-wrapper fade-in">
        <div className="hud-card confirmation-card">
          <div className="cuy-badge-container">
            <div className="cuy-badge">
              <CuyDorado size={54} />
            </div>
          </div>

          <h2 className="room-created-title">¡SALA CREADA CON ÉXITO!</h2>
          <p className="room-created-subtitle">
            Comparte este código de 4 dígitos con tus compañeros para que se unan a la partida:
          </p>

          <div className="room-code-box" onClick={() => handleCopyCode(createdSala.codigo)}>
            <span className="room-code-tag">CÓDIGO DE ACCESO</span>
            <div className="room-code-digits">
              {createdSala.codigo.split("").map((digit, i) => (
                <span key={i} className="code-digit-display">{digit}</span>
              ))}
            </div>
            <button type="button" className="copy-code-btn">
              {copied ? "✓ Copiado al portapapeles" : "📋 Copiar código"}
            </button>
          </div>

          <div className="room-specs-list">
            <div className="spec-item">
              <span className="spec-label">Preguntas:</span>
              <span className="spec-val">{createdSala.cantidadPreguntas}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Capacidad:</span>
              <span className="spec-val">Máx. 4 jugadores</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Estado:</span>
              <span className="spec-val status-waiting">Esperando jugadores</span>
            </div>
          </div>

          <button
            type="button"
            className="login-primary-btn"
            onClick={() => onRoomCreated(createdSala)}
            style={{ marginTop: "24px" }}
          >
            Entrar a la Sala de Espera →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-wrapper fade-in">
      <div className="hud-card config-card">
        <div className="config-header">
          <div className="cuy-badge" style={{ margin: "0 auto 12px" }}>
            <CuyDorado size={48} />
          </div>
          <h1 className="config-title">CREAR NUEVA SALA</h1>
          <p className="config-subtitle">
            Elige la cantidad de preguntas para tu partida de quiz
          </p>
        </div>

        <div className="config-body">
          <div className="section-title-row">
            <span className="section-title">Cantidad de preguntas</span>
            <span className="current-count-badge">{selectedCount} preguntas</span>
          </div>

          {/* Presets Grid */}
          <div className="presets-grid">
            {PRESET_OPTIONS.map((num) => (
              <button
                key={num}
                type="button"
                className={`preset-pill ${!isCustom && selectedCount === num ? "preset-selected" : ""}`}
                onClick={() => handleSelectPreset(num)}
              >
                {num} preguntas {num === 25 ? "(Por defecto)" : ""}
              </button>
            ))}

            {/* Custom Option */}
            <button
              type="button"
              className={`preset-pill ${isCustom ? "preset-selected" : ""}`}
              onClick={() => {
                setIsCustom(true);
                if (!customValue) setCustomValue(String(selectedCount));
              }}
            >
              Personalizado
            </button>
          </div>

          {/* Custom Input Field when selected */}
          {isCustom && (
            <div className="custom-input-container fade-in">
              <label htmlFor="custom-count" className="custom-input-label">
                Ingresa una cantidad (de 1 a 50 preguntas):
              </label>
              <div className="custom-input-wrapper">
                <input
                  id="custom-count"
                  type="number"
                  min="1"
                  max="50"
                  className="custom-number-input"
                  placeholder="25"
                  value={customValue}
                  onChange={handleCustomChange}
                  autoFocus
                />
                <span className="input-suffix">preguntas</span>
              </div>
            </div>
          )}

          <div className="config-info-note">
            <span className="info-icon">ℹ</span>
            <span>Por defecto son 25 preguntas, pero puedes elegir hasta un máximo de 50. La sala soportará hasta 4 jugadores simultáneos.</span>
          </div>
        </div>

        {error && (
          <div className="login-error-msg" style={{ margin: "16px 0 0" }}>
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="config-actions">
          <button
            type="button"
            className="login-primary-btn"
            onClick={handleCreateRoomSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner-content">
                <span className="btn-spinner"></span>
                <span>Generando código y sala...</span>
              </span>
            ) : (
              "Crear sala de juego"
            )}
          </button>

          <button
            type="button"
            className="secondary-back-btn"
            onClick={onBack}
            disabled={loading}
          >
            ← Volver al menú
          </button>
        </div>
      </div>
    </div>
  );
}
