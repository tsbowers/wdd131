// ── QUICK FACTS ──────────────────────────────────────────
const facts = [
  { number: "5", label: "National Parks" },
  { number: "43", label: "State Parks" },
  { number: "28", label: "LDS Temples in Utah" },
  { number: "84,899", label: "Square Miles" },
];

function renderFacts() {
  const grid = document.getElementById("facts-grid");
  if (!grid) return;

  const html = facts.map(fact => `
    <div class="fact-box">
      <span class="fact-number">${fact.number}</span>
      <span class="fact-label">${fact.label}</span>
    </div>
  `).join("");

  grid.innerHTML = html;
}

renderFacts();
