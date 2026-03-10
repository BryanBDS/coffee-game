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

/* =========================
CAMBIAR CONTENIDO PRINCIPAL
========================= */

const tabs = document.querySelectorAll(".content-tab");

tabs.forEach(t=>{
t.classList.remove("active");
});

const target = document.getElementById("tab-"+tab);

if(target){
target.classList.add("active");
}


/* =========================
ACTIVAR ICONO
========================= */

const icons = document.querySelectorAll(".nav-icon");

icons.forEach(i=>{
i.classList.remove("active");
});

const activeIcon = document.querySelector('.nav-icon[data-tab="'+tab+'"]');

if(activeIcon){
activeIcon.classList.add("active");
}


/* =========================
ABRIR SIDEBAR
========================= */

const sidebar = document.getElementById("sideMenu");

sidebar.classList.add("active");


/* =========================
CAMBIAR CONTENIDO SIDEBAR
========================= */

const menu = document.querySelector(".menu");

let html = "";

if(tab === "mapa"){
html = `<button class="nav-btn active">🗺️ MAPA CAFETERO</button>`;
}

if(tab === "finca"){
html = `<button class="nav-btn active">🏡 MI FINCA</button>`;
}

if(tab === "mercado"){
html = `<button class="nav-btn active">📈 MERCADO</button>`;
}

if(tab === "procesos"){
html = `<button class="nav-btn active">🏭 PROCESOS</button>`;
}

if(tab === "config"){
html = `<button class="nav-btn active">⚙️ CONFIGURACIÓN</button>`;
}

menu.innerHTML = html;


/* =========================
INICIAR MAPA
========================= */

if(tab === "mapa"){

setTimeout(()=>{

if(typeof iniciarMapa === "function"){
iniciarMapa();
}

if(typeof coffeeMap !== "undefined" && coffeeMap){
coffeeMap.invalidateSize();
}

},300);

}

}








let coffeeMap = null;

function iniciarMapa(){

if(coffeeMap) return;

coffeeMap = L.map('coffeeMap').setView([4.5709, -74.2973], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

attribution: '© OpenStreetMap'

}).addTo(coffeeMap);


// PARCELAS DE EJEMPLO

const parcelas = [

{nombre:"Finca Antioquia",lat:6.2442,lng:-75.5812},
{nombre:"Finca Huila",lat:2.5359,lng:-75.5277},
{nombre:"Finca Quindio",lat:4.535,lng:-75.6811}

];

parcelas.forEach(p=>{

L.marker([p.lat,p.lng])
.addTo(coffeeMap)
.bindPopup(`<b>${p.nombre}</b><br>Terreno disponible`);

});

}


function mostrarMunicipios(){

const municipios = [

"San Juan de Pasto",
"La Unión",
"Buesaco",
"Consacá",
"Sandoná"

];

let html = "<h3>Municipios cafeteros</h3>";

municipios.forEach(m =>{

html += `<button onclick="seleccionarMunicipio('${m}')">${m}</button>`;

});

document.getElementById("panelMapa").innerHTML = html;

}


function seleccionarMunicipio(nombre){

const lotes = [

{id:"L1", precio:200},
{id:"L2", precio:300},
{id:"L3", precio:250}

];

let html = `<h3>${nombre}</h3>`;

lotes.forEach(l =>{

html += `
<div class="lote">
<p>${l.id}</p>
<p>Precio: ${l.precio}</p>
<button onclick="comprarLote('${l.id}',${l.precio})">
Comprar
</button>
</div>
`;

});

document.getElementById("panelMapa").innerHTML = html;

}


function comprarLote(id,precio){

let jugador = JSON.parse(localStorage.getItem("jugador"));

if(jugador.dinero >= precio){

jugador.dinero -= precio;

jugador.parcela = id;

localStorage.setItem("jugador",JSON.stringify(jugador));

alert("Terreno comprado");

switchTab("finca");

mostrarParcelaComprada();

}else{

alert("No tienes suficiente dinero");

}

             }



function mostrarParcelaComprada(){

let jugador = JSON.parse(localStorage.getItem("jugador"));

document.getElementById("tab-finca").innerHTML = `

<h2>🌱 Mi finca</h2>

<p>Parcela: ${jugador.parcela}</p>

<button onclick="sembrar()">Sembrar café</button>

`;

    }



/* ===========================
   NAVEGACIÓN PRINCIPAL
=========================== */

const navIcons = document.querySelectorAll(".nav-icon");
const sidebar = document.getElementById("sideMenu");

navIcons.forEach(icon => {

icon.addEventListener("click", () => {

    /* activar icono */
    navIcons.forEach(i => i.classList.remove("active"));
    icon.classList.add("active");

    
    /* abrir sección */
    const tab = icon.dataset.tab;
    switchTab(tab);

});

});











