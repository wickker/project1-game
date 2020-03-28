//Global variables
let gamePlayArr = [];
let boardSize = 10;
let gameProgressState = false;
const ALIVE = "alive";
const DEAD = "dead";

//DOM GET variables
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
    let clickedCellIndex = event.target.id.split("-");
    let xCo = clickedCellIndex[0];
    let yCo = clickedCellIndex[1];
    if (gamePlayArr[xCo][yCo] === ALIVE) {
      gamePlayArr[xCo][yCo] = DEAD;
      event.target.classList.remove(ALIVE);
      event.target.classList.add(DEAD);
    } else if (gamePlayArr[xCo][yCo] === DEAD) {
      gamePlayArr[xCo][yCo] = ALIVE;
      event.target.classList.remove(DEAD);
      event.target.classList.add(ALIVE);
    }
  console.log(gamePlayArr);
  }
}

function playGame(event) {
  gameProgressState = true;
  //Saves surrounding live cell count and cell data for each cell depending on player setup
  let arrayLiveCellCount = [];
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      let cellObj = {
        xCoor: x,
        yCoor: y,
        state: gamePlayArr[x][y],
        surrLiveCells: checkSurrEight(x, y)
      };
      arrayLiveCellCount.push(cellObj);
    }
  }
  console.log(arrayLiveCellCount);
  //Based on live cell count, modifies cell state according to Conway GOL rules
  for (let i = 0; i < arrayLiveCellCount.length; i++) {
    if (arrayLiveCellCount[i].state === ALIVE) {
      if (
        arrayLiveCellCount[i].surrLiveCells < 2 ||
        arrayLiveCellCount[i].surrLiveCells > 3
      ) {
        gamePlayArr[arrayLiveCellCount[i].xCoor][
          arrayLiveCellCount[i].yCoor
        ] = DEAD;
      }
    } else if (arrayLiveCellCount[i].state === DEAD) {
      if (arrayLiveCellCount[i].surrLiveCells === 3) {
        gamePlayArr[arrayLiveCellCount[i].xCoor][
          arrayLiveCellCount[i].yCoor
        ] = ALIVE;
      }
    }
  }
  // console.log(gamePlayArr);
  printGamePlayArray();
}

//Prints current gamePlayArr to DOM
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

//Modifies x coordinate if on the edge
function getX(x) {
  if (x === -1) {
    x = boardSize - 1;
  } else if (x === boardSize) {
    x = 0;
  }
  return x;
}

//Modifies y coordinate if on the edge
function getY(y) {
  if (y === -1) {
    y = boardSize - 1;
  } else if (y === boardSize) {
    y = 0;
  }
  return y;
}

//Captures state of surrounding eight cells in an array and counts number of ALIVE cells
function checkSurrEight(xCo, yCo) {
  let checkingArray = [];
  let aliveCells = 0;
  checkingArray.push(gamePlayArr[getX(xCo - 1)][getY(yCo - 1)]);
  checkingArray.push(gamePlayArr[getX(xCo - 1)][getY(yCo)]);
  checkingArray.push(gamePlayArr[getX(xCo - 1)][getY(yCo + 1)]);
  checkingArray.push(gamePlayArr[getX(xCo)][getY(yCo - 1)]);
  checkingArray.push(gamePlayArr[getX(xCo)][getY(yCo + 1)]);
  checkingArray.push(gamePlayArr[getX(xCo + 1)][getY(yCo - 1)]);
  checkingArray.push(gamePlayArr[getX(xCo + 1)][getY(yCo)]);
  checkingArray.push(gamePlayArr[getX(xCo + 1)][getY(yCo + 1)]);
  for (let i = 0; i < checkingArray.length; i++) {
    if (checkingArray[i] === ALIVE) {
      aliveCells++;
    }
  }
  // console.log(checkingArray);
  return aliveCells;
}

initGameBoard();
