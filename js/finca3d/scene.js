import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";

let scene, camera, renderer;

function iniciarFinca3D(){

scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const luz = new THREE.DirectionalLight(0xffffff,1);
luz.position.set(5,10,5);
scene.add(luz);

const terrenoGeo = new THREE.PlaneGeometry(50,50);
const terrenoMat = new THREE.MeshStandardMaterial({color:0x3e8e41});
const terreno = new THREE.Mesh(terrenoGeo, terrenoMat);

terreno.rotation.x = -Math.PI/2;

scene.add(terreno);

camera.position.set(0,10,20);

animate();

}

function animate(){

requestAnimationFrame(animate);

renderer.render(scene,camera);

}

window.iniciarFinca3D = iniciarFinca3D;