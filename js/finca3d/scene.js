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

/* TERRENO VERDE */

const groundGeo = new THREE.PlaneGeometry(20,20);
const groundMat = new THREE.MeshStandardMaterial({color:0x2e7d32});

const ground = new THREE.Mesh(groundGeo,groundMat);

ground.rotation.x = -Math.PI/2;

scene.add(ground);

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