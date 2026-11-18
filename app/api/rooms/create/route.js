import { withRoom } from "../../../lib/roomStore";
import { NextResponse } from "next/server";
import { obtenerPreguntasPorCategoria } from "../../../lib/db";

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function POST(request) {
  try {
    const { userId, userName, userFoto, cantidadPreguntas, categoria = "cultura_peruana" } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
    }

    const cantidad = Math.min(Math.max(parseInt(cantidadPreguntas) || 25, 1), 50);
    const resolvedName = userName || "Explorador";

    return await withRoom({ create: true }, (store, reservedCode) => {
      // Ensure user is in store
      const existingU = store.usuarios.find(u => u.id_usuario === userId);
      if (existingU) {
        if (userName) existingU.nombre = userName;
        if (userFoto) existingU.foto = userFoto;
      } else {
        store.usuarios.push({
          id_usuario: userId,
          nombre: resolvedName,
          email: "",
          foto: userFoto || null,
          auth_provider: 'google',
          es_primera_vez: false,
        });
      }

      // Get questions from selected category
      const categoryQuestions = obtenerPreguntasPorCategoria(categoria, cantidad);
      const roomQuestions = categoryQuestions.map((q, idx) => ({
        numero: idx + 1,
        texto: q.texto,
        alternativa_a: q.alternativas[0],
        alternativa_b: q.alternativas[1],
        alternativa_c: q.alternativas[2],
        alternativa_d: q.alternativas[3],
        respuesta_correcta: q.correcta,
        asignada_a: null,
      }));


      let codigo;
      let attempts = 0;
      while (attempts < 100) {
        codigo = reservedCode || generateCode();
        const existing = store.salas.find(s => s.codigo === codigo && (s.estado === 'esperando' || s.estado === 'jugando'));
        if (!existing) break;
        attempts++;
      }

      const salaId = store.salaIdCounter++;
      const sala = {
        id: salaId,
        codigo,
        creador_id: userId,
        creador_nombre: resolvedName,
        cantidad_preguntas: cantidad,
        categoria,
        estado: 'esperando',
        turno_actual: userId,
        pregunta_activa: null,
        alerta_robo: null,
        ganador: null,
        tiempo_fin: null,
        indice_pregunta: 0,
      };
      store.salas.push(sala);

      // Add creator as player with resolved name and photo
      store.salaJugadores.push({
        sala_id: salaId,
        usuario_id: userId,
        nombre: resolvedName,
        foto: userFoto || null,
        turno_pregunta: 1,
        cartas: { sol: 0, rio: 0, montana: 0 },
      });

      // Save questions with room
      roomQuestions.forEach(q => {
        store.preguntas.push({
          sala_id: salaId,
          ...q,
        });
      });

      return NextResponse.json({
        sala: {
          id: salaId,
          codigo,
          cantidadPreguntas: cantidad,
          categoria,
          creadorId: userId,
          creadorNombre: resolvedName,
        },
      });
    });
  } catch (err) {
    console.error("Error creando sala:", err);
    return NextResponse.json({ error: "Error al crear la sala" }, { status: 500 });
  }
}
