
let plantas = 0
let cafeListo = false


window.mostrarMapa = function(){

console.log("Mapa activado");

/* SOLO cambiar de pestaña */
switchTab("abrirMapa");

}





window.comprarTerreno = function(){

console.log("CLICK comprarTerreno");

/* validar GameManager */

if(!window.GameManager){
console.log("GameManager NO existe");
return;
}

/* validar dinero */

if(GameManager.money < 500){
alert("No tienes dinero suficiente");
return;
}

/* descontar dinero */

GameManager.money -= 500;

/* crear parcela */

const id = Date.now();

console.log("Creando parcela con ID:", id);


console.log("ANTES DE COMPRAR:", GameManager.parcelas);

GameManager.comprarParcela(id);

console.log("DESPUÉS DE COMPRAR:", GameManager.parcelas);

/* guardar */

GameManager.guardar();

/* DEBUG */

console.log("Parcelas después de comprar:", GameManager.parcelas);

/* ir a finca */

switchTab("abrirFinca");

setTimeout(()=>{
if(window.iniciarFinca3D){
iniciarFinca3D();
}
},300);

}


function mostrarFinca(){

/* validar si tiene parcelas reales */

if(!GameManager.parcelas.length){

document.getElementById("pantalla").innerHTML = `
<h2>No tienes terreno</h2>
`;

return;
}

/* mostrar UI */

document.getElementById("pantalla").innerHTML = `

<h2>🌱 Mi finca</h2>

<p>Parcelas: ${GameManager.parcelas.length}</p>

<button onclick="sembrar()">Sembrar café</button>

<button onclick="crecer()">Avanzar crecimiento</button>

<button onclick="switchTab('abrirFinca')">Ver en 3D</button>

`;

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


