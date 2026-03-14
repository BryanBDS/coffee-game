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