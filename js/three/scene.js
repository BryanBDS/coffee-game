import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

/* =========================
SHADERS HOJAS (VIENTO)
========================= */
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
let sol;
let aves = [];
let nubes = [];
let hojasAnimadas = [];

/* =========================
CLIMA DINÁMICO
========================= */
let clima = "soleado"; // soleado | lluvia | post-lluvia

/* =========================
TIPOS DE LLUVIA
========================= */
let tipoLluvia = "ninguna"; // llovizna | lluvia | tormenta
let lluviaParticulas;
let lluviaVelocidad = 0;
let relampago = null;
let rayosTiempo = 0;

let intensidadLluvia = 0;
let intensidadLluviaMax = 0;
let transicionNiebla = 0;


let splashes = [];
let sonidoTrueno = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-thunder-strike-1680.mp3");

let sonidoLluvia = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3");
let sonidoViento = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-strong-wind-1171.mp3");

// configuración
sonidoLluvia.loop = true;
sonidoViento.loop = true;

sonidoLluvia.volume = 0;
sonidoViento.volume = 0;


/* =========================
INICIAR ESCENA
========================= */
function iniciarFinca3D(){

const container = document.getElementById("finca3d");

// activar audio con interacción (necesario en móviles)
container.addEventListener("click", () => {
    sonidoLluvia.play().catch(()=>{});
    sonidoViento.play().catch(()=>{});
});

if(!container) return;

/* limpiar anterior */
if(animationId){
cancelAnimationFrame(animationId);
animationId = null;
}

if(renderer){
renderer.dispose();
renderer.forceContextLoss();
renderer = null;
}

container.innerHTML = "";

/* ESCENA */
scene = new THREE.Scene();

let tipoRegion = "montaña";

if(window.GameManager && GameManager.parcelas.length > 0){
tipoRegion = GameManager.parcelas[0].tipoRegion || "montaña";
}

console.log("Tipo de región:", tipoRegion);

const skyColor = new THREE.Color(0x87CEEB);
scene.background = skyColor;


if(tipoRegion === "montaña"){
scene.fog = new THREE.Fog(0xcfd8dc, 20, 120);
}

if(tipoRegion === "valle"){
scene.fog = new THREE.Fog(0xcfd8dc, 20, 120);
}

if(tipoRegion === "bosque"){
scene.fog = new THREE.Fog(0xcfd8dc, 20, 120);
}

/* =========================
CAPA DE NIEBLA BAJA
========================= */

function crearNiebla(){

const geo = new THREE.PlaneGeometry(200,200);
const mat = new THREE.MeshStandardMaterial({
color: 0xffffff,
transparent: true,
opacity: 0.15,
depthWrite: false
});

const niebla = new THREE.Mesh(geo, mat);
niebla.rotation.x = -Math.PI/2;
niebla.position.y = 2; // altura baja

scene.add(niebla);

return niebla;
}

const niebla = crearNiebla();
niebla.material.opacity = 0; // empieza invisible

/* =========================
CREAR LLUVIA
========================= */
function crearLluvia(){

const cantidad = 3000;

const posiciones = new Float32Array(cantidad * 6); 
// cada gota = 2 puntos (línea)

for(let i=0; i<cantidad; i++){

let x = (Math.random()*100)-50;
let y = Math.random()*50;
let z = (Math.random()*100)-50;

let largo = Math.random() * 0.5 + 0.5;

// punto superior
posiciones[i*6] = x;
posiciones[i*6+1] = y;
posiciones[i*6+2] = z;

// punto inferior
posiciones[i*6+3] = x;
posiciones[i*6+4] = y - largo;
posiciones[i*6+5] = z;

}

const geo = new THREE.BufferGeometry();
geo.setAttribute("position", new THREE.BufferAttribute(posiciones,3));

const mat = new THREE.LineBasicMaterial({
color: 0xcccccc,
transparent: true,
opacity: 0.25, // más suave
depthWrite: false,
blending: THREE.AdditiveBlending // 🔥 EFECTO REALISTA
});

lluviaParticulas = new THREE.LineSegments(geo, mat);
scene.add(lluviaParticulas);

}

crearLluvia();


/* CAMARA */
camera = new THREE.PerspectiveCamera(
75,
container.clientWidth / container.clientHeight,
0.1,
1000
);

/* RENDER */
renderer = new THREE.WebGLRenderer({antialias:true});

renderer.physicallyCorrectLights = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;

container.appendChild(renderer.domElement);


/* =========================
LUCES
========================= */
sol = new THREE.DirectionalLight(0xfff3e0, 3);
sol.shadow.bias = -0.0005;
sol.position.set(10,20,10);
sol.castShadow = true;
sol.shadow.mapSize.width = 2048;
sol.shadow.mapSize.height = 2048;
scene.add(sol);

if(tipoRegion === "montaña"){
sol.intensity = 1.2;
}

if(tipoRegion === "valle"){
sol.intensity = 1.5;
}

if(tipoRegion === "bosque"){
sol.intensity = 0.9;
}

const ambient = new THREE.AmbientLight(0xffffff,0.6);
scene.add(ambient);

/* =========================
TERRENO MONTAÑOSO
========================= */
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load("https://threejs.org/examples/textures/terrain/grasslight-big.jpg");

groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10,10);

