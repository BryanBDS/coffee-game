let plantas = 0;
let cafeListo = false;

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

setTimeout(()=>{
if(window.iniciarFinca3D){
window.iniciarFinca3D();
}
},300);

}