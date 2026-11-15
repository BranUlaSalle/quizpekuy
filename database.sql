-- ======================================================
-- QuizPekuy - Base de datos PostgreSQL
-- ======================================================

CREATE DATABASE quizpekuy;

\c quizpekuy;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario VARCHAR(255) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  foto TEXT,
  password_hash TEXT,
  auth_provider VARCHAR(20) NOT NULL DEFAULT 'google',
  es_primera_vez BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  fecha_ultimo_login TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de salas
CREATE TABLE IF NOT EXISTS salas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(4) UNIQUE NOT NULL,
  creador_id VARCHAR(255) NOT NULL REFERENCES usuarios(id_usuario),
  cantidad_preguntas INTEGER NOT NULL DEFAULT 25,
  estado VARCHAR(20) NOT NULL DEFAULT 'esperando',
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de jugadores en sala
CREATE TABLE IF NOT EXISTS sala_jugadores (
  id SERIAL PRIMARY KEY,
  sala_id INTEGER NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
  usuario_id VARCHAR(255) NOT NULL REFERENCES usuarios(id_usuario),
  turno_pregunta INTEGER,
  fecha_union TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(sala_id, usuario_id)
);

-- Tabla de preguntas
CREATE TABLE IF NOT EXISTS preguntas (
  id SERIAL PRIMARY KEY,
  sala_id INTEGER NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  texto TEXT NOT NULL,
  alternativa_a TEXT NOT NULL,
  alternativa_b TEXT NOT NULL,
  alternativa_c TEXT NOT NULL,
  alternativa_d TEXT NOT NULL,
  respuesta_correcta CHAR(1) NOT NULL,
  asignada_a VARCHAR(255) REFERENCES usuarios(id_usuario)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_salas_codigo ON salas(codigo);
CREATE INDEX IF NOT EXISTS idx_sala_jugadores_sala ON sala_jugadores(sala_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_sala ON preguntas(sala_id);
