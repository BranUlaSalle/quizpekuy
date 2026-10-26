# 🐹👑 En busca del Cuy Dorado
### Juego de mesa interactivo con temática peruana

Aplicación web complementaria oficial diseñada según las especificaciones del documento escolar del proyecto.

---

## 📱 Las 6 Pantallas del Sitio Web

La aplicación está estructurada exactamente en las 6 pantallas solicitadas:

1. **Pantalla Inicio:**
   - Registro de 2 a 4 jugadores con sus nombres.
   - Selección de fichas 3D sin repetir (**Cóndor 🦅, Mototaxi 🛺, Llama 🦙, Combi 🚐**).
   - Botón: *Iniciar Partida*.

2. **Pantalla Partida:**
   - Identificación del **Jugador activo** de turno.
   - Panel de **Pistas** (**Sol ☀️, Montaña ⛰️, Río 🌊**) y **Cartas de efectos** de todos los jugadores.
   - Botones principales de acción:
     * **Pregunta:** Abre la trivia de la casilla Pregunta.
     * **Sorpresa:** Sortea una carta de efecto disponible.
     * **Usar carta:** Juega cartas de comida o sabotaje de la mano.
     * **Llegué al Cuy Dorado:** Comprueba si tiene las 3 pistas y confirma la victoria.
     * **Terminar Turno:** Pasa el turno al siguiente explorador.

3. **Pantalla Pregunta:**
   - Enunciado temático del banco de **15 preguntas sobre el Perú**.
   - Tres alternativas de respuesta (A, B, C).
   - Resultado inmediato (Correcto / Incorrecto).
   - Si acierta: Permite elegir una pista que le falte (Sol, Montaña o Río) e indica tomar la tarjeta física.
   - Botón para volver a la partida.

4. **Pantalla Sorpresa:**
   - Muestra la carta de efecto sorteada entre las disponibles en el mazo de 14 cartas.
   - Indicación destacada de qué tarjeta física tomar.
   - Control de mano máxima de 2 cartas (si ya tiene 2, permite elegir cuál devolver al mazo).
   - Botón para volver a la partida.

5. **Pantalla Uso de cartas:**
   - Selección de la carta de la mano a utilizar.
   - Selección del jugador rival cuando corresponda (*Roba una pista*, *Ají picante*, *Desvío*).
   - **Posible protección:** Si el rival tiene *Mazamorra morada*, el sistema consulta si desea usarla para cancelar el efecto.
   - Resultado del efecto y botón para volver a la partida.

6. **Pantalla Final:**
   - Comprobación automática de las tres pistas sagradas (**Sol, Montaña y Río**).
   - Si le falta alguna pista, el sistema le impide ganar y le indica cuáles le faltan.
   - Si tiene las 3 pistas, solicita la **confirmación física entre los jugadores** de haber llegado al centro del tablero.
   - Anuncio y coronación del gran campeón ganador junto al Cuy Dorado.

---

## 🗂️ Archivos del Proyecto

- [**`index.html`**](file:///c:/Users/bran1/OneDrive/Desktop/quizpekuy/index.html): Las 6 pantallas interactivas de la aplicación.
- [**`styles.css`**](file:///c:/Users/bran1/OneDrive/Desktop/quizpekuy/styles.css): Diseño visual andino-peruano responsivo para computadoras y tablets.
- [**`app.js`**](file:///c:/Users/bran1/OneDrive/Desktop/quizpekuy/app.js): Lógica de turnos, banco de 15 preguntas peruanas, mazo de 14 efectos y guardado en `localStorage`.
- [**`imprimir_tarjetas.html`**](file:///c:/Users/bran1/OneDrive/Desktop/quizpekuy/imprimir_tarjetas.html): Plantilla lista para imprimir las 26 tarjetas en tamaño oficial de 6 × 9 cm.
