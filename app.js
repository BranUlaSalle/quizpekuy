/**
 * EN BUSCA DEL CUY DORADO - LÓGICA OFICIAL
 * 6 Pantallas: Inicio, Partida, Pregunta, Sorpresa, Uso de cartas y Final
 */

// ==========================================
// CONSTANTES Y CONFIGURACIÓN
// ==========================================

const STORAGE_KEY = 'cuy_dorado_game_state_v2';

const FICHAS_CATALOG = [
  { id: 'condor', name: 'Cóndor', icon: '🦅', color: 'Azul', hex: '#1d4ed8' },
  { id: 'mototaxi', name: 'Mototaxi', icon: '🛺', color: 'Rojo', hex: '#be123c' },
  { id: 'llama', name: 'Llama', icon: '🦙', color: 'Amarillo', hex: '#d97706' },
  { id: 'combi', name: 'Combi', icon: '🚐', color: 'Celeste', hex: '#0284c7' }
];

const PISTAS_INFO = {
  Sol: { name: 'Sol', icon: '☀️' },
  Montana: { name: 'Montaña', icon: '⛰️' },
  Rio: { name: 'Río', icon: '🌊' }
};

// 14 Tarjetas de Efectos (2 copias de cada uno de los 7 efectos)
const EFECTOS_CATALOG = {
  ceviche: {
    id: 'ceviche',
    name: 'Ceviche',
    icon: '🍲',
    copies: 2,
    desc: 'Lanza el dado y realiza un movimiento extra (no activa casilla).'
  },
  pollo_brasa: {
    id: 'pollo_brasa',
    name: 'Pollo a la brasa',
    icon: '🍗',
    copies: 2,
    desc: 'Responde una pregunta adicional para intentar obtener una pista.'
  },
  mazamorra: {
    id: 'mazamorra',
    name: 'Mazamorra morada',
    icon: '🥣',
    copies: 2,
    desc: 'Cancela un robo o sabotaje contra ti (se activa cuando alguien te ataca).'
  },
  inca_kola: {
    id: 'inca_kola',
    name: 'Inca Kola',
    icon: '🥤',
    copies: 2,
    desc: 'Repite tu lanzamiento de dado y utiliza el nuevo resultado.'
  },
  roba_pista: {
    id: 'roba_pista',
    name: 'Roba una pista',
    icon: '🥷',
    copies: 2,
    desc: 'Toma de un rival una pista que te falte (el rival puede bloquear con Mazamorra).'
  },
  aji_picante: {
    id: 'aji_picante',
    name: 'Ají picante',
    icon: '🌶️',
    copies: 2,
    desc: 'Haz retroceder dos casillas a un rival en el tablero.'
  },
  desvio: {
    id: 'desvio',
    name: 'Desvío',
    icon: '🔀',
    copies: 2,
    desc: 'Intercambia tu posición con otro jugador que esté en los caminos.'
  }
};

// Exactamente 15 Preguntas con sus respuestas correctas sobre el Perú
const BANCO_15_PREGUNTAS = [
  {
    id: 1,
    categoria: 'Geografía',
    enunciado: '¿En qué región natural del Perú se encuentra la ciudadela de Machu Picchu?',
    opciones: ['Costa', 'Sierra', 'Selva'],
    correcta: 1 // Sierra (Ceja de Selva/Sierra Cusco)
  },
  {
    id: 2,
    categoria: 'Historia',
    enunciado: '¿Cuál era la capital principal del Imperio Inca (Tahuantinsuyo)?',
    opciones: ['Cusco', 'Lima', 'Arequipa'],
    correcta: 0 // Cusco
  },
  {
    id: 3,
    categoria: 'Geografía',
    enunciado: '¿Cuál es el lago navegable más alto del mundo ubicado en el Perú?',
    opciones: ['Lago Junín', 'Lago Titicaca', 'Laguna Parón'],
    correcta: 1 // Lago Titicaca
  },
  {
    id: 4,
    categoria: 'Gastronomía',
    enunciado: '¿Cuál es el plato bandera del Perú preparado a base de pescado crudo, limón, cebolla y ají?',
    opciones: ['Ceviche', 'Lomo saltado', 'Causa limeña'],
    correcta: 0 // Ceviche
  },
  {
    id: 5,
    categoria: 'Fauna Peruana',
    enunciado: '¿Cuál es el ave nacional del Perú de plumaje rojizo anaranjado que habita en los bosques de neblina?',
    opciones: ['Gallito de las Rocas', 'Cóndor Andino', 'Picaflor Gigante'],
    correcta: 0 // Gallito de las Rocas
  },
  {
    id: 6,
    categoria: 'Símbolos Patrios',
    enunciado: '¿Qué animal autóctono representa al reino animal en el Escudo Nacional del Perú?',
    opciones: ['La Vicuña', 'La Llama', 'La Alpaca'],
    correcta: 0 // La Vicuña
  },
  {
    id: 7,
    categoria: 'Geografía',
    enunciado: '¿Cuál es el río más caudaloso y largo del mundo que nace en las cumbres nevadas del Perú?',
    opciones: ['Río Amazonas', 'Río Ucayali', 'Río Marañón'],
    correcta: 0 // Río Amazonas
  },
  {
    id: 8,
    categoria: 'Arqueología',
    enunciado: '¿En qué departamento del Perú se encuentran los misteriosos geoglifos de las Líneas de Nazca?',
    opciones: ['Ica', 'Ayacucho', 'Tacna'],
    correcta: 0 // Ica
  },
  {
    id: 9,
    categoria: 'Símbolos Patrios',
    enunciado: '¿Qué árbol medicinal emblemático figura en el Escudo Nacional del Perú?',
    opciones: ['El Árbol de la Quina', 'El Eucalipto', 'El Queñual'],
    correcta: 0 // El Árbol de la Quina
  },
  {
    id: 10,
    categoria: 'Ciudades del Perú',
    enunciado: '¿A qué ciudad del Perú se le conoce como la "Ciudad Blanca" por sus casonas de sillar?',
    opciones: ['Arequipa', 'Huancayo', 'Trujillo'],
    correcta: 0 // Arequipa
  },
  {
    id: 11,
    categoria: 'Agricultura y Tradición',
    enunciado: '¿De qué tubérculo milenario es el Perú centro de origen con más de 3,000 variedades nativas?',
    opciones: ['La Papa', 'La Yuca', 'El Camote'],
    correcta: 0 // La Papa
  },
  {
    id: 12,
    categoria: 'Historia',
    enunciado: '¿Cómo se llama la civilización más antigua de América ubicada en el valle de Supe, Perú?',
    opciones: ['Caral', 'Chavín', 'Wari'],
    correcta: 0 // Caral
  },
  {
    id: 13,
    categoria: 'Danza y Tradición',
    enunciado: '¿Cuál es la elegante danza de la costa peruana que se baila con pañuelos al ritmo de guitarra y cajón?',
    opciones: ['La Marinera', 'El Festejo', 'El Huaylas'],
    correcta: 0 // La Marinera
  },
  {
    id: 14,
    categoria: 'Geografía Andina',
    enunciado: '¿Cuál es el nevado más alto del Perú con 6,768 metros sobre el nivel del mar?',
    opciones: ['Huascarán', 'Alpamayo', 'Yerupajá'],
    correcta: 0 // Huascarán
  },
  {
    id: 15,
    categoria: 'Cultura Inca',
    enunciado: '¿Cómo se llamaban los corredores mensajeros que recorrían los caminos del Inca (Qhapaq Ñan)?',
    opciones: ['Chasquis', 'Curacas', 'Mitimaes'],
    correcta: 0 // Chasquis
  }
];

