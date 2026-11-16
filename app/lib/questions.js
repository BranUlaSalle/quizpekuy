// ============================================================================
// BANCO DE PREGUNTAS POR CATEGORÍAS (50 preguntas por categoría = 200 preguntas)
// Categorías:
// 1. cultura_peruana (Cultura Peruana)
// 2. doble_sentido (Doble Sentido 😏🔥)
// 3. cotidiano (Cotidiano)
// 4. animales (Animales 🐾)
// ============================================================================

export const CATEGORIAS = [
  { id: "cultura_peruana", nombre: "Cultura Peruana", emoji: "🇵🇪", descripcion: "Historia, tradiciones, gastronomía y lugares del Perú" },
  { id: "doble_sentido", nombre: "Doble Sentido", emoji: "😏🔥", descripcion: "Preguntas pícaras con truco y humor de doble sentido" },
  { id: "cotidiano", nombre: "Cotidiano", emoji: "☕", descripcion: "Situaciones de la vida diaria, sentido común y hábitos" },
  { id: "animales", nombre: "Animales", emoji: "🐾", descripcion: "Curiosidades, hábitats y récords del reino animal" },
];

export const PREGUNTAS_POR_CATEGORIA = {
  // --------------------------------------------------------------------------
  // 1. CULTURA PERUANA (50 preguntas)
  // --------------------------------------------------------------------------
  cultura_peruana: [
    {
      texto: "¿Cuál es la maravilla del mundo moderno ubicada en Cusco, Perú?",
      alternativas: ["Chichén Itzá", "Machu Picchu", "Cristo Redentor", "Petra"],
      correcta: "B"
    },
    {
      texto: "¿En qué año se proclamó la Independencia del Perú?",
      alternativas: ["1810", "1821", "1824", "1830"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el volcán tutelar más representativo de la ciudad de Arequipa?",
      alternativas: ["Chachani", "Misti", "Pichu Pichu", "Ampato"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el plato bandera del Perú preparado a base de pescado marinado en jugo de limón?",
      alternativas: ["Causa Limeña", "Ceviche", "Lomo Saltado", "Ají de Gallina"],
      correcta: "B"
    },
    {
      texto: "¿Qué ave nacional del Perú es conocida por su plumaje rojo anaranjado brillante?",
      alternativas: ["Cóndor Andino", "Gallito de las Rocas", "Colibrí Maravilloso", "Pava Aliblanca"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el lago navegable más alto del mundo ubicado entre Perú y Bolivia?",
      alternativas: ["Lago Titicaca", "Lago Junín", "Lago Poopó", "Laguna de Llanganuco"],
      correcta: "A"
    },
    {
      texto: "¿Quién escribió la célebre novela 'Los ríos profundos' y 'Yawar Fiesta'?",
      alternativas: ["Ciro Alegría", "José María Arguedas", "Mario Vargas Llosa", "César Vallejo"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la moneda oficial del Perú?",
      alternativas: ["Nuevo Sol", "Sol", "Inti", "Peso"],
      correcta: "B"
    },
    {
      texto: "¿Qué piedra volcánica blanca se utilizó tradicionalmente para construir el centro histórico de Arequipa?",
      alternativas: ["Mármol", "Sillar", "Granito", "Basalto"],
      correcta: "B"
    },
    {
      texto: "¿Quién proclamó la independencia del Perú el 28 de julio de 1821?",
      alternativas: ["Simón Bolívar", "José de San Martín", "Antonio José de Sucre", "Ramón Castilla"],
      correcta: "B"
    },
    {
      texto: "¿En qué departamento se encuentran las misteriosas Líneas de Nazca?",
      alternativas: ["Arequipa", "Ica", "Moquegua", "Tacna"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la montaña o nevado más alto del Perú?",
      alternativas: ["Huascarán", "Yerupajá", "Coropuna", "Alpamayo"],
      correcta: "A"
    },
    {
      texto: "¿Cuál es el río más caudaloso y largo del mundo que nace en las alturas de Arequipa, Perú?",
      alternativas: ["Río Nilo", "Río Amazonas", "Río Ucayali", "Río Marañón"],
      correcta: "B"
    },
    {
      texto: "¿Qué escritor peruano ganó el Premio Nobel de Literatura en 2010?",
      alternativas: ["César Vallejo", "Mario Vargas Llosa", "Julio Ramón Ribeyro", "Bryce Echenique"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la danza tradicional de la costa peruana que representa el cortejo y se baila con pañuelo?",
      alternativas: ["Festejo", "Marinera", "Huayno", "Saya"],
      correcta: "B"
    },
    {
      texto: "¿En qué batalla de 1824 se selló definitivamente la independencia de América del Sur?",
      alternativas: ["Batalla de Junín", "Batalla de Ayacucho", "Batalla de Miraflores", "Batalla de Arica"],
      correcta: "B"
    },
    {
      texto: "¿Qué civilización preincaica es famosa por sus trepanaciones craneanas y mantos funerarios?",
      alternativas: ["Moche", "Paracas", "Chimú", "Chavín"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el cañón más profundo de Arequipa y uno de los más profundos del planeta?",
      alternativas: ["Cañón del Pato", "Cañón del Colca / Cotahuasi", "Cañón del Añashuayco", "Cañón del Infiernillo"],
      correcta: "B"
    },
    {
      texto: "¿Cuál fue la capital del Imperio Incaico (Tahuantinsuyo)?",
      alternativas: ["Lima", "Cusco", "Cajamarca", "Jauja"],
      correcta: "B"
    },
    {
      texto: "¿Qué árbol representativo del reino vegetal figura en el Escudo Nacional del Perú?",
      alternativas: ["Árbol del Aliso", "Árbol de la Quina", "Árbol de Queñua", "Árbol de Molle"],
      correcta: "B"
    },
    {
      texto: "¿Qué plato típico arequipeño consiste en un pimiento picante relleno de carne picada y horneado con queso?",
      alternativas: ["Pastel de Papa", "Rocoto Relleno", "Solterito", "Ocopa"],
      correcta: "B"
    },
    {
      texto: "¿Cómo se llama el héroe del Combate de Angamos conocido como 'El Caballero de los Mares'?",
      alternativas: ["Francisco Bolognesi", "Miguel Grau", "Alfonso Ugarte", "Andrés Avelino Cáceres"],
      correcta: "B"
    },
    {
      texto: "¿Qué dios supremo creador veneraban las culturas andinas prehispánicas?",
      alternativas: ["Inti", "Huiracocha (Wiracocha)", "Pachacámac", "Illapa"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el licor de bandera del Perú destilado a base de mosto de uva?",
      alternativas: ["Ron", "Pisco", "Aguardiente", "Tequila"],
      correcta: "B"
    },
    {
      texto: "¿Qué poeta peruano escribió 'Los heraldos negros' y 'Trilce'?",
      alternativas: ["César Vallejo", "Abraham Valdelomar", "José María Eguren", "Martín Adán"],
      correcta: "A"
    },
    {
      texto: "¿En qué región peruana se ubica la imponente fortaleza de Kuelap?",
      alternativas: ["San Martín", "Amazonas", "Loreto", "Cajamarca"],
      correcta: "B"
    },
    {
      texto: "¿Qué emperador inca fue capturado por los españoles en Cajamarca?",
      alternativas: ["Huáscar", "Atahualpa", "Pachacútec", "Túpac Yupanqui"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la fiesta religiosa y cultural más grande de Puno, declarada Patrimonio de la Humanidad?",
      alternativas: ["Señor de los Milagros", "Virgen de la Candelaria", "Señor de Qoyllurit'i", "Corpus Christi"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el animal representativo del reino animal en el Escudo Nacional del Perú?",
      alternativas: ["Llama", "Vicuña", "Alpaca", "Guanaco"],
      correcta: "B"
    },
    {
      texto: "¿Qué postre tradicional peruano se consume especialmente en octubre por el Señor de los Milagros?",
      alternativas: ["Mazamorra Morada", "Turrón de Doña Pepa", "Picarones", "Suspiro a la Limeña"],
      correcta: "B"
    },
    {
      texto: "¿Quién dijo la célebre frase: 'Tengo deberes sagrados que cumplir y los cumpliré hasta quemar el último cartucho'?",
      alternativas: ["Miguel Grau", "Francisco Bolognesi", "Alfonso Ugarte", "Andrés A. Cáceres"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la ciudad de barro prehispánica más grande de América, ubicada en Trujillo?",
      alternativas: ["Cahuachi", "Chan Chan", "Caral", "Pachacámac"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la civilización más antigua de América descubierta en el valle de Supe, Perú?",
      alternativas: ["Chavín", "Caral", "Moche", "Tiwanaku"],
      correcta: "B"
    },
    {
      texto: "¿Cómo se llama la sopa tradicional arequipeña que se sirve los domingos por la mañana?",
      alternativas: ["Chupe de Camarones", "Caldo Blanco / Adobo Arequipeño", "Chairo", "Puche"],
      correcta: "B"
    },
    {
      texto: "¿Qué instrumento musical de percusión afroperuano es una caja de madera con un agujero sonoro?",
      alternativas: ["Bongo", "Cajón Peruano", "Güiro", "Conga"],
      correcta: "B"
    },
    {
      texto: "¿En qué fecha se celebra el 'Día del Pisco Sour' en el Perú?",
      alternativas: ["Primer sábado de febrero", "28 de julio", "Cuarto domingo de julio", "Primer domingo de mayo"],
      correcta: "A"
    },
    {
      texto: "¿Cuál es la flor nacional del Perú, venerada desde tiempos de los incas?",
      alternativas: ["Orquídea", "Flor de la Cantuta", "Flor de Amancaes", "Retama"],
      correcta: "B"
    },
    {
      texto: "¿Quién fue el gran inca considerado el arquitecto y organizador del Tahuantinsuyo?",
      alternativas: ["Manco Cápac", "Pachacútec", "Huayna Cápac", "Sinchi Roca"],
      correcta: "B"
    },
    {
      texto: "¿Qué salsa criolla arequipeña lleva rocoto, cebolla, tomate picado y vinagre para acompañar el chicharrón?",
      alternativas: ["Guacamole", "Salsa criolla / Escribano", "Ocopa", "Huancaína"],
      correcta: "B"
    },
    {
      texto: "¿Qué festividad andina se celebra el 24 de junio en honor al Sol en la explanada de Sacsayhuamán?",
      alternativas: ["Carnaval Cusqueño", "Inti Raymi", "Yawar Fiesta", "Warachikuy"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el puerto marítimo más importante y con mayor tráfico del Perú?",
      alternativas: ["Puerto de Matarani", "Puerto del Callao", "Puerto de Paita", "Puerto de Ilo"],
      correcta: "B"
    },
    {
      texto: "¿Qué personaje histórico lideró una gran rebelión indígena contra el dominio español en 1780?",
      alternativas: ["Mateo Pumacahua", "Túpac Amaru II", "Manco Inca", "Francisco de Zela"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el postre peruano hecho a base de masa de camote y zapallo frita en aros y bañada en miel de chancaca?",
      alternativas: ["Churros", "Picarones", "Buñuelos", "Alfajores"],
      correcta: "B"
    },
    {
      texto: "¿Cómo se llama la bebida fermentada sagrada a base de maíz consumida en los Andes desde tiempos incas?",
      alternativas: ["Mate de coca", "Chicha de Jora", "Emoliente", "Aguamiel"],
      correcta: "B"
    },
    {
      texto: "¿Qué famosa dama arequipeña de la nobleza inca fue sacrificada en el volcán Ampato y hallada congelada?",
      alternativas: ["Mama Ocllo", "La Momia Juanita", "Micaela Bastidas", "Francisca Pizarro"],
      correcta: "B"
    },
    {
      texto: "¿En qué departamento se ubica la hermosa laguna de Huacachina, el oasis de América?",
      alternativas: ["Lima", "Ica", "Arequipa", "Ancash"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el plato tradicional andino cocinado bajo tierra con piedras volcánicas calientes?",
      alternativas: ["Seco de carne", "Pachamanca", "Carapulcra", "Olluquito"],
      correcta: "B"
    },
    {
      texto: "¿Qué felino sagrado andino representaba el mundo de los vivos (Kay Pacha)?",
      alternativas: ["Jaguar", "Puma", "Ocelote", "Gato andino"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el convento y pequeña ciudadela religiosa colonial más famoso de Arequipa?",
      alternativas: ["Monasterio de San Francisco", "Monasterio de Santa Catalina", "Convento de la Recoleta", "Catedral de Arequipa"],
      correcta: "B"
    },
    {
      texto: "¿Qué presidente peruano abolió formalmente la esclavitud en el Perú en 1854?",
      alternativas: ["José Balta", "Ramón Castilla", "Manuel Pardo", "Mariano Ignacio Prado"],
      correcta: "B"
    }
  ],

  // --------------------------------------------------------------------------
  // 2. PREGUNTAS EN DOBLE SENTIDO (50 preguntas con humor pícaro 😏🔥)
  // --------------------------------------------------------------------------
  doble_sentido: [
    {
      texto: "¿Qué es largo, duro y las mujeres se lo meten en la boca hasta que se deshace? 😏🔥",
      alternativas: ["El cepillo de dientes", "El chupetín (paleta)", "El cigarro", "El lápiz labial"],
      correcta: "B"
    },
    {
      texto: "¿Qué tiene pelos por fuera, está húmedo por dentro y empieza por C y termina en O? 😏🔥",
      alternativas: ["El calzoncillo", "El coco", "El cono", "El codo"],
      correcta: "B"
    },
    {
      texto: "¿Qué entra seco y tieso, y sale blando y chorreando? 😏🔥",
      alternativas: ["El hielo", "El fideo / spaguetti", "El jabón", "El pan en la leche"],
      correcta: "B"
    },
    {
      texto: "¿Qué cuelga entre las piernas de un hombre, mide entre 15 y 25 cm y tiene una campana? 😏🔥",
      alternativas: ["El pantalón", "El badajo de la campana de bicicleta", "El cinturón", "El llavero"],
      correcta: "B"
    },
    {
      texto: "¿Qué hace el hombre de pie, la mujer sentada y el perro en tres patas? 😏🔥",
      alternativas: ["Bailar reggaetón", "Saludar / Dar la mano", "Comer", "Dormir"],
      correcta: "B"
    },
    {
      texto: "¿Qué es algo que metes duro, sacas temblando y deja un charco blanco en el suelo? 😏🔥",
      alternativas: ["La vela derretida", "El chupete de helado", "La pintura en brocha", "El termómetro"],
      correcta: "B"
    },
    {
      texto: "¿Qué tiene una mujer dos y una vaca cuatro? 😏🔥",
      alternativas: ["Ojos", "Piernas", "Uñas", "Brazos"],
      correcta: "B"
    },
    {
      texto: "¿Qué se pone más caliente y duro mientras más lo frotas con la mano? 😏🔥",
      alternativas: ["El celular", "El borrador de lápiz", "La masa de pan", "La moneda"],
      correcta: "B"
    },
    {
      texto: "¿Qué entra parado, sale doblado y te deja sudando de satisfacción? 😏🔥",
      alternativas: ["El atleta en salto", "El clavo en la madera", "El pie en un zapato apretado", "El auto en cochera"],
      correcta: "C"
    },
    {
      texto: "¿Qué es peludito, suave, le gusta que lo acaricien y si lo molestas saca las uñas? 😏🔥",
      alternativas: ["El cuy", "El gatito", "El perrito", "El peluche"],
      correcta: "B"
    },
    {
      texto: "¿Dónde tienen las mujeres el pelo más rizado y ensortijado? 😏🔥",
      alternativas: ["En las cejas", "En África", "En los brazos", "En la espalda"],
      correcta: "B"
    },
    {
      texto: "¿Qué se mete con cuidado en una ranura y si se mueve rápido da placer auditivo? 😏🔥",
      alternativas: ["La tarjeta de crédito", "La moneda en la rocola", "La llave de casa", "El billete"],
      correcta: "B"
    },
    {
      texto: "¿Qué empieza con 'P', termina con 'O' y los hombres se lo tocan todo el día en el trabajo? 😏🔥",
      alternativas: ["El pantalón", "El pelo", "El puño", "El bolsillo"],
      correcta: "B"
    },
    {
      texto: "¿Qué se infla cuando lo soplas, se pone tieso y si lo pinchas explota dejando líquido? 😏🔥",
      alternativas: ["La llanta de moto", "El globo con agua", "El colchón inflable", "El salvavidas"],
      correcta: "B"
    },
    {
      texto: "¿Qué tiene un agujero en el centro, dos cosas redondas a los lados y se monta por atrás? 😏🔥",
      alternativas: ["Un caballo", "La bicicleta", "La moto", "El scooter"],
      correcta: "B"
    },
    {
      texto: "¿Qué es largo, rosado, se estira y cuando te lo metes en la boca sabe a fresa? 😏🔥",
      alternativas: ["El chicle en tira", "El labial", "La lengua de vaca", "El malvavisco"],
      correcta: "A"
    },
    {
      texto: "¿Qué entra tieso y frío por un agujero y al rato sale húmedo y con humo? 😏🔥",
      alternativas: ["El cigarrillo", "El carbón de la chimenea", "El pan en la tostadora", "El fierro caliente"],
      correcta: "C"
    },
    {
      texto: "¿Qué tienen en común un cura, un novio nervioso y un paquete de fideos? 😏🔥",
      alternativas: ["Que rezan mucho", "Que se ablandan con agua caliente", "Que usan sotana", "Que van de blanco"],
      correcta: "B"
    },
    {
      texto: "¿Qué mide unos 15 cm, tiene punta roja y cuando se frota enciende la pasión? 😏🔥",
      alternativas: ["El labial de marca", "El fósforo de cocina", "El encendedor", "La vela aromática"],
      correcta: "B"
    },
    {
      texto: "¿Qué te metes entre las piernas en la oscuridad, te mueves de adelante hacia atrás y terminas agitado? 😏🔥",
      alternativas: ["La almohada", "La bicicleta fija de noche", "La mecedora", "El caballo de madera"],
      correcta: "B"
    },
    {
      texto: "¿Qué se pone blanco y espeso cuando lo bates bien fuerte con la mano en un tazón? 😏🔥",
      alternativas: ["La mayonesa", "La clara de huevo a punto de nieve", "El batido de fresa", "La leche condensada"],
      correcta: "B"
    },
    {
      texto: "¿Qué entra derecho por delante, empuja con fuerza y hace gemir a la puerta? 😏🔥",
      alternativas: ["El viento fuerte", "La llave oxidada", "La cerradura rota", "El perro empujando"],
      correcta: "B"
    },
    {
      texto: "¿Qué hace la vaca cuatro veces al día y la mujer solo una al mes? 😏🔥",
      alternativas: ["Comer pasto", "Cambiar de pezuñas", "El ciclo de descanso lunar", "La palabra con cuatro letras"],
      correcta: "B"
    },
    {
      texto: "¿Qué tiene dos cabezas, una cola, no tiene patas y se pone rojo cuando se irrita? 😏🔥",
      alternativas: ["Una serpiente", "Una moneda de dos caras", "Un fósforo usado", "Un grano"],
      correcta: "B"
    },
    {
      texto: "¿Qué te pide tu pareja de rodillas, con la boca abierta y con los ojos llorosos? 😏🔥",
      alternativas: ["Un beso apasionado", "Que le pases el papel higiénico", "Perdón", "Comida"],
      correcta: "B"
    },
    {
      texto: "¿Qué es negro por delante, blanco por detrás y se le mete por el medio un tubo? 😏🔥",
      alternativas: ["La cebra", "La llanta del carro", "El pingüino", "El dominó"],
      correcta: "B"
    },
    {
      texto: "¿Qué parte del cuerpo humano puede aumentar hasta 10 veces su tamaño cuando se excita con la luz? 😏🔥",
      alternativas: ["El músculo bíceps", "La pupila del ojo", "El tímpano", "La lengua"],
      correcta: "B"
    },
    {
      texto: "¿Qué se agarra con las dos manos, se pone en la boca y se chupa hasta sacarle todo el jugo? 😏🔥",
      alternativas: ["La naranja partida", "La caña de azúcar", "El limón", "El mango"],
      correcta: "B"
    },
    {
      texto: "¿Qué es húmedo por dentro, calientito, apretado y cuando metes el pie sientes rico? 😏🔥",
      alternativas: ["El charco de barro", "La media de lana recién lavada y planchada", "La bota de nieve", "La tina de baño"],
      correcta: "B"
    },
    {
      texto: "¿Qué te entra por una oreja, te sale por la otra y te deja sonriendo tontamente? 😏🔥",
      alternativas: ["El viento frío", "Un piropo bien picante", "Un mosquito", "El audífono"],
      correcta: "B"
    },
    {
      texto: "¿Qué tiene el hombre adelante, la mujer atrás y los dos lo usan para sentarse cómodos? 😏🔥",
      alternativas: ["El cojín", "Las rodillas y el asiento", "El respaldo de la silla", "El pantalón"],
      correcta: "B"
    },
    {
      texto: "¿Qué es largo, rugoso, los hombres lo sacan en el baño y lo sacuden antes de guardarlo? 😏🔥",
      alternativas: ["El cinturón de cuero", "El paraguas mojado", "La corbata", "El trapeador"],
      correcta: "B"
    },
    {
      texto: "¿Qué se abre de piernas para que puedas pasar, te abraza fuerte y luego te deja ir? 😏🔥",
      alternativas: ["La puerta vaivén", "La tijera de jardinería", "El torniquete del tren", "La hamaca"],
      correcta: "C"
    },
    {
      texto: "¿Qué se introduce duro y seco en la boca y sale flácido y empapado de saliva? 😏🔥",
      alternativas: ["El caramelo", "El palito de fósforo", "El palillo de dientes", "La galleta de soda"],
      correcta: "D"
    },
    {
      texto: "¿Qué es algo que a las mujeres les gusta largo y grueso para poder agarrarlo bien al cocinar? 😏🔥",
      alternativas: ["El sartén", "El rodillo de amasar", "El cucharón", "El cuchillo de chef"],
      correcta: "B"
    },
    {
      texto: "¿Qué te chorrea por la barbilla cuando te lo comes muy rápido con las dos manos? 😏🔥",
      alternativas: ["El helado de cono derretido", "La sandía jugosa", "El mango maduro", "Todas las anteriores"],
      correcta: "D"
    },
    {
      texto: "¿Qué se moja mientras más te seca? 😏🔥",
      alternativas: ["El sol", "La toalla", "El secador", "El ventilador"],
      correcta: "B"
    },
    {
      texto: "¿Qué tienen los hombres en los pantalones que las mujeres no tienen, pero siempre quieren revisar? 😏🔥",
      alternativas: ["El cierre", "La billetera con plata", "El botón", "El dobladillo"],
      correcta: "B"
    },
    {
      texto: "¿Qué es peludo alrededor, húmedo al centro y si lo frotas echa espuma blanca? 😏🔥",
      alternativas: ["El jabón en el cepillo", "El coco con leche", "El kiwi pelado", "La esponja de baño"],
      correcta: "A"
    },
    {
      texto: "¿Qué le entra a una mujer cuando ve llegar al que le gusta con un paquete grande? 😏🔥",
      alternativas: ["La duda", "La curiosidad de qué compró", "El susto", "El apetito"],
      correcta: "B"
    },
    {
      texto: "¿Qué es redondo, tiene carne al medio, dos panes que lo aprietan y mayonesa chorreando? 😏🔥",
      alternativas: ["El taco", "La hamburguesa", "La empanada", "El sánguche de pollo"],
      correcta: "B"
    },
    {
      texto: "¿Qué se mete con facilidad cuando está bien lubricado y si no duele mucho? 😏🔥",
      alternativas: ["El anillo en el dedo hinchado", "La cadena de la bici", "El candado viejo", "El perno"],
      correcta: "A"
    },
    {
      texto: "¿Qué tiene cuatro letras, empieza con 'C', rima con 'hueso' y a todos les gusta que se lo den con cariño? 😏🔥",
      alternativas: ["Ceso", "Beso (con B)", "Cariño", "Cama"],
      correcta: "B"
    },
    {
      texto: "¿Qué te cuelga en el pecho, tiene dos puntas y pita cuando soplas fuerte? 😏🔥",
      alternativas: ["El silbato de árbitro", "El collar de oro", "La medalla", "La bufanda"],
      correcta: "A"
    },
    {
      texto: "¿Qué entra tieso en una boca caliente y sale blando y sin fuerza? 😏🔥",
      alternativas: ["El hielo", "El fideo cocido", "El chicle", "El bombón"],
      correcta: "B"
    },
    {
      texto: "¿Qué es aquello que los hombres hacen sentados, las mujeres también sentadas y los pájaros en el aire? 😏🔥",
      alternativas: ["Cantar", "Hacer sus necesidades biológicas", "Descansar", "Mirar al frente"],
      correcta: "B"
    },
    {
      texto: "¿Qué mide 20 centímetros, se mete por detrás y te deja lleno hasta no poder más? 😏🔥",
      alternativas: ["El termo de café", "El pavo de navidad relleno", "El sánguche de chorizo", "El taper de comida"],
      correcta: "C"
    },
    {
      texto: "¿Qué se pone duro cuando le das calor con las manos y líquido si lo calientas de más? 😏🔥",
      alternativas: ["El chocolate de barra", "La mantequilla", "La plastilina", "La cera de depilar"],
      correcta: "A"
    },
    {
      texto: "¿Qué tiene una abertura estrecha, pelos finos alrededor y si le metes el dedo te puede morder? 😏🔥",
      alternativas: ["Un canario", "Una planta carnívora", "Un puercoespín", "Un erizo"],
      correcta: "B"
    },
    {
      texto: "¿Qué es lo primero que le mete un hombre a su esposa la noche de bodas al llegar a la suite? 😏🔥",
      alternativas: ["La maleta al cuarto", "La llave a la cerradura", "La tarjeta de crédito", "El abrigo al clóset"],
      correcta: "B"
    }
  ],

  // --------------------------------------------------------------------------
  // 3. COTIDIANO (50 preguntas)
  // --------------------------------------------------------------------------
  cotidiano: [
    {
      texto: "¿A qué temperatura hierve el agua al nivel del mar en condiciones normales?",
      alternativas: ["90 °C", "100 °C", "110 °C", "120 °C"],
      correcta: "B"
    },
    {
      texto: "¿Cuál de estos alimentos contiene mayor cantidad de vitamina C?",
      alternativas: ["Manzana", "Naranja / Camu Camu", "Plátano", "Papa"],
      correcta: "B"
    },
    {
      texto: "¿Cuántas horas de sueño nocturno promedio se recomiendan para un adulto saludable?",
      alternativas: ["4 a 5 horas", "7 a 8 horas", "10 a 12 horas", "3 a 4 horas"],
      correcta: "B"
    },
    {
      texto: "¿Qué aparato doméstico utiliza ondas electromagnéticas para calentar alimentos rápidamente?",
      alternativas: ["Horno eléctrico", "Microondas", "Freidora de aire", "Tostadora"],
      correcta: "B"
    },
    {
      texto: "¿Qué gas producen los seres humanos al exhalar durante la respiración?",
      alternativas: ["Oxígeno", "Dióxido de carbono (CO2)", "Monóxido de carbono", "Metano"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la forma correcta de lavarse las manos según la OMS para eliminar bacterias y virus?",
      alternativas: ["5 segundos solo agua", "Al menos 20 segundos con agua y jabón", "Pasarse alcohol sin frotar", "Secarse con la ropa"],
      correcta: "B"
    },
    {
      texto: "¿Qué bebida popular matutina contiene cafeína y se prepara tostando granos?",
      alternativas: ["Té verde", "Café", "Mate", "Avena"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el atajo de teclado universal en Windows para copiar texto seleccionado?",
      alternativas: ["Ctrl + V", "Ctrl + C", "Ctrl + X", "Ctrl + Z"],
      correcta: "B"
    },
    {
      texto: "¿Qué condimento común de cocina tiene como fórmula química NaCl?",
      alternativas: ["Azúcar blanca", "Sal de mesa (Cloruro de sodio)", "Bicarbonato de sodio", "Pimienta"],
      correcta: "B"
    },
    {
      texto: "¿Cuántos minutos tiene exactamente una hora?",
      alternativas: ["50 minutos", "60 minutos", "100 minutos", "3600 minutos"],
      correcta: "B"
    },
    {
      texto: "¿Cuál de estos colores del semáforo indica precaución y cambio inminente?",
      alternativas: ["Rojo", "Amarillo / Ámbar", "Verde", "Azul"],
      correcta: "B"
    },
    {
      texto: "¿Qué elemento vital cubre aproximadamente el 71% de la superficie de nuestro planeta?",
      alternativas: ["Tierra", "Agua", "Hielo", "Arena"],
      correcta: "B"
    },
    {
      texto: "¿Qué vitamina produce nuestro propio cuerpo cuando nuestra piel se expone a la luz solar?",
      alternativas: ["Vitamina A", "Vitamina D", "Vitamina B12", "Vitamina K"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el atajo de teclado para deshacer la última acción realizada en una computadora?",
      alternativas: ["Ctrl + Y", "Ctrl + Z", "Ctrl + S", "Ctrl + D"],
      correcta: "B"
    },
    {
      texto: "¿Qué instrumento doméstico se usa para medir la temperatura corporal de una persona?",
      alternativas: ["Barómetro", "Termómetro", "Tensiómetro", "Higrómetro"],
      correcta: "B"
    },
    {
      texto: "¿Cada cuántos años ocurre un año bisiesto con 366 días?",
      alternativas: ["Cada 2 años", "Cada 4 años", "Cada 5 años", "Cada 10 años"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la función principal de los glóbulos rojos en la sangre?",
      alternativas: ["Combatir infecciones", "Transportar oxígeno a los tejidos", "Coagular heridas", "Filtrar toxinas"],
      correcta: "B"
    },
    {
      texto: "¿Qué sentido humano se relaciona directamente con el nervio olfativo?",
      alternativas: ["Gusto", "Olfato", "Vista", "Oído"],
      correcta: "B"
    },
    {
      texto: "¿En qué contenedor de reciclaje de colores se suele depositar el papel y cartón limpio?",
      alternativas: ["Contenedor marrón", "Contenedor azul", "Contenedor amarillo", "Contenedor rojo"],
      correcta: "B"
    },
    {
      texto: "¿Qué nutriente es la principal fuente de energía rápida para el cuerpo humano?",
      alternativas: ["Grasas saturadas", "Carbohidratos", "Proteínas", "Minerales"],
      correcta: "B"
    },
    {
      texto: "¿Qué órgano del cuerpo bombea sangre continuamente sin descanso?",
      alternativas: ["Cerebro", "Corazón", "Pulmón", "Riñón"],
      correcta: "B"
    },
    {
      texto: "¿Cuál de estos materiales es el más recomendado para evitar la contaminación de plásticos de un solo uso?",
      alternativas: ["Bolsas de plástico", "Bolsas de tela reutilizables", "Vasos de tecnopor", "Cañitas de plástico"],
      correcta: "B"
    },
    {
      texto: "¿A qué número de emergencia se suele llamar en Perú para contactar a la Policía Nacional?",
      alternativas: ["116", "105", "106", "112"],
      correcta: "B"
    },
    {
      texto: "¿Qué se debe hacer primero en caso de un temblor o sismo según Defensa Civil?",
      alternativas: ["Gritar y correr", "Conservar la calma y ubicarse en zonas seguras", "Usar el ascensor", "Grabar para TikTok"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el ingrediente base para hacer chocolate?",
      alternativas: ["Vainilla", "Cacao", "Café", "Canela"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la capital de la República del Perú?",
      alternativas: ["Arequipa", "Lima", "Cusco", "Trujillo"],
      correcta: "B"
    },
    {
      texto: "¿Qué músculo es el más activo de todo el cuerpo humano, moviéndose más de 100,000 veces al día?",
      alternativas: ["Bíceps", "Músculos oculares (del ojo)", "Lengua", "Gemelos"],
      correcta: "B"
    },
    {
      texto: "¿Cuántos dientes tiene un ser humano adulto con dentadura completa (incluyendo muelas del juicio)?",
      alternativas: ["28", "32", "36", "30"],
      correcta: "B"
    },
    {
      texto: "¿Qué unidad de medida se usa habitualmente para medir la memoria RAM o almacenamiento de un celular?",
      alternativas: ["Kilogramos", "Gigabytes (GB)", "Voltios", "Megawatts"],
      correcta: "B"
    },
    {
      texto: "¿Qué líquido vital transparente es indispensable para la vida humana y no tiene color ni sabor?",
      alternativas: ["Jugo", "Agua pura", "Gaseosa", "Té"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la comida considerada tradicionalmente la más importante para iniciar el día con energía?",
      alternativas: ["Cena", "Desayuno", "Almuerzo", "Lonche"],
      correcta: "B"
    },
    {
      texto: "¿Qué tipo de ejercicio físico mejora principalmente el sistema cardiovascular?",
      alternativas: ["Levantamiento de pesas estático", "Ejercicio aeróbico (correr, nadar, montar bicicleta)", "Estiramiento pasivo", "Juegos de mesa"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la moneda con la que se paga en los Estados Unidos?",
      alternativas: ["Euro", "Dólar estadounidense (USD)", "Libra esterlina", "Yen"],
      correcta: "B"
    },
    {
      texto: "¿Qué día de la semana suele ser considerado el primer día laboral en la mayoría de países?",
      alternativas: ["Domingo", "Lunes", "Sábado", "Martes"],
      correcta: "B"
    },
    {
      texto: "¿Qué aparato doméstico sirve para conservar los alimentos fríos y evitar que se descompongan?",
      alternativas: ["Lavadora", "Refrigerador / Nevera", "Secadora", "Batidora"],
      correcta: "B"
    },
    {
      texto: "¿Cuántos meses tiene un año calendario regular?",
      alternativas: ["10", "12", "14", "11"],
      correcta: "B"
    },
    {
      texto: "¿Qué cereal es la base de alimentación diaria de miles de millones de personas en Asia y América Latina?",
      alternativas: ["Trigo", "Arroz", "Avena", "Centeno"],
      correcta: "B"
    },
    {
      texto: "¿Qué dispositivo portátil inteligente llevamos en el bolsillo para comunicarnos y navegar en internet?",
      alternativas: ["Calculadora", "Smartphone / Teléfono celular", "Radio a pilas", "Linterna"],
      correcta: "B"
    },
    {
      texto: "¿Qué vitamina es conocida por ayudar a la coagulación normal de la sangre?",
      alternativas: ["Vitamina C", "Vitamina K", "Vitamina E", "Vitamina B1"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la estación más calurosa del año en el hemisferio sur?",
      alternativas: ["Invierno", "Verano", "Otoño", "Primavera"],
      correcta: "B"
    },
    {
      texto: "¿Qué sentido nos permite percibir los sabores dulce, salado, amargo, ácido y umami?",
      alternativas: ["Tacto", "Gusto", "Olfato", "Vista"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la función principal de los pulmones?",
      alternativas: ["Digerir alimentos", "Intercambio de oxígeno y dióxido de carbono", "Bombear sangre", "Filtrar la orina"],
      correcta: "B"
    },
    {
      texto: "¿Qué material transparente se utiliza comúnmente en las ventanas de las casas?",
      alternativas: ["Plástico opaco", "Vidrio", "Madera", "Metal"],
      correcta: "B"
    },
    {
      texto: "¿Qué deporte es conocido mundialmente como 'el deporte rey'?",
      alternativas: ["Baloncesto", "Fútbol", "Tenis", "Béisbol"],
      correcta: "B"
    },
    {
      texto: "¿Cómo se llama el proceso en el que el agua pasa de estado líquido a vapor?",
      alternativas: ["Congelación", "Evaporación", "Condensación", "Sublimación"],
      correcta: "B"
    },
    {
      texto: "¿Qué profesión se encarga del cuidado y tratamiento de la salud bucal y de los dientes?",
      alternativas: ["Oftalmólogo", "Odontólogo / Dentista", "Dermatólogo", "Pediatra"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la cantidad de días que tiene el mes de febrero en un año no bisiesto?",
      alternativas: ["30 días", "28 días", "29 días", "31 días"],
      correcta: "B"
    },
    {
      texto: "¿Qué elemento es fundamental beber para mantenerse hidratado todos los días?",
      alternativas: ["Gaseosa", "Agua", "Café bien cargado", "Bebidas energizantes"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es la capital del estado de conservación del cuerpo a través del descanso reparador?",
      alternativas: ["Estrés", "Sueño reparador", "Insomnio", "Trabajo nocturno"],
      correcta: "B"
    },
    {
      texto: "¿Qué se celebra universalmente el 25 de diciembre?",
      alternativas: ["Año Nuevo", "Navidad", "Día del Trabajo", "Halloween"],
      correcta: "B"
    }
  ],

  // --------------------------------------------------------------------------
  // 4. ANIMALES (50 preguntas 🐾)
  // --------------------------------------------------------------------------
  animales: [
    {
      texto: "¿Cuál es el animal terrestre más rápido del mundo, alcanzando más de 100 km/h?",
      alternativas: ["León", "Guepardo (Chita)", "Gacela", "Leopardo"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el animal más grande que ha existido en la historia del planeta Tierra?",
      alternativas: ["Tiranosaurio Rex", "Ballena Azul", "Tiburón Megalodón", "Elefante Africano"],
      correcta: "B"
    },
    {
      texto: "¿Qué roedor domesticado originario de los Andes peruanos es conocido como Cuy o Cobayo?",
      alternativas: ["Chinchilla", "Cavia porcellus (Cuy)", "Capibara", "Vizcacha"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el mamífero volador capaz de realizar vuelo activo sostenido?",
      alternativas: ["Ardilla voladora", "Murciélago", "Colugo", "Petaura"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el ave voladora más grande de los Andes peruanos y símbolo de libertad?",
      alternativas: ["Águila Harpía", "Cóndor Andino", "Flamenco", "Gavilán"],
      correcta: "B"
    },
    {
      texto: "¿Qué reptil cambia de color en su piel para comunicarse y camuflarse?",
      alternativas: ["Iguana", "Camaleón", "Gecko", "Cocodrilo"],
      correcta: "B"
    },
    {
      texto: "¿Cuántos tentáculos tiene un pulpo común?",
      alternativas: ["6", "8", "10", "12"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el animal terrestre viviente más alto del mundo gracias a su largo cuello?",
      alternativas: ["Avestruz", "Jirafa", "Elefante", "Camello"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal marino duerme con la mitad de su cerebro despierto para poder respirar?",
      alternativas: ["Tiburón blanco", "Delfín", "Medusa", "Pez payaso"],
      correcta: "B"
    },
    {
      texto: "¿Qué gran roedor sudamericano es considerado el roedor más grande del mundo?",
      alternativas: ["Castor", "Capibara (Ronsoco)", "Nutria", "Puercoespín"],
      correcta: "B"
    },
    {
      texto: "¿De qué se alimenta casi exclusivamente el oso panda gigante en su hábitat natural?",
      alternativas: ["Pescado", "Bambú", "Bayas silvestres", "Insectos"],
      correcta: "B"
    },
    {
      texto: "¿Qué insecto es famoso por fabricar miel y polinizar gran parte de los cultivos del mundo?",
      alternativas: ["Avispa", "Abeja", "Hormiga", "Mariposa"],
      correcta: "B"
    },
    {
      texto: "¿Cuántas patas tiene una araña típica?",
      alternativas: ["6", "8", "10", "12"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal produce los famosos 'cantos' submarinos audibles a kilómetros de distancia?",
      alternativas: ["Tiburón martillo", "Ballena jorobada", "Orca", "Manta raya"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el mamífero terrestre más pesado y grande que camina sobre la tierra hoy en día?",
      alternativas: ["Rinoceronte blanco", "Elefante africano", "Hipopótamo", "Oso polar"],
      correcta: "B"
    },
    {
      texto: "¿Qué marsupial australiano es famoso por cargar a su cría en una bolsa ventral llamada marsupio?",
      alternativas: ["Dingo", "Canguro", "Ornitorrinco", "Equidna"],
      correcta: "B"
    },
    {
      texto: "¿Qué ave no voladora adaptada al frío y nado vive principalmente en el hemisferio sur (Antártida y costas peruanas)?",
      alternativas: ["Gaviota", "Pingüino (ej. Pingüino de Humboldt)", "Albatros", "Pelícano"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el único mamífero que pone huevos junto con el equidna y tiene pico similar al de un pato?",
      alternativas: ["Castor", "Ornitorrinco", "Nutria", "Armadillo"],
      correcta: "B"
    },
    {
      texto: "¿Qué sentido tienen los perros hasta 100,000 veces más desarrollado que el ser humano?",
      alternativas: ["La vista nocturna", "El olfato", "El gusto", "El equilibrio"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal marino cuenta con tres corazones y sangre de color azulada?",
      alternativas: ["Calamar gigante", "Pulpo", "Cangrejo herradura", "Estrella de mar"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el felino salvaje más grande de América y el tercero del mundo después del tigre y el león?",
      alternativas: ["Puma", "Jaguar (Otorongo)", "Ocelote", "Guepardo"],
      correcta: "B"
    },
    {
      texto: "¿Cómo se llama el proceso en el que una oruga se transforma en una hermosa mariposa?",
      alternativas: ["Muda", "Metamorfosis", "Evolución rápida", "Fisión"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal tiene la mordida más potente medida en el reino animal actual?",
      alternativas: ["León africano", "Cocodrilo marino / del Nilo", "Tiburón blanco", "Oso pardo"],
      correcta: "B"
    },
    {
      texto: "¿Cuántos estómagos (o cavidades estomacales) tiene una vaca para rumiar el pasto?",
      alternativas: ["2", "4 (rumen, retículo, omaso, abomaso)", "6", "1"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el ave más pequeña del mundo capaz de volar hacia atrás y aletear decenas de veces por segundo?",
      alternativas: ["Gorrión", "Colibrí (Picaflor)", "Jilguero", "Canario"],
      correcta: "B"
    },
    {
      texto: "¿Qué camelido sudamericano silvestre posee una de las fibras de lana más finas y caras del mundo?",
      alternativas: ["Llama", "Vicuña", "Alpaca", "Guanaco"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal es conocido como el 'Rey de la Selva' a pesar de vivir principalmente en la sabana?",
      alternativas: ["Tigre", "León", "Elefante", "Gorila"],
      correcta: "B"
    },
    {
      texto: "¿Qué reptil de caparazón duro puede vivir más de 150 años, como las de las Islas Galápagos?",
      alternativas: ["Cocodrilo", "Tortuga gigante", "Iguana marina", "Dragón de Komodo"],
      correcta: "B"
    },
    {
      texto: "¿Cuál de estos animales es un anfibio que pasa de renacuajo acuático a adulto con patas?",
      alternativas: ["Lagartija", "Rana", "Serpiente", "Tortuga"],
      correcta: "B"
    },
    {
      texto: "¿Qué gran simio comparte más del 98% de su ADN con los seres humanos?",
      alternativas: ["Mandril", "Chimpancé / Bonobo", "Babuino", "Lémur"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el pez cartilaginoso temido en los océanos que posee múltiples filas de dientes que se regeneran?",
      alternativas: ["Barracuda", "Tiburón", "Atún", "Morena"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal tiene una lengua tan larga que puede medir lo mismo que todo su cuerpo para cazar hormigas?",
      alternativas: ["Armadillo", "Oso hormiguero", "Perezoso", "Erizo"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal polar posee pelaje translúcido que parece blanco y piel negra debajo para absorber calor?",
      alternativas: ["Foca leopardo", "Oso polar", "Zorro ártico", "Morsa"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el lagarto más grande y pesado del mundo nativo de Indonesia?",
      alternativas: ["Iguana verde", "Dragón de Komodo", "Varano del Nilo", "Monstruo de Gila"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal puede regenerar por completo una extremidad o cola si la pierde?",
      alternativas: ["Perro", "Salamandra / Ajolote", "Cangrejo ermitaño", "Ratón"],
      correcta: "B"
    },
    {
      texto: "¿Qué cetáceo con manchas blancas y negras es apodado 'ballena asesina', aunque en realidad es un delfín grande?",
      alternativas: ["Beluga", "Orca", "Narval", "Cachalote"],
      correcta: "B"
    },
    {
      texto: "¿Cuántos ojos tienen las abejas?",
      alternativas: ["2 ojos", "5 ojos (2 compuestos y 3 simples/ocelos)", "8 ojos", "4 ojos"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal es famoso por dormir colgado de las ramas de los árboles cabeza abajo casi todo el día?",
      alternativas: ["Mono aullador", "Oso perezoso", "Koala", "Lemur"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal posee jorobas en su lomo para almacenar grasa que le permite cruzar desiertos?",
      alternativas: ["Caballo", "Camello / Dromedario", "Búfalo", "Antílope"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el ave rapaz nocturna con grandes ojos y capacidad de girar la cabeza hasta 270 grados?",
      alternativas: ["Águila", "Búho / Lechuza", "Halcón", "Cuervo"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal marino no tiene cerebro, corazón, ni huesos, y su cuerpo es 95% agua?",
      alternativas: ["Esponja", "Medusa", "Erizo de mar", "Caracol de mar"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal tiene las rayas blancas y negras únicas como si fueran una huella dactilar?",
      alternativas: ["Tigre de Bengala", "Cebra", "Tapir", "Okapi"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal es el mamífero más acorazado cubierto de placas óseas móviles?",
      alternativas: ["Pangolín", "Armadillo", "Tortuga", "Equidna"],
      correcta: "B"
    },
    {
      texto: "¿Cuál es el pez más veloz de los océanos, capaz de nadar a más de 100 km/h?",
      alternativas: ["Tiburón azul", "Pez vela", "Pez espada", "Barracuda"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal produce un potente hedor como mecanismo de defensa cuando se siente amenazado?",
      alternativas: ["Zorrillo / Mofeta", "Tejón", "Comadreja", "Castor"],
      correcta: "A"
    },
    {
      texto: "¿Qué cetáceo macho posee un largo colmillo helicoidal de marfil que parece el cuerno de un unicornio?",
      alternativas: ["Morsa", "Narval", "Beluga", "Elefante marino"],
      correcta: "B"
    },
    {
      texto: "¿Qué animal invertebrado puede levantar hasta 50 veces su propio peso corporal?",
      alternativas: ["Escarabajo", "Hormiga", "Grillo", "Saltamontes"],
      correcta: "B"
    },
    {
      texto: "¿Qué reptil no tiene patas, se desplaza reptando y detecta vibraciones y calor en el suelo?",
      alternativas: ["Salamandra", "Serpiente", "Ciempiés", "Lagartija sin patas"],
      correcta: "B"
    },
    {
      texto: "¿Qué mamífero marino es conocido como la 'vaca marina' por su carácter pacífico y alimentación herbívora?",
      alternativas: ["Nutria marina", "Manatí", "Dugongo", "León marino"],
      correcta: "B"
    },
    {
      texto: "¿Qué simpático animal andino es el protagonista dorado y rey de este juego QuizPekuy?",
      alternativas: ["Vizcacha", "El Cuy Dorado 👑🐹", "La Vicuña Real", "El Gallito"],
      correcta: "B"
    }
  ]
};

// Función auxiliar para obtener preguntas de una categoría o combinadas
export function obtenerPreguntasPorCategoria(categoriaId, cantidad = 25) {
  const lista = PREGUNTAS_POR_CATEGORIA[categoriaId] || PREGUNTAS_POR_CATEGORIA["cultura_peruana"];
  const barajadas = [...lista].sort(() => 0.5 - Math.random());
  return barajadas.slice(0, Math.min(cantidad, barajadas.length));
}
