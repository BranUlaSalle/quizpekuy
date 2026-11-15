import { NextResponse } from "next/server";
import { query, isUsingMemory, memoryStore, guardarEnSqlYLog } from "../../../lib/db";


const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || "ulasalle.edu.pe";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export async function POST(request) {
  try {
    const { credential, accessToken } = await request.json();

    if (!credential && !accessToken) {
      return NextResponse.json({ error: "Falta el token de autenticación" }, { status: 400 });
    }

    let id = "";
    let email = "";
    let emailVerified = false;
    let name = "";
    let picture = "";

    if (credential) {
      const res = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      );
      if (!res.ok) {
        return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
      }
      const info = await res.json();
      if (CLIENT_ID && info.aud !== CLIENT_ID) {
        return NextResponse.json({ error: "Token no corresponde a esta app" }, { status: 401 });
      }
      id = info.sub;
      email = (info.email || "").toLowerCase();
      emailVerified = info.email_verified === "true" || info.email_verified === true;
      name = info.name || email.split("@")[0];
      picture = info.picture || "";
    } else if (accessToken) {
      const tokenRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
      );
      if (!tokenRes.ok) {
        return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
      }
      const tokenInfo = await tokenRes.json();
      if (CLIENT_ID && tokenInfo.aud !== CLIENT_ID && tokenInfo.azp !== CLIENT_ID) {
        return NextResponse.json({ error: "Token no corresponde a esta app" }, { status: 401 });
      }
      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!userRes.ok) {
        return NextResponse.json({ error: "No se pudo obtener el perfil de usuario" }, { status: 401 });
      }
      const profile = await userRes.json();
      id = profile.sub || tokenInfo.sub;
      email = (profile.email || tokenInfo.email || "").toLowerCase();
      emailVerified =
        profile.email_verified === true ||
        profile.email_verified === "true" ||
        tokenInfo.email_verified === "true";
      name = profile.name || tokenInfo.name || email.split("@")[0];
      picture = profile.picture || "";
    }

    if (!id) {
      id = "google_" + Date.now();
    }

    if (!emailVerified) {
      return NextResponse.json({ error: "El correo no está verificado por Google" }, { status: 403 });
    }

    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return NextResponse.json(
        { error: `Solo se permiten cuentas institucionales @${ALLOWED_DOMAIN}. Tu cuenta seleccionada fue: ${email}` },
        { status: 403 }
      );
    }

    let isFirstTime = true;

    // Check in-memory store
    const existingIdx = memoryStore.usuarios.findIndex(u => u.id_usuario === id || u.email === email);
    if (existingIdx >= 0) {
      isFirstTime = memoryStore.usuarios[existingIdx].es_primera_vez;
      memoryStore.usuarios[existingIdx].nombre = name;
      memoryStore.usuarios[existingIdx].foto = picture;
      memoryStore.usuarios[existingIdx].es_primera_vez = false;
    } else {
      memoryStore.usuarios.push({
        id_usuario: id,
        nombre: name,
        email,
        foto: picture,
        auth_provider: 'google',
        es_primera_vez: false, // will be false on next login
        password_hash: null,
      });
      isFirstTime = true;
    }

    // Try PostgreSQL
    if (!isUsingMemory()) {
      try {
        const existingUser = await query(
          'SELECT id_usuario, es_primera_vez FROM usuarios WHERE id_usuario = $1 OR email = $2',
          [id, email]
        );
        
        if (existingUser.rows.length > 0) {
          isFirstTime = existingUser.rows[0].es_primera_vez;
          await query(
            `UPDATE usuarios SET nombre = $1, foto = $2, fecha_ultimo_login = NOW(), es_primera_vez = FALSE WHERE id_usuario = $3`,
            [name, picture, existingUser.rows[0].id_usuario]
          );
        } else {
          await query(
            `INSERT INTO usuarios (id_usuario, nombre, email, foto, auth_provider, es_primera_vez, fecha_registro, fecha_ultimo_login) 
             VALUES ($1, $2, $3, $4, 'google', FALSE, NOW(), NOW())`,
            [id, name, email, picture]
          );
          isFirstTime = true;
        }
      } catch (dbError) {
        console.error("Nota DB:", dbError.message);
      }
    }

    // Guardar en usuarios.sql y usuarios.log
    guardarEnSqlYLog({
      id,
      name,
      email,
      picture,
      provider: 'google',
      esPrimeraVez: isFirstTime,
    });

    return NextResponse.json({
      user: { id, name, email, picture, isFirstTime },
    });
  } catch (err) {
    console.error("Error en auth Google:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
