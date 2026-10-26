/**
 * EN BUSCA DEL CUY DORADO - LÓGICA OFICIAL DEL JUEGO
 * Desarrollado con JavaScript vanilla, Web Audio API y LocalStorage
 */

// ==========================================
// CONFIGURACIÓN Y CONSTANTES
// ==========================================

const STORAGE_KEY = 'cuy_dorado_game_state_v1';

// Catálogo de Fichas Oficiales
const TOKENS_CATALOG = [
  { id: 'condor', name: 'Cóndor', icon: '🦅', colorName: 'Negro / Violeta', colorHex: '#4c1d95', borderHex: '#7c3aed' },
  { id: 'mototaxi', name: 'Mototaxi', icon: '🛺', colorName: 'Rojo Carmín', colorHex: '#be123c', borderHex: '#e11d48' },
  { id: 'llama', name: 'Llama', icon: '🦙', colorName: 'Amarillo Dorado', colorHex: '#d97706', borderHex: '#f59e0b' },
  { id: 'combi', name: 'Combi', icon: '🚐', colorName: 'Azul Marino', colorHex: '#1d4ed8', borderHex: '#3b82f6' }
];

// Pistas Sagradas
const PISTAS_KEYS = ['Sol', 'Montana', 'Rio'];
const PISTAS_INFO = {
  Sol: { name: 'Sol', icon: '☀️', desc: 'El Inti sagrado de los Andes' },
  Montana: { name: 'Montaña', icon: '⛰️', desc: 'Las cumbres de los Apus protectores' },
  Rio: { name: 'Río', icon: '🌊', desc: 'Las aguas sagradas del Amazonas y Vilcanota' }
};

// Catálogo de Efectos (7 tipos, 2 copias cada uno = 14 cartas en total)
const EFFECTS_CATALOG = {
  ceviche: {
    id: 'ceviche',
    name: 'Ceviche',
    icon: '🍲',
    type: 'movimiento',
    copies: 2,
    desc: 'Lanza el dado y realiza un movimiento extra (no activa casilla).',
    requiresTarget: false
  },
  pollo_brasa: {
    id: 'pollo_brasa',
    name: 'Pollo a la brasa',
    icon: '🍗',
    type: 'sabiduria',
    copies: 2,
    desc: 'Responde una pregunta adicional para intentar obtener una pista.',
    requiresTarget: false
  },
  mazamorra: {
    id: 'mazamorra',
    name: 'Mazamorra morada',
    icon: '🥣',
    type: 'defensa',
    copies: 2,
    desc: 'Cancela un robo o sabotaje contra ti (se usa como reacción).',
    requiresTarget: false,
    isPassiveReaction: true
  },
  inca_kola: {
    id: 'inca_kola',
    name: 'Inca Kola',
    icon: '🥤',
    type: 'suerte',
    copies: 2,
    desc: 'Repite tu lanzamiento y utiliza el nuevo resultado.',
    requiresTarget: false
  },
  roba_pista: {
    id: 'roba_pista',
    name: 'Roba una pista',
    icon: '🥷',
    type: 'ataque',
    copies: 2,
    desc: 'Toma de un rival una pista que te falte.',
    requiresTarget: true,
    targetType: 'pista_rival'
  },
  aji_picante: {
    id: 'aji_picante',
    name: 'Ají picante',
    icon: '🌶️',
    type: 'sabotaje',
    copies: 2,
    desc: 'Haz retroceder dos casillas a un rival.',
    requiresTarget: true,
    targetType: 'rival_solo'
  },
  desvio: {
    id: 'desvio',
    name: 'Desvío',
    icon: '🔀',
    type: 'estrategia',
    copies: 2,
    desc: 'Intercambia tu posición con otro jugador que esté en los caminos.',
    requiresTarget: true,
    targetType: 'rival_solo'
  }
};

