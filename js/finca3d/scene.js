import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

let scene, camera, renderer;

function crearEscena(container){

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

/* CUBO PRUEBA */

const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshStandardMaterial({color:0xff0000});

const cube = new THREE.Mesh(cubeGeo,cubeMat);

cube.position.y = 1;

scene.add(cube);

camera.position.set(5,5,5);
camera.lookAt(0,0,0);

function animate(){

requestAnimationFrame(animate);

cube.rotation.y += 0.01;

renderer.render(scene,camera);

}

animate();

}

/* =========================
OBSERVADOR DEL DOM
========================= */

function esperarFinca(){

const container = document.getElementById("finca3d");

if(container){

console.log("Finca detectada, iniciando 3D");

crearEscena(container);

return;

}

/* observar cambios en el DOM */

const observer = new MutationObserver(() => {

const container = document.getElementById("finca3d");

if(container){

console.log("Finca detectada por observer");

crearEscena(container);

observer.disconnect();

}

});

observer.observe(document.body,{
childList:true,
subtree:true
});

}

/* HACER GLOBAL */

window.iniciarFinca3D = esperarFinca;