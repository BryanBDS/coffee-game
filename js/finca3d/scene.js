let scene, camera, renderer;

let parcelasCompradas = 0;
const parcelas = [];

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

window.iniciarFinca3D = function(){

const container = document.getElementById("finca3d");

if(!container){
console.log("No existe el contenedor finca3d");
return;
}

container.innerHTML = "";

/* ESCENA */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

/* CAMARA */

const camera = new THREE.PerspectiveCamera(
75,
container.clientWidth / container.clientHeight,
0.1,
1000
);

/* RENDER */

const renderer = new THREE.WebGLRenderer({
antialias:false,
powerPreference:"high-performance"
});
renderer.setSize(container.clientWidth, container.clientHeight);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

container.appendChild(renderer.domElement);


/* LUZ */

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,10,5);
scene.add(light);

/* TERRENO BASE */

const groundGeo = new THREE.PlaneGeometry(40,40);
const groundMat = new THREE.MeshStandardMaterial({color:0x4caf50});

const ground = new THREE.Mesh(groundGeo,groundMat);
ground.rotation.x = -Math.PI/2;

scene.add(ground);


/* CREAR PARCELAS DE CULTIVO */

const parcelas = [];

const parcelaGeo = new THREE.PlaneGeometry(3,3);
const parcelaMat = new THREE.MeshStandardMaterial({color:0x6d4c41});

for(let x=-12; x<=12; x+=4){

for(let z=-12; z<=12; z+=4){

const parcela = new THREE.Mesh(parcelaGeo, parcelaMat);

parcela.rotation.x = -Math.PI/2;

parcela.position.set(x,0.01,z);

scene.add(parcela);

parcelas.push(parcela);

}

}


function crearParcela(){

const parcelaGeo = new THREE.PlaneGeometry(3,3);
const parcelaMat = new THREE.MeshStandardMaterial({color:0x6d4c41});

const parcela = new THREE.Mesh(parcelaGeo, parcelaMat);

parcela.rotation.x = -Math.PI/2;

/* posición automática */

const posicionX = parcelasCompradas * 4;

parcela.position.set(posicionX,0.01,0);

scene.add(parcela);

parcelas.push(parcela);

parcelasCompradas++;

}


function comprarParcela3D(){

crearParcela();

}



/* CUBO ROJO */

const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshStandardMaterial({color:0xff0000});

const cube = new THREE.Mesh(cubeGeo,cubeMat);

cube.position.y = 1;

scene.add(cube);

/* POSICIÓN CAMARA */

camera.position.set(5,5,5);
camera.lookAt(0,0,0);

/* ANIMACIÓN */

function animate(){

requestAnimationFrame(animate);

/* si la pestaña no está visible no renderizar */

if(document.hidden) return;

cube.rotation.y += 0.01;

renderer.render(scene,camera);

}

animate();

};
