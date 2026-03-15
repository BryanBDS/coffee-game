import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

window.iniciarFinca3D = function(){

const container = document.getElementById("finca3d");

if(!container){
console.log("No existe el contenedor finca3d");
return;
}

container.innerHTML = "";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
container.clientWidth / container.clientHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({antialias:true});

renderer.setSize(container.clientWidth, 400);

container.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({color:0x00ff00});

const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 3;

function animate(){

requestAnimationFrame(animate);

cube.rotation.x += 0.01;
cube.rotation.y += 0.01;

renderer.render(scene, camera);

}

animate();

};