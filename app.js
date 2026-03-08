document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("registerForm");
const loginScreen = document.getElementById("loginScreen");
const gameUI = document.getElementById("gameUI");

// Revisar si ya hay jugador guardado
const jugador = localStorage.getItem("jugador");

if (jugador) {

const datos = JSON.parse(jugador);

document.getElementById("farmName").textContent = "🌱 " + datos.granja;
document.getElementById("playerMoney").textContent = "💰 Balance: " + datos.dinero + " CoffeeCoins";

loginScreen.style.display = "none";
gameUI.style.display = "block";

}

// Registro
form.addEventListener("submit", function(e){

e.preventDefault();

const inputs = form.querySelectorAll("input");

const jugadorData = {
    granja: inputs[0].value,
    email: inputs[1].value,
    dinero: 100,
    cafe: 0
};

localStorage.setItem("jugador", JSON.stringify(jugadorData));

// Ocultar login
document.querySelector('.login-card').style.display = 'none';

// Mostrar pantalla de carga
const loading = document.getElementById('loadingScreen');

if(loading){
loading.style.display = 'flex';
}

let progress = 0;
const fill = document.querySelector('.progress-fill');

const interval = setInterval(() => {

progress += 10;

if(progress > 100) progress = 100;

if(fill){
fill.style.width = progress + "%";
}

if(progress === 100){

clearInterval(interval);

if(loading){
loading.style.display = "none";
}

// Mostrar juego
loginScreen.style.display = "none";
gameUI.style.display = "block";

// Mostrar datos del jugador
document.getElementById("farmName").textContent = "🌱 " + jugadorData.granja;
document.getElementById("playerMoney").textContent = "💰 Balance: " + jugadorData.dinero + " CoffeeCoins";

}

},200);

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


function switchTab(tab){

const tabs = document.querySelectorAll(".content-tab");

tabs.forEach(t=>{
t.classList.remove("active");
});

document.getElementById("tab-"+tab).classList.add("active");

const buttons = document.querySelectorAll(".nav-btn");

buttons.forEach(b=>{
b.classList.remove("active");
});

event.target.classList.add("active");

}