// Banco de Preguntas sobre el Perú (Trivia Cultural, Geográfica e Histórica)
const QUESTIONS_BANK = [
  {
    id: 1,
    category: 'Geografía',
    question: '¿En qué región natural del Perú se encuentra la ciudadela de Machu Picchu?',
    options: ['Costa', 'Sierra', 'Selva'],
    correct: 1 // Sierra (Ceja de Selva/Sierra de Cusco)
  },
  {
    id: 2,
    category: 'Cultura e Historia',
    question: '¿Cuál era la capital principal del Imperio Inca (Tahuantinsuyo)?',
    options: ['Cusco', 'Arequipa', 'Lima'],
    correct: 0
  },
  {
    id: 3,
    category: 'Geografía',
    question: '¿Cuál es el lago navegable más alto del mundo, compartido entre Perú y Bolivia?',
    options: ['Lago Junín', 'Lago Titicaca', 'Laguna de Llanganuco'],
    correct: 1
  },
  {
    id: 4,
    category: 'Gastronomía',
    question: '¿Cuál es el plato bandera del Perú preparado tradicionalmente a base de pescado crudo, limón, cebolla y ají?',
    options: ['Ceviche', 'Lomo saltado', 'Ají de gallina'],
    correct: 0
  },
  {
    id: 5,
    category: 'Fauna Peruana',
    question: '¿Cuál es el ave nacional del Perú, conocida por su brillante plumaje anaranjado y cresta?',
    options: ['El Cóndor Andino', 'El Gallito de las Rocas', 'El Colibrí Maravilloso'],
    correct: 1
  },
  {
    id: 6,
    category: 'Fauna y Símbolos',
    question: '¿Qué animal autóctono aparece en el Escudo Nacional representando el reino animal del Perú?',
    options: ['La Vicuña', 'La Llama', 'La Alpaca'],
    correct: 0
  },
  {
    id: 7,
    category: 'Geografía y Selva',
    question: '¿Cuál es el río más caudaloso y largo del mundo que nace en las cumbres nevadas del Perú?',
    options: ['Río Ucayali', 'Río Amazonas', 'Río Marañón'],
    correct: 1
  },
  {
    id: 8,
    category: 'Arqueología',
    question: '¿En qué departamento del Perú se encuentran los misteriosos geoglifos gigantes conocidos como las Líneas de Nazca?',
    options: ['Ica', 'Arequipa', 'Moquegua'],
    correct: 0
  },
  {
    id: 9,
    category: 'Flora y Recursos',
    question: '¿Qué árbol medicinal emblemático figura en el Escudo Nacional del Perú?',
    options: ['El Árbol de la Quina', 'El Queñual', 'El Algarrobo'],
    correct: 0
  },
  {
    id: 10,
    category: 'Ciudades del Perú',
    question: '¿A qué hermosa ciudad peruana se le conoce como la "Ciudad Blanca" debido a sus construcciones de sillar volcánico?',
    options: ['Arequipa', 'Ayacucho', 'Trujillo'],
    correct: 0
  },
  {
    id: 11,
    category: 'Gastronomía y Tradición',
    question: '¿De qué tubérculo milenario es el Perú el centro de origen y cuenta con más de 3,000 variedades nativas?',
    options: ['La Yuca', 'La Papa', 'El Camote'],
    correct: 1
  },
  {
    id: 12,
    category: 'Historia y Arqueología',
    question: '¿Cómo se llama la civilización más antigua de América, ubicada en el valle de Supe al norte de Lima?',
    options: ['Caral', 'Chavín', 'Moche'],
    correct: 0
  },
  {
    id: 13,
    category: 'Tradición y Danza',
    question: '¿Cuál es la danza tradicional de la costa peruana caracterizada por el elegante movimiento de pañuelos y zapateo?',
    options: ['La Marinera', 'El Huaylas', 'La Diablada'],
    correct: 0
  },
  {
    id: 14,
    category: 'Geografía Andina',
    question: '¿Cuál es el nevado más alto del Perú con 6,768 metros sobre el nivel del mar?',
    options: ['Alpamayo', 'Huascarán', 'Yerupajá'],
    correct: 1
  },
  {
    id: 15,
    category: 'Cultura Inca',
    question: '¿Qué nombre recibían los rápidos mensajeros corredores que recorrían los caminos del Inca (Qhapaq Ñan)?',
    options: ['Chasquis', 'Curacas', 'Mitimaes'],
    correct: 0
  },
  {
    id: 16,
    category: 'Fauna de la Selva',
    question: '¿Qué gran roedor andino y mascota milenaria de los Andes da nombre a nuestro juego?',
    options: ['El Cuy (Cobayo)', 'La Vizcacha', 'El Ronsoco'],
    correct: 0
  },
  {
    id: 17,
    category: 'Cultura y Fiestas',
    question: '¿En qué mes y en qué fecha se celebra el Inti Raymi (Fiesta del Sol) en la fortaleza de Sacsayhuamán?',
    options: ['24 de Junio', '28 de Julio', '1 de Enero'],
    correct: 0
  },
  {
    id: 18,
    category: 'Gastronomía',
    question: '¿Qué postre morado tradicional de Lima se prepara típicamente en octubre junto al arroz con leche?',
    options: ['Mazamorra morada', 'Picarones', 'Suspiro a la limeña'],
    correct: 0
  },
  {
    id: 19,
    category: 'Arqueología',
    question: '¿En qué departamento se descubrieron las majestuosas tumbas del Señor de Sipán?',
    options: ['Lambayeque', 'La Libertad', 'Piura'],
    correct: 0
  },
  {
    id: 20,
    category: 'Geografía del Perú',
    question: '¿Cuál es el cañón más profundo de Arequipa donde se suele avistar el vuelo majestuoso del Cóndor?',
    options: ['Cañón del Colca', 'Cañón del Pato', 'Cañón de Tinajani'],
    correct: 0
  }
];

// ==========================================
// ESTADO GLOBAL DE LA PARTIDA
// ==========================================

let gameState = {
  isStarted: false,
  isFinished: false,
  winner: null,
  activePlayerIndex: 0,
  players: [],
  // Mazo de efectos: lista de ids de cartas disponibles para sortear
  effectDeck: [],
  // Preguntas ya usadas en esta partida para no repetir
  usedQuestionsIds: [],
  // Historial de eventos
  logs: []
};

// ==========================================
// SISTEMA DE AUDIO (Web Audio API)
// ==========================================

let soundEnabled = true;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'card') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'dice') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'victory') {
      // Fanfarria andina
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + idx * 0.12);
        g.gain.setValueAtTime(0.25, now + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.3);
        o.start(now + idx * 0.12);
        o.stop(now + idx * 0.12 + 0.3);
      });
    }
  } catch (e) {
    console.warn('Audio no soportado o bloqueado por el navegador', e);
  }
}

// ==========================================
// INICIALIZACIÓN DEL MAZO Y REGLAS
// ==========================================

function createFullEffectDeck() {
  const deck = [];
  Object.values(EFFECTS_CATALOG).forEach(effect => {
    for (let i = 0; i < effect.copies; i++) {
      deck.push(effect.id);
    }
  });
  return shuffleArray(deck);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ==========================================
// GESTIÓN DE LOCALSTORAGE
// ==========================================

function saveStateToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.error('Error guardando en localStorage:', e);
  }
}

function loadStateFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error cargando de localStorage:', e);
  }
  return null;
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

// ==========================================
// REGISTRO DE LOGS / HISTORIAL
// ==========================================

function addLog(message, type = 'info') {
  const entry = {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    message,
    type
  };
  gameState.logs.unshift(entry);
  if (gameState.logs.length > 40) gameState.logs.pop();
  renderLogs();
  saveStateToStorage();
}

function renderLogs() {
  const container = document.getElementById('game-log-entries');
  if (!container) return;
  container.innerHTML = gameState.logs.map(log => `
    <div class="log-item ${log.type}">
      <span style="opacity: 0.6; font-size: 0.75rem;">[${log.time}]</span> ${log.message}
    </div>
  `).join('');
}

// ==========================================
// RENDERIZADO DE PANTALLA: CONFIGURACIÓN
// ==========================================

let currentConfigCount = 3;
let playerTokenSelections = ['condor', 'mototaxi', 'llama', 'combi'];

