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

comprarParcela3D();

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


