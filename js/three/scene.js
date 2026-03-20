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
scene.background = new THREE.Color(0xbfd1e5);

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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.appendChild(renderer.domElement);

/* LUZ */

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,20,10);

light.castShadow = true;

light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;

scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff,0.4);
scene.add(ambient);

/* TERRENO */

const textureLoader = new THREE.TextureLoader();

const groundTexture = textureLoader.load("https://threejs.org/examples/textures/terrain/grasslight-big.jpg");

groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10,10);

const groundGeo = new THREE.PlaneGeometry(100,100,64,64);

/* =========================
CREAR MONTAÑAS (ALTURA)
========================= */

const vertices = groundGeo.attributes.position;

for(let i=0; i<vertices.count; i++){

const x = vertices.getX(i);
const y = vertices.getY(i);

/* ruido simple tipo montaña */
const altura = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 2;

vertices.setZ(i, altura);

}

groundGeo.computeVertexNormals();

const groundMat = new THREE.MeshStandardMaterial({
map: groundTexture
});

const ground = new THREE.Mesh(groundGeo,groundMat);
ground.rotation.x = -Math.PI/2;

scene.add(ground);
ground.receiveShadow = true;

/* =========================
ÁRBOLES NATURALES
========================= */

function crearArbol(x,z){

/* altura base del terreno */
let y = 0;

/* TRONCO */
const troncoGeo = new THREE.CylinderGeometry(0.15,0.25,2,6);
const troncoMat = new THREE.MeshStandardMaterial({color:0x5d4037});
const tronco = new THREE.Mesh(troncoGeo, troncoMat);

/* COPA MÁS NATURAL */
const copaGeo = new THREE.ConeGeometry(1.2,3,8);
const copaMat = new THREE.MeshStandardMaterial({color:0x1b5e20});
const copa = new THREE.Mesh(copaGeo, copaMat);

/* posición */
tronco.position.set(x, y + 1, z);
copa.position.set(x, y + 3, z);

/* pequeña variación */
copa.scale.y = 1 + Math.random()*0.5;

scene.add(tronco);
scene.add(copa);

}

/* =========================
GENERAR ÁRBOLES
========================= */

for(let i=0;i<50;i++){

let x = (Math.random()*80)-40;
let z = (Math.random()*80)-40;

crearArbol(x,z);

}



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

const mat = new THREE.MeshStandardMaterial({
color: color,
roughness: 1,
metalness: 0
});

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

camera.position.set(15,10,15);
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