function renderSetupForm(playerCount) {
  currentConfigCount = playerCount;
  const form = document.getElementById('setup-form');
  form.innerHTML = '';

  const defaultNames = ['Ana', 'Carlos', 'Diego', 'Lucía'];

  for (let i = 0; i < playerCount; i++) {
    const defaultToken = TOKENS_CATALOG[i % TOKENS_CATALOG.length].id;
    if (!playerTokenSelections[i]) {
      playerTokenSelections[i] = defaultToken;
    }

    const card = document.createElement('div');
    card.className = 'player-card-input';
    card.id = `player-card-${i}`;

    const currentToken = TOKENS_CATALOG.find(t => t.id === playerTokenSelections[i]) || TOKENS_CATALOG[0];

    card.innerHTML = `
      <div class="player-header-setup">
        <span class="player-label">Jugador ${i + 1}</span>
        <span class="token-preview-chip" style="background-color: ${currentToken.colorHex}22; color: ${currentToken.colorHex}; border-color: ${currentToken.borderHex};">
          ${currentToken.icon} ${currentToken.name}
        </span>
      </div>
      <div class="input-group">
        <label for="player-name-${i}">Nombre del explorador:</label>
        <input type="text" id="player-name-${i}" class="input-text" value="${defaultNames[i] || 'Jugador ' + (i + 1)}" maxlength="20" required autocomplete="off">
      </div>
      <div class="token-select-group">
        <label>Elige tu Ficha 3D:</label>
        <div class="token-radio-cards" data-player-idx="${i}">
          ${TOKENS_CATALOG.map(token => {
            const isSelected = playerTokenSelections[i] === token.id;
            const isTaken = playerTokenSelections.slice(0, playerCount).some((tId, idx) => idx !== i && tId === token.id);
            return `
              <label class="token-radio-label ${isSelected ? 'selected' : ''} ${isTaken ? 'disabled' : ''}" style="border-left: 4px solid ${token.colorHex}">
                <input type="radio" name="token-${i}" value="${token.id}" ${isSelected ? 'checked' : ''} ${isTaken ? 'disabled' : ''}>
                <span>${token.icon} ${token.name}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;

    form.appendChild(card);
  }

  // Event listeners para selección de fichas sin repetir
  form.querySelectorAll('.token-radio-cards').forEach(group => {
    group.addEventListener('change', (e) => {
      const pIdx = parseInt(group.dataset.playerIdx, 10);
      const chosenToken = e.target.value;
      playerTokenSelections[pIdx] = chosenToken;
      playSound('click');
      renderSetupForm(currentConfigCount);
    });
  });
}

function checkSavedGame() {
  const saved = loadStateFromStorage();
  const banner = document.getElementById('resume-banner');
  const resumeText = document.getElementById('resume-text');

  if (saved && saved.isStarted && !saved.isFinished && saved.players && saved.players.length > 0) {
    banner.classList.remove('hidden');
    const pNames = saved.players.map(p => p.name).join(', ');
    resumeText.textContent = `Partida en curso con ${saved.players.length} jugadores: ${pNames}.`;
  } else {
    banner.classList.add('hidden');
  }
}

// ==========================================
// INICIAR / REANUDAR PARTIDA
// ==========================================

function startNewGame() {
  const players = [];
  const chosenTokens = new Set();

  for (let i = 0; i < currentConfigCount; i++) {
    const nameInput = document.getElementById(`player-name-${i}`);
    const name = nameInput ? nameInput.value.trim() : `Jugador ${i + 1}`;
    const tokenId = playerTokenSelections[i];

    if (chosenTokens.has(tokenId)) {
      alert(`La ficha ${tokenId} está repetida. Cada explorador debe tener una ficha diferente.`);
      return;
    }
    chosenTokens.add(tokenId);

    const tokenObj = TOKENS_CATALOG.find(t => t.id === tokenId);

    players.push({
      id: i,
      name: name || `Jugador ${i + 1}`,
      token: tokenObj,
      pistas: [], // Array con 'Sol', 'Montana', 'Rio'
      cards: []   // Array con id de efectos (máximo 2)
    });
  }

  gameState = {
    isStarted: true,
    isFinished: false,
    winner: null,
    activePlayerIndex: 0,
    players: players,
    effectDeck: createFullEffectDeck(),
    usedQuestionsIds: [],
    logs: []
  };

  playSound('correct');
  addLog(`¡Partida iniciada con ${players.length} jugadores: ${players.map(p => p.name).join(', ')}!`, 'info');
  saveStateToStorage();
  showGameScreen();
}

function resumeSavedGame() {
  const saved = loadStateFromStorage();
  if (saved) {
    gameState = saved;
    playSound('correct');
    showGameScreen();
  }
}

function restartGamePrompt() {
  if (confirm('¿Estás seguro de que deseas abandonar la partida actual y comenzar una nueva?')) {
    clearStorage();
    showSetupScreen();
  }
}

// ==========================================
// NAVEGACIÓN ENTRE PANTALLAS
// ==========================================

function showSetupScreen() {
  document.getElementById('screen-setup').classList.remove('hidden');
  document.getElementById('screen-game').classList.add('hidden');
  document.getElementById('btn-restart-game').classList.add('hidden');
  checkSavedGame();
  renderSetupForm(currentConfigCount);
}

function showGameScreen() {
  document.getElementById('screen-setup').classList.add('hidden');
  document.getElementById('screen-game').classList.remove('hidden');
  document.getElementById('btn-restart-game').classList.remove('hidden');
  renderGameDashboard();
}

// ==========================================
// RENDERIZADO DEL TABLERO DE JUEGO (DASHBOARD)
// ==========================================

function getActivePlayer() {
  return gameState.players[gameState.activePlayerIndex];
}

