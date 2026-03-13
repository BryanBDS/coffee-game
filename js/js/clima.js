async function obtenerClima(lat,lng){

const apiKey = "TU_API_KEY";

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

try{

const res = await fetch(url);
const data = await res.json();

const clima = data.weather[0].main;
const temp = data.main.temp;

mostrarClima(clima,temp);

}catch(error){

console.log("Error clima",error);

}

}

function mostrarClima(clima,temp){

const panel = document.getElementById("climaInfo");

if(!panel) return;

panel.innerHTML = `
🌦 Clima actual: ${clima}<br>
🌡 Temperatura: ${temp}°C
`;

}