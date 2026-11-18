import { NextResponse } from "next/server";
import { query, isUsingMemory, memoryStore, obtenerPreguntasPorCategoria } from "../../../lib/db";

// Checks victory condition: player must have 1 sol, 1 rio and 1 montana
function tieneTriadaGanadora(cartas) {
  if (!cartas) return false;
  return (cartas.sol >= 1) && (cartas.rio >= 1) && (cartas.montana >= 1);
}

// Next turn helper
function getNextPlayerId(players, currentUserId) {
  if (!players || players.length === 0) return null;
  const currentIndex = players.findIndex(p => String(p.usuario_id) === String(currentUserId));
  if (currentIndex === -1) return players[0].usuario_id;
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex].usuario_id;
}

export async function POST(request) {
  try {
    const { salaId, userId, action, data = {} } = await request.json();

    if (!salaId || !userId || !action) {
      return NextResponse.json({ error: "Parámetros incompletos" }, { status: 400 });
    }

    const idNumber = parseInt(salaId, 10);

    if (isUsingMemory()) {
      const sala = memoryStore.salas.find(s => s.id === idNumber);
      if (!sala) {
        return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
      }

      const players = memoryStore.salaJugadores
        .filter(sj => sj.sala_id === sala.id)
        .sort((a, b) => (a.orden_turno ?? 0) - (b.orden_turno ?? 0));
      const currentPlayerRecord = players.find(p => String(p.usuario_id) === String(userId));
      if (!currentPlayerRecord) {
        return NextResponse.json({ error: "Jugador no pertenece a esta sala" }, { status: 403 });
      }

      const userObj = memoryStore.usuarios.find(u => u.id_usuario === userId);
      const userName = userObj ? userObj.nombre : "Jugador";

      // ----------------------------------------------------------------------
      // 1. PEDIR PREGUNTA
      // ----------------------------------------------------------------------
      if (action === "PEDIR_PREGUNTA") {
        if (sala.estado !== "jugando") {
          return NextResponse.json({ error: "La partida no está en curso" }, { status: 409 });
        }

        if (String(sala.turno_actual) !== String(userId)) {
          return NextResponse.json({ error: "No es tu turno de responder" }, { status: 403 });
        }

        if (sala.pregunta_activa || sala.alerta_robo?.activo) {
          return NextResponse.json({ error: "Ya hay una opción en curso en la sala" }, { status: 409 });
        }

        // Get questions for this room
        const roomQs = memoryStore.preguntas.filter(q => q.sala_id === sala.id);
        const idx = (sala.indice_pregunta || 0) % (roomQs.length || 1);
        const q = roomQs[idx] || {
          numero: idx + 1,
          texto: "¿Cuál es el volcán tutelar de Arequipa?",
          alternativa_a: "Chachani",
          alternativa_b: "Misti",
          alternativa_c: "Pichu Pichu",
          alternativa_d: "Ampato",
          respuesta_correcta: "B",
        };
        sala.indice_pregunta = idx + 1;

        sala.pregunta_activa = {
          jugadorId: userId,
          jugadorNombre: userName,
          numero: q.numero || idx + 1,
          texto: q.texto,
          alternativas: [q.alternativa_a, q.alternativa_b, q.alternativa_c, q.alternativa_d],
          correcta: q.respuesta_correcta || "B",
          respondida: false,
          esperandoAcertijo: false,
        };

        // Return alternatives ONLY to the player who asked
        return NextResponse.json({
          ok: true,
          pregunta: {
            numero: sala.pregunta_activa.numero,
            texto: sala.pregunta_activa.texto,
            alternativas: sala.pregunta_activa.alternativas,
          },
        });
      }

      // ----------------------------------------------------------------------
      // 2. RESPONDER PREGUNTA
      // ----------------------------------------------------------------------
      if (action === "RESPONDER_PREGUNTA") {
        if (!sala.pregunta_activa ||
            String(sala.pregunta_activa.jugadorId) !== String(userId) ||
            sala.pregunta_activa.respondida ||
            String(sala.turno_actual) !== String(userId)) {
          return NextResponse.json({ error: "No hay una pregunta activa para ti" }, { status: 400 });
        }

        const { alternativaSeleccionada } = data; // e.g., 'A', 'B', 'C', 'D' o index 0..3
        let isCorrect = false;

        const correctLetter = sala.pregunta_activa.correcta.toUpperCase();
        if (typeof alternativaSeleccionada === "string") {
          const selUpper = alternativaSeleccionada.toUpperCase();
          if (selUpper === correctLetter) isCorrect = true;
          // check if they passed the full alternative text matching the correct one
          const mapLetters = ["A", "B", "C", "D"];
          const correctIdx = mapLetters.indexOf(correctLetter);
          if (correctIdx >= 0 && sala.pregunta_activa.alternativas[correctIdx] === alternativaSeleccionada) {
            isCorrect = true;
          }
        } else if (typeof alternativaSeleccionada === "number") {
          const mapLetters = ["A", "B", "C", "D"];
          if (mapLetters[alternativaSeleccionada] === correctLetter) isCorrect = true;
        }

        sala.pregunta_activa.respondida = true;

        if (isCorrect) {
          sala.pregunta_activa.esperandoAcertijo = true;
          return NextResponse.json({
            ok: true,
            correcto: true,
            mensaje: "¡Respuesta correcta! Elige tu carta acertijo (Sol, Río o Montaña).",
          });
        } else {
          // Incorrect: advance turn to next player
          sala.pregunta_activa = null;
          sala.turno_actual = getNextPlayerId(players, userId);

          return NextResponse.json({
            ok: true,
            correcto: false,
            mensaje: "Respuesta incorrecta. Pasa el turno al siguiente explorador.",
            siguienteTurno: sala.turno_actual,
          });
        }
      }

      // ----------------------------------------------------------------------
      // 3. ELEGIR ACERTIJO (Sol, Río, Montaña)
      // ----------------------------------------------------------------------
      if (action === "ELEGIR_ACERTIJO") {
        const { tipoAcertijo } = data; // "sol" | "rio" | "montana"
        if (!tipoAcertijo || !["sol", "rio", "montana"].includes(tipoAcertijo)) {
          return NextResponse.json({ error: "Tipo de acertijo inválido" }, { status: 400 });
        }
        if (!sala.pregunta_activa ||
            String(sala.pregunta_activa.jugadorId) !== String(userId) ||
            !sala.pregunta_activa.esperandoAcertijo ||
            String(sala.turno_actual) !== String(userId)) {
          return NextResponse.json({ error: "No tienes una respuesta correcta pendiente de elegir carta" }, { status: 409 });
        }

        if (!currentPlayerRecord.cartas) {
          currentPlayerRecord.cartas = { sol: 0, rio: 0, montana: 0 };
        }

        currentPlayerRecord.cartas[tipoAcertijo] = (currentPlayerRecord.cartas[tipoAcertijo] || 0) + 1;

        // Check victory condition: must have at least 1 sol, 1 rio, and 1 montana
        const gano = tieneTriadaGanadora(currentPlayerRecord.cartas);

        if (gano) {
          sala.ganador = { id: userId, nombre: userName };
          sala.estado = 'terminada';
          sala.tiempo_fin = Date.now() + 30000; // 30 seconds
        }

        // Clear active question and advance turn
        sala.pregunta_activa = null;
        if (!gano) {
          sala.turno_actual = getNextPlayerId(players, userId);
        }

        return NextResponse.json({
          ok: true,
          gano,
          cartas: currentPlayerRecord.cartas,
          ganador: sala.ganador,
          siguienteTurno: sala.turno_actual,
        });
      }

      // ----------------------------------------------------------------------
      // 4. ALERTA ROBAR
      // ----------------------------------------------------------------------
      if (action === "ALERTA_ROBAR") {
        if (sala.estado !== "jugando") {
          return NextResponse.json({ error: "La partida no está en curso" }, { status: 409 });
        }

        if (String(sala.turno_actual) !== String(userId)) {
          return NextResponse.json({ error: "No es tu turno de robar" }, { status: 403 });
        }

        if (sala.pregunta_activa || sala.alerta_robo?.activo) {
          return NextResponse.json({ error: "Ya hay una opción en curso en la sala" }, { status: 409 });
        }

        sala.alerta_robo = {
          activo: true,
          ladronId: userId,
          ladronNombre: userName,
          mensaje: `¡Alerta! ${userName} va a robar una carta acertijo...`,
        };

        return NextResponse.json({ ok: true, alertaRobo: sala.alerta_robo });
      }

      // ----------------------------------------------------------------------
      // 5. CANCELAR ROBO ("Paso")
      // ----------------------------------------------------------------------
      if (action === "PASAR_TURNO") {
        if (sala.estado !== "jugando" || String(sala.turno_actual) !== String(userId)) {
          return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
        }
        if (sala.pregunta_activa || sala.alerta_robo?.activo) {
          return NextResponse.json({ error: "Termina la opción actual antes de pasar turno" }, { status: 409 });
        }
        sala.turno_actual = getNextPlayerId(players, userId);
        return NextResponse.json({ ok: true, siguienteTurno: sala.turno_actual });
      }

      if (action === "CANCELAR_ROBO") {
        sala.alerta_robo = null;
        return NextResponse.json({ ok: true });
      }

      // ----------------------------------------------------------------------
      // 6. EJECUTAR ROBO ("Estoy seguro")
      // ----------------------------------------------------------------------
      if (action === "EJECUTAR_ROBO") {
        const { victimaId, tipoAcertijo } = data; // e.g. "email_...", "sol" | "rio" | "montana"
        if (!victimaId) {
          return NextResponse.json({ error: "Debes elegir a un jugador para robarle" }, { status: 400 });
        }

        if (!sala.alerta_robo?.activo ||
            String(sala.alerta_robo.ladronId) !== String(userId) ||
            String(sala.turno_actual) !== String(userId)) {
          return NextResponse.json({ error: "No tienes un robo pendiente en tu turno" }, { status: 409 });
        }

        const victimaRecord = players.find(p => String(p.usuario_id) === String(victimaId));
        if (!victimaRecord) {
          return NextResponse.json({ error: "Jugador no encontrado" }, { status: 404 });
        }

        if (!victimaRecord.cartas) victimaRecord.cartas = { sol: 0, rio: 0, montana: 0 };
        if (!currentPlayerRecord.cartas) currentPlayerRecord.cartas = { sol: 0, rio: 0, montana: 0 };

        // Determine which card to steal
        let cartaARobar = tipoAcertijo;
        if (!cartaARobar || !victimaRecord.cartas[cartaARobar] || victimaRecord.cartas[cartaARobar] <= 0) {
          // steal any card the victim has
          const available = ["sol", "rio", "montana"].filter(k => victimaRecord.cartas[k] > 0);
          if (available.length === 0) {
            sala.alerta_robo = null;
            return NextResponse.json({ error: "El jugador no tiene cartas para robar" }, { status: 400 });
          }
          cartaARobar = available[0];
        }

        // Transfer card
        victimaRecord.cartas[cartaARobar] = Math.max(0, victimaRecord.cartas[cartaARobar] - 1);
        currentPlayerRecord.cartas[cartaARobar] = (currentPlayerRecord.cartas[cartaARobar] || 0) + 1;

        const victimaObj = memoryStore.usuarios.find(u => u.id_usuario === victimaId);
        const victimaNombre = victimaObj ? victimaObj.nombre : "un jugador";

        // Check victory
        const gano = tieneTriadaGanadora(currentPlayerRecord.cartas);

        if (gano) {
          sala.ganador = { id: userId, nombre: userName };
          sala.estado = 'terminada';
          sala.tiempo_fin = Date.now() + 30000;
        }

        sala.alerta_robo = {
          activo: false,
          ladronId: userId,
          ladronNombre: userName,
          mensaje: `${userName} le robó una carta de ${cartaARobar.toUpperCase()} a ${victimaNombre}!`,
        };

        // Advance turn
        if (!gano) {
          sala.turno_actual = getNextPlayerId(players, userId);
        }

        return NextResponse.json({
          ok: true,
          gano,
          cartaRobada: cartaARobar,
          cartas: currentPlayerRecord.cartas,
          siguienteTurno: sala.turno_actual,
          ganador: sala.ganador,
        });
      }

      // ----------------------------------------------------------------------
      // 7. REVANCHA (Solo creador)
      // ----------------------------------------------------------------------
      if (action === "REVANCHA") {
        if (sala.creador_id !== userId) {
          return NextResponse.json({ error: "Solo el creador de la sala puede iniciar la revancha" }, { status: 403 });
        }

        // Reset game state
        sala.estado = 'jugando';
        sala.ganador = null;
        sala.alerta_robo = null;
        sala.pregunta_activa = null;
        sala.tiempo_fin = null;
        sala.turno_actual = players[0].usuario_id;
        sala.inicio_partida = Date.now() + 8000;
        sala.indice_pregunta = 0;

        // Reset all cards
        players.forEach(p => {
          p.cartas = { sol: 0, rio: 0, montana: 0 };
        });

        // Reshuffle questions
        const newQs = obtenerPreguntasPorCategoria(sala.categoria || "cultura_peruana", sala.cantidad_preguntas || 25);
        memoryStore.preguntas = memoryStore.preguntas.filter(q => q.sala_id !== sala.id);
        newQs.forEach((q, idx) => {
          memoryStore.preguntas.push({
            sala_id: sala.id,
            numero: idx + 1,
            texto: q.texto,
            alternativa_a: q.alternativas[0],
            alternativa_b: q.alternativas[1],
            alternativa_c: q.alternativas[2],
            alternativa_d: q.alternativas[3],
            respuesta_correcta: q.correcta,
            asignada_a: null,
          });
        });

        return NextResponse.json({ ok: true, mensaje: "Revancha iniciada" });
      }

      return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
    }

    // Default response if not memory
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error en acción de sala:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