// ==========================================
// ESTADO DE LA PARTIDA
// ==========================================

let estadoJuego = {
  iniciada: false,
  finalizada: false,
  jugadorActivoIdx: 0,
  jugadores: [],
  mazoEfectos: [],
  preguntasUsadas: [],
  registroLogs: []
};

// ==========================================
// CONTROL DE PANTALLAS (VISTAS)
// ==========================================

const PANTALLAS = [
  'pantalla-inicio',
  'pantalla-partida',
  'pantalla-pregunta',
  'pantalla-sorpresa',
  'pantalla-uso-cartas',
  'pantalla-final'
];

function mostrarPantalla(idPantalla) {
  PANTALLAS.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === idPantalla) {
        el.classList.remove('hidden');
        el.classList.add('active');
      } else {
        el.classList.add('hidden');
        el.classList.remove('active');
      }
    }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// PERSISTENCIA EN LOCALSTORAGE
// ==========================================

function guardarEstado() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoJuego));
  } catch (e) {
    console.error('Error guardando partida:', e);
  }
}

function cargarEstado() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error cargando partida:', e);
  }
  return null;
}

function reiniciarPartidaStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

// ==========================================
// REGISTRO DE HISTORIAL (LOGS)
// ==========================================

function registrarLog(texto) {
  const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  estadoJuego.registroLogs.unshift(`[${hora}] ${texto}`);
  if (estadoJuego.registroLogs.length > 25) estadoJuego.registroLogs.pop();
  actualizarVistaLogs();
  guardarEstado();
}

function actualizarVistaLogs() {
  const container = document.getElementById('partida-log-list');
  if (!container) return;
  container.innerHTML = estadoJuego.registroLogs.map(l => `<div class="log-entry">${l}</div>`).join('');
}

// ==========================================
// PANTALLA 1: INICIO
// Registro de 2 a 4 nombres y elección de fichas sin repetir
// ==========================================

let cantidadJugadoresActual = 3;
let fichasSeleccionadas = ['condor', 'mototaxi', 'llama', 'combi'];

