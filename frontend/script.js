const API_BASE_URL = "https://cloudquizfoot2-functions.azurewebsites.net/api";

let currentDifficulty = 3;
let score = 0;
let questionNumber = 1;
let totalQuestions = 10;
let usedQuestions = [];
let qiFootGlobal = 0;

let suddenScore = 0;
let suddenDifficulty = 1;
let suddenUsedQuestions = [];
let suddenAlive = true;

const screenQuiz = document.getElementById("screen-quiz");
const screenEnd = document.getElementById("screen-end");

const questionCounter = document.getElementById("question-counter");
const scoreDisplay = document.getElementById("score-display");
const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices");
const btnNext = document.getElementById("btn-next");

const finalScore = document.getElementById("final-score");
const playerNameInput = document.getElementById("player-name");
const saveStatus = document.getElementById("save-status");

function showScreen(activeId) {
  const screens = [screenQuiz, screenEnd];
  screens.forEach((s) => s && s.classList.remove("active"));

  const screen = document.getElementById(activeId);
  if (screen) screen.classList.add("active");
}

function startQiFoot() {
    document.getElementById("home-screen").classList.add("hidden");

    currentDifficulty = 3;
    score = 0;
    questionNumber = 1;
    usedQuestions = [];

    showScreen("screen-quiz");
    loadQuestion();
}

async function loadQuestion() {
  try {
    const usedParam = usedQuestions.join(",");
    const res = await fetch(
      `${API_BASE_URL}/nextquestion?difficulty=${currentDifficulty}&used=${usedParam}`
    );

    if (!res.ok) throw new Error("Erreur API nextquestion");

    const q = await res.json();
    renderQuestion(q);

  } catch (err) {
    alert("Impossible de charger la question : " + err.message);
  }
}

function renderQuestion(question) {
  btnNext.disabled = true;
  choicesContainer.innerHTML = "";

  questionCounter.textContent = `Question ${questionNumber} / ${totalQuestions}`;
  scoreDisplay.textContent = `Score : ${score}`;
  questionText.textContent = question.question;

  usedQuestions.push(question.id);

  const choices = [
    { text: question.choice1, correct: question.choice1 === question.answer },
    { text: question.choice2, correct: question.choice2 === question.answer },
    { text: question.choice3, correct: question.choice3 === question.answer },
  ];

  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  choices.forEach((ch) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = ch.text;

    btn.addEventListener("click", () => handleAnswer(btn, question, ch.correct));
    choicesContainer.appendChild(btn);
  });
}

function handleAnswer(button, q, isCorrect) {
  const allButtons = document.querySelectorAll(".choice-btn");
  allButtons.forEach((b) => (b.disabled = true));

  const delta = Math.floor(Math.random() * 3) + 1;

  if (isCorrect) {
    button.classList.add("correct");

    let m = 1;
    if (q.difficulty >= 5 && q.difficulty <= 7) m = 1.2;
    if (q.difficulty >= 8 && q.difficulty <= 9) m = 1.4;
    if (q.difficulty === 10) m = 1.6;

    score += Math.round(q.difficulty * m);
    currentDifficulty = Math.min(10, currentDifficulty + delta);

  } else {
    button.classList.add("wrong");

    allButtons.forEach((b) => {
      if (b.textContent === q.answer) b.classList.add("correct");
    });

    currentDifficulty = Math.max(1, currentDifficulty - delta);
  }

  scoreDisplay.textContent = `Score : ${score}`;
  btnNext.disabled = false;
}

async function nextQuestion() {
  questionNumber++;
  if (questionNumber > totalQuestions) endQuiz();
  else loadQuestion();
}

function endQuiz() {
  qiFootGlobal = Math.round(score * 1.7);

  let niveau = "";
  let message = "";

  if (qiFootGlobal < 50) {
    niveau = "District 🟤";
    message = "Frérot… t’es vraiment éclaté 😭";
  } else if (qiFootGlobal < 80) {
    niveau = "National ⚪";
    message = "Tu joues, mais t’es pas filmé 📹";
  } else if (qiFootGlobal < 120) {
    niveau = "Ligue 1 🔵";
    message = "C’est propre 🔥";
  } else if (qiFootGlobal < 150) {
    niveau = "Champion’s League 🟣";
    message = "Très très chaud 😳🔥";
  } else {
    niveau = "Ballon d’Or 🟡";
    message = "GOAT 🐐🔥";
  }

  finalScore.textContent = qiFootGlobal;
  document.getElementById("qi-foot-level").innerHTML =
    `Niveau : <strong>${niveau}</strong><br><br>${message}`;

  showScreen("screen-end");
}