const groundGeo = new THREE.PlaneGeometry(100,100,64,64);
const vertices = groundGeo.attributes.position;

for(let i=0; i<vertices.count; i++){

const x = vertices.getX(i);
const y = vertices.getY(i);

let altura = 0;

/* =========================
TERRENO SEGÚN REGIÓN
========================= */

if(tipoRegion === "montaña"){

altura =
Math.sin(x * 0.1) * Math.cos(y * 0.1) * 6 +
Math.sin(x * 0.05) * 3 +
Math.sin(x * 0.02) * 8;

}

if(tipoRegion === "valle"){

altura =
Math.sin(x * 0.05) * 2 +
Math.sin(y * 0.05) * 2;

}

if(tipoRegion === "bosque"){

altura =
Math.sin(x * 0.08) * Math.cos(y * 0.08) * 4;

}

/* aplicar altura */
vertices.setZ(i, altura);

}

groundGeo.computeVertexNormals();

const groundMat = new THREE.MeshStandardMaterial({
map: groundTexture,
roughness: 0.9,
metalness: 0.1
});

const ground = new THREE.Mesh(groundGeo,groundMat);
ground.rotation.x = -Math.PI/2;
ground.receiveShadow = true;

scene.add(ground);

/* =========================
NUBES
========================= */
let nubes = [];

function crearNube(){

const group = new THREE.Group();

/* varias esferas para forma real */
for(let i=0;i<5;i++){

const geo = new THREE.SphereGeometry(
1.5 + Math.random(),
8,
8
);

const mat = new THREE.MeshStandardMaterial({
color: 0xffffff,
transparent: true,
opacity: 0.85
});

const parte = new THREE.Mesh(geo, mat);

parte.position.set(
(Math.random()-0.5)*3,
Math.random()*1,
(Math.random()-0.5)*3
);

group.add(parte);

}

/* 🔥 ALTURA ALTA (CLAVE) */
group.position.set(
(Math.random()*100)-50,
25 + Math.random()*10, // 🔥 MÁS ALTO
(Math.random()*100)-50
);

scene.add(group);
nubes.push(group);

}

/* =========================
AVES
========================= */
function crearAve(){

const group = new THREE.Group();

/* alas */
const alaGeo = new THREE.BoxGeometry(0.8,0.05,0.3);
const mat = new THREE.MeshStandardMaterial({color:0x222222});

const ala1 = new THREE.Mesh(alaGeo, mat);
const ala2 = new THREE.Mesh(alaGeo, mat);

ala1.position.x = -0.4;
ala2.position.x = 0.4;

group.add(ala1);
group.add(ala2);

/* cuerpo */
const cuerpoGeo = new THREE.SphereGeometry(0.2,6,6);
const cuerpo = new THREE.Mesh(cuerpoGeo, mat);

group.add(cuerpo);

/* 🔥 ALTURA CORRECTA */
group.position.set(
(Math.random()*80)-40,
15 + Math.random()*10, // 🔥 MÁS ALTO
(Math.random()*80)-40
);

scene.add(group);
aves.push(group);

}


/* =========================
GENERAR NUBES
========================= */

for(let i=0;i<8;i++){
crearNube();
}

/* =========================
GENERAR AVES
========================= */

for(let i=0;i<6;i++){
crearAve();
}


/* =========================
ÁRBOLES PRO
========================= */
function crearArbol(x,z){

const group = new THREE.Group();

const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4b3621 });

let colorHoja = 0x2d5a27;

if(tipoRegion === "valle") colorHoja = 0x4caf50;
if(tipoRegion === "bosque") colorHoja = 0x1b5e20;

