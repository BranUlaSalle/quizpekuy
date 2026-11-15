-- ======================================================
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

INSERT INTO usuarios (id_usuario, nombre, email, foto, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) VALUES ('email_1794734360176_5fs5dz', 'Carlos mendoza', 'carlos.mendoza@ulasalle.edu.pe', '', 'email', true, '2026-11-15T09:19:20.176Z', '2026-11-15T09:19:20.176Z') ON CONFLICT (id_usuario) DO UPDATE SET nombre = 'Carlos mendoza', foto = '', fecha_ultimo_login = '2026-11-15T09:19:20.176Z', es_primera_vez = FALSE;
INSERT INTO usuarios (id_usuario, nombre, email, foto, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) VALUES ('email_1794734360176_5fs5dz', 'Carlos mendoza', 'carlos.mendoza@ulasalle.edu.pe', '', 'email', false, '2026-11-15T09:19:20.324Z', '2026-11-15T09:19:20.324Z') ON CONFLICT (id_usuario) DO UPDATE SET nombre = 'Carlos mendoza', foto = '', fecha_ultimo_login = '2026-11-15T09:19:20.324Z', es_primera_vez = FALSE;
INSERT INTO usuarios (id_usuario, nombre, email, foto, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) VALUES ('email_1794734360527_d80bco', 'Maria flores', 'maria.flores@ulasalle.edu.pe', '', 'email', true, '2026-11-15T09:19:20.527Z', '2026-11-15T09:19:20.527Z') ON CONFLICT (id_usuario) DO UPDATE SET nombre = 'Maria flores', foto = '', fecha_ultimo_login = '2026-11-15T09:19:20.527Z', es_primera_vez = FALSE;
INSERT INTO usuarios (id_usuario, nombre, email, foto, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) VALUES ('email_1794734376628_ettiuj', 'Juan perez', 'juan.perez@ulasalle.edu.pe', '', 'email', true, '2026-11-15T09:19:36.628Z', '2026-11-15T09:19:36.628Z') ON CONFLICT (id_usuario) DO UPDATE SET nombre = 'Juan perez', foto = '', fecha_ultimo_login = '2026-11-15T09:19:36.628Z', es_primera_vez = FALSE;
INSERT INTO usuarios (id_usuario, nombre, email, foto, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) VALUES ('email_1794734376764_q3plxz', 'Ana gomez', 'ana.gomez@ulasalle.edu.pe', '', 'email', true, '2026-11-15T09:19:36.764Z', '2026-11-15T09:19:36.764Z') ON CONFLICT (id_usuario) DO UPDATE SET nombre = 'Ana gomez', foto = '', fecha_ultimo_login = '2026-11-15T09:19:36.764Z', es_primera_vez = FALSE;
INSERT INTO usuarios (id_usuario, nombre, email, foto, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) VALUES ('email_1794734376859_vi8ojf', 'Pedro soto', 'pedro.soto@ulasalle.edu.pe', '', 'email', true, '2026-11-15T09:19:36.859Z', '2026-11-15T09:19:36.859Z') ON CONFLICT (id_usuario) DO UPDATE SET nombre = 'Pedro soto', foto = '', fecha_ultimo_login = '2026-11-15T09:19:36.859Z', es_primera_vez = FALSE;
INSERT INTO usuarios (id_usuario, nombre, email, foto, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) VALUES ('114741183858840650944', 'Bran Yames Paz Patatingo', 'bpazp@ulasalle.edu.pe', 'https://lh3.googleusercontent.com/a/ACg8ocIiDkU8RpUFtikw15DB56HOykwUFHoXJp09wUoFVV7LlXJqDQ=s96-c', 'google', true, '2026-11-15T09:21:48.503Z', '2026-11-15T09:21:48.503Z') ON CONFLICT (id_usuario) DO UPDATE SET nombre = 'Bran Yames Paz Patatingo', foto = 'https://lh3.googleusercontent.com/a/ACg8ocIiDkU8RpUFtikw15DB56HOykwUFHoXJp09wUoFVV7LlXJqDQ=s96-c', fecha_ultimo_login = '2026-11-15T09:21:48.503Z', es_primera_vez = FALSE;
