import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const leafVertexShader = `
varying vec3 vNormal;
uniform float uTime;
void main() {
vNormal = normalize(normalMatrix * normal);
float instanceId = float(gl_InstanceID);
float wind = sin(uTime * 1.5 + instanceId) * 0.1;
vec3 newPos = position;
newPos.x += wind * (position.y + 0.5); 
vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(newPos, 1.0);
gl_Position = projectionMatrix * mvPosition;
}
`;

const leafFragmentShader = `
varying vec3 vNormal;
uniform vec3 uColor;
void main() {
float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;
gl_FragColor = vec4(uColor * light, 1.0);
}
`;

/* VARIABLES GLOBALES */
let scene, camera, renderer;
let animationId = null;
let arbolesShader = [];
let sol;

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

scene.fog = new THREE.FogExp2(0xbfd1e5, 0.01);

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

sol = new THREE.DirectionalLight(0xffffff,1);
sol.position.set(10,20,10);
sol.castShadow = true;

scene.add(sol);
window.sol = sol;


let tiempoDia = 0;

THREE.AmbientLight(0xffffff,0.6);
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
const altura =
Math.sin(x * 0.15) * Math.cos(y * 0.15) * 3 +
Math.sin(x * 0.05) * 2;

vertices.setZ(i, altura);

}

groundGeo.computeVertexNormals();

const groundMat = new THREE.MeshStandardMaterial({
map: groundTexture,
roughness: 1,
metalness: 0
});

const ground = new THREE.Mesh(groundGeo,groundMat);
ground.rotation.x = -Math.PI/2;

scene.add(ground);
ground.receiveShadow = true;


let nubes = [];

function crearNube(){

const geo = new THREE.SphereGeometry(2,6,6);
const mat = new THREE.MeshStandardMaterial({
color: 0xffffff,
transparent: true,
opacity: 0.8
});

const nube = new THREE.Mesh(geo, mat);

nube.position.set(
(Math.random()*80)-40,
10 + Math.random()*10,
(Math.random()*80)-40
);

scene.add(nube);
nubes.push(nube);

}

/* generar varias */
for(let i=0;i<10;i++){
crearNube();
}


let aves = [];
window.aves = aves;
function crearAve(){

const geo = new THREE.ConeGeometry(0.2,0.5,4);
const mat = new THREE.MeshStandardMaterial({color:0x000000});

const ave = new THREE.Mesh(geo, mat);

ave.position.set(
(Math.random()*40)-20,
8 + Math.random()*5,
(Math.random()*40)-20
);

scene.add(ave);
aves.push(ave);

}

for(let i=0;i<5;i++){
crearAve();
}



function crearArbolPro(x,z){

const group = new THREE.Group();

const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4b3621 });

const leafMat = new THREE.ShaderMaterial({
uniforms: { 
uTime: { value: 0 }, 
uColor: { value: new THREE.Color(0x2d5a27) } 
},
vertexShader: leafVertexShader,
fragmentShader: leafFragmentShader,
side: THREE.DoubleSide
});

const leafGeom = new THREE.SphereGeometry(0.2, 6, 6);
const leafMesh = new THREE.InstancedMesh(leafGeom, leafMat, 500);

let leafCount = 0;
const dummy = new THREE.Object3D();

const grow = (pos, dir, len, wid, depth) => {

if (depth <= 0) {

for (let i = 0; i < 4; i++) {

if (leafCount < 500) {

dummy.position.copy(pos).add(new THREE.Vector3(
Math.random()-0.5,
Math.random()-0.5,
Math.random()-0.5
));

dummy.scale.setScalar(Math.random() * 2 + 1);
dummy.updateMatrix();

leafMesh.setMatrixAt(leafCount++, dummy.matrix);

}

}

return;
}

const geom = new THREE.CylinderGeometry(wid * 0.7, wid, len, 6);
geom.translate(0, len / 2, 0);

const branch = new THREE.Mesh(geom, trunkMat);
branch.castShadow = true;

branch.position.copy(pos);
branch.quaternion.setFromUnitVectors(
new THREE.Vector3(0, 1, 0),
dir.clone().normalize()
);

group.add(branch);

const tip = pos.clone().add(dir.clone().setLength(len));

for (let i = 0; i < 2; i++) {

const newDir = dir.clone()
.applyAxisAngle(new THREE.Vector3(1,0,0), (Math.random()-0.5)*1.5)
.applyAxisAngle(new THREE.Vector3(0,0,1), (Math.random()-0.5)*1.5);

grow(tip, newDir, len * 0.7, wid * 0.7, depth - 1);

}

};

grow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 3, 0.3, 4);

group.add(leafMesh);

/* POSICIÓN EN EL TERRENO */
group.position.set(x, 0, z);

scene.add(group);

/* GUARDAMOS MATERIAL PARA ANIMAR */
return leafMat;

}

/* =========================
GENERAR ÁRBOLES
========================= */

let hojasAnimadas = [];
window.arbolesShader = hojasAnimadas;

for(let i=0;i<20;i++){

let x = (Math.random()*80)-40;
let z = (Math.random()*80)-40;

const hojas = crearArbolPro(x,z);

hojasAnimadas.push(hojas);

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

/* =========================
TIEMPO GLOBAL
========================= */

const time = t * 0.001;

/* =========================
MOVIMIENTO HOJAS (VIENTO)
========================= */

if(window.arbolesShader){
window.arbolesShader.forEach(mat=>{
mat.uniforms.uTime.value = time;
});
}

/* =========================
CICLO DÍA / NOCHE
========================= */

const dia = Math.sin(time * 0.05);

/* color del cielo */
scene.background = new THREE.Color().setHSL(0.6, 0.5, 0.6 + dia * 0.2);

/* intensidad de luz */
if(window.sol){
window.sol.intensity = 1 + dia;
window.sol.position.x = Math.sin(time * 0.1) * 20;
window.sol.position.y = 20 + Math.cos(time * 0.1) * 10;
}

/* =========================
ANIMACIÓN AVES
========================= */

if(window.aves){
window.aves.forEach(ave=>{
ave.position.x += 0.05;
if(ave.position.x > 50) ave.position.x = -50;
});
}

/* =========================
CUBO DEBUG (puedes quitar luego)
========================= */

cube.rotation.y += 0.01;

/* =========================
RENDER
========================= */

renderer.render(scene,camera);

}

animate();

}

window.iniciarFinca3D = iniciarFinca3D;