import { NextResponse } from "next/server";
import { query, isUsingMemory, memoryStore } from "../../../lib/db";


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const salaId = searchParams.get("salaId");

    if (!salaId) {
      return NextResponse.json({ error: "ID de sala requerido" }, { status: 400 });
    }

    const idNumber = parseInt(salaId);

    if (isUsingMemory()) {
      const sala = memoryStore.salas.find(s => s.id === idNumber);
      if (!sala) {
        return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
      }

      const playerRecords = memoryStore.salaJugadores.filter(sj => sj.sala_id === sala.id);
      
      const jugadores = playerRecords.map((sj, idx) => {
        const u = memoryStore.usuarios.find(u => u.id_usuario === sj.usuario_id);
        return {
          id: sj.usuario_id,
          nombre: u ? u.nombre : `Jugador ${idx + 1}`,
          foto: u ? u.foto : null,
          turnoPregunta: sj.turno_pregunta || (idx + 1),
        };
      });

      // ONLY include numero, texto, and asignada_a - NEVER alternatives or correct answer
      const preguntas = memoryStore.preguntas
        .filter(q => q.sala_id === sala.id && q.asignada_a)
        .map(q => ({
          numero: q.numero,
          texto: q.texto,
          asignadaA: q.asignada_a,
        }));

      return NextResponse.json({
        sala: {
          id: sala.id,
          codigo: sala.codigo,
          creadorId: sala.creador_id,
          cantidadPreguntas: sala.cantidad_preguntas,
          estado: sala.estado,
        },
        jugadores,
        preguntas,
      });
    }

    // PostgreSQL path
    const salaResult = await query(
      "SELECT id, codigo, creador_id, cantidad_preguntas, estado FROM salas WHERE id = $1",
      [idNumber]
    );

    if (salaResult.rows.length === 0) {
      return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
    }

    const sala = salaResult.rows[0];

    const playersResult = await query(
      `SELECT u.id_usuario, u.nombre, u.email, u.foto, sj.turno_pregunta
       FROM sala_jugadores sj
       LEFT JOIN usuarios u ON u.id_usuario = sj.usuario_id
       WHERE sj.sala_id = $1
       ORDER BY sj.fecha_union ASC`,
      [idNumber]
    );

    // CRITICAL: only numero, texto, asignada_a (NO alternatives, NO respuesta_correcta)
    const questionsResult = await query(
      `SELECT p.numero, p.texto, p.asignada_a
       FROM preguntas p
       WHERE p.sala_id = $1 AND p.asignada_a IS NOT NULL
       ORDER BY p.numero ASC`,
      [idNumber]
    );

    return NextResponse.json({
      sala: {
        id: sala.id,
        codigo: sala.codigo,
        creadorId: sala.creador_id,
        cantidadPreguntas: sala.cantidad_preguntas,
        estado: sala.estado,
      },
      jugadores: playersResult.rows.map((p, idx) => ({
        id: p.id_usuario,
        nombre: p.nombre || `Jugador ${idx + 1}`,
        foto: p.foto,
        turnoPregunta: p.turno_pregunta || (idx + 1),
      })),
      preguntas: questionsResult.rows.map(q => ({
        numero: q.numero,
        texto: q.texto,
        asignadaA: q.asignada_a,
      })),
    });
  } catch (err) {
    console.error("Error obteniendo lobby:", err);
    return NextResponse.json({ error: "Error al obtener datos del lobby" }, { status: 500 });
  }
}
