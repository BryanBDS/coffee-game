
let plantas = 0
let cafeListo = false


window.mostrarMapa = function(){

console.log("Mapa activado");

/* SOLO cambiar de pestaña */
switchTab("abrirMapa");

}


window.comprarTerreno = function(){

console.log("CLICK comprarTerreno");

if(!window.GameManager) return;

if(GameManager.money < 500){
alert("No tienes dinero suficiente");
return;
}

GameManager.money -= 500;

const id = Date.now();

GameManager.comprarParcela(id);

GameManager.guardar();

/* ir a finca */
switchTab("abrirFinca");

}



window.mostrarMapa = function(){

console.log("Mapa activado");

/* abrir pestaña correctamente */
switchTab("abrirMapa");

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

document.querySelector(".finca-detail").innerHTML = html;

}


