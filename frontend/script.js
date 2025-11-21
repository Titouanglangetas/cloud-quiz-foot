// 👉 BACKEND LOCAL
const API_BASE_URL = "http://localhost:7071/api";

let currentDifficulty = 3; // difficulté initiale
let score = 0;
let questionNumber = 1;
let totalQuestions = 10; // tu peux changer ici
let usedQuestions = [];
let qiFootGlobal = 0;



const screenStart = document.getElementById("screen-start");
const screenQuiz = document.getElementById("screen-quiz");
const screenEnd = document.getElementById("screen-end");
const screenLeaderboard = document.getElementById("screen-leaderboard");

const questionCounter = document.getElementById("question-counter");
const scoreDisplay = document.getElementById("score-display");
const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices");
const btnNext = document.getElementById("btn-next");

const finalScore = document.getElementById("final-score");
const totalQuestionsDisplay = document.getElementById("total-questions");
const playerNameInput = document.getElementById("player-name");
const saveStatus = document.getElementById("save-status");
const leaderboardList = document.getElementById("leaderboard-list");

document.getElementById("btn-start").addEventListener("click", startQuiz);
btnNext.addEventListener("click", nextQuestion);
document.getElementById("btn-save-score").addEventListener("click", saveScore);
document.getElementById("btn-reload").addEventListener("click", () => location.reload());

function showScreen(activeId) {
  const screens = [screenStart, screenQuiz, screenEnd];

  screens.forEach((s) => {
    if (s) s.classList.remove("active");
  });

  const screen = document.getElementById(activeId);
  if (screen) screen.classList.add("active");
}

// 🚀 DEMARRER LE QUIZ
async function startQuiz() {
  currentDifficulty = 3;
  score = 0;
  questionNumber = 1;

  showScreen("screen-quiz");
  await loadQuestion();
}

// 📥 Charger une question depuis le backend
async function loadQuestion() {
  try {
    const usedParam = usedQuestions.join(",");
    const res = await fetch(`${API_BASE_URL}/nextquestion?difficulty=${currentDifficulty}&used=${usedParam}`);
;
    if (!res.ok) throw new Error("Erreur API nextquestion");

    const q = await res.json();
    renderQuestion(q);

  } catch (err) {
    alert("Impossible de charger la question : " + err.message);
  }
}

// 🎨 Afficher la question
function renderQuestion(question) {
  btnNext.disabled = true;
  choicesContainer.innerHTML = "";

  questionCounter.textContent = `Question ${questionNumber} / ${totalQuestions}`;
  scoreDisplay.textContent = `Score : ${score}`;
  questionText.textContent = question.question;

  usedQuestions.push(question.id);

  // --- Mélange des réponses ---
  let choices = [
    { text: question.choice1, correct: question.choice1 === question.answer },
    { text: question.choice2, correct: question.choice2 === question.answer },
    { text: question.choice3, correct: question.choice3 === question.answer }
  ];

  // Shuffle façon Fisher-Yates
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  // Affichage
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

  // Tirage aléatoire entre 1 et 3
  const delta = Math.floor(Math.random() * 3) + 1;

  if (isCorrect) {
    button.classList.add("correct");

    let m = 1;
    if (q.difficulty >= 5 && q.difficulty <= 7) m = 1.2;
    if (q.difficulty >= 8 && q.difficulty <= 9) m = 1.4;
    if (q.difficulty == 10) m = 1.6;

    score += Math.round(q.difficulty * m);
    currentDifficulty = Math.min(10, currentDifficulty + delta);

  } else {
    button.classList.add("wrong");

    // Mettre en vert la bonne réponse
    allButtons.forEach((b) => {
      if (b.textContent === q.answer) {
        b.classList.add("correct");
      }
    });

    currentDifficulty = Math.max(1, currentDifficulty - delta);
  }

  scoreDisplay.textContent = `Score : ${score}`;
  btnNext.disabled = false;
}


// ▶ Question suivante
async function nextQuestion() {
  questionNumber++;

  if (questionNumber > totalQuestions) {
    endQuiz();
  } else {
    await loadQuestion();
  }
}
function endQuiz() {
  qiFootGlobal = Math.round(score * 1.7);

  let niveau = "";
  let message = "";

  if (qiFootGlobal < 50) {
    niveau = "District 🟤";
    message = "Frérot… t’as pas juste les croisés, t’as aussi les ménisques, la malléole et la licence. Le foot c’est pas fait pour tout le monde. Faut peut-être envisager le ping-pong.";
  }
  else if (qiFootGlobal < 80) {
    niveau = "National ⚪";
    message = "Ok, t’es pas catastrophique… mais t’es le genre de mec qui crie 'laisse !' et rate la balle. Sur FIFA t’es Neymar, dans la vraie vie t’es latéral droit en U13.";
  }
  else if (qiFootGlobal < 120) {
    niveau = "Ligue 1 🔵";
    message = "Ça commence à jouer ! T’es chaud… mais calme-toi, rien de fou non plus. Tu fais la diff au five, mais pas assez pour que quelqu’un te filme.";
  }
  else if (qiFootGlobal < 150) {
    niveau = "Champion’s League 🟣";
    message = "Là oui mon reuf, c’est carré. T’es tellement fort que même les défenseurs ont peur de te tacler, pas envie de faire un pénalty VAR.";
  }
  else {
    niveau = "Ballon d’Or 🟡";
    message = "Wallah t’es trop chaud. Si tu joues vraiment comme ça, Paris t’aurait déjà signé pour remplacer Mbappé. Préviens-moi quand tu fais ta conf’ de presse qu’on rigole.";
  }

  finalScore.textContent = qiFootGlobal;

  const niveauEl = document.getElementById("qi-foot-level");
  niveauEl.innerHTML = `Niveau : <strong>${niveau}</strong><br><br>${message}`;

  showScreen("screen-end");
}


// 💾 Enregistrer le score
async function saveScore() {
  const name = playerNameInput.value.trim();
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
      body: JSON.stringify({ name, score: qiFootGlobal }),
    });

    if (!res.ok) throw new Error("Erreur API submitresult");

    saveStatus.textContent = "Score enregistré ✔";
    saveStatus.className = "status ok";

    await loadLeaderboard();
  } catch (err) {
    saveStatus.textContent = "Erreur lors de l'enregistrement.";
    saveStatus.className = "status error";
  }
}

// 📊 Charger leaderboard
async function loadLeaderboard() {
  const res = await fetch(`${API_BASE_URL}/getleaderboard`);
  const data = await res.json();

  leaderboardList.innerHTML = "";
  data.forEach((entry, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${idx + 1}. ${entry.name}</span><span>${entry.score} pts</span>`;
    leaderboardList.appendChild(li);
  });
}

async function loadLeaderboardLive() {
  try {
    const res = await fetch(`${API_BASE_URL}/getleaderboard`);
    const data = await res.json();

    leaderboardList.innerHTML = "";
    data.forEach((entry, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${idx + 1}. ${entry.name}</span><span>${entry.score} pts</span>`;
      leaderboardList.appendChild(li);
    });
  } catch (e) {
    console.log("Erreur leaderboard live :", e);
  }
}

// Mise à jour régulière du leaderboard
setInterval(loadLeaderboardLive, 3000);
loadLeaderboardLive();