async function saveScore() {
  const name = playerNameInput.value.trim();
  const modePlayed = suddenAlive ? "qifoot" : "sudden";
  if (!name) {
    saveStatus.textContent = "Merci d'entrer un pseudo.";
    saveStatus.className = "status error";
    return;
  }

  saveStatus.textContent = "Enregistrement...";
  saveStatus.className = "status";

  try {
    const res = await fetch(`${API_BASE_URL}/submitresult`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score: qiFootGlobal, mode: modePlayed }),

    });

    if (!res.ok) throw new Error("Erreur API submitresult");

    saveStatus.textContent = "Score enregistré ✔";
    saveStatus.className = "status ok";

    setTimeout(() => {
      document.getElementById("screen-end").classList.remove("active");
      document.getElementById("home-screen").classList.remove("hidden");
      loadMiniLeaderboards();
    }, 800);

  } catch (err) {
    saveStatus.textContent = "Erreur lors de l'enregistrement.";
    saveStatus.className = "status error";
  }
}

async function loadMiniLeaderboards() {
  loadMini("qifoot", "#lb-qifoot ul");
  loadMini("sudden", "#lb-sudden ul");
}

async function loadMini(mode, selector) {
  try {
    const res = await fetch(`${API_BASE_URL}/getleaderboard?mode=${mode}`);
    const data = await res.json();

    const ul = document.querySelector(selector);
    if (!ul) return;

    ul.innerHTML = "";

    data.slice(0, 3).forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${i + 1}. ${item.name}</span><span>${item.score} pts</span>`;
      ul.appendChild(li);
    });

  } catch (e) {
    console.error("Erreur leaderboard mini:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadMiniLeaderboards();

  btnNext.addEventListener("click", nextQuestion);
  document.getElementById("btn-save-score").addEventListener("click", saveScore);

  window.startQiFoot = startQiFoot;
  window.startSuddenDeath = startSuddenDeath;
});

function startSuddenDeath() {
    suddenScore = 0;
    suddenAlive = true;
    suddenDifficulty = 1;
    suddenUsedQuestions = [];

    document.getElementById("home-screen").classList.add("hidden");
    showScreen("screen-quiz");

    loadSuddenQuestion();
}

async function loadSuddenQuestion() {
    if (!suddenAlive) return;

    try {
        const usedParam = suddenUsedQuestions.join(",");
        const res = await fetch(
            `${API_BASE_URL}/nextquestion?difficulty=${suddenDifficulty}&used=${usedParam}`
        );

        if (!res.ok) throw new Error("Erreur API nextquestion");

        const q = await res.json();
        renderSuddenQuestion(q);

    } catch (err) {
        alert("Erreur chargement Mort Subite : " + err.message);
    }
}

function renderSuddenQuestion(question) {
    btnNext.style.display = "none";
    choicesContainer.innerHTML = "";

    questionCounter.textContent = `Mort Subite • Score : ${suddenScore}`;
    scoreDisplay.textContent = "";
    questionText.textContent = question.question;

    suddenUsedQuestions.push(question.id);

    let choices = [
        { text: question.choice1, correct: question.choice1 === question.answer },
        { text: question.choice2, correct: question.choice2 === question.answer },
        { text: question.choice3, correct: question.choice3 === question.answer },
    ];

    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    choices.forEach((ch) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = ch.text;

        btn.addEventListener("click", () => handleSuddenAnswer(btn, question, ch.correct));
        choicesContainer.appendChild(btn);
    });
}

function handleSuddenAnswer(button, q, isCorrect) {
    const allButtons = document.querySelectorAll(".choice-btn");
    allButtons.forEach(b => b.disabled = true);

    if (isCorrect) {
        button.classList.add("correct");
        suddenScore++;

        suddenDifficulty = Math.min(10, suddenDifficulty + 1);

        setTimeout(() => loadSuddenQuestion(), 700);

    } else {
        button.classList.add("wrong");

        allButtons.forEach(b => {
            if (b.textContent === q.answer) b.classList.add("correct");
        });

        suddenAlive = false;

        setTimeout(() => endSuddenDeath(), 900);
    }
}

function endSuddenDeath() {
    qiFootGlobal = suddenScore; // on réutilise ton écran de fin
    finalScore.textContent = suddenScore;

    document.getElementById("qi-foot-level").innerHTML =
        `Mode Mort Subite terminé 🔥<br><br>Score final : <strong>${suddenScore}</strong>`;

    showScreen("screen-end");
}

