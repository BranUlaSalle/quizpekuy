"use client";

import { useState, useRef } from "react";
import CuyDorado from "./CuyDorado";

export default function JoinRoom({ user, onRoomJoined, onBack }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  function handleDigitChange(index, val) {
    setError("");
    const cleaned = val.replace(/\D/g, "");

    if (cleaned.length === 0) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    if (cleaned.length === 1) {
      const next = [...digits];
      next[index] = cleaned;
      setDigits(next);

      if (index < 3) {
        inputsRef.current[index + 1]?.focus();
      }

      // Check if all 4 are filled
      if (index === 3 && next.every((d) => d !== "")) {
        submitJoin(next.join(""));
      }
    } else if (cleaned.length >= 4) {
      // Paste multi-digit
      const pasted = cleaned.slice(0, 4).split("");
      setDigits(pasted);
      inputsRef.current[3]?.focus();
      submitJoin(pasted.join(""));
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const next = pasted.split("");
      setDigits(next);
      inputsRef.current[3]?.focus();
      submitJoin(pasted);
    }
  }

  async function submitJoin(code) {
    const fullCode = code || digits.join("");
    if (fullCode.length !== 4) {
      setError("Por favor ingresa los 4 dígitos del código de la sala");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userFoto: user.picture,
          codigo: fullCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo ingresar a la sala");

      onRoomJoined(data.sala);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen-wrapper fade-in">
      <div className="hud-card join-card">
        <div className="cuy-badge-container">
          <div className="cuy-badge">
            <CuyDorado size={48} />
          </div>
        </div>

        <h1 className="join-title">UNIRSE A UNA SALA</h1>
        <p className="join-subtitle">
          Ingresa el código único de 4 dígitos proporcionado por el creador de la sala
        </p>

        {/* 4-digit code input boxes */}
        <div className="code-input-row" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className={`code-digit-box ${digit ? "digit-filled" : ""}`}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              autoFocus={index === 0}
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <div className="login-error-msg" style={{ margin: "16px auto", maxWidth: "340px" }}>
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Action button */}
        <div className="join-actions">
          <button
            type="button"
            className="login-primary-btn"
            onClick={() => submitJoin()}
            disabled={loading || digits.some((d) => d === "")}
          >
            {loading ? (
              <span className="btn-spinner-content">
                <span className="btn-spinner"></span>
                <span>Buscando sala...</span>
              </span>
            ) : (
              "Ingresar a la sala"
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
