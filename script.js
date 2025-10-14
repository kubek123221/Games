let words = [];
let word = "";
let guessed = [];
let wrong = 0;

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

// 🔹 Układ QWERTY
const rows = [
  "q w e r t y u i o p".split(" "),
  "a ą s ś d f g h j k l ł".split(" "),
  "z ź x c ć v b n ń m".split(" ")
];

// 🔹 Wczytanie słów z pliku tekstowego
async function loadWords() {
  try {
    const response = await fetch("polskie_slowa.txt");
    const text = await response.text();
    words = text
      .split("\n")
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 0);
    console.log("Wczytano słowa:", words.length);
    startGame();
  } catch (err) {
    messageDiv.textContent = "⚠️ Nie udało się wczytać pliku polskie_slowa.txt. Uruchom grę przez serwer lokalny.";
  }
}

// 🔹 Rozpoczęcie nowej gry
function startGame() {
  if (words.length === 0) {
    messageDiv.textContent = "Brak słów do gry!";
    return;
  }

  word = words[Math.floor(Math.random() * words.length)];
  guessed = [];
  wrong = 0;
  messageDiv.textContent = "";
  stagesDiv.textContent = "";
  showWord();
  generateLetters();
}

// 🔹 Wyświetlanie słowa
function showWord() {
  const display = word.split("").map(l => (guessed.includes(l) ? l : "_")).join(" ");
  wordDiv.textContent = display;

  if (!display.includes("_")) {
    messageDiv.textContent = `🎉 WYGRAŁEŚ! Słowo to: ${word}`;
    disableLetters();
  }
}

// 🔹 Tworzenie przycisków w układzie QWERTY
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
    showWord();
  } else {
    wrong++;
    updateHangman();
    if (wrong >= stages.length - 1) {
      messageDiv.textContent = `💀 PRZEGRAŁEŚ! Słowo to: ${word}`;
      disableLetters();
    }
  }
}

// 🔹 Rysowanie wisielca
function updateHangman() {
  stagesDiv.textContent = stages.slice(0, wrong + 1).join("\n");
}

// 🔹 Blokowanie przycisków po końcu gry
function disableLetters() {
  document.querySelectorAll("#letters button").forEach(btn => (btn.disabled = true));
}

// 🔹 Restart gry (nowe losowanie słowa)
restartBtn.onclick = startGame;

// 🔹 Start — wczytanie słów i rozpoczęcie gry
loadWords();
