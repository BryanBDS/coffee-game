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


let coffeeMap = null;
let grupoLotes = L.layerGroup();
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

/* =========================
SOLO ABRIR CONTENIDO SI ES BOTÓN
========================= */

if(tab.startsWith("abrir")){

const realTab = tab.replace("abrir","").toLowerCase();

const tabs = document.querySelectorAll(".content-tab");

tabs.forEach(t=>{
t.classList.remove("active");
});

const target = document.getElementById("tab-"+realTab);

if(target){
target.classList.add("active");
}

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
ABRIR / CERRAR SIDEBAR  
========================= */

const sidebar = document.getElementById("sideMenu");

const activeIconNow = document.querySelector(".nav-icon.active");

if(activeIconNow && activeIconNow.dataset.tab === tab && sidebar.classList.contains("active")){

sidebar.classList.remove("active");
activeIconNow.classList.remove("active");

return;

}

sidebar.classList.add("active");


/* =========================
CAMBIAR CONTENIDO SIDEBAR
========================= */

const menu = sidebar.querySelector(".menu");

if(!menu){
console.log("Menu no encontrado");
return;
}

let html = "";

if(tab === "mapa"){
html = `<button class="nav-btn active" onclick="switchTab('abrirMapa')">🗺️ MAPA CAFETERO</button>`;
}

if(tab === "finca"){
html = `<button class="nav-btn active" onclick="switchTab('abrirFinca')">🏡 MI FINCA</button>`;
}

if(tab === "mercado"){
html = `<button class="nav-btn active" onclick="switchTab('abrirMercado')">📈 MERCADO</button>`;
}

if(tab === "procesos"){
html = `<button class="nav-btn active" onclick="switchTab('abrirProcesos')">🏭 PROCESOS</button>`;
}

if(tab === "config"){
html = `<button class="nav-btn active" onclick="switchTab('abrirConfig')">⚙️ CONFIGURACIÓN</button>`;
}

menu.innerHTML = html;

}










function iniciarMapa(){

if(coffeeMap) return;

coffeeMap = L.map('coffeeMap').setView([4.5709, -74.2973], 6);
grupoLotes.addTo(coffeeMap);    

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

/* =========================
MARCADOR NARIÑO
========================= */

const narino = L.marker([1.289, -77.357]).addTo(coffeeMap);

narino.bindPopup(`
<h3>☕ Región Cafetera</h3>
<p>Nariño</p>
<button onclick="mostrarMunicipios()">Ver Municipios</button>
`);
    
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

html += `<button class="nav-btn" onclick="seleccionarMunicipio('${m}')">📍 ${m}</button>`;

});

document.querySelector(".menu").innerHTML = html;

}





function seleccionarMunicipio(nombre){

/* =========================
COORDENADAS MUNICIPIOS
========================= */

const coords = {

"San Juan de Pasto":[1.2136,-77.2811],
"La Unión":[1.6019,-77.1310],
"Buesaco":[1.3833,-77.1561],
"Consacá":[1.2089,-77.4600],
"Sandoná":[1.2862,-77.4720]

};

 /* mover mapa al municipio */

if(coffeeMap && coords[nombre]){

coffeeMap.setView(coords[nombre],11);

}

/* =========================
PARCELAS EN EL MAPA
========================= */

const parcelasMunicipio = [

{nombre:"Lote 1",lat:coords[nombre][0]+0.01,lng:coords[nombre][1]+0.01},
{nombre:"Lote 2",lat:coords[nombre][0]-0.01,lng:coords[nombre][1]-0.01},
{nombre:"Lote 3",lat:coords[nombre][0]+0.015,lng:coords[nombre][1]-0.01}

];

parcelasMunicipio.forEach(p=>{

L.marker([p.lat,p.lng])
.addTo(grupoLotes)
.bindPopup(`<b>${p.nombre}</b><br><button onclick="comprarLote('${nombre}','${p.nombre}',100)">Comprar</button>`);

});    

    
const lotes = [

{nombre:"Lote 1", tamaño:"1 hectárea", precio:100},
{nombre:"Lote 2", tamaño:"2 hectáreas", precio:180},
{nombre:"Lote 3", tamaño:"5 hectáreas", precio:400}

];

let html = `<h3>Lotes en ${nombre}</h3>`;

lotes.forEach(l =>{

html += `
<button class="nav-btn" onclick="comprarLote('${nombre}','${l.nombre}',${l.precio})">

${l.nombre}  
${l.tamaño}  
💰 ${l.precio} CoffeeCoins

</button>
`;

});

document.querySelector(".menu").innerHTML = html;

}