function renderizarPantallaInicio(cantidad) {
  cantidadJugadoresActual = cantidad;
  const container = document.getElementById('inicio-players-container');
  container.innerHTML = '';

  const nombresDefault = ['Ana', 'Carlos', 'Diego', 'Lucía'];

  for (let i = 0; i < cantidad; i++) {
    const fichaSeleccionada = fichasSeleccionadas[i] || FICHAS_CATALOG[i].id;
    fichasSeleccionadas[i] = fichaSeleccionada;

    const card = document.createElement('div');
    card.className = 'player-input-card';
    card.innerHTML = `
      <div class="pic-header">
        <span class="pic-title">Jugador ${i + 1}</span>
      </div>
      <div class="input-box">
        <label for="input-name-${i}">Nombre del explorador:</label>
        <input type="text" id="input-name-${i}" class="input-field" value="${nombresDefault[i]}" maxlength="20" required autocomplete="off">
      </div>
      <div>
        <label class="token-options-label">Elige tu ficha 3D (sin repetir):</label>
        <div class="token-options-grid" data-p-idx="${i}">
          ${FICHAS_CATALOG.map(f => {
            const isSelected = fichaSeleccionada === f.id;
            // Deshabilitada si otro jugador ya la tiene seleccionada
            const isTaken = fichasSeleccionadas.slice(0, cantidad).some((fId, idx) => idx !== i && fId === f.id);
            return `
              <label class="token-choice ${isSelected ? 'selected' : ''} ${isTaken ? 'disabled' : ''}">
                <input type="radio" name="ficha-p-${i}" value="${f.id}" ${isSelected ? 'checked' : ''} ${isTaken ? 'disabled' : ''}>
                <span>${f.icon} ${f.name}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.appendChild(card);
  }

  // Event listener para cambio de fichas
  container.querySelectorAll('.token-options-grid').forEach(grid => {
    grid.addEventListener('change', (e) => {
      const pIdx = parseInt(grid.dataset.pIdx, 10);
      fichasSeleccionadas[pIdx] = e.target.value;
      renderizarPantallaInicio(cantidadJugadoresActual);
    });
  });
}

function iniciarPartidaDesdeInicio() {
  const errorBox = document.getElementById('inicio-error-msg');
  errorBox.classList.add('hidden');

  const jugadores = [];
  const fichasUsadas = new Set();

  for (let i = 0; i < cantidadJugadoresActual; i++) {
    const input = document.getElementById(`input-name-${i}`);
    const nombre = input ? input.value.trim() : `Jugador ${i + 1}`;
    const fichaId = fichasSeleccionadas[i];

    if (!nombre) {
      errorBox.textContent = `Por favor ingresa un nombre para el Jugador ${i + 1}.`;
      errorBox.classList.remove('hidden');
      return;
    }

    if (fichasUsadas.has(fichaId)) {
      errorBox.textContent = `La ficha ${fichaId} está repetida. Cada explorador debe tener una ficha diferente.`;
      errorBox.classList.remove('hidden');
      return;
    }
    fichasUsadas.add(fichaId);

    const fichaObj = FICHAS_CATALOG.find(f => f.id === fichaId);

    jugadores.push({
      id: i,
      name: nombre,
      token: fichaObj,
      pistas: [], // Sol, Montana, Rio
      cartas: []  // Máximo 2 cartas de efectos
    });
  }

  // Generar mazo de 14 cartas de efectos (2 copias de cada uno)
  const mazo = [];
  Object.values(EFECTOS_CATALOG).forEach(efecto => {
    for (let c = 0; c < efecto.copies; c++) {
      mazo.push(efecto.id);
    }
  });

  // Barajar mazo
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
  }

  estadoJuego = {
    iniciada: true,
    finalizada: false,
    jugadorActivoIdx: 0,
    jugadores: jugadores,
    mazoEfectos: mazo,
    preguntasUsadas: [],
    registroLogs: []
  };

  registrarLog(`¡Partida iniciada con ${jugadores.length} jugadores: ${jugadores.map(j => j.name).join(', ')}!`);
  guardarEstado();
  renderizarPantallaPartida();
  mostrarPantalla('pantalla-partida');
}

// ==========================================
// PANTALLA 2: PARTIDA
// Jugador activo, pistas y cartas de todos;
// Botones: Pregunta, Sorpresa, Usar carta, Terminar turno, Llegué al Cuy Dorado
// ==========================================

function getJugadorActivo() {
  return estadoJuego.jugadores[estadoJuego.jugadorActivoIdx];
}

