import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { PREGUNTAS_POR_CATEGORIA, CATEGORIAS, obtenerPreguntasPorCategoria } from './questions';

const SQL_FILE_PATH = path.join(process.cwd(), "usuarios.sql");
const LOG_FILE_PATH = path.join(process.cwd(), "usuarios.log");

function escapeSql(value) {
  return String(value ?? "").replace(/'/g, "''");
}

export function guardarEnSqlYLog({ id, name, email, picture, provider = 'google', esPrimeraVez = false }) {
  try {
    const timestamp = new Date().toISOString();

    if (!fs.existsSync(SQL_FILE_PATH)) {
      const headerSql = `-- ======================================================
-- QuizPekuy - Registro de usuarios autenticados
-- ======================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario VARCHAR(255) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  foto TEXT,
  password_hash TEXT,
  auth_provider VARCHAR(20) NOT NULL DEFAULT 'google',
  es_primera_vez BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_registro VARCHAR(64) NOT NULL,
  fecha_ultimo_login VARCHAR(64) NOT NULL
);

`;
      fs.writeFileSync(SQL_FILE_PATH, headerSql, "utf8");
    }

    const sqlStatement = `INSERT INTO usuarios (id_usuario, nombre, email, foto, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) VALUES ('${escapeSql(
      id
    )}', '${escapeSql(name)}', '${escapeSql(email)}', '${escapeSql(picture)}', '${escapeSql(provider)}', ${esPrimeraVez}, '${timestamp}', '${timestamp}') ON CONFLICT (id_usuario) DO UPDATE SET nombre = '${escapeSql(
      name
    )}', foto = '${escapeSql(picture)}', fecha_ultimo_login = '${timestamp}', es_primera_vez = FALSE;\n`;

    fs.appendFileSync(SQL_FILE_PATH, sqlStatement, "utf8");

    const logEntry = `[${timestamp}] NOMBRE: ${name} | ID_USUARIO: ${id} | EMAIL: ${email} | PROVIDER: ${provider} | PRIMERA_VEZ: ${esPrimeraVez}\n`;
    fs.appendFileSync(LOG_FILE_PATH, logEntry, "utf8");
  } catch (error) {
    console.error("Error al registrar en usuarios.sql / usuarios.log:", error);
  }
}

// Function to load users from usuarios.sql on startup
function cargarUsuariosDesdeSql() {
  const usuarios = [];
  try {
    if (fs.existsSync(SQL_FILE_PATH)) {
      const content = fs.readFileSync(SQL_FILE_PATH, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/VALUES\s*\(\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'/i);
        if (match) {
          const [, id, nombre, email, foto] = match;
          const existing = usuarios.find(u => u.id_usuario === id);
          if (!existing) {
            usuarios.push({
              id_usuario: id,
              nombre: nombre || email.split('@')[0],
              email,
              foto: foto || null,
              auth_provider: 'google',
              es_primera_vez: false,
            });
          } else {
            if (nombre) existing.nombre = nombre;
            if (foto) existing.foto = foto;
          }
        }
      }
    }
  } catch (e) {
    console.warn("No se pudo pre-cargar usuarios de SQL:", e.message);
  }
  return usuarios;
}

export const pool = process.env.DATABASE_URL ? new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
}) : null;
const useMemory = !pool;
pool?.on("error", error => console.error("PostgreSQL:", error.message));

// Global in-memory fallback store
if (!global.__QUIZPEKUY_STORE) {
  global.__QUIZPEKUY_STORE = {
    usuarios: cargarUsuariosDesdeSql(),
    salas: [],
    salaJugadores: [],
    preguntas: [],
    salaIdCounter: 1,
  };
}
const memoryStore = global.__QUIZPEKUY_STORE;

export async function query(text, params) {
  if (useMemory || !pool) {
    return { rows: [] };
  }
  return pool.query(text, params);
}

export function isUsingMemory() {
  return useMemory;
}

export { memoryStore, PREGUNTAS_POR_CATEGORIA, CATEGORIAS, obtenerPreguntasPorCategoria };
export default { query, isUsingMemory, memoryStore, guardarEnSqlYLog, PREGUNTAS_POR_CATEGORIA, CATEGORIAS, obtenerPreguntasPorCategoria };
