const list = JSON.parse(localStorage.getItem('bucketList')) || [];

function saveList() {
    localStorage.setItem('bucketList', JSON.stringify(list));
}

function renderFullList() {
    const ul = document.getElementById('full-list');
    if (!ul) return;

    ul.innerHTML = list.map(item => `
        <li>
            ${item.name}
            <button class="remove" data-name="${item.name}">Remove</button>
        </li>
    `).join('');

    document.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const index = list.findIndex(i => i.name === name);
            if (index !== -1) list.splice(index, 1);
            saveList();
            renderFullList();
            updateProgress();
        });
    });
}

function updateProgress() {
    const bar = document.getElementById('progress-bar');
    const label = document.getElementById('progress-label');
    if (!bar || !label) return;

    const completed = list.filter(item => item.completed).length;
    const total = list.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    bar.style.width = percentage + '%';
    label.textContent = completed + '/' + total;
}

