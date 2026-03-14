const menuButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

menuButton.addEventListener("click", function(){

navigation.classList.toggle("open");

if(menuButton.textContent === "☰"){
menuButton.textContent = "X";
}
else{
menuButton.textContent = "☰";
}

});

document.querySelector("#year").textContent =
new Date().getFullYear();

document.querySelector("#lastModified").textContent =
"Last Modified: " + document.lastModified;