function renderGameDashboard() {
  const activePlayer = getActivePlayer();
  if (!activePlayer) return;

  // 1. Banner superior del turno
  const avatarEl = document.getElementById('current-player-avatar');
  avatarEl.textContent = activePlayer.token.icon;
  avatarEl.style.backgroundColor = activePlayer.token.colorHex + '22';
  avatarEl.style.borderColor = activePlayer.token.borderHex;

  document.getElementById('current-player-name').textContent = activePlayer.name;
  document.getElementById('current-player-token').textContent = `${activePlayer.token.name} (${activePlayer.token.colorName})`;

  // Pistas del jugador activo
  const pistasRow = document.getElementById('current-player-pistas-icons');
  pistasRow.innerHTML = PISTAS_KEYS.map(key => {
    const hasPista = activePlayer.pistas.includes(key);
    const info = PISTAS_INFO[key];
    return `
      <span class="pista-chip ${hasPista ? 'acquired' : 'missing'}" data-pista="${key}">
        ${info.icon} ${info.name} ${hasPista ? '✓' : ''}
      </span>
    `;
  }).join('');

  // Cartas del jugador activo
  const cardsCountEl = document.getElementById('current-player-cards-count');
  cardsCountEl.textContent = activePlayer.cards.length;

  const cardsRow = document.getElementById('current-player-cards-icons');
  if (activePlayer.cards.length === 0) {
    cardsRow.innerHTML = `<span class="empty-card-slot">Vacío</span><span class="empty-card-slot">Vacío</span>`;
  } else {
    cardsRow.innerHTML = activePlayer.cards.map(cardId => {
      const cardInfo = EFFECTS_CATALOG[cardId];
      return `<span class="active-card-mini" title="${cardInfo.desc}">${cardInfo.icon} ${cardInfo.name}</span>`;
    }).join('');
    if (activePlayer.cards.length === 1) {
      cardsRow.innerHTML += `<span class="empty-card-slot">Vacío</span>`;
    }
  }

  // 2. Contador de mazo
  const deckEl = document.getElementById('deck-counter');
  deckEl.innerHTML = `Mazo de efectos: <strong>${gameState.effectDeck.length}/14</strong>`;

  // 3. Tarjetas de estado de todos los jugadores
  const playersContainer = document.getElementById('players-status-cards');
  playersContainer.innerHTML = gameState.players.map((p, idx) => {
    const isTurn = idx === gameState.activePlayerIndex;
    return `
      <div class="player-status-card ${isTurn ? 'is-turn' : ''}" style="border-left: 6px solid ${p.token.colorHex};">
        <div class="psc-header">
          <div class="psc-avatar-name">
            <div class="psc-avatar" style="border-color: ${p.token.borderHex}; background: ${p.token.colorHex}15;">
              ${p.token.icon}
            </div>
            <div>
              <div class="psc-name">${p.name}</div>
              <div class="psc-token-name">${p.token.name}</div>
            </div>
          </div>
          ${isTurn ? '<span class="psc-turn-tag">TURNO ACTUAL</span>' : ''}
        </div>

        <div class="psc-pistas-row">
          <span class="psc-label">Pistas (${p.pistas.length}/3)</span>
          <div class="psc-chips-list">
            ${PISTAS_KEYS.map(key => {
              const has = p.pistas.includes(key);
              return `<span class="pista-chip ${has ? 'acquired' : 'missing'}" style="font-size: 0.72rem;">${PISTAS_INFO[key].icon} ${PISTAS_INFO[key].name}</span>`;
            }).join('')}
          </div>
        </div>

        <div class="psc-effects-row">
          <span class="psc-label">Cartas de Efecto (${p.cards.length}/2)</span>
          <div class="psc-chips-list">
            ${p.cards.length === 0 ? '<span style="font-size: 0.75rem; color: #a8a29e;">Sin cartas</span>' : ''}
            ${p.cards.map(cId => {
              const c = EFFECTS_CATALOG[cId];
              return `<span class="effect-badge-item" title="${c.desc}">${c.icon} ${c.name}</span>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  renderLogs();
}

// ==========================================
// CONTROL DE TURNOS
// ==========================================

function nextTurn() {
  playSound('click');
  const prevPlayer = getActivePlayer();
  gameState.activePlayerIndex = (gameState.activePlayerIndex + 1) % gameState.players.length;
  const newPlayer = getActivePlayer();

  addLog(`Termina el turno de <strong>${prevPlayer.name}</strong>. Es el turno de <strong>${newPlayer.name}</strong> (${newPlayer.token.name}).`, 'info');
  saveStateToStorage();
  renderGameDashboard();
}

// ==========================================
// MODAL: CASILLA PREGUNTA
// ==========================================

let currentQuestion = null;
let answeredCurrentQuestion = false;

function openQuestionModal() {
  playSound('click');
  const player = getActivePlayer();
  answeredCurrentQuestion = false;

  // Filtrar preguntas no usadas
  let available = QUESTIONS_BANK.filter(q => !gameState.usedQuestionsIds.includes(q.id));
  if (available.length === 0) {
    // Si se agotan, reiniciamos el banco de usadas
    gameState.usedQuestionsIds = [];
    available = [...QUESTIONS_BANK];
    addLog(`¡Se han respondido todas las preguntas de trivia! Se reinicia el mazo de preguntas.`, 'info');
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  currentQuestion = available[randomIndex];
  gameState.usedQuestionsIds.push(currentQuestion.id);

  // UI
  document.getElementById('q-player-name').textContent = `Explorador: ${player.name} (${player.token.name})`;
  document.getElementById('q-category').textContent = currentQuestion.category;
  document.getElementById('q-question-text').textContent = currentQuestion.question;

  // Reset feedback y selector de pistas
  const feedbackEl = document.getElementById('q-feedback');
  feedbackEl.classList.add('hidden');
  feedbackEl.className = 'feedback-banner hidden';

  const pistasPickEl = document.getElementById('q-pistas-selector');
  pistasPickEl.classList.add('hidden');

  const btnConfirm = document.getElementById('btn-q-confirm');
  btnConfirm.classList.add('hidden');

  // Render opciones
  const optionsContainer = document.getElementById('q-options-container');
  optionsContainer.innerHTML = currentQuestion.options.map((opt, idx) => `
    <button class="btn-option" data-opt-idx="${idx}">
      <span><strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}</span>
      <span class="option-check"></span>
    </button>
  `).join('');

  optionsContainer.querySelectorAll('.btn-option').forEach(btn => {
    btn.addEventListener('click', () => handleAnswerClick(parseInt(btn.dataset.optIdx, 10)));
  });

  openModal('modal-pregunta');
}

function handleAnswerClick(selectedIdx) {
  if (answeredCurrentQuestion) return;
  answeredCurrentQuestion = true;

  const player = getActivePlayer();
  const optionsButtons = document.querySelectorAll('#q-options-container .btn-option');
  optionsButtons.forEach(b => b.disabled = true);

  const isCorrect = selectedIdx === currentQuestion.correct;
  const chosenBtn = optionsButtons[selectedIdx];
  const correctBtn = optionsButtons[currentQuestion.correct];

  const feedbackEl = document.getElementById('q-feedback');
  const feedbackTitle = document.getElementById('q-feedback-title');
  const feedbackMsg = document.getElementById('q-feedback-msg');
  const feedbackIcon = document.getElementById('q-feedback-icon');

  if (isCorrect) {
    playSound('correct');
    chosenBtn.classList.add('correct');
    feedbackEl.className = 'feedback-banner success';
    feedbackIcon.textContent = '🎉';
    feedbackTitle.textContent = '¡RESPUESTA CORRECTA!';

    // Verificar qué pistas le faltan
    const missingPistas = PISTAS_KEYS.filter(k => !player.pistas.includes(k));

    if (missingPistas.length === 0) {
      feedbackMsg.innerHTML = `¡Excelente! Ya tienes las 3 pistas sagradas en tu poder. ¡Avanza directo al centro hacia el Cuy Dorado!`;
      addLog(`<strong>${player.name}</strong> acertó la pregunta "${currentQuestion.question}" (Ya posee todas las pistas).`, 'question');
      document.getElementById('btn-q-confirm').classList.remove('hidden');
    } else {
      feedbackMsg.innerHTML = `Elige a continuación la pista sagrada física que deseas incorporar a tu inventario:`;
      showPistasSelector(missingPistas);
    }
  } else {
    playSound('error');
    chosenBtn.classList.add('incorrect');
    correctBtn.classList.add('correct');
    feedbackEl.className = 'feedback-banner error';
    feedbackIcon.textContent = '❌';
    feedbackTitle.textContent = '¡RESPUESTA INCORRECTA!';
    feedbackMsg.textContent = `La respuesta correcta era: "${currentQuestion.options[currentQuestion.correct]}". No obtienes ninguna pista en este turno.`;

    addLog(`<strong>${player.name}</strong> falló la pregunta de trivia.`, 'question');
    document.getElementById('btn-q-confirm').classList.remove('hidden');
  }

  feedbackEl.classList.remove('hidden');
  saveStateToStorage();
}

function showPistasSelector(missingPistas) {
  const container = document.getElementById('q-pistas-selector');
  const buttonsGrid = document.getElementById('q-pistas-buttons');
  buttonsGrid.innerHTML = '';

  missingPistas.forEach(pistaKey => {
    const info = PISTAS_INFO[pistaKey];
    const btn = document.createElement('button');
    btn.className = 'btn-pick-pista';
    btn.innerHTML = `${info.icon} Reclamar ${info.name}`;
    btn.addEventListener('click', () => {
      claimPistaForPlayer(getActivePlayer(), pistaKey);
      container.classList.add('hidden');
      document.getElementById('q-feedback-msg').innerHTML = `Has obtenido la pista <strong>${info.icon} ${info.name}</strong>. ¡Toma tu tarjeta física!`;
      document.getElementById('btn-q-confirm').classList.remove('hidden');
    });
    buttonsGrid.appendChild(btn);
  });

  container.classList.remove('hidden');
}

function claimPistaForPlayer(player, pistaKey) {
  if (!player.pistas.includes(pistaKey)) {
    player.pistas.push(pistaKey);
    playSound('card');
    addLog(`<strong>${player.name}</strong> obtuvo la pista sagrada: <strong>${PISTAS_INFO[pistaKey].icon} ${PISTAS_INFO[pistaKey].name}</strong>.`, 'pista');
    renderGameDashboard();
    saveStateToStorage();
  }
}

// ==========================================
// MODAL: CASILLA SORPRESA (SORTEO DE CARTA)
// ==========================================

let drawnCardId = null;

function openSurpriseModal() {
  playSound('click');
  const player = getActivePlayer();

  if (gameState.effectDeck.length === 0) {
    alert('¡El mazo de cartas de efectos está vacío temporalmente! Las cartas volverán al mazo cuando otros jugadores las utilicen.');
    return;
  }

  // Sorteo aleatorio de una carta del mazo disponible
  const randomIndex = Math.floor(Math.random() * gameState.effectDeck.length);
  drawnCardId = gameState.effectDeck.splice(randomIndex, 1)[0];
  const cardInfo = EFFECTS_CATALOG[drawnCardId];

  playSound('card');

  // UI
  document.getElementById('draw-card-art').textContent = cardInfo.icon;
  document.getElementById('draw-card-name').textContent = cardInfo.name;
  document.getElementById('draw-card-desc').textContent = cardInfo.desc;
  document.getElementById('draw-card-reminder').textContent = `${cardInfo.icon} ${cardInfo.name}`;

  const discardSection = document.getElementById('sorpresa-discard-section');
  const acceptBtn = document.getElementById('btn-sorpresa-accept');

  // Comprobar límite de 2 cartas
  if (player.cards.length >= 2) {
    // Debe descartar una carta: la nueva o una de las que ya tiene
    discardSection.classList.remove('hidden');
    acceptBtn.classList.add('hidden');

    const discardGrid = document.getElementById('discard-options-grid');
    discardGrid.innerHTML = '';

    // Opción A: Conservar las 2 actuales y descartar la recién sacada
    const btnDiscardNew = document.createElement('button');
    btnDiscardNew.className = 'btn-discard-choice';
    btnDiscardNew.innerHTML = `Descartar la nueva (${cardInfo.icon} ${cardInfo.name})`;
    btnDiscardNew.addEventListener('click', () => {
      // Devolver la nueva al mazo
      gameState.effectDeck.push(drawnCardId);
      addLog(`<strong>${player.name}</strong> sacó <strong>${cardInfo.name}</strong> pero decidió descartarla por límite de mano.`, 'surprise');
      closeModal('modal-sorpresa');
      renderGameDashboard();
      saveStateToStorage();
    });
    discardGrid.appendChild(btnDiscardNew);

    // Opciones B y C: Descartar una de las 2 que ya tenía e incorporar la nueva
    player.cards.forEach((oldCardId, idx) => {
      const oldCardInfo = EFFECTS_CATALOG[oldCardId];
      const btnDiscardOld = document.createElement('button');
      btnDiscardOld.className = 'btn-discard-choice';
      btnDiscardOld.innerHTML = `Descartar ${oldCardInfo.icon} ${oldCardInfo.name} y quedarme con ${cardInfo.name}`;
      btnDiscardOld.addEventListener('click', () => {
        // Devolver la vieja al mazo
        gameState.effectDeck.push(oldCardId);
        player.cards.splice(idx, 1);
        // Incorporar la nueva
        player.cards.push(drawnCardId);
        addLog(`<strong>${player.name}</strong> descartó <strong>${oldCardInfo.name}</strong> y agregó <strong>${cardInfo.name}</strong> a su inventario.`, 'surprise');
        closeModal('modal-sorpresa');
        renderGameDashboard();
        saveStateToStorage();
      });
      discardGrid.appendChild(btnDiscardOld);
    });
  } else {
    // Si tiene menos de 2, puede aceptarla directamente
    discardSection.classList.add('hidden');
    acceptBtn.classList.remove('hidden');
    acceptBtn.onclick = () => {
      player.cards.push(drawnCardId);
      addLog(`<strong>${player.name}</strong> obtuvo la carta de efecto: <strong>${cardInfo.icon} ${cardInfo.name}</strong> (Toma la tarjeta física).`, 'surprise');
      closeModal('modal-sorpresa');
      renderGameDashboard();
      saveStateToStorage();
    };
  }

  openModal('modal-sorpresa');
}

// ==========================================
// MODAL: USAR CARTA DE EFECTO
// ==========================================

let selectedCardToPlay = null;
let selectedTargetRival = null;
let selectedPistaToSteal = null;

function openUseCardModal() {
  playSound('click');
  const player = getActivePlayer();

  if (player.cards.length === 0) {
    alert(`No tienes cartas de efecto en tu mano en este momento. Consíguelas cayendo en casillas Sorpresa.`);
    return;
  }

  // Vista de lista de cartas del jugador
  document.getElementById('usar-carta-list-view').classList.remove('hidden');
  document.getElementById('usar-carta-target-view').classList.add('hidden');
  document.getElementById('modal-usar-footer').classList.remove('hidden');

  const container = document.getElementById('my-cards-selection-grid');
  container.innerHTML = player.cards.map((cId, idx) => {
    const card = EFFECTS_CATALOG[cId];
    return `
      <button class="playable-card-btn" data-card-idx="${idx}" data-card-id="${card.id}">
        <span class="pc-icon">${card.icon}</span>
        <strong class="pc-title">${card.name}</strong>
        <span class="pc-desc">${card.desc}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.playable-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cIdx = parseInt(btn.dataset.cardIdx, 10);
      initiatePlayCard(cIdx);
    });
  });

  openModal('modal-usar-carta');
}

function initiatePlayCard(cardIndexInHand) {
  const player = getActivePlayer();
  const cardId = player.cards[cardIndexInHand];
  const cardInfo = EFFECTS_CATALOG[cardId];
  selectedCardToPlay = { cardId, cardIndexInHand, cardInfo };

  if (cardInfo.id === 'mazamorra') {
    alert('La "Mazamorra morada" es una carta de reacción defensiva. Se activa automáticamente cuando un rival te ataca con "Roba una pista", "Ají picante" o "Desvío" para protegerte.');
    return;
  }

  if (cardInfo.id === 'ceviche') {
    // Ceviche: Movimiento extra inmediato
    consumeCardFromPlayer(player, cardIndexInHand);
    closeModal('modal-usar-carta');
    addLog(`<strong>${player.name}</strong> jugó <strong>Ceviche 🍲</strong>: ¡Lanza el dado físico y realiza un movimiento extra! (Este movimiento no activa casilla).`, 'info');
    alert(`🍲 ¡Has jugado Ceviche!\n\nLanza el dado y realiza un movimiento extra en el tablero físico con tu ficha. Recuerda: este movimiento extra no activa la casilla donde caigas.`);
    renderGameDashboard();
    return;
  }

  if (cardInfo.id === 'pollo_brasa') {
    // Pollo a la brasa: Pregunta extra inmediata
    consumeCardFromPlayer(player, cardIndexInHand);
    closeModal('modal-usar-carta');
    addLog(`<strong>${player.name}</strong> jugó <strong>Pollo a la brasa 🍗</strong>: ¡Responde una pregunta adicional para intentar obtener otra pista!`, 'info');
    renderGameDashboard();
    setTimeout(() => {
      openQuestionModal();
    }, 300);
    return;
  }

  if (cardInfo.id === 'inca_kola') {
    // Inca Kola: Repetir lanzamiento
    consumeCardFromPlayer(player, cardIndexInHand);
    closeModal('modal-usar-carta');
    addLog(`<strong>${player.name}</strong> jugó <strong>Inca Kola 🥤</strong>: ¡Vuelve a tirar el dado y usa el nuevo resultado!`, 'info');
    alert(`🥤 ¡Has jugado Inca Kola!\n\nVuelve a lanzar el dado físico (o usa el dado virtual) y utiliza el nuevo resultado.`);
    renderGameDashboard();
    return;
  }

  // Cartas que requieren objetivo rival (Roba una pista, Ají picante, Desvío)
  setupTargetRivalView(cardInfo);
}

function setupTargetRivalView(cardInfo) {
  document.getElementById('usar-carta-list-view').classList.add('hidden');
  document.getElementById('usar-carta-target-view').classList.remove('hidden');
  document.getElementById('modal-usar-footer').classList.add('hidden');

  const cardInfoBox = document.getElementById('target-card-info');
  cardInfoBox.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px; background: #fff7ed; border-radius: 8px; border: 1.5px solid #fed7aa;">
      <span style="font-size: 2rem;">${cardInfo.icon}</span>
      <div>
        <strong style="color: #9a3412; font-size: 1.1rem;">${cardInfo.name}</strong>
        <p style="font-size: 0.85rem; color: #451a03; margin: 0;">${cardInfo.desc}</p>
      </div>
    </div>
  `;

  // Rival Step
  const rivalsGrid = document.getElementById('rivals-buttons-grid');
  rivalsGrid.innerHTML = '';
  selectedTargetRival = null;
  selectedPistaToSteal = null;

  const otherPlayers = gameState.players.filter(p => p.id !== getActivePlayer().id);

  otherPlayers.forEach(rival => {
    const btn = document.createElement('button');
    btn.className = 'btn-target-rival';
    btn.innerHTML = `${rival.token.icon} ${rival.name} (${rival.token.name})`;
    btn.addEventListener('click', () => {
      rivalsGrid.querySelectorAll('.btn-target-rival').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      handleRivalSelected(rival);
    });
    rivalsGrid.appendChild(btn);
  });

  document.getElementById('target-pista-step').classList.add('hidden');
  document.getElementById('target-defense-step').classList.add('hidden');
  document.getElementById('btn-target-confirm').classList.add('hidden');
}

function handleRivalSelected(rival) {
  selectedTargetRival = rival;
  const activePlayer = getActivePlayer();
  const cardId = selectedCardToPlay.cardInfo.id;

  if (cardId === 'roba_pista') {
    // Debe seleccionar una pista que el rival tenga y que al activo le falte
    const stealablePistas = rival.pistas.filter(p => !activePlayer.pistas.includes(p));

    const pistaStep = document.getElementById('target-pista-step');
    const pistasGrid = document.getElementById('pistas-to-steal-grid');
    pistasGrid.innerHTML = '';

    if (stealablePistas.length === 0) {
      pistasGrid.innerHTML = `<p style="color: #dc2626; font-size: 0.85rem;">${rival.name} no tiene ninguna pista que a ti te falte. Elige a otro rival.</p>`;
      pistaStep.classList.remove('hidden');
      document.getElementById('target-defense-step').classList.add('hidden');
      document.getElementById('btn-target-confirm').classList.add('hidden');
      return;
    }

    stealablePistas.forEach(pistaKey => {
      const pInfo = PISTAS_INFO[pistaKey];
      const btn = document.createElement('button');
      btn.className = 'btn-target-pista';
      btn.innerHTML = `${pInfo.icon} Robar ${pInfo.name}`;
      btn.addEventListener('click', () => {
        pistasGrid.querySelectorAll('.btn-target-pista').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedPistaToSteal = pistaKey;
        checkDefenseStep(rival);
      });
      pistasGrid.appendChild(btn);
    });

    pistaStep.classList.remove('hidden');
    document.getElementById('target-defense-step').classList.add('hidden');
    document.getElementById('btn-target-confirm').classList.add('hidden');
  } else {
    // Ají picante o Desvío
    document.getElementById('target-pista-step').classList.add('hidden');
    checkDefenseStep(rival);
  }
}

function checkDefenseStep(rival) {
  const defenseStep = document.getElementById('target-defense-step');
  const confirmBtn = document.getElementById('btn-target-confirm');

  // Comprobar si el rival tiene Mazamorra morada
  const hasMazamorra = rival.cards.includes('mazamorra');

  if (hasMazamorra) {
    defenseStep.classList.remove('hidden');
    document.getElementById('defense-query-text').innerHTML = `
      🛡️ <strong>${rival.name}</strong> tiene una carta física de <strong>Mazamorra Morada</strong> en su inventario.<br>
      ¿Desea usarla para cancelar este efecto por completo?
    `;

    document.getElementById('btn-defense-use').onclick = () => {
      // Usa mazamorra: se consumen ambas cartas
      resolveAttackWithDefense(true);
    };

    document.getElementById('btn-defense-skip').onclick = () => {
      // No usa mazamorra: se aplica el ataque
      resolveAttackWithDefense(false);
    };

    confirmBtn.classList.add('hidden');
  } else {
    defenseStep.classList.add('hidden');
    confirmBtn.classList.remove('hidden');
    confirmBtn.onclick = () => {
      resolveAttackWithDefense(false);
    };
  }
}

function resolveAttackWithDefense(wasDefended) {
  const activePlayer = getActivePlayer();
  const rival = selectedTargetRival;
  const cardId = selectedCardToPlay.cardInfo.id;
  const cardIdx = selectedCardToPlay.cardIndexInHand;

  // Consumir la carta del atacante
  consumeCardFromPlayer(activePlayer, cardIdx);

  if (wasDefended) {
    // Consumir la mazamorra del defensor
    const mazamorraIdx = rival.cards.indexOf('mazamorra');
    if (mazamorraIdx !== -1) {
      consumeCardFromPlayer(rival, mazamorraIdx);
    }

    playSound('error');
    addLog(`🛡️ <strong>${rival.name}</strong> utilizó <strong>Mazamorra morada</strong> y canceló el efecto de <strong>${selectedCardToPlay.cardInfo.name}</strong> de <strong>${activePlayer.name}</strong>. ¡Ambas cartas vuelven al mazo!`, 'defense');
    alert(`🛡️ ¡Ataque Cancelado!\n\n${rival.name} usó su Mazamorra morada para defenderse. El ataque no surte efecto y ambas tarjetas físicas vuelven al pozo.`);
  } else {
    // Aplicar el efecto según la carta
    if (cardId === 'roba_pista') {
      // Transferir la pista del rival al atacante
      const pistaKey = selectedPistaToSteal;
      const rivalPistaIdx = rival.pistas.indexOf(pistaKey);
      if (rivalPistaIdx !== -1) {
        rival.pistas.splice(rivalPistaIdx, 1);
        activePlayer.pistas.push(pistaKey);
      }
      playSound('card');
      addLog(`🥷 <strong>${activePlayer.name}</strong> robó la pista <strong>${PISTAS_INFO[pistaKey].icon} ${PISTAS_INFO[pistaKey].name}</strong> a <strong>${rival.name}</strong>. ¡Entreguen físicamente la tarjeta!`, 'attack');
      alert(`🥷 ¡Robo Exitoso!\n\n${activePlayer.name} le roba la pista ${PISTAS_INFO[pistaKey].icon} ${PISTAS_INFO[pistaKey].name} a ${rival.name}.\n¡${rival.name} debe entregar su tarjeta física a ${activePlayer.name}!`);
    } else if (cardId === 'aji_picante') {
      playSound('card');
      addLog(`🌶️ <strong>${activePlayer.name}</strong> usó <strong>Ají picante</strong> contra <strong>${rival.name}</strong>: ¡Debe retroceder 2 casillas en el tablero físico!`, 'attack');
      alert(`🌶️ ¡Ají Picante!\n\n${rival.name} debe retroceder 2 casillas en el tablero físico.`);
    } else if (cardId === 'desvio') {
      playSound('card');
      addLog(`🔀 <strong>${activePlayer.name}</strong> usó <strong>Desvío</strong> con <strong>${rival.name}</strong>: ¡Intercambian sus posiciones en el tablero físico!`, 'attack');
      alert(`🔀 ¡Desvío!\n\n${activePlayer.name} y ${rival.name} intercambian sus fichas de lugar en el tablero.`);
    }
  }

  closeModal('modal-usar-carta');
  renderGameDashboard();
  saveStateToStorage();
}

function consumeCardFromPlayer(player, cardIndexInHand) {
  const cardId = player.cards[cardIndexInHand];
  player.cards.splice(cardIndexInHand, 1);
  // Vuelve al mazo de cartas disponibles
  gameState.effectDeck.push(cardId);
}

// ==========================================
// MODAL: DADO VIRTUAL (1 a 6)
// ==========================================

let isRollingDice = false;

function openDiceModal() {
  playSound('click');
  const player = getActivePlayer();
  const diceDisplay = document.getElementById('dice-display');
  const resultText = document.getElementById('dice-result-text');
  const incaBox = document.getElementById('inca-kola-reroll-prompt');

  diceDisplay.textContent = '🎲';
  resultText.textContent = '¡Lanza el dado!';

  if (player.cards.includes('inca_kola')) {
    incaBox.classList.remove('hidden');
    document.getElementById('btn-use-inca-kola-dice').onclick = () => {
      const idx = player.cards.indexOf('inca_kola');
      consumeCardFromPlayer(player, idx);
      addLog(`<strong>${player.name}</strong> usó <strong>Inca Kola</strong> para volver a lanzar el dado.`, 'info');
      renderGameDashboard();
      incaBox.classList.add('hidden');
      rollDice();
    };
  } else {
    incaBox.classList.add('hidden');
  }

  openModal('modal-dado');
}

function rollDice() {
  if (isRollingDice) return;
  isRollingDice = true;

  const diceDisplay = document.getElementById('dice-display');
  const resultText = document.getElementById('dice-result-text');
  diceDisplay.classList.add('rolling');

  let count = 0;
  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const interval = setInterval(() => {
    playSound('dice');
    const tempNum = Math.floor(Math.random() * 6);
    diceDisplay.textContent = diceFaces[tempNum];
    count++;

    if (count > 8) {
      clearInterval(interval);
      diceDisplay.classList.remove('rolling');
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      diceDisplay.textContent = diceFaces[finalRoll - 1];
      resultText.textContent = `¡Sacaste ${finalRoll}!`;
      isRollingDice = false;

      const player = getActivePlayer();
      addLog(`🎲 <strong>${player.name}</strong> lanzó el dado y sacó un <strong>${finalRoll}</strong>.`, 'info');
      saveStateToStorage();
    }
  }, 70);
}

// ==========================================
// VICTORIA: ¡LLEGUÉ AL CUY DORADO!
// ==========================================

function claimCuyDorado() {
  playSound('click');
  const player = getActivePlayer();

  // Comprobar si tiene las 3 pistas sagradas
  const hasAllPistas = PISTAS_KEYS.every(k => player.pistas.includes(k));

  if (!hasAllPistas) {
    const missing = PISTAS_KEYS.filter(k => !player.pistas.includes(k)).map(k => `${PISTAS_INFO[k].icon} ${PISTAS_INFO[k].name}`);
    alert(`⚠️ ¡Aún no puedes coronarte con el Cuy Dorado!\n\nTe falta(n) la(s) siguiente(s) pista(s) sagrada(s):\n- ${missing.join('\n- ')}\n\nDebes responder preguntas correctamente en el tablero o usar cartas como 'Roba una pista' para conseguirlas.`);
    return;
  }

  // Confirmar si físicamente llegó al centro del tablero
  const confirmArrival = confirm(`👑 ¡ATENCIÓN EXPLORADOR!\n\n${player.name} posee las 3 pistas sagradas (Sol ☀️, Montaña ⛰️ y Río 🌊).\n\n¿Todos los jugadores confirman que su ficha 3D de ${player.token.name} ha llegado al centro del tablero donde descansa el Cuy Dorado?`);

  if (!confirmArrival) {
    return;
  }

  // Declarar Victoria
  gameState.isFinished = true;
  gameState.winner = player;

  playSound('victory');
  addLog(`👑🏆 ¡VICTORIA! <strong>${player.name}</strong> ha reunido las 3 pistas sagradas y alcanzado al majestuoso <strong>Cuy Dorado</strong>. ¡Es el Campeón Absoluto del Perú!`, 'pista');

  document.getElementById('winner-name-announce').textContent = `¡${player.name} es el Gran Campeón!`;
  document.getElementById('winner-details-announce').innerHTML = `
    Ficha: <strong>${player.token.icon} ${player.token.name}</strong> (${player.token.colorName})<br>
    ¡Consiguió el Sol ☀️, la Montaña ⛰️ y el Río 🌊 y coronó la cima del Cuy Dorado!
  `;

  document.getElementById('victory-summary-box').innerHTML = `
    <strong>Resumen final de la partida:</strong><br>
    ${gameState.players.map(p => `• ${p.token.icon} <strong>${p.name}</strong>: ${p.pistas.length}/3 pistas &bull; ${p.cards.length} cartas`).join('<br>')}
  `;

  saveStateToStorage();
  openModal('modal-victoria');
}

// ==========================================
// UTILIDADES PARA MODALES
// ==========================================

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
  }
}

// ==========================================
// EVENT LISTENERS PRINCIPALES
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Selector de número de jugadores (2, 3, 4)
  document.querySelectorAll('.btn-count').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      document.querySelectorAll('.btn-count').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const count = parseInt(btn.dataset.count, 10);
      renderSetupForm(count);
    });
  });

  // Botón Comenzar Partida
  document.getElementById('btn-start-game').addEventListener('click', startNewGame);

  // Botón Reanudar Partida Guardada
  document.getElementById('btn-resume-game').addEventListener('click', resumeSavedGame);
  document.getElementById('btn-dismiss-resume').addEventListener('click', () => {
    clearStorage();
    document.getElementById('resume-banner').classList.add('hidden');
  });

  // Botón Reiniciar / Nueva Partida
  document.getElementById('btn-restart-game').addEventListener('click', restartGamePrompt);
  document.getElementById('btn-new-game-victory').addEventListener('click', () => {
    closeModal('modal-victoria');
    clearStorage();
    showSetupScreen();
  });

  // Botón Sonido
  const soundBtn = document.getElementById('btn-sound-toggle');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    soundBtn.title = soundEnabled ? 'Sonido activado' : 'Sonido desactivado';
    playSound('click');
  });

  // Botón Reglas
  document.getElementById('btn-show-rules').addEventListener('click', () => {
    playSound('click');
    openModal('modal-reglas');
  });

  // Botones de Acción del Turno
  document.getElementById('btn-action-pregunta').addEventListener('click', openQuestionModal);
  document.getElementById('btn-action-sorpresa').addEventListener('click', openSurpriseModal);
  document.getElementById('btn-action-usar-carta').addEventListener('click', openUseCardModal);
  document.getElementById('btn-action-dado').addEventListener('click', openDiceModal);
  document.getElementById('btn-roll-dice').addEventListener('click', rollDice);

  // Reclamo del Cuy Dorado
  document.getElementById('btn-claim-cuy').addEventListener('click', claimCuyDorado);

  // Terminar Turno
  document.getElementById('btn-end-turn').addEventListener('click', nextTurn);

  // Botón Limpiar Log
  document.getElementById('btn-clear-log').addEventListener('click', () => {
    gameState.logs = [];
    renderLogs();
    saveStateToStorage();
  });

  // Botón Cerrar Pregunta Aceptar
  document.getElementById('btn-q-confirm').addEventListener('click', () => {
    closeModal('modal-pregunta');
    renderGameDashboard();
  });

  // Cancelar en selección de objetivo de carta
  document.getElementById('btn-target-cancel').addEventListener('click', () => {
    document.getElementById('usar-carta-target-view').classList.add('hidden');
    document.getElementById('usar-carta-list-view').classList.remove('hidden');
    document.getElementById('modal-usar-footer').classList.remove('hidden');
  });

  // Cierre genérico de modales con botones data-close
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      playSound('click');
      closeModal(el.dataset.close);
    });
  });

  // Cerrar modal al hacer clic en el backdrop oscuro
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // Comprobar estado inicial
  const saved = loadStateFromStorage();
  if (saved && saved.isStarted && !saved.isFinished) {
    gameState = saved;
    showGameScreen();
  } else {
    showSetupScreen();
  }
});
