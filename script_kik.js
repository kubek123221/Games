const cells = document.querySelectorAll(".cell");
const messageDiv = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const botModeBtn = document.getElementById("botMode");

let board = Array(9).fill("");
let currentPlayer = "X";
let botEnabled = false;

// Włącz tryb bota
botModeBtn.onclick = () => {
  botEnabled = !botEnabled;
  botModeBtn.textContent = botEnabled ? "🤖 Bot włączony" : "🤖 Tryb z Botem";
  botModeBtn.style.background = botEnabled ? "#2980b9" : "#3498db";
  restartGame();
};

// restart gry
restartBtn.onclick = restartGame;

// dodaj eventy do pól
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const idx = cell.dataset.index;
    if (!board[idx] && !isGameOver()) {
      makeMove(idx, currentPlayer);
    }
  });
});

// funkcje
function makeMove(idx, player) {
  board[idx] = player;
  cells[idx].textContent = player;

  if(checkWinner(player)) {
    messageDiv.textContent = `${player} wygrywa!`;
  } else if(board.every(cell => cell)) {
    messageDiv.textContent = "🤝 Remis!";
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if(botEnabled && currentPlayer==="O") {
      botMove();
    }
  }
}

function checkWinner(player) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.some(combo => combo.every(idx => board[idx]===player));
}

function isGameOver() {
  return checkWinner("X") || checkWinner("O") || board.every(cell => cell);
}

function botMove() {
  const empty = board.map((v,i) => v === "" ? i : null).filter(v=>v!==null);
  if(empty.length === 0) return;
  const randIdx = empty[Math.floor(Math.random()*empty.length)];
  makeMove(randIdx, "O");
}

function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  cells.forEach(cell => cell.textContent="");
  messageDiv.textContent="";
}
 
