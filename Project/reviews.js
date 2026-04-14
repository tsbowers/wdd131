// reviews.js — Reviews page JavaScript

const REVIEWS_KEY = "utah_reviews";

// ── LOAD / SAVE ───────────────────────────────────────────
function loadReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveReviews(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// ── RENDER STARS ──────────────────────────────────────────
function renderStars(count) {
  const n = parseInt(count, 10);
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < n ? "var(--secondary)" : "var(--border)"};">&#9733;</span>`
  ).join("");
}

// ── FORMAT DATE ───────────────────────────────────────────
function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// ── RENDER REVIEWS LIST ───────────────────────────────────
function renderReviews() {
  const container = document.getElementById("reviews-list");
  const noMsg = document.getElementById("no-reviews-msg");
  if (!container) return;

  const reviews = loadReviews();

  if (reviews.length === 0) {
    container.innerHTML = "";
    noMsg.style.display = "block";
    return;
  }

  noMsg.style.display = "none";

  // newest first
  const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = sorted.map(r => `
    <article class="review-card">
      <div class="reviewer-name">${r.name}</div>
      <div class="stars">${renderStars(r.rating)}</div>
      ${r.location ? `<div style="font-size:0.83rem; color:var(--secondary); margin-top:0.2rem;">&#128205; ${r.location}</div>` : ""}
      <div class="review-text">${r.text}</div>
      <div class="review-date">${formatDate(r.date)}</div>
    </article>
  `).join("");
}

// ── VALIDATE EMAIL ────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── FORM SUBMISSION ───────────────────────────────────────
function initForm() {
  const form = document.getElementById("review-form");
  const msgEl = document.getElementById("form-message");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name   = form["reviewer-name"].value.trim();
    const email  = form["reviewer-email"].value.trim();
    const text   = form["review-text"].value.trim();
    const location = form["visit-location"].value.trim();
    const ratingInput = form.querySelector('input[name="rating"]:checked');
    const rating = ratingInput ? ratingInput.value : "0";

    // validation
    if (!name) {
      alert("Please enter your name.");
      form["reviewer-name"].focus();
      return;
    }
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      form["reviewer-email"].focus();
      return;
    }
    if (!text) {
      alert("Please write a review before submitting.");
      form["review-text"].focus();
      return;
    }

    // build review object
    const review = {
      id: `rev_${Date.now()}`,
      name,
      email,
      location,
      rating,
      text,
      date: new Date().toISOString(),
    };

    // save to localStorage
    const reviews = loadReviews();
    reviews.push(review);
    saveReviews(reviews);

    // show confirmation
    msgEl.style.display = "block";
    form.reset();

    // re-render list
    renderReviews();

    // scroll to message
    msgEl.scrollIntoView({ behavior: "smooth", block: "center" });

    // hide message after 5 seconds
    setTimeout(() => {
      msgEl.style.display = "none";
    }, 5000);
  });
}

// ── INIT ──────────────────────────────────────────────────
renderReviews();
initForm();
