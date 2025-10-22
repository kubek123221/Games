let words = [];
let word = "";
let category = "";
let guessed = [];
let wrong = 0;
let selectedFile = null;
let selectedLang = 'Pl'; // domyślnie Polski
let selectedCategory = null;

// tryb 2 graczy
let twoPlayerMode = false;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;

const stages = [
`





`,
`
     _______
    |/      
    |       
    |       
    |       
    |       
____|____
`,
`
     _______
    |/      |
    |      (_)
    |       
    |       
    |       
____|____
`,
`
     _______
    |/      |
    |      (_)
    |       |
    |       |
    |       
____|____
`,
`
     _______
    |/      |
    |      (_)
    |      \\|
    |       |
    |       
____|____
`,
`
     _______
    |/      |
    |      (_)
    |      \\|/
    |       |
    |       
____|____
`,
`
     _______
    |/      |
    |      (_)
    |      \\|/
    |       |
    |      / 
____|____
`,
`
     _______
    |/      |
    |      (_)
    |      \\|/
    |       |
    |      / \\
____|____
`
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

const langToggleBtn = document.getElementById("langToggle");

const rows = [
  "q w e r t y u i o p".split(" "),
  "a s d f g h j k l".split(" "),
  "z x c v b n m".split(" ").concat(["ą","ć","ę","ł","ń","ó","ś","ź","ż"])
];

// 🔹 przycisk zmiany języka
langToggleBtn.onclick = () => {
  selectedLang = selectedLang === 'Pl' ? 'Ang' : 'Pl';
  langToggleBtn.textContent = selectedLang === 'Pl' ? 'Polsk🇵🇱' : 'English🇬🇧';
  if (selectedCategory) {
    selectedFile = `${selectedCategory}_words_${selectedLang}.txt`;
    loadWords();
  }
  updateUIText();
};

// 🔹 zmiana tekstów interfejsu
function updateUIText() {
  if (selectedLang === 'Pl') {
    restartBtn.textContent = '🔄 Zagraj ponownie';
    twoPlayersBtn.textContent = '👥 2 Gracze';
    if (!twoPlayerMode) messageDiv.textContent = '';
  } else {
    restartBtn.textContent = '🔄 Play Again';
    twoPlayersBtn.textContent = '👥 2 Players';
    if (!twoPlayerMode) messageDiv.textContent = '';
  }
}

// 🔹 wybór kategorii
function selectCategory(baseName) {
  selectedCategory = baseName;
  selectedFile = `${baseName}_words_${selectedLang}.txt`;
  document.getElementById("category-select").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadWords();
}

// 🔹 wczytywanie słów
async function loadWords() {
  try {
    const response = await fetch(selectedFile);
    const text = await response.text();
    words = text
      .split("\n")
      .map(line => {
        const parts = line.split(";");
        return {
          word: parts[0].trim().toLowerCase(),
          category: parts[1]?.trim() || (selectedLang==='Pl'?'Brak kategorii':'No category')
        };
      })
      .filter(w => w.word.length > 0);
    startGame();
  } catch {
    messageDiv.textContent = `⚠️ Nie udało się wczytać pliku ${selectedFile}!`;
  }
}

// 🔹 start gry
function startGame() {
  currentPlayer = 1;
  guessed = [];
  wrong = 0;
  messageDiv.textContent = "";
  stagesDiv.textContent = stages[0]; // początkowy etap
  categoryDiv.textContent = "";

  const chosen = words[Math.floor(Math.random() * words.length)];
  word = chosen.word;
  category = chosen.category;

  categoryDiv.textContent = selectedLang==='Pl' ? `Kategoria: ${category}` : `Category: ${category}`;

  showWord();
  generateLetters();
}

// 🔹 wyświetlanie słowa
function showWord() {
  const display = word.split("").map(l => (l === "-" ? "-" : guessed.includes(l) ? l : "_")).join(" ");
  wordDiv.textContent = display;

  if (!display.includes("_")) {
    if (twoPlayerMode) {
      if (currentPlayer === 1) player1Score += 5;
      else player2Score += 5;
      updateScoreboard();
    }
    messageDiv.textContent = selectedLang==='Pl' 
      ? `🎉 Gracz ${currentPlayer} wygrał! Słowo: ${word}` 
      : `🎉 Player ${currentPlayer} wins! Word: ${word}`;
    disableLetters();
  }
}

// 🔹 generowanie klawiatury
function generateLetters() {
  lettersDiv.innerHTML = "";
  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    row.forEach(letter => {
      if (selectedLang==='Ang' && "ąćęłńóśźż".includes(letter)) return;
      const btn = document.createElement("button");
      btn.textContent = letter;
      btn.onclick = () => guess(letter, btn);
      rowDiv.appendChild(btn);
    });
    lettersDiv.appendChild(rowDiv);
  });
}

// 🔹 zgadywanie liter
function guess(letter, button) {
  button.disabled = true;

  if (word.includes(letter)) {
    guessed.push(letter);
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
      messageDiv.textContent = selectedLang==='Pl'
        ? `💀 Koniec rundy! Słowo: ${word}`
        : `💀 Game over! Word: ${word}`;
      disableLetters();
    }
  }

  if (twoPlayerMode && !word.includes(letter)) {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    messageDiv.textContent = selectedLang==='Pl'
      ? `Tura gracza ${currentPlayer}`
      : `Player ${currentPlayer} turn`;
  }
}

// 🔹 rysowanie wisielca
function updateHangman() {
  stagesDiv.textContent = stages[wrong];
}

// 🔹 blokowanie przycisków
function disableLetters() {
  document.querySelectorAll("#letters button").forEach(btn => (btn.disabled = true));
}

// 🔹 tryb 2 graczy
twoPlayersBtn.onclick = () => {
  twoPlayerMode = true;
  player1Score = 0;
  player2Score = 0;
  updateScoreboard();
  scoreboard.style.display = "block";
  startGame();
};

// 🔹 aktualizacja punktów
function updateScoreboard() {
  player1ScoreTd.textContent = player1Score;
  player2ScoreTd.textContent = player2Score;
}

// 🔹 restart gry
restartBtn.onclick = () => {
  twoPlayerMode = false;
  scoreboard.style.display = "none";
  startGame();
};
