//Global variables
let gamePlayArr = [];
let boardSize = 5;
let gameProgressState = false;

//DOM get variables 
let gameBoardDiv = document.getElementById("game-board");

//Initialize empty game board 
function initGameBoard() {
  for (let x=0; x < boardSize; x++) {
    gamePlayArr.push([]);
    for (let y=0; y < boardSize; y++) {
      gamePlayArr[x].push("dead");
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

//Lets player set up initial "dead" or "alive" state of game board
function playerSetUp(event) {
  //Only functions when game is not in progress 
  if (gameProgressState === false) {
    //Change cell state to "alive" in DOM
    event.target.classList.remove("dead");
    event.target.classList.add("alive");
    //Update cell state in gamePlayArr
    let clickedCellIndex = event.target.id.split("-");
    let xCo = clickedCellIndex[0];
    let yCo = clickedCellIndex[1];
    gamePlayArr[xCo][yCo] = "alive";
    console.log(gamePlayArr);
  }
}



initGameBoard();