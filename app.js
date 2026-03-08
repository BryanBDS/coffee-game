// Esperar que la página cargue
document.addEventListener("DOMContentLoaded", function() {

const form = document.getElementById("registerForm");

// Verificar si el jugador ya está registrado
const jugadorGuardado = localStorage.getItem("jugador");

if (jugadorGuardado) {

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("gameUI").style.display = "block";

}

// Registro del jugador
form.addEventListener("submit", function(e) {

    e.preventDefault();

    const inputs = form.querySelectorAll("input");

    const granja = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;

    const jugador = {
        granja: granja,
        email: email,
        dinero: 100,
        cafe: 0
    };

    // Guardar jugador
    localStorage.setItem("jugador", JSON.stringify(jugador));

    // Ocultar login
    document.getElementById("loginScreen").style.display = "none";

    // Mostrar juego
    document.getElementById("gameUI").style.display = "block";

});

});



let terrenoComprado = false
let plantas = 0
let cafeListo = false
let dinero = 1000

function mostrarMapa(){

document.getElementById("pantalla").innerHTML = `

<h2>🌍 Mapa cafetero</h2>

<button onclick="comprarTerreno()">Comprar terreno en Colombia</button>

`

}

function comprarTerreno(){

if(dinero >= 500){

dinero -= 500
terrenoComprado = true

document.getElementById("pantalla").innerHTML = `
<h2>Terreno comprado en Colombia</h2>
<p>Dinero restante: ${dinero}</p>
<button onclick="mostrarFinca()">Ir a mi finca</button>
`

}else{

alert("No tienes dinero suficiente")

}

}

function mostrarFinca(){

if(!terrenoComprado){

document.getElementById("pantalla").innerHTML = `
<h2>No tienes terreno</h2>
`

return
}

document.getElementById("pantalla").innerHTML = `

<h2>🌱 Mi finca</h2>

<p>Plantas sembradas: ${plantas}</p>

<button onclick="sembrar()">Sembrar café</button>

<button onclick="crecer()">Avanzar crecimiento</button>

`

}

function sembrar(){

plantas = 100

document.getElementById("pantalla").innerHTML = `
<h2>Café sembrado</h2>
<p>Plantas: ${plantas}</p>
<button onclick="mostrarFinca()">Volver</button>
`

}

function crecer(){

cafeListo = true

document.getElementById("pantalla").innerHTML = `
<h2>🍒 Café listo para cosechar</h2>
<button onclick="cosechar()">Cosechar</button>
`

}

function cosechar(){

dinero += 800

document.getElementById("pantalla").innerHTML = `
<h2>Cosecha vendida</h2>
<p>Ganancia: 800</p>
<p>Dinero total: ${dinero}</p>
<button onclick="mostrarFinca()">Volver a finca</button>
`

}

function mostrarMercado(){

document.getElementById("pantalla").innerHTML = `
<h2>💰 Mercado del café</h2>
<p>Precio actual: 2.5 CCF/kg</p>
`


}
