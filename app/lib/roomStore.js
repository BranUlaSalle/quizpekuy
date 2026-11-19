import { pool, memoryStore } from "./db";

let schemaReady;
export async function withRoom({ id, code, create, readOnly }, apply) {
  if (!pool) {
    if (process.env.NODE_ENV === "production") throw new Error("Configura DATABASE_URL o DATABASE_QUIZPEKUY en producción");
    const response = apply(memoryStore);
    if (!readOnly && response.ok) {
      const room = memoryStore.salas.find(r => r.id === id || r.codigo === code);
      if (room) room.revision = (room.revision || 0) + 1;
    }
    return response;
  }
  schemaReady ??= pool.query(`CREATE TABLE IF NOT EXISTS quiz_partidas (
    id SERIAL PRIMARY KEY, codigo TEXT NOT NULL, activa BOOLEAN NOT NULL DEFAULT true,
    partida JSONB NOT NULL DEFAULT '{}'
  )`).then(() => pool.query("CREATE UNIQUE INDEX IF NOT EXISTS quiz_codigo_activo ON quiz_partidas(codigo) WHERE activa"))
    .catch(error => { schemaReady = null; throw error; });
  await schemaReady;
  const client = await pool.connect();
  try {
    if (!readOnly) await client.query("BEGIN");
    let row;
    if (create) {
      for (let attempt = 0; attempt < 100 && !row; attempt++) {
        const codigo = String(Math.floor(1000 + Math.random() * 9000));
        const result = await client.query("INSERT INTO quiz_partidas(codigo) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id,codigo", [codigo]);
        row = result.rows[0];
      }
      if (!row) throw new Error("Sin códigos disponibles");
    } else {
      const where = code ? "codigo = $1 AND activa" : "id = $1";
      const lock = readOnly ? "" : " FOR UPDATE";
      const result = await client.query(`SELECT id,codigo,partida FROM quiz_partidas WHERE ${where}${lock}`, [code || id]);
      row = result.rows[0];
    }
    const state = row?.partida || { salas: [], salaJugadores: [], preguntas: [], usuarios: [], salaIdCounter: row?.id };
    const response = apply(state, create ? row.codigo : undefined);
    if (!readOnly) {
      if (response.ok && row) {
        state.salas[0].revision = (state.salas[0].revision || 0) + 1;
        await client.query("UPDATE quiz_partidas SET partida=$1, activa=$2 WHERE id=$3", [state, state.salas[0].estado !== "terminada", row.id]);
      }
      await client.query(response.ok ? "COMMIT" : "ROLLBACK");
    }
    return response;
  } catch (error) {
    if (!readOnly) await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
