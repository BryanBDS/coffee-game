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

/* iniciar finca 3D cuando se abra la pestaña */

if(realTab === "finca"){

setTimeout(()=>{

if(window.iniciarFinca3D){
window.iniciarFinca3D();
}

},200);

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

html = `
<h2>🌍 Mapa cafetero</h2>
<button id="btnComprar">Comprar terreno en Colombia</button>
`;

setTimeout(()=>{

const btn = document.getElementById("btnComprar");

if(btn){
btn.addEventListener("click", ()=>{

console.log("CLICK comprarTerreno desde UI");
window.comprarTerreno();

});
}

},100);

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
const leafletPopup = document.querySelector(".leaflet-popup");

/* si la barra no está abierta no hacemos nada */
if(!sidebar.classList.contains("active")) return;

/* si se toca dentro del sidebar no cerrar */
if(sidebar.contains(e.target)) return;

/* si se toca un icono tampoco cerrar */
if(iconSidebar.contains(e.target)) return;

/* si se toca el popup del mapa no cerrar */
if(leafletPopup && leafletPopup.contains(e.target)) return;

/* cerrar sidebar */
sidebar.classList.remove("active");

/* quitar icono activo */
document.querySelectorAll(".nav-icon").forEach(i=>{
i.classList.remove("active");
});

});