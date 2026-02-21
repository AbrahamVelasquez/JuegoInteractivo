// Usamos Notyf con un estilo que pegue con el juego
const notyf = new Notyf({
    duration: 5000,
    position: { x: 'right', y: 'bottom' },
});

// Elementos del DOM
const contenedor = document.getElementById("tablero"); 
const btnReset = document.getElementById("btnReset"); 
const displayTiempo = document.getElementById("timer");

// Variables de estado del puzzle
let fichas = []; 
let tiempoSegundos = 0;
let intervalo = null;

// Colores vibrantes para el modo oscuro
let coloresVivos = ["#FFD700", "#FF69B4", "#32CD32", "#9370DB"];

// Función para elegir nivel con prompt
let configurarNivel = function() {
    let nivel = prompt("Escribe el nivel:\n1. Iniciación (10 min)\n2. Medio (6 min)\n3. Avanzado (4 min)");
    
    // Devolvemos segundos según la elección
    if (nivel === "1") return 600;
    if (nivel === "2") return 360;
    if (nivel === "3") return 240;
    
    return 600; // Por defecto
};

// Algoritmo para mezclar las fichas
let mezclarFichas = function(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Función para pintar el tablero
let renderizarTablero = function() {
    contenedor.innerHTML = "";
    
    fichas.forEach((numero, indice) => {
        let celda = document.createElement("div");
        celda.classList.add("celda");
        
        if (numero === 16) {
            celda.textContent = "";
            celda.classList.add("blanca");
        } else {
            celda.textContent = numero;
            // Aplicamos color según su número
            let filaOrigen = Math.floor((numero - 1) / 4);
            celda.style.backgroundColor = coloresVivos[filaOrigen];
            // Le damos un borde sutil del mismo color pero más claro
            celda.style.border = "1px solid rgba(255,255,255,0.3)";
        }

        celda.addEventListener("click", () => moverFicha(indice));
        contenedor.appendChild(celda);
    });
};

// Lógica de movimiento
let moverFicha = function(indiceClick) {
    let indiceBlanco = fichas.indexOf(16);
    
    let filaClick = Math.floor(indiceClick / 4);
    let colClick = indiceClick % 4;
    let filaBlanca = Math.floor(indiceBlanco / 4);
    let colBlanca = indiceBlanco % 4;

    let esAdyacente = Math.abs(filaClick - filaBlanca) + Math.abs(colClick - colBlanca) === 1;

    if (esAdyacente) {
        [fichas[indiceClick], fichas[indiceBlanco]] = [fichas[indiceBlanco], fichas[indiceClick]];
        renderizarTablero();
        verificarResultado();
    }
};

// Comprobación de victoria
let verificarResultado = function() {
    let ganado = fichas.every((num, i) => num === i + 1);
    if (ganado) {
        clearInterval(intervalo);
        notyf.success("¡Increíble! Tablero completado.");
    }
};

// El cronómetro
let actualizarCronometro = function() {
    let min = Math.floor(tiempoSegundos / 60);
    let seg = tiempoSegundos % 60;
    
    displayTiempo.innerText = "⏳ Tiempo: " + min + ":" + (seg < 10 ? "0" + seg : seg);
    
    if (tiempoSegundos <= 0) {
        clearInterval(intervalo);
        notyf.error("¡GAME OVER! Se acabó el tiempo.");
        contenedor.style.pointerEvents = "none";
    }
    tiempoSegundos--;
};

// Inicio del juego
let iniciarJuego = function() {
    fichas = Array.from({length: 16}, (_, i) => i + 1);
    fichas = mezclarFichas(fichas);
    
    tiempoSegundos = configurarNivel();
    contenedor.style.pointerEvents = "auto";
    
    clearInterval(intervalo);
    intervalo = setInterval(actualizarCronometro, 1000);
    
    renderizarTablero();
};

btnReset.addEventListener("click", iniciarJuego);

// ¡Arrancamos!
iniciarJuego();