function mostrarLotes(municipio){
const menu = document.querySelector(".menu");

menu.innerHTML = `
<h3>Lotes en ${municipio}</h3>

<button class="nav-btn" onclick="comprarLote('${municipio}',1)">
Lote 1 - 1 Hectárea
💰 100 CoffeeCoins
</button>

<button class="nav-btn" onclick="comprarLote('${municipio}',2)">
Lote 2 - 2 Hectáreas
💰 180 CoffeeCoins
</button>

`;

}
 

function comprarLote(municipio,lote,precio){

/* =========================
CREAR FINCA
========================= */

const finca = {
municipio: municipio,
lote: lote,
precio: precio
};

/* guardar finca temporalmente */
localStorage.setItem("miFinca",JSON.stringify(finca));

alert("¡Compraste "+lote+" en "+municipio+"! ☕");

/* abrir sección MI FINCA */

switchTab("finca");

/* mostrar información de la finca */

mostrarMiFinca();

}



function mostrarMiFinca(){

const data = localStorage.getItem("miFinca");

if(!data) return;

const finca = JSON.parse(data);

let html = `
<div class="card">

<h2>☕ Mi finca</h2>

<p><b>Municipio:</b> ${finca.municipio}</p>

<p><b>Lote:</b> ${finca.lote}</p>

<p><b>Precio:</b> ${finca.precio} CoffeeCoins</p>

<button class="nav-btn">🌱 Sembrar café</button>

</div>
`;

document.querySelector("#tab-finca").innerHTML = html;

}








/* =========================
ABRIR MAPA CAFETERO
========================= */

function abrirMapaCafetero(){

setTimeout(()=>{

if(typeof iniciarMapa === "function"){
iniciarMapa();
}

if(coffeeMap){

coffeeMap.setView([4.5709,-74.2973],6);
coffeeMap.invalidateSize();

}

/* borrar lotes */
if(typeof grupoLotes !== "undefined"){
grupoLotes.clearLayers();
}

},300);

}



/* =========================
ABRIR FINCA
========================= */

function abrirFinca(){

const tab = document.getElementById("tab-finca");

document.querySelectorAll(".content-tab").forEach(t=>{
t.classList.remove("active");
});

tab.classList.add("active");

}

/* =========================
ABRIR MERCADO
========================= */

function abrirMercado(){

const tab = document.getElementById("tab-mercado");

document.querySelectorAll(".content-tab").forEach(t=>{
t.classList.remove("active");
});

tab.classList.add("active");

}

/* =========================
ABRIR PROCESOS
========================= */

function abrirProcesos(){

const tab = document.getElementById("tab-procesos");

document.querySelectorAll(".content-tab").forEach(t=>{
t.classList.remove("active");
});

tab.classList.add("active");

}

/* =========================
ABRIR CONFIG
========================= */

function abrirConfig(){

const tab = document.getElementById("tab-config");

document.querySelectorAll(".content-tab").forEach(t=>{
t.classList.remove("active");
});

tab.classList.add("active");
}


/* =========================
CERRAR SIDEBAR AL TOCAR PANTALLA
========================= */

document.addEventListener("click", function(e){

const sidebar = document.getElementById("sideMenu");
const iconSidebar = document.querySelector(".icon-sidebar");

/* si la barra no está abierta no hacemos nada */
if(!sidebar.classList.contains("active")) return;

/* si se toca dentro del sidebar no cerrar */
if(sidebar.contains(e.target)) return;

/* si se toca un icono tampoco cerrar */
if(iconSidebar.contains(e.target)) return;

/* cerrar sidebar */
sidebar.classList.remove("active");

/* quitar icono activo */
document.querySelectorAll(".nav-icon").forEach(i=>{
i.classList.remove("active");
});

});







