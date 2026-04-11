<style>
    text-align: center;
    color: white;
}

/* CARDS */
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    padding: 1rem;
}

.card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* BUTTON */
button {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
}

button:hover {
    background: var(--secondary);
    color: black;
}

/* PROGRESS */
.progress {
    background: #ddd;
    height: 20px;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar {
    background: var(--secondary);
    height: 100%;
    width: 0%;
}
</style>
