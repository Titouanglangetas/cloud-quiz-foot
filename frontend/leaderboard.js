const API = "http://localhost:7071/api";

async function loadLeaderboard(mode, elementId) {
    try {
        const res = await fetch(`${API}/getleaderboard?mode=${mode}`);
        const data = await res.json();

        const ul = document.getElementById(elementId);
        ul.innerHTML = "";

        data.slice(0, 10).forEach((row, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${index + 1}. ${row.name}</span>
                <span>${row.score} pts</span>
            `;
            ul.appendChild(li);
        });

    } catch (err) {
        console.error("Erreur leaderboard:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadLeaderboard("qifoot", "lb-qifoot-full");
    loadLeaderboard("sudden", "lb-sudden-full");
});
