import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

let scene, camera, renderer;

function iniciarFinca3D(){

const container = document.getElementById("finca3d");

if(!container){
console.log("No existe finca3d");
return;
}

/* limpiar */

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

/* PARCELA BASE */

const parcelaGeo = new THREE.PlaneGeometry(3,3);
const parcelaMat = new THREE.MeshStandardMaterial({color:0x6d4c41});

const parcela = new THREE.Mesh(parcelaGeo, parcelaMat);
parcela.rotation.x = -Math.PI/2;
parcela.position.set(0,0.02,0);

scene.add(parcela);

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
requestAnimationFrame(animate);
cube.rotation.y += 0.01;
renderer.render(scene,camera);
}

animate();

}

window.iniciarFinca3D = iniciarFinca3D;