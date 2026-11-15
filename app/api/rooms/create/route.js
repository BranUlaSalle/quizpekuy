import { NextResponse } from "next/server";
import { query, isUsingMemory, memoryStore, BANCO_PREGUNTAS } from "../../../lib/db";


function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function POST(request) {
  try {
    const { userId, cantidadPreguntas } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
    }

    const cantidad = Math.min(Math.max(parseInt(cantidadPreguntas) || 25, 1), 50);

    // Shuffle and pick questions for the room
    const shuffled = [...BANCO_PREGUNTAS].sort(() => 0.5 - Math.random());
    const roomQuestions = shuffled.slice(0, cantidad).map((q, idx) => ({
      numero: idx + 1,
      texto: q.texto,
      alternativa_a: q.alternativas[0],
      alternativa_b: q.alternativas[1],
      alternativa_c: q.alternativas[2],
      alternativa_d: q.alternativas[3],
      respuesta_correcta: q.correcta,
      asignada_a: idx === 0 ? userId : null, // Question #1 assigned to creator
    }));

    if (isUsingMemory()) {
      let codigo;
      let attempts = 0;
      while (attempts < 100) {
        codigo = generateCode();
        const existing = memoryStore.salas.find(s => s.codigo === codigo && s.estado === 'esperando');
        if (!existing) break;
        attempts++;
      }

      const salaId = memoryStore.salaIdCounter++;
      const sala = {
        id: salaId,
        codigo,
        creador_id: userId,
        cantidad_preguntas: cantidad,
        estado: 'esperando',
      };
      memoryStore.salas.push(sala);

      // Add creator as player
      memoryStore.salaJugadores.push({
        sala_id: salaId,
        usuario_id: userId,
        turno_pregunta: 1,
      });

      // Save questions with room
      roomQuestions.forEach(q => {
        memoryStore.preguntas.push({
          sala_id: salaId,
          ...q,
        });
      });

      return NextResponse.json({
        sala: {
          id: salaId,
          codigo,
          cantidadPreguntas: cantidad,
        },
      });
    }

    // PostgreSQL path
    let codigo;
    let attempts = 0;
    while (attempts < 100) {
      codigo = generateCode();
      const existing = await query(
        "SELECT id FROM salas WHERE codigo = $1 AND estado = 'esperando'",
        [codigo]
      );
      if (existing.rows.length === 0) break;
      attempts++;
    }

    const result = await query(
      `INSERT INTO salas (codigo, creador_id, cantidad_preguntas, estado) 
       VALUES ($1, $2, $3, 'esperando') RETURNING id, codigo, cantidad_preguntas`,
      [codigo, userId, cantidad]
    );

    const sala = result.rows[0];

    await query(
      `INSERT INTO sala_jugadores (sala_id, usuario_id, turno_pregunta) VALUES ($1, $2, 1)`,
      [sala.id, userId]
    );

    // Insert questions
    for (const q of roomQuestions) {
      await query(
        `INSERT INTO preguntas (sala_id, numero, texto, alternativa_a, alternativa_b, alternativa_c, alternativa_d, respuesta_correcta, asignada_a)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [sala.id, q.numero, q.texto, q.alternativa_a, q.alternativa_b, q.alternativa_c, q.alternativa_d, q.respuesta_correcta, q.asignada_a]
      );
    }

    return NextResponse.json({
      sala: {
        id: sala.id,
        codigo: sala.codigo,
        cantidadPreguntas: sala.cantidad_preguntas,
      },
    });
  } catch (err) {
    console.error("Error creando sala:", err);
    return NextResponse.json({ error: "Error al crear la sala" }, { status: 500 });
  }
}
