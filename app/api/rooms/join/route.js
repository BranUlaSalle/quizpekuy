import { NextResponse } from "next/server";
import { query, isUsingMemory, memoryStore } from "../../../lib/db";

export async function POST(request) {
  try {
    const { userId, userName, userFoto, codigo } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
    }

    if (!codigo || String(codigo).trim().length !== 4) {
      return NextResponse.json({ error: "Ingresa un código de sala válido de 4 dígitos" }, { status: 400 });
    }

    const cleanCode = String(codigo).trim();
    const resolvedName = userName || "Explorador";

    // Ensure user is in memoryStore
    const existingU = memoryStore.usuarios.find(u => u.id_usuario === userId);
    if (existingU) {
      if (userName) existingU.nombre = userName;
      if (userFoto) existingU.foto = userFoto;
    } else {
      memoryStore.usuarios.push({
        id_usuario: userId,
        nombre: resolvedName,
        email: "",
        foto: userFoto || null,
        auth_provider: 'google',
        es_primera_vez: false,
      });
    }

    if (isUsingMemory()) {
      const sala = memoryStore.salas.find(s => s.codigo === cleanCode && (s.estado === 'esperando' || s.estado === 'jugando'));
      if (!sala) {
        return NextResponse.json({ error: "Sala no encontrada o el código es inválido" }, { status: 404 });
      }

      const playersInRoom = memoryStore.salaJugadores.filter(sj => sj.sala_id === sala.id);
      const alreadyJoined = playersInRoom.find(sj => sj.usuario_id === userId);

      if (!alreadyJoined) {
        if (playersInRoom.length >= 4) {
          return NextResponse.json({ error: "La sala ya está llena (máximo 4 jugadores)" }, { status: 403 });
        }

        const nextSlot = playersInRoom.length + 1;
        memoryStore.salaJugadores.push({
          sala_id: sala.id,
          usuario_id: userId,
          nombre: resolvedName,
          foto: userFoto || null,
          turno_pregunta: nextSlot,
          cartas: { sol: 0, rio: 0, montana: 0 },
        });
      } else {
        if (userName) alreadyJoined.nombre = userName;
        if (userFoto) alreadyJoined.foto = userFoto;
      }

      return NextResponse.json({
        sala: {
          id: sala.id,
          codigo: sala.codigo,
          cantidadPreguntas: sala.cantidad_preguntas,
          categoria: sala.categoria || "cultura_peruana",
          creadorId: sala.creador_id,
          creadorNombre: sala.creador_nombre || "Anfitrión",
          estado: sala.estado,
        },
        message: alreadyJoined ? "Ya estás en esta sala" : undefined,
      });
    }

    // PostgreSQL path
    const salaResult = await query(
      "SELECT id, codigo, creador_id, cantidad_preguntas, estado FROM salas WHERE codigo = $1 AND estado IN ('esperando', 'jugando')",
      [cleanCode]
    );

    if (salaResult.rows.length === 0) {
      return NextResponse.json({ error: "Sala no encontrada o el código es inválido" }, { status: 404 });
    }

    const sala = salaResult.rows[0];

    const countResult = await query(
      "SELECT COUNT(*) as total FROM sala_jugadores WHERE sala_id = $1",
      [sala.id]
    );

    const playerCount = parseInt(countResult.rows[0]?.total || 0);

    const alreadyJoined = await query(
      "SELECT id FROM sala_jugadores WHERE sala_id = $1 AND usuario_id = $2",
      [sala.id, userId]
    );

    if (alreadyJoined.rows.length === 0) {
      if (playerCount >= 4) {
        return NextResponse.json({ error: "La sala ya está llena (máximo 4 jugadores)" }, { status: 403 });
      }

      const nextSlot = playerCount + 1;
      await query(
        `INSERT INTO sala_jugadores (sala_id, usuario_id, turno_pregunta) VALUES ($1, $2, $3)`,
        [sala.id, userId, nextSlot]
      );
    }

    return NextResponse.json({
      sala: {
        id: sala.id,
        codigo: sala.codigo,
        cantidadPreguntas: sala.cantidad_preguntas,
        creadorId: sala.creador_id,
        estado: sala.estado,
      },
    });
  } catch (err) {
    console.error("Error uniéndose a sala:", err);
    return NextResponse.json({ error: "Error al unirse a la sala" }, { status: 500 });
  }
}
