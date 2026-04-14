// bucketlist.js — Bucket List page JavaScript

// ── DESTINATION DATA ──────────────────────────────────────
const destinations = [
  // ─ NORTHERN UTAH ─
  { id: "ni_1",  name: "Antelope Island State Park",   region: "northern", type: "state" },
  { id: "ni_2",  name: "Bear Lake State Park",          region: "northern", type: "state" },
  { id: "ni_3",  name: "Great Salt Lake State Park",    region: "northern", type: "state" },
  { id: "ni_4",  name: "Wasatch Mountain State Park",   region: "northern", type: "state" },
  { id: "ni_5",  name: "Jordanelle State Park",         region: "northern", type: "state" },
  { id: "ni_6",  name: "East Canyon State Park",        region: "northern", type: "state" },
  { id: "ni_7",  name: "Rockport State Park",           region: "northern", type: "state" },
  { id: "nt_1",  name: "Logan Utah Temple",             region: "northern", type: "temple" },
  { id: "nt_2",  name: "Ogden Utah Temple",             region: "northern", type: "temple" },
  { id: "nt_3",  name: "Bountiful Utah Temple",         region: "northern", type: "temple" },
  { id: "nt_4",  name: "Salt Lake Temple",              region: "northern", type: "temple" },
  { id: "nt_5",  name: "Jordan River Utah Temple",      region: "northern", type: "temple" },
  { id: "nt_6",  name: "Payson Utah Temple",            region: "northern", type: "temple" },
  { id: "nt_7",  name: "Vernal Utah Temple",            region: "northern", type: "temple" },
  { id: "nt_8",  name: "Layton Utah Temple",            region: "northern", type: "temple" },
  { id: "nt_9",  name: "Saratoga Springs Utah Temple",  region: "northern", type: "temple" },
  { id: "nt_10", name: "Syracuse Utah Temple",          region: "northern", type: "temple" },

  // ─ CENTRAL UTAH ─
  { id: "ci_1",  name: "Capitol Reef National Park",    region: "central", type: "national" },
  { id: "ci_2",  name: "Goblin Valley State Park",      region: "central", type: "state" },
  { id: "ci_3",  name: "Yuba State Park",               region: "central", type: "state" },
  { id: "ci_4",  name: "Millsite State Park",           region: "central", type: "state" },
  { id: "ci_5",  name: "Huntington State Park",         region: "central", type: "state" },
  { id: "ci_6",  name: "Scofield State Park",           region: "central", type: "state" },
  { id: "ct_1",  name: "Manti Utah Temple",             region: "central", type: "temple" },
  { id: "ct_2",  name: "Mount Timpanogos Utah Temple",  region: "central", type: "temple" },
  { id: "ct_3",  name: "Provo City Center Temple",      region: "central", type: "temple" },
  { id: "ct_4",  name: "Provo Utah Temple",             region: "central", type: "temple" },
  { id: "ct_5",  name: "Orem Utah Temple",              region: "central", type: "temple" },
  { id: "ct_6",  name: "Nephi Utah Temple",             region: "central", type: "temple" },

  // ─ SOUTHERN UTAH ─
  { id: "si_1",  name: "Arches National Park",          region: "southern", type: "national" },
  { id: "si_2",  name: "Bryce Canyon National Park",    region: "southern", type: "national" },
  { id: "si_3",  name: "Canyonlands National Park",     region: "southern", type: "national" },
  { id: "si_4",  name: "Zion National Park",            region: "southern", type: "national" },
  { id: "si_5",  name: "Dead Horse Point State Park",   region: "southern", type: "state" },
  { id: "si_6",  name: "Kodachrome Basin State Park",   region: "southern", type: "state" },
  { id: "si_7",  name: "Snow Canyon State Park",        region: "southern", type: "state" },
  { id: "si_8",  name: "Coral Pink Sand Dunes State Park", region: "southern", type: "state" },
  { id: "si_9",  name: "Escalante Petrified Forest State Park", region: "southern", type: "state" },
  { id: "si_10", name: "Gunlock State Park",            region: "southern", type: "state" },
  { id: "si_11", name: "Sand Hollow State Park",        region: "southern", type: "state" },
  { id: "st_1",  name: "St. George Utah Temple",        region: "southern", type: "temple" },
  { id: "st_2",  name: "Cedar City Utah Temple",        region: "southern", type: "temple" },
  { id: "st_3",  name: "Moab Utah Temple",              region: "southern", type: "temple" },
];

// ── LOCALSTORAGE KEY ──────────────────────────────────────
const STORAGE_KEY = "utah_bucket_list";

// ── STATE ─────────────────────────────────────────────────
let savedIds = loadSaved();
let activeFilter = "all";

// ── LOAD / SAVE ───────────────────────────────────────────
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function persistSaved() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
}

