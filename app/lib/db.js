import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { BANCO_PREGUNTAS } from './questions';

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

let pool = null;
let useMemory = false;

// Global in-memory fallback store
if (!global.__QUIZPEKUY_STORE) {
  global.__QUIZPEKUY_STORE = {
    usuarios: [],
    salas: [],
    salaJugadores: [],
    preguntas: [],
    salaIdCounter: 1,
  };
}
const memoryStore = global.__QUIZPEKUY_STORE;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/quizpekuy',
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', () => {
    useMemory = true;
  });
} catch {
  useMemory = true;
}

export async function query(text, params) {
  if (useMemory) {
    return { rows: [] };
  }
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === '57P03' || err.message?.includes('connect') || err.message?.includes('timeout')) {
      useMemory = true;
      return { rows: [] };
    }
    throw err;
  }
}

export function isUsingMemory() {
  return useMemory;
}

export { memoryStore, BANCO_PREGUNTAS };
export default { query, isUsingMemory, memoryStore, guardarEnSqlYLog, BANCO_PREGUNTAS };
