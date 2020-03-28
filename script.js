//Global variables
let gamePlayArr = [];
let boardSize = 10;
let gameProgressState = false;
const ALIVE = "alive";
const DEAD ="dead";

//DOM get variables
let gameBoardDiv = document.getElementById("game-board");
let startButtonSelector = document.querySelector("#start-button button");

//Initialize empty game board
function initGameBoard() {
  for (let x = 0; x < boardSize; x++) {
    gamePlayArr.push([]);
    for (let y = 0; y < boardSize; y++) {
      gamePlayArr[x].push(DEAD);
      let newCell = document.createElement("div");
      newCell.className = "cell";
      newCell.classList.add(DEAD);
      newCell.id = x + "-" + y;
      newCell.style.height = 450 / boardSize + "px";
      newCell.style.width = 450 / boardSize + "px";
      newCell.addEventListener("click", playerSetUp);
      gameBoardDiv.appendChild(newCell);
    }
  }
  startButtonSelector.addEventListener("click", playGame);
}

//Lets player set up initial DEAD or ALIVE state of game board
function playerSetUp(event) {
  //Only functions when game is not in progress
  if (gameProgressState === false) {
    //Change cell state to ALIVE in DOM
    event.target.classList.remove(DEAD);
    event.target.classList.add(ALIVE);
    //Update cell state in gamePlayArr
    let clickedCellIndex = event.target.id.split("-");
    let xCo = clickedCellIndex[0];
    let yCo = clickedCellIndex[1];
    gamePlayArr[xCo][yCo] = ALIVE;
    console.log(gamePlayArr);
  }
}

function playGame(event) {
  gameProgressState = true;
  //Saves surrounding live cell count for all inner cells depending on player setup
  let arrayLiveCellCount = [];
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (x !== 0 && y !== 0 && x !== boardSize - 1 && y !== boardSize - 1) {
        let surrLiveCells = checkSurrEight(x, y);
        arrayLiveCellCount.push([x, y, gamePlayArr[x][y], surrLiveCells]);
      }
    }
  }
  //Based on live cell count, modifies inner cell state
  for (let i = 0; i < arrayLiveCellCount.length; i++) {
    if (arrayLiveCellCount[i][2] === ALIVE) {
      if (arrayLiveCellCount[i][3] < 2 || arrayLiveCellCount[i][3] > 3) {
        gamePlayArr[arrayLiveCellCount[i][0]][arrayLiveCellCount[i][1]] =
          DEAD;
      }
    } else if (arrayLiveCellCount[i][2] === DEAD) {
      if (arrayLiveCellCount[i][3] === 3) {
        gamePlayArr[arrayLiveCellCount[i][0]][arrayLiveCellCount[i][1]] =
          ALIVE;
      }
    }
  }
  // //Modifies edge cell state
  // for (let i = 0; i < boardSize; i++) {
  //   for (let z = 0; z < boardSize; z++) {
  //     if (i === 0 || z === 0 || i === boardSize - 1 || z === boardSize - 1) {
  //       if (gamePlayArr[i][z] === ALIVE) {
  //         gamePlayArr[i][z] = DEAD;
  //       }
  //     }
  //   }
  // }
  console.log(gamePlayArr);
  printGamePlayArray();
}


function printGamePlayArray() {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      let cellId = x + "-" + y;
      //console.log(cellId);
      if (gamePlayArr[x][y] === ALIVE) {
        document.getElementById(cellId).classList.remove(DEAD);
        document.getElementById(cellId).classList.add(ALIVE);
      } else {
        document.getElementById(cellId).classList.remove(ALIVE);
        document.getElementById(cellId).classList.add(DEAD);
      }
    }
  }
}

function checkSurrEight(xCo, yCo) {
  let checkingArray = [];
  let aliveCells = 0;
  checkingArray.push(gamePlayArr[xCo - 1][yCo - 1]);
  checkingArray.push(gamePlayArr[xCo - 1][yCo]);
  checkingArray.push(gamePlayArr[xCo - 1][yCo + 1]);
  checkingArray.push(gamePlayArr[xCo][yCo - 1]);
  checkingArray.push(gamePlayArr[xCo][yCo + 1]);
  checkingArray.push(gamePlayArr[xCo + 1][yCo - 1]);
  checkingArray.push(gamePlayArr[xCo + 1][yCo]);
  checkingArray.push(gamePlayArr[xCo + 1][yCo + 1]);
  for (let i = 0; i < checkingArray.length; i++) {
    if (checkingArray[i] === ALIVE) {
      aliveCells++;
    }
  }
  return aliveCells;
}

initGameBoard();
