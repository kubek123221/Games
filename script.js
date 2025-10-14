let words = [];
let word = "";
let category = "";
let guessed = [];
let wrong = 0;

// 2-player variables
let twoPlayerMode = false;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;

const stages = [
  "",
  "__________",
  "|        |",
  "|        O",
  "|       /|\\",
  "|       / \\",
  "|"
];

const wordDiv = document.getElementById("word");
const lettersDiv = document.getElementById("letters");
const stagesDiv = document.getElementById("stages");
const messageDiv = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const twoPlayersBtn = document.getElementById("twoPlayers");
const categoryDiv = document.getElementById("category");

const player1ScoreTd = document.getElementById("player1Score");
const player2ScoreTd = document.getElementById("player2Score");
const scoreboard = document.getElementById("scoreboard");

const rows = [
  "q w e r t y u i o p".split(" "),
  "a s d f g h j k l".split(" "),
  "z x c v b n m".split(" ").concat(["ą","ć","ę","ł","ń","ó","ś","ź","ż"])
];

// 🔹 Wczytanie słów
async function loadWords() {
  const response = await fetch("polskie_slowa.txt");
  const text = await response.text();
  words = text
    .split("\n")
    .map(line => {
      const parts = line.split(";");
      return {
        word: parts[0].trim().toLowerCase(),
        category: parts[1]?.trim() || "Brak kategorii"
      };
    })
    .filter(w => w.word.length > 0);
  startGame();
}

// 🔹 Start gry
function startGame() {
  currentPlayer = 1;
  guessed = [];
  wrong = 0;
  messageDiv.textContent = "";
  stagesDiv.textContent = "";
  categoryDiv.textContent = "";

  if (words.length === 0) {
    messageDiv.textContent = "Brak słów!";
    return;
  }

  const chosen = words[Math.floor(Math.random() * words.length)];
  word = chosen.word;
  category = chosen.category;

  categoryDiv.textContent = `Kategoria: ${category}`;
  showWord();
  generateLetters();
}

// 🔹 Wyświetlanie słowa
function showWord() {
  const display = word.split("").map(l => (l === "-" ? "-" : guessed.includes(l) ? l : "_")).join(" ");
  wordDiv.textContent = display;

  if (!display.includes("_")) {
    // koniec gry: przyznaj 5 punktów temu kto zgadł
    if (twoPlayerMode) {
      if (currentPlayer === 1) player1Score += 5;
      else player2Score += 5;
      updateScoreboard();
    }
    messageDiv.textContent = `🎉 Gracz ${currentPlayer} wygrał! Słowo: ${word}`;
    disableLetters();
  }
}

// 🔹 Tworzenie klawiatury
function generateLetters() {
  lettersDiv.innerHTML = "";

  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";

    row.forEach(letter => {
      const btn = document.createElement("button");
      btn.textContent = letter;
      btn.onclick = () => guess(letter, btn);
      rowDiv.appendChild(btn);
    });

    lettersDiv.appendChild(rowDiv);
  });
}

// 🔹 Zgadywanie litery
function guess(letter, button) {
  button.disabled = true;

  if (word.includes(letter)) {
    guessed.push(letter);
    // punkty w trybie 2 graczy
    if (twoPlayerMode) {
      const count = word.split("").filter(l => l === letter).length;
      if (currentPlayer === 1) player1Score += count;
      else player2Score += count;
      updateScoreboard();
    }
    showWord();
  } else {
    wrong++;
    updateHangman();
    if (wrong >= stages.length - 1) {
      messageDiv.textContent = `💀 Koniec rundy! Słowo: ${word}`;
      disableLetters();
    }
  }

  // zmiana gracza w trybie 2 graczy po nieudanej literze
  if (twoPlayerMode && !word.includes(letter)) {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    messageDiv.textContent = `Tura gracza ${currentPlayer}`;
  }
}

// 🔹 Wisielec
function updateHangman() {
  stagesDiv.textContent = stages.slice(0, wrong + 1).join("\n");
}

// 🔹 Blokowanie przycisków
function disableLetters() {
  document.querySelectorAll("#letters button").forEach(btn => (btn.disabled = true));
}

// 🔹 2-player mode
twoPlayersBtn.onclick = () => {
  twoPlayerMode = true;
  player1Score = 0;
  player2Score = 0;
  updateScoreboard();
  scoreboard.style.display = "block";
  startGame();
};

// 🔹 Aktualizacja punktów
function updateScoreboard() {
  player1ScoreTd.textContent = player1Score;
  player2ScoreTd.textContent = player2Score;
}

// 🔹 Restart
restartBtn.onclick = () => {
  twoPlayerMode = false;
  scoreboard.style.display = "none";
  startGame();
};

// start gry solo
loadWords();
