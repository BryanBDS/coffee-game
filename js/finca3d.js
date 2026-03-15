let scene, camera, renderer;
let player;

function entrarFinca3D(){

const container = document.getElementById("finca3D");

container.innerHTML = "";

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
75,
container.clientWidth / 400,
0.1,
1000
);

renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth,400);

container.appendChild(renderer.domElement);

/* LUZ */

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,10,10);
scene.add(light);

/* SUELO */

const sueloGeo = new THREE.PlaneGeometry(50,50);
const sueloMat = new THREE.MeshStandardMaterial({color:0x3e8e41});

const suelo = new THREE.Mesh(sueloGeo,sueloMat);

suelo.rotation.x = -Math.PI/2;

scene.add(suelo);

/* JUGADOR */

const playerGeo = new THREE.BoxGeometry(1,2,1);
const playerMat = new THREE.MeshStandardMaterial({color:0x8B4513});

player = new THREE.Mesh(playerGeo,playerMat);

player.position.y = 1;

scene.add(player);

camera.position.set(0,3,5);

animate();

}

function animate(){

requestAnimationFrame(animate);

renderer.render(scene,camera);

}