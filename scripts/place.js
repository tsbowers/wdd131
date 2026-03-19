const temperature = 8; 
const windSpeed = 15; 

function calculateWindChill(temp, speed) {
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16);
}

const windChillElement = document.getElementById("windChill");
if (temperature <= 10 && windSpeed > 4.8) {
    windChillElement.textContent = `${Math.round(calculateWindChill(temperature, windSpeed))}°C`;
} else {
    windChillElement.textContent = "N/A";
}

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;