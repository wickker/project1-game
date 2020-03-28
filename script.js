//Global variables
let gamePlayArr = [];
let boardSize = 10;
let gameProgressState = false;
const ALIVE = "alive";
const DEAD = "dead";
let timer = 0;

//DOM GET variables
let gameBoardDiv = document.getElementById("game-board");
let startButtonSelector = document.querySelector("#start-button button");
let endButtonSelector = document.querySelector("#end-button button");

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
  endButtonSelector.addEventListener("click", endGame);
}

//Lets player set up initial DEAD or ALIVE state of game board
function playerSetUp(event) {
  //Only functions when game is not in progress
  if (gameProgressState === false) {
    //Allows player to change cell state then updates new state to gamePlayArr and DOM
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
  let arrayCellDetails = [];
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      let cellObj = {
        xCoor: x,
        yCoor: y,
        state: gamePlayArr[x][y],
        surrLiveCells: checkSurrEight(x, y)
      };
      arrayCellDetails.push(cellObj);
    }
  }
  console.log(arrayCellDetails);
  //Based on live cell count, modifies cell state according to Conway GOL rules
  for (let i = 0; i < arrayCellDetails.length; i++) {
    if (arrayCellDetails[i].state === ALIVE) {
      if (
        arrayCellDetails[i].surrLiveCells < 2 ||
        arrayCellDetails[i].surrLiveCells > 3
      ) {
        gamePlayArr[arrayCellDetails[i].xCoor][
          arrayCellDetails[i].yCoor
        ] = DEAD;
      }
    } else if (arrayCellDetails[i].state === DEAD) {
      if (arrayCellDetails[i].surrLiveCells === 3) {
        gamePlayArr[arrayCellDetails[i].xCoor][
          arrayCellDetails[i].yCoor
        ] = ALIVE;
      }
    }
  }
  // console.log(gamePlayArr);
  printGamePlayArray();
  //sets interval that playGame function is triggered and cells change state
  if (timer === 0) {
    timer = setInterval(playGame, 500);
  }
}

//Clears interval and freezes game board, allowing player to change cell configuration
function endGame() {
  if (timer !== 0) {
    clearInterval(timer);
    timer = 0;
  }
  gameProgressState = false;
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
