import { NextResponse } from "next/server";
import { query, isUsingMemory, memoryStore } from "../../../lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const salaId = searchParams.get("salaId");

    if (!salaId) {
      return NextResponse.json({ error: "ID de sala requerido" }, { status: 400 });
    }

    const idNumber = parseInt(salaId, 10);

    if (isUsingMemory()) {
      const sala = memoryStore.salas.find(s => s.id === idNumber);
      if (!sala) {
        return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
      }

      const playerRecords = memoryStore.salaJugadores.filter(sj => sj.sala_id === sala.id);
      
      const jugadores = playerRecords.map((sj, idx) => {
        const u = memoryStore.usuarios.find(u => u.id_usuario === sj.usuario_id);
        const resolvedName = (u && u.nombre) ? u.nombre : (sj.nombre || `Jugador ${idx + 1}`);
        const resolvedFoto = (u && u.foto) ? u.foto : (sj.foto || null);
        return {
          id: sj.usuario_id,
          nombre: resolvedName,
          foto: resolvedFoto,
          turnoPregunta: sj.turno_pregunta || (idx + 1),
          cartas: sj.cartas || { sol: 0, rio: 0, montana: 0 },
        };
      });

      // Filter active question so alternatives are NOT visible in public lobby poll
      let publicPreguntaActiva = null;
      if (sala.pregunta_activa) {
        publicPreguntaActiva = {
          jugadorId: sala.pregunta_activa.jugadorId,
          jugadorNombre: sala.pregunta_activa.jugadorNombre,
          numero: sala.pregunta_activa.numero,
          texto: sala.pregunta_activa.texto,
          respondida: sala.pregunta_activa.respondida,
          esperandoAcertijo: sala.pregunta_activa.esperandoAcertijo,
        };
      }

      return NextResponse.json({
        sala: {
          id: sala.id,
          codigo: sala.codigo,
          creadorId: sala.creador_id,
          creadorNombre: sala.creador_nombre || "Anfitrión",
          cantidadPreguntas: sala.cantidad_preguntas,
          categoria: sala.categoria || "cultura_peruana",
          estado: sala.estado,
          turnoActual: sala.turno_actual,
          preguntaActiva: publicPreguntaActiva,
          alertaRobo: sala.alerta_robo,
          ganador: sala.ganador,
          tiempoFin: sala.tiempo_fin,
        },
        jugadores,
        preguntas: memoryStore.preguntas
          .filter(q => q.sala_id === sala.id)
          .slice(0, 10)
          .map(q => ({ numero: q.numero, texto: q.texto, asignadaA: q.asignada_a })),
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
        cartas: { sol: 0, rio: 0, montana: 0 },
      })),
      preguntas: [],
    });
  } catch (err) {
    console.error("Error obteniendo lobby:", err);
    return NextResponse.json({ error: "Error al obtener datos del lobby" }, { status: 500 });
  }
}
