let coffeeMap = null;
let grupoLotes = L.layerGroup();

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
<button id="btnMunicipios">Ver Municipios</button>
`);

narino.on('popupopen', function(){

const btn = document.getElementById("btnMunicipios");

if(btn){
btn.addEventListener("click", function(){
mostrarMunicipios();
});
}

});
    
    
}



function mostrarMunicipios(){
grupoLotes.clearLayers();    

/* abrir sidebar correctamente */

switchTab("mapa");

/* lista de municipios */

const municipios = [

"San Juan de Pasto",
"La Unión",
"Buesaco",
"Consacá",
"Sandoná"

];

let html = "<h3>Municipios cafeteros</h3>";

municipios.forEach(m =>{

html += `
<button class="nav-btn" onclick="seleccionarMunicipio('${m}')">
📍 ${m}
</button>
`;

});

/* insertar contenido en el menú */

const menu = document.querySelector("#sideMenu .menu");

if(menu){
menu.innerHTML = html;
}

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

obtenerClima(coords[nombre][0],coords[nombre][1]);

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

{nombre:"Lote 1", hectareas:1, precio:100},
{nombre:"Lote 2", hectareas:2, precio:180},
{nombre:"Lote 3", hectareas:5, precio:400}

];

let html = `<h3>Lotes en ${nombre}</h3>`;

lotes.forEach(l =>{

html += `
<button class="nav-btn" onclick="comprarLote('${nombre}','${l.nombre}',${l.precio},${l.hectareas})">

${l.nombre}  
${l.hectareas} hectáreas  
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


function comprarLote(municipio,lote,precio,hectareas){

if(!window.GameManager) return;

if(GameManager.money < precio){
alert("No tienes dinero suficiente");
return;
}

/* descontar dinero */
GameManager.money -= precio;

/* crear parcela REAL */
const id = Date.now();

GameManager.parcelas.push({
id: id,
municipio: municipio,
lote: lote,
precio: precio,
hectareas: hectareas, // 🔥 NUEVO
estado: "vacio",
nivel: 1
});

/* guardar */
GameManager.guardar();

alert("¡Compraste " + lote + " en " + municipio + "! ☕");

/* ir a finca */
switchTab("abrirFinca");

/* renderizar 3D */
setTimeout(()=>{
if(window.iniciarFinca3D){
iniciarFinca3D();
}
},300);

}


/* =========================
ABRIR MAPA CAFETERO
========================= */

function abrirMapaCafetero(){

/* abrir la pestaña del mapa */

document.querySelectorAll(".content-tab").forEach(tab=>{
tab.classList.remove("active");
});

const mapaTab = document.getElementById("tab-mapa");

if(mapaTab){
mapaTab.classList.add("active");
}

/* esperar a que el mapa sea visible */

setTimeout(()=>{

if(!coffeeMap){
iniciarMapa();
}

/* limpiar lotes del municipio */

if(grupoLotes){
grupoLotes.clearLayers();
}

/* regresar a vista inicial de Colombia */

if(coffeeMap){
coffeeMap.setView([4.5709, -74.2973],6);
coffeeMap.invalidateSize();
}

},200);

/* restaurar menú inicial */

const menu = document.querySelector("#sideMenu .menu");

if(menu){
menu.innerHTML = `
<button class="nav-btn active" onclick="abrirMapaCafetero()">🗺️ MAPA CAFETERO</button>
`;
}

 }
 
 
 
