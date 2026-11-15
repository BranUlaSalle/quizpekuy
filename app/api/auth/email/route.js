import { NextResponse } from "next/server";
import { query, isUsingMemory, memoryStore, guardarEnSqlYLog } from "../../../lib/db";
import bcrypt from "bcryptjs";


const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "ulasalle.edu.pe";

export async function POST(request) {
  try {
    const { email, password, action } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Correo y contraseña son requeridos" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    if (!emailLower.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return NextResponse.json(
        { error: `Solo se permiten cuentas institucionales @${ALLOWED_DOMAIN}` },
        { status: 403 }
      );
    }

    if (action === "register") {
      // Check existing in memory
      const existingMem = memoryStore.usuarios.find(u => u.email === emailLower);
      if (existingMem) {
        return NextResponse.json({ error: "Este correo ya está registrado. Inicia sesión." }, { status: 409 });
      }

      // Check existing in Postgres
      if (!isUsingMemory()) {
        try {
          const existingDB = await query(
            'SELECT id_usuario FROM usuarios WHERE email = $1',
            [emailLower]
          );
          if (existingDB.rows.length > 0) {
            return NextResponse.json({ error: "Este correo ya está registrado. Inicia sesión." }, { status: 409 });
          }
        } catch (e) {
          console.error("Nota DB:", e.message);
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const id = "email_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
      const rawName = emailLower.split("@")[0].replace(/[._-]/g, " ");
      const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      // Save to memory
      memoryStore.usuarios.push({
        id_usuario: id,
        nombre: name,
        email: emailLower,
        foto: null,
        password_hash: passwordHash,
        auth_provider: 'email',
        es_primera_vez: false,
      });

      // Save to Postgres
      if (!isUsingMemory()) {
        try {
          await query(
            `INSERT INTO usuarios (id_usuario, nombre, email, password_hash, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) 
             VALUES ($1, $2, $3, $4, 'email', FALSE, NOW(), NOW())`,
            [id, name, emailLower, passwordHash]
          );
        } catch (e) {
          console.error("Nota DB:", e.message);
        }
      }

      // Guardar en usuarios.sql y usuarios.log
      guardarEnSqlYLog({
        id,
        name,
        email: emailLower,
        picture: null,
        provider: 'email',
        esPrimeraVez: true,
      });

      return NextResponse.json({
        user: { id, name, email: emailLower, picture: null, isFirstTime: true },
      });
    } else {
      // LOGIN
      let user = null;
      let validPassword = false;

      // Check memory
      const userMem = memoryStore.usuarios.find(u => u.email === emailLower && u.auth_provider === 'email');
      if (userMem) {
        validPassword = await bcrypt.compare(password, userMem.password_hash);
        if (!validPassword) {
          return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
        }
        user = userMem;
      } else if (!isUsingMemory()) {
        try {
          const result = await query(
            'SELECT id_usuario, nombre, email, foto, password_hash, es_primera_vez FROM usuarios WHERE email = $1 AND auth_provider = $2',
            [emailLower, 'email']
          );
          if (result.rows.length > 0) {
            const dbUser = result.rows[0];
            validPassword = await bcrypt.compare(password, dbUser.password_hash);
            if (!validPassword) {
              return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
            }
            user = {
              id_usuario: dbUser.id_usuario,
              nombre: dbUser.nombre,
              email: dbUser.email,
              foto: dbUser.foto,
              es_primera_vez: dbUser.es_primera_vez,
            };
            await query(
              `UPDATE usuarios SET fecha_ultimo_login = NOW(), es_primera_vez = FALSE WHERE id_usuario = $1`,
              [dbUser.id_usuario]
            );
          }
        } catch (e) {
          console.error("Nota DB:", e.message);
        }
      }

      if (!user) {
        return NextResponse.json({ error: "Correo no registrado. Haz clic en 'Regístrate' para crear tu cuenta." }, { status: 404 });
      }

      // Always returning user when logging in
      const isFirstTime = false;

      guardarEnSqlYLog({
        id: user.id_usuario,
        name: user.nombre,
        email: user.email,
        picture: user.foto,
        provider: 'email',
        esPrimeraVez: false,
      });

      return NextResponse.json({
        user: {
          id: user.id_usuario,
          name: user.nombre,
          email: user.email,
          picture: user.foto,
          isFirstTime,
        },
      });
    }
  } catch (err) {
    console.error("Error en auth email:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