const leafMat = new THREE.ShaderMaterial({
uniforms: { 
uTime: { value: 0 }, 
uColor: { value: new THREE.Color(colorHoja) } 
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
group.position.set(x, 0, z);

scene.add(group);
return leafMat;
}

/* generar árboles */
for(let i=0;i<20;i++){
let x = (Math.random()*80)-40;
let z = (Math.random()*80)-40;
hojasAnimadas.push(crearArbol(x,z));
}

/* =========================
PARCELAS
========================= */
if(window.GameManager){
GameManager.parcelas.forEach((p, index)=>{

let size = 3;
if(p.hectareas === 2) size = 5;
if(p.hectareas === 5) size = 8;

const geo = new THREE.PlaneGeometry(size, size, 10, 10);

/* deformar bordes */
const v = geo.attributes.position;

for(let i=0; i<v.count; i++){

let px = v.getX(i);
let py = v.getY(i);

let ruido = (Math.random() - 0.5) * 0.3;

v.setZ(i, ruido);

}

geo.computeVertexNormals();



let color = 0x6d4c41;
if(p.estado === "sembrado") color = 0x2e7d32;
if(p.estado === "listo") color = 0xffeb3b;

const mat = new THREE.MeshStandardMaterial({color});

const parcela = new THREE.Mesh(geo, mat);
parcela.rotation.x = -Math.PI/2;

let posX = index * (size + 1);
let posZ = 0;

/* 🔥 obtener altura real del terreno */
let alturaTerreno = 0;

const vertices = groundGeo.attributes.position;

let distanciaMin = Infinity;

for(let i=0; i<vertices.count; i++){

const vx = vertices.getX(i);
const vz = vertices.getY(i);

const dx = vx - posX;
const dz = vz - posZ;

const dist = dx*dx + dz*dz;

if(dist < distanciaMin){
distanciaMin = dist;
alturaTerreno = vertices.getZ(i);
}

}

/* 🔥 colocar parcela sobre terreno */
parcela.position.set(posX, alturaTerreno + 0.05, posZ);

scene.add(parcela);
});
}

/* CAMARA */
camera.position.set(10, 8, 10);
camera.lookAt(0,0,0);
console.log("Render OK");

/* =========================
ANIMACIÓN
========================= */
function animate(t){

animationId = requestAnimationFrame(animate);

const time = t * 0.001;



/* =========================
CAMBIO DE CLIMA AUTOMÁTICO
========================= */

// cambia clima cada cierto tiempo

if(Math.floor(time) % 30 === 0){

const rand = Math.random();

if(rand < 0.25){
clima = "soleado";
tipoLluvia = "ninguna";
}
else if(rand < 0.5){
clima = "lluvia";
tipoLluvia = "llovizna";
lluviaVelocidad = 0.2;
intensidadLluviaMax = 0.3;
}
else if(rand < 0.75){
clima = "lluvia";
tipoLluvia = "lluvia";
lluviaVelocidad = 0.5;
intensidadLluviaMax = 0.7;
}
else{
clima = "lluvia";
tipoLluvia = "tormenta";
lluviaVelocidad = 1.2;
intensidadLluviaMax = 1.2;
}

}



/* viento hojas */
hojasAnimadas.forEach(mat=>{
mat.uniforms.uTime.value = time;
});

/* día/noche */
const dia = Math.sin(time * 0.05);

/* =========================
ATMÓSFERA HÚMEDA (REALISMO)
========================= */
if(clima === "lluvia"){
    renderer.toneMappingExposure = 0.6;
}else{
    renderer.toneMappingExposure = 0.8;
}


// suelo mojado dinámico
if(clima === "lluvia"){
    ground.material.roughness -= 0.01;
    ground.material.metalness += 0.01;
}else{
    ground.material.roughness += 0.01;
    ground.material.metalness -= 0.01;
}

// límites
ground.material.roughness = Math.max(0.3, Math.min(1, ground.material.roughness));
ground.material.metalness = Math.max(0, Math.min(0.5, ground.material.metalness));


/* =========================
SONIDO DE LLUVIA
========================= */

if(clima === "lluvia"){
    sonidoLluvia.volume += 0.01;
}else{
    sonidoLluvia.volume -= 0.01;
}

// límites
sonidoLluvia.volume = Math.max(0, Math.min(0.5, sonidoLluvia.volume));

/* =========================
SONIDO DE VIENTO
========================= */

if(tipoLluvia === "tormenta"){
    sonidoViento.volume += 0.01;
}else{
    sonidoViento.volume -= 0.01;
}

// límites
sonidoViento.volume = Math.max(0, Math.min(0.6, sonidoViento.volume));



/* =========================
EFECTO LLUVIA EN LUZ
========================= */

if(clima === "lluvia"){
    sol.intensity = (1 + dia) * 0.5;
}else{
    sol.intensity = 1 + dia;
}


scene.background = new THREE.Color().setHSL(0.6, 0.5, 0.6 + dia * 0.2);

sol.intensity = 1 + dia;

/* =========================
RAYOS (TORMENTA)
========================= */

if(tipoLluvia === "tormenta"){

    if(Math.random() < 0.005){

        setTimeout(()=>{
            sonidoTrueno.currentTime = 0;
            sonidoTrueno.volume = 1;
            sonidoTrueno.play();
        }, 500 + Math.random()*1500);

        // flash fuerte
        scene.background = new THREE.Color(0xffffff);
        sol.intensity = 4;

        // crear relámpago
        if(!relampago){
            relampago = new THREE.PointLight(0xffffff, 80, 300);
            scene.add(relampago);
        }

        relampago.position.set(
            (Math.random()*50)-25,
            30,
            (Math.random()*50)-25
        );

relampago.intensity = 80;

        // apagar rápido (flash real)
        setTimeout(()=>{
            scene.background = new THREE.Color().setHSL(0.6, 0.5, 0.6 + dia * 0.2);
            sol.intensity = 1 + dia;
        }, 80);

    }

}



sol.position.x = Math.sin(time * 0.1) * 20;
sol.position.y = 20 + Math.cos(time * 0.1) * 10;

/* =========================
ANIMACIÓN AVES REAL
========================= */
aves.forEach(ave=>{
ave.position.x += 0.1;

/* movimiento tipo vuelo */
ave.position.y += Math.sin(Date.now()*0.002) * 0.01;

if(ave.position.x > 50){
ave.position.x = -50;
}
});



/* =========================
MOVER NUBES
========================= */
nubes.forEach(nube=>{
    nube.position.x += 0.01;

    if(nube.position.x > 60){
        nube.position.x = -60;
    }
});



/* =========================
NIEBLA DINÁMICA SEGÚN CLIMA
========================= */

// transición suave
if(clima === "lluvia"){
    transicionNiebla += 0.01;
}
else if(clima === "post-lluvia"){
    transicionNiebla += 0.005;
}
else{
    transicionNiebla -= 0.01;
}

// límites
transicionNiebla = Math.max(0, Math.min(1, transicionNiebla));

// aplicar opacidad
if(niebla){
    niebla.material.opacity = 0.15 * transicionNiebla;

    // movimiento suave
    niebla.position.x += 0.01;
}


/* =========================
ANIMAR LLUVIA
========================= */

if(lluviaParticulas){

const positions = lluviaParticulas.geometry.attributes.position;

for(let i=0; i<positions.count; i++){

let y = positions.getY(i);

y -= lluviaVelocidad * (0.5 + intensidadLluviaMax);

// viento lateral
let x = positions.getX(i);
x += (0.01 + Math.sin(time * 2 + i) * 0.02) * intensidadLluviaMax;

positions.setX(i, x);

if(y < 0){

// crear splash
const geoSplash = new THREE.CircleGeometry(0.2, 6);
const matSplash = new THREE.MeshBasicMaterial({
color: 0xaaaaaa,
transparent: true,
opacity: 0.5
});

const splash = new THREE.Mesh(geoSplash, matSplash);
splash.rotation.x = -Math.PI/2;

splash.position.set(
positions.getX(i),
0.05,
positions.getZ(i)
);

scene.add(splash);
splashes.push(splash);

// reset gota
y = 50;

y = 50;
}

positions.setY(i, y);

}

positions.needsUpdate = true;

/* visibilidad */
lluviaParticulas.visible = tipoLluvia !== "ninguna";

}


splashes.forEach((s, index)=>{
s.scale.x += 0.05;
s.scale.y += 0.05;
s.material.opacity -= 0.02;

if(s.material.opacity <= 0){
scene.remove(s);
splashes.splice(index,1);
}
});



renderer.render(scene,camera);
}

animate(0);

}

window.iniciarFinca3D = iniciarFinca3D;