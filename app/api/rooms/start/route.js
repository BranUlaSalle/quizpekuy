import { NextResponse } from "next/server";
import { query, isUsingMemory, memoryStore } from "../../../lib/db";

export async function POST(request) {
  try {
    const { salaId, userId, turnOrderIds = [] } = await request.json();

    if (!salaId || !userId) {
      return NextResponse.json({ error: "Parámetros incompletos" }, { status: 400 });
    }

    const idNumber = parseInt(salaId, 10);

    if (isUsingMemory()) {
      const sala = memoryStore.salas.find(s => s.id === idNumber);
      if (!sala) {
        return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
      }

      // Check that ONLY the creator of the room can start the game
      if (sala.creador_id !== userId) {
        return NextResponse.json({ error: "Solo la persona que ha creado la sala puede iniciar la partida" }, { status: 403 });
      }

      const players = memoryStore.salaJugadores.filter(sj => sj.sala_id === sala.id);
      if (players.length < 2) {
        return NextResponse.json({ error: "Se necesitan al menos 2 jugadores para empezar la partida" }, { status: 400 });
      }

      const requestedOrder = Array.isArray(turnOrderIds) ? turnOrderIds : [];
      const uniqueOrder = new Set(requestedOrder);
      if (requestedOrder.length !== players.length || uniqueOrder.size !== players.length ||
          !players.every((player) => uniqueOrder.has(player.usuario_id))) {
        return NextResponse.json({ error: "Asigna un turno único a cada jugador" }, { status: 400 });
      }

      const orderedPlayers = requestedOrder.map((playerId) => players.find((player) => player.usuario_id === playerId));
      orderedPlayers.forEach((player, index) => { player.orden_turno = index + 1; });
      sala.orden_turnos = requestedOrder;
      sala.estado = 'jugando';
      sala.turno_actual = requestedOrder[0];
      sala.inicio_partida = Date.now() + 8000;
      sala.pregunta_activa = null;
      sala.alerta_robo = null;
      sala.ganador = null;
      sala.tiempo_fin = null;
      sala.indice_pregunta = 0;

      // Initialize cards for all players
      players.forEach(p => {
        p.cartas = { sol: 0, rio: 0, montana: 0 };
      });

      return NextResponse.json({
        ok: true,
        estado: 'jugando',
        turnoActual: sala.turno_actual,
        ordenTurnos: sala.orden_turnos,
        inicioPartida: sala.inicio_partida,
        sala: {
          id: sala.id,
          codigo: sala.codigo,
          estado: 'jugando',
          turnoActual: sala.turno_actual,
          ordenTurnos: sala.orden_turnos,
          inicioPartida: sala.inicio_partida,
        },
      });
    }

    // PostgreSQL path
    const salaResult = await query("SELECT creador_id FROM salas WHERE id = $1", [idNumber]);
    if (salaResult.rows.length === 0) {
      return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
    }

    if (salaResult.rows[0].creador_id !== userId) {
      return NextResponse.json({ error: "Solo la persona que ha creado la sala puede iniciar la partida" }, { status: 403 });
    }

    const countRes = await query("SELECT COUNT(*) as total FROM sala_jugadores WHERE sala_id = $1", [idNumber]);
    const total = parseInt(countRes.rows[0]?.total || 0, 10);

    if (total < 2) {
      return NextResponse.json({ error: "Se necesitan al menos 2 jugadores para empezar la partida" }, { status: 400 });
    }

    await query("UPDATE salas SET estado = 'jugando' WHERE id = $1", [idNumber]);

    return NextResponse.json({ ok: true, estado: 'jugando' });
  } catch (err) {
    console.error("Error iniciando partida:", err);
    return NextResponse.json({ error: "Error al iniciar la partida" }, { status: 500 });
  }
}
