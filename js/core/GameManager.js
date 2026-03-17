const GameManager = {

money: 1000,
parcelas: [],
cafe: 0,

/* =========================
INICIAR JUEGO
========================= */

init(){

console.log("GameManager iniciado");

this.cargar();

this.actualizarUI();

},

/* =========================
COMPRAR PARCELA
========================= */

comprarParcela(id){

console.log("Comprando parcela:", id);

this.parcelas.push({
id: id,
cultivo: "vacio",
nivel: 1
});

this.guardar();
this.actualizarUI();

},

/* =========================
ACTUALIZAR UI
========================= */

actualizarUI(){

const moneyTop = document.getElementById("playerMoney");
const moneySide = document.getElementById("playerMoneySide");

if(moneyTop){
moneyTop.textContent = "💰 " + this.money + " CoffeeCoins";
}

if(moneySide){
moneySide.textContent = this.money + " CoffeeCoins";
}

},

/* =========================
GUARDAR
========================= */

guardar(){

localStorage.setItem("coffeeEmpire", JSON.stringify({
money: this.money,
parcelas: this.parcelas,
cafe: this.cafe
}));

console.log("Juego guardado");

},

/* =========================
CARGAR
========================= */

cargar(){

const data = localStorage.getItem("coffeeEmpire");

if(data){

const parsed = JSON.parse(data);

this.money = parsed.money || 1000;
this.parcelas = parsed.parcelas || [];
this.cafe = parsed.cafe || 0;

console.log("Juego cargado");

}

}

};

window.GameManager = GameManager;