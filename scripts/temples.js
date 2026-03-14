const menuButton = document.querySelector("#menu");
const navList = document.querySelector("#navlist");

menuButton.addEventListener("click", function () {

if (navList.style.display === "flex") {
navList.style.display = "none";
menuButton.textContent = "☰";
}
else {
navList.style.display = "flex";
menuButton.textContent = "X";
}

});

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#lastModified").textContent =
"Last Modified: " + document.lastModified;
