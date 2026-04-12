const STORAGE_KEY = "utahBucketList";

const presetLocations = [
  { name: "Antelope Island State Park", type: "State Park", region: "Northern" },
  { name: "Bear Lake State Park", type: "State Park", region: "Northern" },
  { name: "Great Salt Lake State Park", type: "State Park", region: "Northern" },
  { name: "Logan Utah Temple", type: "Temple", region: "Northern" },
  { name: "Ogden Utah Temple", type: "Temple", region: "Northern" },
  { name: "Payson Utah Temple", type: "Temple", region: "Northern" },
  { name: "Vernal Utah Temple", type: "Temple", region: "Northern" },
  { name: "Wasatch Mountain State Park", type: "State Park", region: "Northern" },

  { name: "Capitol Reef National Park", type: "National Park", region: "Central" },
  { name: "Goblin Valley State Park", type: "State Park", region: "Central" },
  { name: "Yuba State Park", type: "State Park", region: "Central" },

  { name: "Arches National Park", type: "National Park", region: "Southern" },
  { name: "Bryce Canyon National Park", type: "National Park", region: "Southern" },
  { name: "Canyonlands National Park", type: "National Park", region: "Southern" },
  { name: "Dead Horse Point State Park", type: "State Park", region: "Southern" },
  { name: "Kodachrome Basin State Park", type: "State Park", region: "Southern" },
  { name: "Snow Canyon State Park", type: "State Park", region: "Southern" },
  { name: "St. George Utah Temple", type: "Temple", region: "Southern" },
  { name: "Zion National Park", type: "National Park", region: "Southern" }
];

function getBucketList() {
  let storedList = localStorage.getItem(STORAGE_KEY);
  if (storedList) {
    return JSON.parse(storedList);
  }
  return [];
}

function saveBucketList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function isDuplicate(name) {
  let list = getBucketList();

  for (let i = 0; i < list.length; i++) {
    if (list[i].name.toLowerCase() === name.toLowerCase()) {
      return true;
    }
  }

  return false;
}

function addItem(name, type, region) {
  if (name.trim() === "" || isDuplicate(name)) {
    return false;
  }

  let list = getBucketList();

  list.push({
    name: name.trim(),
    type: type,
    region: region,
    visited: false
  });

  saveBucketList(list);
  return true;
}

function removeItem(index) {
  let list = getBucketList();
  list.splice(index, 1);
  saveBucketList(list);
}

function toggleVisited(index) {
  let list = getBucketList();
  list[index].visited = !list[index].visited;
  saveBucketList(list);
}

function createAddButton(item) {
  let button = document.createElement("button");
  button.type = "button";
  button.className = "btn-add";
  button.textContent = "Add";

  if (isDuplicate(item.name)) {
    button.textContent = "Added";
    button.disabled = true;
  }

  button.addEventListener("click", function () {
    let added = addItem(item.name, item.type, item.region);

    if (added) {
      button.textContent = "Added";
      button.disabled = true;
    } else {
      alert("That location is already in your bucket list.");
    }
  });

  return button;
}

function renderHomeOptions(regionName, listId) {
  let ul = document.getElementById(listId);
  if (!ul) {
    return;
  }

  ul.innerHTML = "";

  for (let i = 0; i < presetLocations.length; i++) {
    if (presetLocations[i].region === regionName) {
      let li = document.createElement("li");
      li.className = "option-item";

      let nameSpan = document.createElement("span");
      nameSpan.className = "option-name";
      nameSpan.textContent = presetLocations[i].name;

      let addButton = createAddButton(presetLocations[i]);

      li.appendChild(nameSpan);
      li.appendChild(addButton);
      ul.appendChild(li);
    }
  }
}

function renderRegion(regionName, listId) {
  let ul = document.getElementById(listId);
  if (!ul) {
    return;
  }

  let list = getBucketList();
  ul.innerHTML = "";

  let foundItems = false;

  for (let i = 0; i < list.length; i++) {
    if (list[i].region === regionName) {
      foundItems = true;

      let li = document.createElement("li");
      if (list[i].visited) {
        li.classList.add("visited");
      }

      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = list[i].visited;
      checkbox.dataset.index = i;

      checkbox.addEventListener("change", function () {
        toggleVisited(Number(this.dataset.index));
        renderBucketList();
      });

      let info = document.createElement("div");
      info.className = "item-info";

      let nameSpan = document.createElement("span");
      nameSpan.className = "item-name";
      nameSpan.textContent = list[i].name;

      let metaSpan = document.createElement("span");
      metaSpan.className = "item-meta";
      metaSpan.textContent = list[i].type + " | " + list[i].region + " Utah";

      info.appendChild(nameSpan);
      info.appendChild(metaSpan);

      let removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "✕";
      removeBtn.dataset.index = i;

      removeBtn.addEventListener("click", function () {
        removeItem(Number(this.dataset.index));
        renderBucketList();
        renderHomePage();
      });

      li.appendChild(checkbox);
      li.appendChild(info);
      li.appendChild(removeBtn);
      ul.appendChild(li);
    }
  }

  if (!foundItems) {
    let li = document.createElement("li");
    li.className = "empty-msg";
    li.textContent = "No " + regionName.toLowerCase() + " Utah locations added yet.";
    ul.appendChild(li);
  }
}

function updateProgress() {
  let list = getBucketList();
  let visitedCount = 0;

  for (let i = 0; i < list.length; i++) {
    if (list[i].visited) {
      visitedCount++;
    }
  }

  let total = list.length;
  let percent = 0;

  if (total > 0) {
    percent = Math.round((visitedCount / total) * 100);
  }

  let progressBar = document.getElementById("progress-bar");
  let progressLabel = document.getElementById("progress-label");

  if (progressBar && progressLabel) {
    progressBar.style.width = percent + "%";
    progressLabel.textContent = visitedCount + " of " + total + " visited (" + percent + "%)";
  }
}

function renderBucketList() {
  renderRegion("Northern", "northern-list");
  renderRegion("Central", "central-list");
  renderRegion("Southern", "southern-list");
  updateProgress();
}

function renderHomePage() {
  renderHomeOptions("Northern", "northern-options");
  renderHomeOptions("Central", "central-options");
  renderHomeOptions("Southern", "southern-options");
}

document.addEventListener("DOMContentLoaded", function () {
  renderHomePage();
  renderBucketList();

  let clearBtn = document.getElementById("clear-btn");

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      let answer = confirm("Clear your entire bucket list?");

      if (answer) {
        saveBucketList([]);
        renderBucketList();
        renderHomePage();
      }
    });
  }
});