// Product data array
const products = [
  {
    id: "fc-1888",
    name: "flux capacitor",
    averagerating: 4.5
  },
  {
    id: "fc-2050",
    name: "power laces",
    averagerating: 4.7
  },
  {
    id: "fs-1987",
    name: "time circuits",
    averagerating: 3.5
  },
  {
    id: "ac-2000",
    name: "low voltage reactor",
    averagerating: 3.9
  },
  {
    id: "jj-1969",
    name: "warp equalizer",
    averagerating: 5.0
  }
];

// Populate the product select dropdown dynamically
const selectEl = document.getElementById("product-name");

if (selectEl) {
  products.forEach(function(product) {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    selectEl.appendChild(option);
  });
}

// Review counter using localStorage
const countDisplay = document.getElementById("review-count");

if (countDisplay) {
  // We are on review.html — increment and display the count
  let count = Number(localStorage.getItem("reviewCount")) || 0;
  count += 1;
  localStorage.setItem("reviewCount", count);
  countDisplay.textContent = count;
}