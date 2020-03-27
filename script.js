//Global variables
let gamePlayArr = [];
let boardSize = 5;

//DOM get variables 
let gameBoardDiv = document.getElementById("game-board");

function initGameBoard() {
  for (let x=0; x < boardSize; x++) {
    gamePlayArr.push([]);
    for (let y=0; y < boardSize; y++) {
      gamePlayArr[x].push("");
      let newCell = document.createElement("div");
      newCell.className = "cell";
      newCell.classList.add("dead");
      newCell.id = x + "-" + y; 
      newCell.style.height = "90px";
      newCell.style.width = "90px";
      newCell.addEventListener("click", playerSetUp);
      gameBoardDiv.appendChild(newCell);
    }
  }
}

function playerSetUp() {
  console.log("color change!");
}

initGameBoard();