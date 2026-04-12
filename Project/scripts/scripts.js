const STORAGE_KEY = "utahBucketList";

function getBucketList() {
  let stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  let list = JSON.parse(stored);

  // Fix older saved versions if needed
  for (let i = 0; i < list.length; i++) {
    if (typeof list[i] === "string") {
      list[i] = {
        name: list[i],
        type: "Other",
        region: "Northern",
        visited: false
      };
    }

    if (list[i].visited === undefined) {
      list[i].visited = false;
    }
  }

  return list;
}

function saveBucketList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function itemExists(name) {
  let list = getBucketList();

  for (let i = 0; i < list.length; i++) {
    if (list[i].name.toLowerCase() === name.toLowerCase()) {
      return true;
    }
  }

  return false;
}

function addItem(name, type, region) {
  if (!name || itemExists(name)) {
    return false;
  }

  let list = getBucketList();

  let item = {
    name: name,
    type: type,
    region: region,
    visited: false
  };

  list.push(item);
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

function updateAddButtons() {
  let buttons = document.querySelectorAll(".btn-add");

  for (let i = 0; i < buttons.length; i++) {
    let name = buttons[i].dataset.name;

    if (itemExists(name)) {
      buttons[i].textContent = "Added";
      buttons[i].disabled = true;
    } else {
      buttons[i].textContent = "Add";
      buttons[i].disabled = false;
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

  let found = false;

  for (let i = 0; i < list.length; i++) {
    if (list[i].region === regionName) {
      found = true;

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
      removeBtn.setAttribute("aria-label", "Remove " + list[i].name);

      removeBtn.addEventListener("click", function () {
        removeItem(Number(this.dataset.index));
        renderBucketList();
        updateAddButtons();
      });

      li.appendChild(checkbox);
      li.appendChild(info);
      li.appendChild(removeBtn);
      ul.appendChild(li);
    }
  }

  if (!found) {
    let li = document.createElement("li");
    li.className = "empty-msg";
    li.textContent = "No " + regionName.toLowerCase() + " Utah locations added yet.";
    ul.appendChild(li);
  }
}

function updateProgress() {
  let list = getBucketList();
  let visited = 0;

  for (let i = 0; i < list.length; i++) {
    if (list[i].visited) {
      visited++;
    }
  }

  let total = list.length;
  let percent = 0;

  if (total > 0) {
    percent = Math.round((visited / total) * 100);
  }

  let bar = document.getElementById("progress-bar");
  let label = document.getElementById("progress-label");

  if (bar && label) {
    bar.style.width = percent + "%";
    label.textContent = visited + " of " + total + " visited (" + percent + "%)";
  }
}

function renderBucketList() {
  renderRegion("Northern", "northern-list");
  renderRegion("Central", "central-list");
  renderRegion("Southern", "southern-list");
  updateProgress();
}

document.addEventListener("DOMContentLoaded", function () {
  let addButtons = document.querySelectorAll(".btn-add");

  for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener("click", function () {
      let name = this.dataset.name;
      let type = this.dataset.type;
      let region = this.dataset.region;

      let added = addItem(name, type, region);

      if (added) {
        this.textContent = "Added";
        this.disabled = true;
      } else {
        alert("That location is already in your bucket list.");
      }
    });
  }

  updateAddButtons();
  renderBucketList();

  let clearBtn = document.getElementById("clear-btn");

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      let confirmed = confirm("Clear your entire bucket list?");

      if (confirmed) {
        saveBucketList([]);
        renderBucketList();
        updateAddButtons();
      }
    });
  }
});