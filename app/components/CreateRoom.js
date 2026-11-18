"use client";

import { useRef, useState } from "react";
import CuyDorado from "./CuyDorado";

const PRESET_OPTIONS = [10, 25, 30, 40, 50];

const CATEGORIAS_LISTA = [
  { id: "cultura_peruana", nombre: "Cultura Peruana", emoji: "🇵🇪", desc: "Historia, tradiciones y gastronomía" },
  { id: "doble_sentido", nombre: "Doble sentido", emoji: "😏🔥", desc: "Humor pícaro y preguntas capciosas" },
  { id: "cotidiano", nombre: "Cotidiano", emoji: "☕", desc: "Sentido común y vida diaria" },
  { id: "animales", nombre: "Animales", emoji: "🐾", desc: "Fauna, récords y curiosidades" },
];

export default function CreateRoom({ user, onRoomCreated, onBack }) {
  const [selectedCount, setSelectedCount] = useState(25); // Default is 25 as requested
  const [selectedCategory, setSelectedCategory] = useState("cultura_peruana"); // Default category
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const creating = useRef(false);
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
    if (creating.current || createdSala) return;
    creating.current = true;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userFoto: user.picture,
          cantidadPreguntas: selectedCount,
          categoria: selectedCategory,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear la sala");

      setCreatedSala(data.sala);
    } catch (e) {
      setError(e.message);
    } finally {
      creating.current = false;
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

  const catObj = CATEGORIAS_LISTA.find(c => c.id === (createdSala?.categoria || selectedCategory));

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
              <span className="spec-label">Categoría:</span>
              <span className="spec-val" style={{ color: "var(--gold-accent)" }}>
                {catObj?.emoji} {catObj?.nombre}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Preguntas:</span>
              <span className="spec-val">{createdSala.cantidadPreguntas}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Capacidad:</span>
              <span className="spec-val">Máx. 4 jugadores</span>
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
            Personaliza tu partida de quiz con el Cuy Dorado
          </p>
        </div>

        <div className="config-body">
          {/* Categoría de Preguntas */}
          <div className="section-title-row" style={{ marginTop: "6px" }}>
            <span className="section-title">Temática de preguntas</span>
          </div>

          <div className="category-select-grid">
            {CATEGORIAS_LISTA.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill ${selectedCategory === cat.id ? "cat-selected" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <div className="cat-texts">
                  <span className="cat-name">{cat.nombre}</span>
                  <span className="cat-desc">{cat.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="welcome-divider" style={{ margin: "16px 0 14px" }}></div>

          {/* Cantidad de preguntas */}
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
                <span>{num} preguntas {num === 25 ? "(Por defecto)" : ""}</span>
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
              <span>Personalizado (1 a 50)</span>
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
            <span>Por defecto son 25 preguntas. Podrán unirse hasta 4 jugadores y se requerirán al menos 2 para iniciar la partida.</span>
          </div>
        </div>

        {error && (
          <div className="login-error-msg" style={{ margin: "14px 0 0" }}>
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
                <span>Generando sala con preguntas...</span>
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
