import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

/* VARIABLES GLOBALES */
let scene, camera, renderer;
let animationId = null;

function iniciarFinca3D(){

const container = document.getElementById("finca3d");

if(!container){
console.log("No existe finca3d");
return;
}

/* 🔥 DETENER ANIMACIÓN */
if(animationId){
cancelAnimationFrame(animationId);
animationId = null;
}

/* 🔥 DESTRUIR RENDERER ANTERIOR */
if(renderer){
renderer.dispose();
renderer.forceContextLoss();
renderer.domElement = null;
renderer = null;
}

/* 🔥 LIMPIAR HTML COMPLETAMENTE */
container.innerHTML = "";


/* ESCENA */

scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

/* CAMARA */

camera = new THREE.PerspectiveCamera(
75,
container.clientWidth / container.clientHeight,
0.1,
1000
);

/* RENDER */

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(container.clientWidth, container.clientHeight);

container.appendChild(renderer.domElement);

/* LUZ */

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,10,5);
scene.add(light);

/* TERRENO */

const groundGeo = new THREE.PlaneGeometry(40,40);
const groundMat = new THREE.MeshStandardMaterial({color:0x4caf50});

const ground = new THREE.Mesh(groundGeo,groundMat);
ground.rotation.x = -Math.PI/2;

scene.add(ground);

/* =========================
PARCELAS REALES DEL JUGADOR
========================= */

if(window.GameManager){

console.log("Parcelas del jugador:", GameManager.parcelas);

GameManager.parcelas.forEach((p, index)=>{

/* tamaño según hectáreas */
let size = 3;

if(p.hectareas === 2) size = 5;
if(p.hectareas === 5) size = 8;

/* geometría */
const geo = new THREE.PlaneGeometry(size, size);

/* color según estado */
let color = 0x6d4c41; // café

if(p.estado === "sembrado") color = 0x2e7d32;
if(p.estado === "listo") color = 0xffeb3b;

const mat = new THREE.MeshStandardMaterial({color: color});

const parcela = new THREE.Mesh(geo, mat);

parcela.rotation.x = -Math.PI/2;

/* posición separada */
parcela.position.set(index * (size + 1), 0.02, 0);

scene.add(parcela);

});

}



/* CUBO */

const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshStandardMaterial({color:0xff0000});

const cube = new THREE.Mesh(cubeGeo,cubeMat);
cube.position.y = 1;

scene.add(cube);

/* CAMARA */

camera.position.set(6,6,6);
camera.lookAt(0,0,0);

/* LOOP */

function animate(){
animationId = requestAnimationFrame(animate);
cube.rotation.y += 0.01;
renderer.render(scene,camera);
}

animate();

}

window.iniciarFinca3D = iniciarFinca3D;