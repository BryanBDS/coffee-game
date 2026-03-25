import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";



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
let sonidoTrueno = new Audio("audio/trueno.mp3");
let sonidoLluvia = new Audio("audio/lluvia.mp3");
let sonidoViento = new Audio("audio/viento.mp3");

let audioActivado = false;


// configuración

sonidoLluvia.loop = true;
sonidoViento.loop = true;

sonidoLluvia.volume = 0.5;
sonidoViento.volume = 0.4;
sonidoTrueno.volume = 1;


async function obtenerClimaReal(){

    try{

        const apiKey = "c8f6f70942774338a9e14343262403";
        const ciudad = "Pasto";

        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${ciudad}&lang=es`;

        const res = await fetch(url);
        const data = await res.json();

        console.log("🌦️ Clima real:", data);

 const condicion = data.current.condition.text.toLowerCase();
const codigo = data.current.condition.code;

// 🔥 PRIMERO definir tipo de lluvia SOLO con código
if(codigo >= 200 && codigo < 300){
    tipoLluvia = "tormenta";
}
else if(codigo >= 300 && codigo < 700){
    tipoLluvia = "lluvia";
}
else{
    tipoLluvia = "ninguna";
}

// 🔥 AHORA definir clima GENERAL (sin romper tipoLluvia)
if(tipoLluvia === "tormenta"){
    clima = "lluvia";
    lluviaVelocidad = 1.2;
    intensidadLluviaMax = 1.2;
}
else if(tipoLluvia === "lluvia"){
    clima = "lluvia";
    lluviaVelocidad = 0.6;
    intensidadLluviaMax = 0.8;
}
else if(condicion.includes("nublado")){
    clima = "post-lluvia";
}
else{
    clima = "soleado";
}

        console.log("🌦️ Aplicado:", clima, tipoLluvia);

    }catch(e){
        console.log("❌ Error clima:", e);
    }

}



/* =========================
INICIAR ESCENA
========================= */
function iniciarFinca3D(){

// 🌦️ cargar clima real
obtenerClimaReal();

// actualizar cada 10 minutos
setInterval(()=>{
    obtenerClimaReal();
}, 600000);

const container = document.getElementById("finca3d");


function activarAudio(){

    if(audioActivado) return;
    audioActivado = true;

    console.log("🔊 Audio desbloqueado PRO");

    // lluvia
    sonidoLluvia.muted = true;
    sonidoLluvia.play().then(()=>{
        sonidoLluvia.pause();
        sonidoLluvia.currentTime = 0;
        sonidoLluvia.muted = false;
    });

    // viento
    sonidoViento.muted = true;
    sonidoViento.play().then(()=>{
        sonidoViento.pause();
        sonidoViento.currentTime = 0;
        sonidoViento.muted = false;
    });

    // 🔥 TRUENO (CLAVE)
    sonidoTrueno.muted = true;
    sonidoTrueno.play().then(()=>{
        sonidoTrueno.pause();
        sonidoTrueno.currentTime = 0;
        sonidoTrueno.muted = false;
    });

}


// múltiples eventos (por seguridad en Android)
if(container){
    container.addEventListener("click", activarAudio);
    container.addEventListener("touchstart", activarAudio);
}


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

/* =========================
CIELO REALISTA (SKYBOX)
========================= */
const loader = new THREE.CubeTextureLoader();

const skybox = loader.load([
    "https://threejs.org/examples/textures/cube/skybox/px.jpg",
    "https://threejs.org/examples/textures/cube/skybox/nx.jpg",
    "https://threejs.org/examples/textures/cube/skybox/py.jpg",
    "https://threejs.org/examples/textures/cube/skybox/ny.jpg",
    "https://threejs.org/examples/textures/cube/skybox/pz.jpg",
    "https://threejs.org/examples/textures/cube/skybox/nz.jpg"
]);

scene.background = skybox;

let tipoRegion = "montaña";

if(window.GameManager && GameManager.parcelas.length > 0){
tipoRegion = GameManager.parcelas[0].tipoRegion || "montaña";
}

console.log("Tipo de región:", tipoRegion);
 

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


const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.5, // intensidad
    0.4,
    0.85
);

composer.addPass(bloomPass);


renderer.physicallyCorrectLights = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.appendChild(renderer.domElement);


/* =========================
LUCES
========================= */
sol = new THREE.DirectionalLight(0xffffff, 5);
sol.castShadow = true;

// sombras suaves PRO
sol.shadow.mapSize.width = 4096;
sol.shadow.mapSize.height = 4096;

sol.shadow.camera.near = 0.5;
sol.shadow.camera.far = 100;
sol.shadow.camera.left = -50;
sol.shadow.camera.right = 50;
sol.shadow.camera.top = 50;
sol.shadow.camera.bottom = -50;

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
APLICAR CLIMA VISUAL
========================= */
function aplicarClimaVisual(dia){

    // NO tocar scene.background (dejamos el skybox)

    // ☀️ SOLEADO
    if(clima === "soleado"){
        sol.intensity = 1.5 + dia;
        renderer.toneMappingExposure = 0.9;
    }

    // ☁️ NUBLADO
    else if(clima === "post-lluvia"){
        sol.intensity = 0.8 + dia;
        renderer.toneMappingExposure = 0.7;
    }

    // 🌧️ LLUVIA
    else if(clima === "lluvia" && tipoLluvia !== "tormenta"){
        sol.intensity = 0.5 + dia;
        renderer.toneMappingExposure = 0.6;
    }

    // ⛈️ TORMENTA
    else if(tipoLluvia === "tormenta"){
        sol.intensity = 0.3 + dia;
        renderer.toneMappingExposure = 0.5;
    }

}




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





/* viento hojas */
hojasAnimadas.forEach(mat=>{
mat.uniforms.uTime.value = time;
});

/* día/noche */
const dia = Math.sin(time * 0.05);

aplicarClimaVisual(dia);


/* =========================
ATMÓSFERA HÚMEDA (REALISMO)
========================= */


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

if(clima === "lluvia" && audioActivado){
    if(sonidoLluvia.paused){
        sonidoLluvia.play().catch(()=>{});
    }
}else{
    sonidoLluvia.pause();
}



/* =========================
SONIDO DE VIENTO
========================= */

if(tipoLluvia === "tormenta" && audioActivado){
    if(sonidoViento.paused){
        sonidoViento.play().catch(()=>{});
    }
}else{
    sonidoViento.pause();
}



/* =========================
EFECTO LLUVIA EN LUZ
========================= */


/* =========================
RAYOS (TORMENTA)
========================= */

if(tipoLluvia === "tormenta"){

    if(Math.random() < 0.005){

        // ⚡ FLASH VISUAL
        scene.background = new THREE.Color(0xffffff);
        sol.intensity = 4;

        if(!relampago){
            relampago = new THREE.PointLight(0xffffff, 20, 200);
            scene.add(relampago);
        }

        relampago.position.set(
            (Math.random()*50)-25,
            30,
            (Math.random()*50)-25
        );

        // ⚡ SONIDO DE TRUENO (FIJO)
        setTimeout(()=>{

            try{
                sonidoTrueno.pause();
                sonidoTrueno.currentTime = 0;

                // 🔒 asegurar volumen válido
                sonidoTrueno.volume = Math.max(0, Math.min(1, 1));

                sonidoTrueno.play().catch(e=>{
                    console.log("⚠️ Trueno bloqueado:", e);
                });

            }catch(e){
                console.log("ERROR TRUENO:", e);
            }

        }, 300 + Math.random()*700);

        // volver a normal
        setTimeout(()=>{
    aplicarClimaVisual(dia);
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



composer.render();
}

animate(0);

}



function detenerFinca3D(){

    console.log("🛑 Saliendo de finca...");

    // detener animación
    if(animationId){
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // apagar sonidos
    sonidoLluvia.pause();
    sonidoLluvia.currentTime = 0;

    sonidoViento.pause();
    sonidoViento.currentTime = 0;

    sonidoTrueno.pause();
    sonidoTrueno.currentTime = 0;

}


window.detenerFinca3D = detenerFinca3D;


window.iniciarFinca3D = iniciarFinca3D;