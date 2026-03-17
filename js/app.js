/* =========================
COFFEE EMPIRE - APP PRINCIPAL
========================= */

document.addEventListener("DOMContentLoaded", function(){

console.log("☕ Coffee Empire iniciado correctamente");

/* iniciar sistema principal */

if(window.GameManager){
GameManager.init();
}

/* inicializar componentes si existen */

if(typeof iniciarMapa === "function"){
console.log("Mapa listo");
}

if(typeof mostrarMiFinca === "function"){
console.log("Sistema de finca listo");
}

});