// ── FILTER LOGIC ──────────────────────────────────────────
function matchesFilter(dest) {
  if (activeFilter === "all") return true;
  if (activeFilter === dest.region) return true;
  if (activeFilter === dest.type) return true;
  return false;
}

// ── TAG LABEL ─────────────────────────────────────────────
function tagFor(type) {
  const map = {
    national: { cls: "tag-national", label: "National Park" },
    state:    { cls: "tag-state",    label: "State Park" },
    temple:   { cls: "tag-temple",   label: "Temple" },
  };
  const t = map[type] || { cls: "", label: type };
  return `<span class="dest-tag ${t.cls}">${t.label}</span>`;
}

// ── RENDER DESTINATIONS ───────────────────────────────────
function renderDestinations() {
  const container = document.getElementById("destinations-container");
  if (!container) return;

  const regions = [
    { key: "northern", label: "Northern Utah" },
    { key: "central",  label: "Central Utah" },
    { key: "southern", label: "Southern Utah" },
  ];

  let html = "";

  regions.forEach(region => {
    const items = destinations.filter(d =>
      d.region === region.key && matchesFilter(d)
    );

    if (items.length === 0) return;

    const itemsHtml = items.map(dest => {
      const isAdded = savedIds.includes(dest.id);
      return `
        <div class="dest-item" data-id="${dest.id}" data-region="${dest.region}" data-type="${dest.type}">
          <div class="dest-info">
            <div class="dest-name">${dest.name}</div>
            ${tagFor(dest.type)}
          </div>
          <button
            class="add-btn ${isAdded ? "added" : ""}"
            data-id="${dest.id}"
            aria-label="${isAdded ? `Remove ${dest.name} from bucket list` : `Add ${dest.name} to bucket list`}"
          >
            ${isAdded ? "Added ✓" : "Add"}
          </button>
        </div>
      `;
    }).join("");

    html += `
      <section class="region-section" aria-labelledby="region-${region.key}">
        <h2 class="region-title" id="region-${region.key}">${region.label}</h2>
        <div class="dest-list">
          ${itemsHtml}
        </div>
      </section>
    `;
  });

  if (html === "") {
    html = `<p style="color:#888; padding:1rem 0;">No destinations match this filter.</p>`;
  }

  container.innerHTML = html;

  // attach click events to add buttons
  container.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", handleAddClick);
  });
}

// ── HANDLE ADD/REMOVE ─────────────────────────────────────
function handleAddClick(e) {
  const btn = e.currentTarget;
  const id = btn.dataset.id;

  if (savedIds.includes(id)) {
    // remove
    savedIds = savedIds.filter(s => s !== id);
    btn.textContent = "Add";
    btn.classList.remove("added");
    btn.setAttribute("aria-label", `Add ${getDestName(id)} to bucket list`);
  } else {
    // add
    savedIds.push(id);
    btn.textContent = "Added ✓";
    btn.classList.add("added");
    btn.setAttribute("aria-label", `Remove ${getDestName(id)} from bucket list`);
  }

  persistSaved();
  renderSavedList();
}

function getDestName(id) {
  const d = destinations.find(x => x.id === id);
  return d ? d.name : id;
}

// ── SAVED LIST PANEL ──────────────────────────────────────
function renderSavedList() {
  const list = document.getElementById("saved-list");
  const countEl = document.getElementById("saved-count");
  const emptyMsg = document.getElementById("saved-empty-msg");
  const clearBtn = document.getElementById("clear-list-btn");
  if (!list) return;

  countEl.textContent = savedIds.length;

  if (savedIds.length === 0) {
    list.innerHTML = "";
    list.appendChild(emptyMsg);
    emptyMsg.style.display = "block";
    clearBtn.style.display = "none";
    return;
  }

  emptyMsg.style.display = "none";
  clearBtn.style.display = "inline-block";

  list.innerHTML = savedIds.map(id => {
    const name = getDestName(id);
    return `
      <li>
        ${name}
        <button aria-label="Remove ${name} from saved list" data-remove="${id}">&#x2715;</button>
      </li>
    `;
  }).join("");

  list.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.remove;
      savedIds = savedIds.filter(s => s !== id);
      persistSaved();
      renderSavedList();
      renderDestinations();
    });
  });
}

// ── FILTER BUTTONS ────────────────────────────────────────
function initFilters() {
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderDestinations();
    });
  });
}

// ── CLEAR ALL ─────────────────────────────────────────────
function initClearBtn() {
  const btn = document.getElementById("clear-list-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your entire bucket list?")) {
      savedIds = [];
      persistSaved();
      renderSavedList();
      renderDestinations();
    }
  });
}

// ── INIT ──────────────────────────────────────────────────
renderDestinations();
renderSavedList();
initFilters();
initClearBtn();