function renderizarPantallaPartida() {
  const activo = getJugadorActivo();
  if (!activo) return;

  // Banner Jugador Activo
  document.getElementById('ap-badge-icon').textContent = activo.token.icon;
  document.getElementById('ap-player-name').textContent = activo.name;
  document.getElementById('ap-player-token').textContent = `Ficha: ${activo.token.name} (${activo.token.color})`;

  // Estado de Todos los Jugadores (Pistas y Cartas)
  const gridContainer = document.getElementById('partida-players-grid');
  gridContainer.innerHTML = estadoJuego.jugadores.map((p, idx) => {
    const isActivo = idx === estadoJuego.jugadorActivoIdx;
    return `
      <div class="player-status-tile ${isActivo ? 'is-active-turn' : ''}" style="border-left: 5px solid ${p.token.hex}">
        <div class="pst-header">
          <div class="pst-name-token">${p.token.icon} ${p.name} (${p.token.name})</div>
          ${isActivo ? '<span class="pst-turn-chip">ACTIVO</span>' : ''}
        </div>

        <div class="pst-row">
          <span class="pst-label">Pistas (${p.pistas.length}/3)</span>
          <div class="pst-pistas-list">
            ${['Sol', 'Montana', 'Rio'].map(k => {
              const tiene = p.pistas.includes(k);
              const info = PISTAS_INFO[k];
              return `<span class="pista-badge ${tiene ? 'has' : 'none'}">${info.icon} ${info.name} ${tiene ? '✓' : ''}</span>`;
            }).join('')}
          </div>
        </div>

        <div class="pst-row">
          <span class="pst-label">Cartas de Efecto (${p.cartas.length}/2)</span>
          <div class="pst-cards-list">
            ${p.cartas.length === 0 ? '<span style="font-size:0.75rem; color:#a8a29e;">Sin cartas</span>' : ''}
            ${p.cartas.map(cId => {
              const c = EFECTOS_CATALOG[cId];
              return `<span class="card-badge-pill" title="${c.desc}">${c.icon} ${c.name}</span>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Contador de Mazo
  document.getElementById('partida-deck-indicator').textContent = `Mazo de efectos: ${estadoJuego.mazoEfectos.length}/14`;

  actualizarVistaLogs();
}

function terminarTurno() {
  const anterior = getJugadorActivo();
  estadoJuego.jugadorActivoIdx = (estadoJuego.jugadorActivoIdx + 1) % estadoJuego.jugadores.length;
  const nuevo = getJugadorActivo();

  registrarLog(`Termina el turno de ${anterior.name}. Turno de <strong>${nuevo.name}</strong> (${nuevo.token.name}).`);
  guardarEstado();
  renderizarPantallaPartida();
}

// ==========================================
// PANTALLA 3: PREGUNTA
// Enunciado, tres respuestas y resultado. Si aciertas, eliges pista faltante.
// ==========================================

let preguntaActual = null;
let yaRespondioPregunta = false;

function abrirPantallaPregunta() {
  const activo = getJugadorActivo();
  yaRespondioPregunta = false;

  // Filtrar preguntas no usadas
  let disponibles = BANCO_15_PREGUNTAS.filter(q => !estadoJuego.preguntasUsadas.includes(q.id));
  if (disponibles.length === 0) {
    // Si se agotan las 15, se reinician
    estadoJuego.preguntasUsadas = [];
    disponibles = [...BANCO_15_PREGUNTAS];
    registrarLog('Se han respondido las 15 preguntas de trivia. ¡Se reinicia el mazo de preguntas!');
  }

  const randomIdx = Math.floor(Math.random() * disponibles.length);
  preguntaActual = disponibles[randomIdx];
  estadoJuego.preguntasUsadas.push(preguntaActual.id);
  guardarEstado();

  // Render UI
  document.getElementById('pregunta-player-indicator').textContent = `Explorador: ${activo.name} (${activo.token.name})`;
  document.getElementById('pregunta-category-tag').textContent = preguntaActual.categoria;
  document.getElementById('pregunta-texto').textContent = preguntaActual.enunciado;

  // Ocultar resultados previos
  document.getElementById('pregunta-resultado-box').classList.add('hidden');
  document.getElementById('pregunta-selector-pistas').classList.add('hidden');

  // Renderizar 3 opciones
  const opcionesContainer = document.getElementById('pregunta-opciones');
  opcionesContainer.innerHTML = preguntaActual.opciones.map((opt, idx) => `
    <button class="q-btn-option" data-idx="${idx}">
      <strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}
    </button>
  `).join('');

  opcionesContainer.querySelectorAll('.q-btn-option').forEach(btn => {
    btn.addEventListener('click', () => responderPregunta(parseInt(btn.dataset.idx, 10)));
  });

  mostrarPantalla('pantalla-pregunta');
}

function responderPregunta(opcionSeleccionada) {
  if (yaRespondioPregunta) return;
  yaRespondioPregunta = true;

  const activo = getJugadorActivo();
  const botones = document.querySelectorAll('#pregunta-opciones .q-btn-option');
  botones.forEach(b => b.disabled = true);

  const esCorrecta = opcionSeleccionada === preguntaActual.correcta;
  botones[opcionSeleccionada].classList.add(esCorrecta ? 'correct' : 'incorrect');
  if (!esCorrecta) {
    botones[preguntaActual.correcta].classList.add('correct');
  }

  const resBox = document.getElementById('pregunta-resultado-box');
  const resIcon = document.getElementById('pregunta-res-icon');
  const resTitle = document.getElementById('pregunta-res-title');
  const resDesc = document.getElementById('pregunta-res-desc');

  if (esCorrecta) {
    resBox.className = 'result-banner success';
    resIcon.textContent = '🎉';
    resTitle.textContent = '¡RESPUESTA CORRECTA!';

    // Pistas que le faltan
    const faltantes = ['Sol', 'Montana', 'Rio'].filter(k => !activo.pistas.includes(k));

    if (faltantes.length === 0) {
      resDesc.innerHTML = `¡Excelente! Ya posees las 3 pistas sagradas (Sol ☀️, Montaña ⛰️ y Río 🌊). ¡Dirígete al centro para encontrar al Cuy Dorado!`;
      registrarLog(`<strong>${activo.name}</strong> acertó la pregunta (Ya tiene todas las pistas).`);
    } else {
      resDesc.innerHTML = `Has respondido con éxito. Elige una de las pistas que te faltan a continuación:`;
      mostrarSelectorPistasFaltantes(faltantes);
    }
  } else {
    resBox.className = 'result-banner error';
    resIcon.textContent = '❌';
    resTitle.textContent = '¡RESPUESTA INCORRECTA!';
    resDesc.innerHTML = `La respuesta correcta era: <strong>${preguntaActual.opciones[preguntaActual.correcta]}</strong>. No obtienes ninguna pista en este turno.`;
    registrarLog(`<strong>${activo.name}</strong> falló la pregunta de trivia.`);
  }

  resBox.classList.remove('hidden');
}

function mostrarSelectorPistasFaltantes(faltantes) {
  const selectorBox = document.getElementById('pregunta-selector-pistas');
  const grid = document.getElementById('pregunta-pistas-grid');
  grid.innerHTML = '';

  faltantes.forEach(pistaKey => {
    const info = PISTAS_INFO[pistaKey];
    const btn = document.createElement('button');
    btn.className = 'btn-pick-pista';
    btn.innerHTML = `${info.icon} Tomar ${info.name}`;
    btn.addEventListener('click', () => {
      const activo = getJugadorActivo();
      if (!activo.pistas.includes(pistaKey)) {
        activo.pistas.push(pistaKey);
        registrarLog(`<strong>${activo.name}</strong> obtuvo la pista sagrada: <strong>${info.icon} ${info.name}</strong>.`);
        guardarEstado();
      }
      selectorBox.classList.add('hidden');
      document.getElementById('pregunta-res-desc').innerHTML = `
        ¡Excelente! Has reclamado la pista <strong>${info.icon} ${info.name}</strong>.<br>
        📌 <strong>¡Toma tu tarjeta física de ${info.name}!</strong>
      `;
    });
    grid.appendChild(btn);
  });

  selectorBox.classList.remove('hidden');
}

// ==========================================
// PANTALLA 4: SORPRESA
// Carta sorteada e indicación de qué tarjeta física tomar.
// ==========================================

let cartaSorteadaId = null;

function abrirPantallaSorpresa() {
  const activo = getJugadorActivo();

  if (estadoJuego.mazoEfectos.length === 0) {
    alert('¡El mazo de cartas de efectos está vacío temporalmente! Las cartas volverán al mazo cuando sean utilizadas.');
    return;
  }

  // Sorteo de carta del mazo
  const randomIdx = Math.floor(Math.random() * estadoJuego.mazoEfectos.length);
  cartaSorteadaId = estadoJuego.mazoEfectos.splice(randomIdx, 1)[0];
  const carta = EFECTOS_CATALOG[cartaSorteadaId];

  // Renderizar la carta sorteada
  document.getElementById('sorpresa-card-icon').textContent = carta.icon;
  document.getElementById('sorpresa-card-name').textContent = carta.name;
  document.getElementById('sorpresa-card-desc').textContent = carta.desc;
  document.getElementById('sorpresa-physical-name').textContent = `${carta.icon} ${carta.name}`;

  const descarteBox = document.getElementById('sorpresa-limite-descarte');
  const btnAceptar = document.getElementById('btn-aceptar-sorpresa');

  // Límite de 2 cartas
  if (activo.cartas.length >= 2) {
    // Debe descartar una
    descarteBox.classList.remove('hidden');
    btnAceptar.classList.add('hidden');

    const optionsContainer = document.getElementById('sorpresa-discard-options');
    optionsContainer.innerHTML = '';

    // Opción 1: Descartar la recién sorteada
    const btnD1 = document.createElement('button');
    btnD1.className = 'btn-discard-option';
    btnD1.innerHTML = `Devolver al mazo la nueva: <strong>${carta.icon} ${carta.name}</strong>`;
    btnD1.addEventListener('click', () => {
      estadoJuego.mazoEfectos.push(cartaSorteadaId);
      registrarLog(`<strong>${activo.name}</strong> sorteó <strong>${carta.name}</strong> pero la devolvió al mazo por límite de cartas.`);
      guardarEstado();
      renderizarPantallaPartida();
      mostrarPantalla('pantalla-partida');
    });
    optionsContainer.appendChild(btnD1);

    // Opciones 2 y 3: Descartar una de las 2 que ya tenía
    activo.cartas.forEach((cId, idx) => {
      const viejaCarta = EFECTOS_CATALOG[cId];
      const btnD2 = document.createElement('button');
      btnD2.className = 'btn-discard-option';
      btnD2.innerHTML = `Devolver al mazo <strong>${viejaCarta.icon} ${viejaCarta.name}</strong> y quedarme con <strong>${carta.name}</strong>`;
      btnD2.addEventListener('click', () => {
        // Devolver la vieja al mazo
        estadoJuego.mazoEfectos.push(cId);
        activo.cartas.splice(idx, 1);
        // Incorporar la nueva
        activo.cartas.push(cartaSorteadaId);
        registrarLog(`<strong>${activo.name}</strong> devolvió <strong>${viejaCarta.name}</strong> al mazo y tomó <strong>${carta.name}</strong>.`);
        guardarEstado();
        renderizarPantallaPartida();
        mostrarPantalla('pantalla-partida');
      });
      optionsContainer.appendChild(btnD2);
    });
  } else {
    // Si tiene menos de 2 cartas, simplemente la toma
    descarteBox.classList.add('hidden');
    btnAceptar.classList.remove('hidden');

    btnAceptar.onclick = () => {
      activo.cartas.push(cartaSorteadaId);
      registrarLog(`<strong>${activo.name}</strong> obtuvo la carta de efecto: <strong>${carta.icon} ${carta.name}</strong> (Toma la tarjeta física).`);
      guardarEstado();
      renderizarPantallaPartida();
      mostrarPantalla('pantalla-partida');
    };
  }

  mostrarPantalla('pantalla-sorpresa');
}

// ==========================================
// PANTALLA 5: USO DE CARTAS
// Selección del efecto, del rival cuando corresponda y de una posible protección.
// ==========================================

let cartaElegidaParaUsar = null;
let rivalElegido = null;
let pistaRoboElegida = null;

function abrirPantallaUsoCartas() {
  const activo = getJugadorActivo();

  document.getElementById('uso-cartas-intro').textContent = `Cartas en mano de: ${activo.name} (${activo.token.name})`;

  // Reset de pasos
  document.getElementById('uso-step-seleccionar-carta').classList.remove('hidden');
  document.getElementById('uso-step-seleccionar-rival').classList.add('hidden');
  document.getElementById('uso-step-seleccionar-pista').classList.add('hidden');
  document.getElementById('uso-step-proteccion').classList.add('hidden');
  document.getElementById('uso-step-resultado').classList.add('hidden');

  const container = document.getElementById('uso-my-cards-container');
  const emptyMsg = document.getElementById('uso-no-cards-msg');

  if (activo.cartas.length === 0) {
    container.innerHTML = '';
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');
    container.innerHTML = activo.cartas.map((cId, idx) => {
      const c = EFECTOS_CATALOG[cId];
      return `
        <button class="card-playable-btn" data-c-idx="${idx}">
          <div class="cpb-icon">${c.icon}</div>
          <strong class="cpb-name">${c.name}</strong>
          <p class="cpb-desc">${c.desc}</p>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.card-playable-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cIdx = parseInt(btn.dataset.cIdx, 10);
        procesarCartaSeleccionada(cIdx);
      });
    });
  }

  mostrarPantalla('pantalla-uso-cartas');
}

function procesarCartaSeleccionada(cIdx) {
  const activo = getJugadorActivo();
  const cId = activo.cartas[cIdx];
  const cInfo = EFECTOS_CATALOG[cId];
  cartaElegidaParaUsar = { id: cId, index: cIdx, info: cInfo };

  if (cId === 'mazamorra') {
    alert('La "Mazamorra morada" es una carta de reacción defensiva. Se usa cuando un rival intenta atacarte con "Roba una pista", "Ají picante" o "Desvío".');
    return;
  }

  if (cId === 'ceviche') {
    // Ceviche: Movimiento extra
    descartarCartaAlMazo(activo, cIdx);
    registrarLog(`<strong>${activo.name}</strong> usó <strong>Ceviche 🍲</strong>: ¡Lanza el dado y realiza un movimiento extra!`);
    mostrarResultadoUso('🍲 Ceviche Activado', 'Lanza el dado físico y realiza un movimiento extra en el tablero (este movimiento no activa casilla). Se devuelve la tarjeta física al pozo.');
    return;
  }

  if (cId === 'pollo_brasa') {
    // Pollo a la brasa: Pregunta extra
    descartarCartaAlMazo(activo, cIdx);
    registrarLog(`<strong>${activo.name}</strong> usó <strong>Pollo a la brasa 🍗</strong>: ¡Responde una pregunta adicional!`);
    abrirPantallaPregunta();
    return;
  }

  if (cId === 'inca_kola') {
    // Inca Kola: Repetir lanzamiento
    descartarCartaAlMazo(activo, cIdx);
    registrarLog(`<strong>${activo.name}</strong> usó <strong>Inca Kola 🥤</strong>: ¡Vuelve a lanzar el dado y usa el nuevo resultado!`);
    mostrarResultadoUso('🥤 Inca Kola Activada', 'Vuelve a lanzar el dado físico y utiliza el nuevo resultado. Se devuelve la tarjeta física al pozo.');
    return;
  }

  // Cartas que requieren selección de rival (Roba una pista, Ají picante, Desvío)
  configurarSeleccionRival(cInfo);
}

function configurarSeleccionRival(cInfo) {
  document.getElementById('uso-step-seleccionar-rival').classList.remove('hidden');

  const rivalsContainer = document.getElementById('uso-rivals-container');
  rivalsContainer.innerHTML = '';
  rivalElegido = null;
  pistaRoboElegida = null;

  const rivales = estadoJuego.jugadores.filter(p => p.id !== getJugadorActivo().id);

  rivales.forEach(rival => {
    const btn = document.createElement('button');
    btn.className = 'btn-select-target';
    btn.innerHTML = `${rival.token.icon} ${rival.name} (${rival.token.name})`;
    btn.addEventListener('click', () => {
      rivalsContainer.querySelectorAll('.btn-select-target').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      rivalElegido = rival;
      continuarTrasElegirRival();
    });
    rivalsContainer.appendChild(btn);
  });
}

function continuarTrasElegirRival() {
  const activo = getJugadorActivo();
  const cId = cartaElegidaParaUsar.id;

  if (cId === 'roba_pista') {
    // Debe seleccionar una pista que el rival tenga y que al activo le falte
    const pistasRobables = rivalElegido.pistas.filter(p => !activo.pistas.includes(p));
    const pistaStep = document.getElementById('uso-step-seleccionar-pista');
    const grid = document.getElementById('uso-pistas-steal-container');
    grid.innerHTML = '';

    if (pistasRobables.length === 0) {
      grid.innerHTML = `<p style="color:#dc2626; font-size:0.9rem;">${rivalElegido.name} no tiene ninguna pista que a ti te falte. Elige a otro rival.</p>`;
      pistaStep.classList.remove('hidden');
      document.getElementById('uso-step-proteccion').classList.add('hidden');
      return;
    }

    pistasRobables.forEach(pKey => {
      const pInfo = PISTAS_INFO[pKey];
      const btn = document.createElement('button');
      btn.className = 'btn-select-target';
      btn.innerHTML = `${pInfo.icon} Robar ${pInfo.name}`;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.btn-select-target').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        pistaRoboElegida = pKey;
        verificarProteccionMazamorra();
      });
      grid.appendChild(btn);
    });

    pistaStep.classList.remove('hidden');
  } else {
    // Ají picante o Desvío
    document.getElementById('uso-step-seleccionar-pista').classList.add('hidden');
    verificarProteccionMazamorra();
  }
}

function verificarProteccionMazamorra() {
  const rivalTieneMazamorra = rivalElegido.cartas.includes('mazamorra');
  const proteccionBox = document.getElementById('uso-step-proteccion');

  if (rivalTieneMazamorra) {
    proteccionBox.classList.remove('hidden');
    document.getElementById('uso-proteccion-texto').innerHTML = `
      El rival <strong>${rivalElegido.name}</strong> posee la carta física de <strong>Mazamorra Morada</strong>.<br>
      ¿Desea usarla en este momento para cancelar el efecto de <strong>${cartaElegidaParaUsar.info.name}</strong>?
    `;

    document.getElementById('btn-defensa-si').onclick = () => aplicarEfectoConDefensa(true);
    document.getElementById('btn-defensa-no').onclick = () => aplicarEfectoConDefensa(false);
  } else {
    proteccionBox.classList.add('hidden');
    // Aplica directo sin defensa
    aplicarEfectoConDefensa(false);
  }
}

function aplicarEfectoConDefensa(seDefendio) {
  const activo = getJugadorActivo();
  const rival = rivalElegido;
  const cId = cartaElegidaParaUsar.id;

  // Consumir carta del atacante
  descartarCartaAlMazo(activo, cartaElegidaParaUsar.index);

  if (seDefendio) {
    // Consumir la mazamorra del rival
    const mIdx = rival.cartas.indexOf('mazamorra');
    if (mIdx !== -1) {
      descartarCartaAlMazo(rival, mIdx);
    }

    registrarLog(`🛡️ <strong>${rival.name}</strong> usó <strong>Mazamorra morada</strong> y canceló el efecto de <strong>${cartaElegidaParaUsar.info.name}</strong> de <strong>${activo.name}</strong>.`);
    mostrarResultadoUso('🛡️ ¡Efecto Cancelado con Mazamorra!', `${rival.name} se defendió con su Mazamorra morada. Ambas cartas de efectos vuelven al mazo disponible.`);
  } else {
    if (cId === 'roba_pista') {
      const pKey = pistaRoboElegida;
      const rIdx = rival.pistas.indexOf(pKey);
      if (rIdx !== -1) {
        rival.pistas.splice(rIdx, 1);
        activo.pistas.push(pKey);
      }
      registrarLog(`🥷 <strong>${activo.name}</strong> robó la pista <strong>${PISTAS_INFO[pKey].icon} ${PISTAS_INFO[pKey].name}</strong> a <strong>${rival.name}</strong>.`);
      mostrarResultadoUso('🥷 ¡Robo Exitoso!', `${activo.name} le roba la pista ${PISTAS_INFO[pKey].icon} ${PISTAS_INFO[pKey].name} a ${rival.name}. ¡${rival.name} debe entregarle la tarjeta física!`);
    } else if (cId === 'aji_picante') {
      registrarLog(`🌶️ <strong>${activo.name}</strong> usó <strong>Ají picante</strong>: ¡${rival.name} retrocede 2 casillas en el tablero!`);
      mostrarResultadoUso('🌶️ ¡Ají Picante Aplicado!', `${rival.name} debe retroceder dos casillas en el tablero físico.`);
    } else if (cId === 'desvio') {
      registrarLog(`🔀 <strong>${activo.name}</strong> usó <strong>Desvío</strong> con <strong>${rival.name}</strong>: ¡Intercambian posiciones en el tablero!`);
      mostrarResultadoUso('🔀 ¡Desvío Aplicado!', `${activo.name} y ${rival.name} deben intercambiar sus fichas en el tablero físico.`);
    }
  }

  guardarEstado();
}

function descartarCartaAlMazo(jugador, cIdx) {
  const cId = jugador.cartas[cIdx];
  jugador.cartas.splice(cIdx, 1);
  estadoJuego.mazoEfectos.push(cId);
}

function mostrarResultadoUso(titulo, desc) {
  document.getElementById('uso-step-seleccionar-carta').classList.add('hidden');
  document.getElementById('uso-step-seleccionar-rival').classList.add('hidden');
  document.getElementById('uso-step-seleccionar-pista').classList.add('hidden');
  document.getElementById('uso-step-proteccion').classList.add('hidden');

  const resBox = document.getElementById('uso-step-resultado');
  document.getElementById('uso-res-title').textContent = titulo;
  document.getElementById('uso-res-desc').innerHTML = desc;
  resBox.classList.remove('hidden');
}

// ==========================================
// PANTALLA 6: FINAL
// Botón Llegué al Cuy Dorado y comprobación de las tres pistas.
// La posición se confirma entre los jugadores.
// ==========================================

function abrirPantallaFinal() {
  const activo = getJugadorActivo();

  document.getElementById('final-player-name').textContent = `Explorador: ${activo.name} (${activo.token.name})`;

  // Comprobar las 3 pistas
  const tieneSol = activo.pistas.includes('Sol');
  const tieneMontana = activo.pistas.includes('Montana');
  const tieneRio = activo.pistas.includes('Rio');

  const solItem = document.getElementById('check-sol');
  solItem.className = `pista-check-item ${tieneSol ? 'ok' : 'fail'}`;
  document.getElementById('chk-sol-status').textContent = tieneSol ? 'Posee ✓' : 'Falta ✗';

  const montanaItem = document.getElementById('check-montana');
  montanaItem.className = `pista-check-item ${tieneMontana ? 'ok' : 'fail'}`;
  document.getElementById('chk-montana-status').textContent = tieneMontana ? 'Posee ✓' : 'Falta ✗';

  const rioItem = document.getElementById('check-rio');
  rioItem.className = `pista-check-item ${tieneRio ? 'ok' : 'fail'}`;
  document.getElementById('chk-rio-status').textContent = tieneRio ? 'Posee ✓' : 'Falta ✗';

  const tieneTodas = tieneSol && tieneMontana && tieneRio;

  const faltaBox = document.getElementById('final-falta-pistas-box');
  const confirmBox = document.getElementById('final-confirmacion-posicion-box');
  const ganadorBox = document.getElementById('final-ganador-box');

  ganadorBox.classList.add('hidden');

  if (!tieneTodas) {
    const faltantes = [];
    if (!tieneSol) faltantes.push('Sol ☀️');
    if (!tieneMontana) faltantes.push('Montaña ⛰️');
    if (!tieneRio) faltantes.push('Río 🌊');

    faltaBox.classList.remove('hidden');
    confirmBox.classList.add('hidden');
    document.getElementById('final-falta-pistas-desc').textContent = `Te falta(n) la(s) siguiente(s) pista(s): ${faltantes.join(', ')}. Debes reunirlas antes de coronarte con el Cuy Dorado.`;
  } else {
    faltaBox.classList.add('hidden');
    confirmBox.classList.remove('hidden');
  }

  mostrarPantalla('pantalla-final');
}

function declararGanadorPartida() {
  const activo = getJugadorActivo();
  estadoJuego.finalizada = true;

  registrarLog(`👑🏆 ¡VICTORIA! <strong>${activo.name}</strong> reunió las 3 pistas sagradas y alcanzó al <strong>Cuy Dorado</strong> en el centro.`);
  guardarEstado();

  document.getElementById('final-confirmacion-posicion-box').classList.add('hidden');
  document.getElementById('final-footer-back').classList.add('hidden');

  const ganadorBox = document.getElementById('final-ganador-box');
  document.getElementById('winner-name-text').textContent = `¡${activo.name} es el Gran Campeón!`;
  ganadorBox.classList.remove('hidden');
}

// ==========================================
// EVENT LISTENERS GLOBALES
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Selector de cantidad de jugadores en Pantalla 1
  document.querySelectorAll('.btn-count').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-count').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const count = parseInt(btn.dataset.count, 10);
      renderizarPantallaInicio(count);
    });
  });

  // Botón Iniciar Partida en Pantalla 1
  document.getElementById('btn-iniciar-partida').addEventListener('click', iniciarPartidaDesdeInicio);

  // Botones de Navegación de Pantalla 2 (Partida)
  document.getElementById('btn-ir-pregunta').addEventListener('click', abrirPantallaPregunta);
  document.getElementById('btn-ir-sorpresa').addEventListener('click', abrirPantallaSorpresa);
  document.getElementById('btn-ir-usar-carta').addEventListener('click', abrirPantallaUsoCartas);
  document.getElementById('btn-ir-final').addEventListener('click', abrirPantallaFinal);
  document.getElementById('btn-terminar-turno').addEventListener('click', terminarTurno);

  // Botones de Regreso a la Partida
  document.getElementById('btn-volver-partida-pregunta').addEventListener('click', () => {
    renderizarPantallaPartida();
    mostrarPantalla('pantalla-partida');
  });

  document.getElementById('btn-volver-partida-uso').addEventListener('click', () => {
    renderizarPantallaPartida();
    mostrarPantalla('pantalla-partida');
  });

  document.getElementById('btn-volver-partida-final').addEventListener('click', () => {
    renderizarPantallaPartida();
    mostrarPantalla('pantalla-partida');
  });

  // Confirmación de posición en Pantalla 6 (Final)
  document.getElementById('btn-confirmar-llegada-si').addEventListener('click', declararGanadorPartida);
  document.getElementById('btn-confirmar-llegada-no').addEventListener('click', () => {
    renderizarPantallaPartida();
    mostrarPantalla('pantalla-partida');
  });

  // Nueva Partida
  document.getElementById('btn-global-nueva-partida').addEventListener('click', () => {
    if (confirm('¿Deseas iniciar una nueva partida? Se reiniciarán los datos actuales.')) {
      reiniciarPartidaStorage();
      renderizarPantallaInicio(3);
      mostrarPantalla('pantalla-inicio');
    }
  });

  document.getElementById('btn-final-nueva-partida').addEventListener('click', () => {
    reiniciarPartidaStorage();
    renderizarPantallaInicio(3);
    mostrarPantalla('pantalla-inicio');
  });

  // Cargar estado previo o mostrar inicio
  const guardado = cargarEstado();
  if (guardado && guardado.iniciada && !guardado.finalizada) {
    estadoJuego = guardado;
    renderizarPantallaPartida();
    mostrarPantalla('pantalla-partida');
  } else {
    renderizarPantallaInicio(3);
    mostrarPantalla('pantalla-inicio');
  }
});
