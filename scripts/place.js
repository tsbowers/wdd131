// Footer
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// Static values
const temp = 8; // Celsius
const windSpeed = 15; // km/h

// Wind Chill Function (metric)
function calculateWindChill(t, v) {
    return 13.12 + 0.6215 * t - 11.37 * Math.pow(v, 0.16) + 0.3965 * t * Math.pow(v, 0.16);
}

const windChillElement = document.getElementById("windChill");

// Conditions check
if (temp <= 10 && windSpeed > 4.8) {
    const chill = calculateWindChill(temp, windSpeed);
    windChillElement.textContent = `${Math.round(chill)}°C`;
} else {
    windChillElement.textContent = "N/A";
}