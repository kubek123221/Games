const cells = document.querySelectorAll(".cell");
const messageDiv = document.getElementById("message");
const restartBtn = document.getElementById("restartKik");
const langToggleBtn = document.getElementById("langToggleKik");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;
let selectedLang = 'Pl';

// 🔹 zmiana języka
langToggleBtn.onclick = () => {
  selectedLang = selectedLang === 'Pl' ? 'Ang' : 'Pl';
  langToggleBtn.textContent = selectedLang === 'Pl' ? 'Polsk🇵🇱' : 'English🇬🇧';
  if (!gameOver) updateMessage();
};

// 🔹 kliknięcie w pole
cells.forEach(cell => {
  cell.onclick = () => {
    const index = cell.getAttribute("data-index");
    if (!board[index] && !gameOver) {
      board[index] = currentPlayer;
      cell.textContent = currentPlayer;
      checkWinner();
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateMessage();
    }
  };
});

// 🔹 sprawdzanie zwycięzcy
function checkWinner() {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8], // wiersze
    [0,3,6],[1,4,7],[2,5,8], // kolumny
    [0,4,8],[2,4,6]          // przekątne
  ];

  for (const combo of winCombos) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      messageDiv.textContent = selectedLang==='Pl'?`🎉 Gracz ${board[a]} wygrał!`:`🎉 Player ${board[a]} wins!`;
      gameOver = true;
      return;
    }
  }

  if (!board.includes(null)) {
    messageDiv.textContent = selectedLang==='Pl'?'🤝 Remis!':'🤝 Draw!';
    gameOver = true;
  }
}

// 🔹 aktualizacja wiadomości
function updateMessage() {
  if (!gameOver) {
    messageDiv.textContent = selectedLang==='Pl'?`Tura gracza: ${currentPlayer}`:`Player turn: ${currentPlayer}`;
  }
}

// 🔹 restart gry
restartBtn.onclick = () => {
  board.fill(null);
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
  gameOver = false;
  updateMessage();
};
 
