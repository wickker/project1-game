//Global variables
let boardSizeDimension = 600;
let targetFormDimension = 300;
let gamePlayArr = [];
let targetFormArr = [];
let boardSize = 10;
let currentBoardSize;
let gameProgressState = false;
const ALIVE = "alive";
const DEAD = "dead";
let timer = 0;
// let qnsBank = {};
// let qnsClickCount = 1;
// let qnsId = 1;
let qnsProgressState = false;
let totalQns = 6;
let qnsText = {
  q1: "test 1",
  q2: "test 2",
  q3: "test 3",
  q4: "test 4",
  q5: "test 5",
  q6: "test 6"
};
let winMsg = "You found a match!";

//DOM GET variables
const gameBoardDiv = document.getElementById("game-board");
const startButtonSelector = document.querySelector("#start-button button");
const endButtonSelector = document.querySelector("#end-button button");
const clearButtonSelector = document.querySelector("#clear-button button");
const saveButtonSelector = document.querySelector("#save-button button");
const questionBank = puzzles;
const targetFormDiv = document.getElementById("target-form-board");
const qnsTextSelector = document.getElementById("qns-text");
const winMsgSelector = document.getElementById("win-msg");

//Initialize empty game board
function initGameBoard(size) {
  for (let x = 0; x < size; x++) {
    gamePlayArr.push([]);
    for (let y = 0; y < size; y++) {
      gamePlayArr[x].push(DEAD);
      let newCell = document.createElement("div");
      newCell.className = "cell";
      newCell.classList.add(DEAD);
      newCell.id = x + "-" + y;
      newCell.style.height = boardSizeDimension / size + "px";
      newCell.style.width = boardSizeDimension / size + "px";
      newCell.addEventListener("click", playerSetUp);
      gameBoardDiv.appendChild(newCell);
    }
  }
  startButtonSelector.addEventListener("click", playGame);
  endButtonSelector.addEventListener("click", endGame);
  clearButtonSelector.addEventListener("click", clearBoard);
}

//Initialize question buttons
function initQuestionButton() {
  for (let i = 1; i < totalQns + 1; i++) {
    let qnsSelector = document.getElementById("q" + i);
    qnsSelector.addEventListener("click", loadQns);
  }
}

function loadQns(event) {
  if (qnsProgressState === true) {
    gameBoardDiv.innerHTML = "";
    targetFormDiv.innerHTML = "";
    winMsgSelector.innerHTML = "";
    gamePlayArr = [];
    targetFormArr = [];
    qnsProgressState = false;
  }
  let qnsNum = parseInt(event.target.id.slice(-1));
  console.log(qnsNum);
  currentBoardSize = questionBank[qnsNum].boardSize;
  console.log(currentBoardSize);
  qnsTextSelector.textContent = qnsText[event.target.id];
  initGameBoard(currentBoardSize);
  printAndPushArrayToGameBoard(questionBank[qnsNum].puzzle);
  loadTargetForm(qnsNum);
  qnsProgressState = true;
}

function checkWin() {
  for (let x = 0; x < currentBoardSize; x++) {
    for (let y = 0; y < currentBoardSize; y++) {
      if (gamePlayArr[x][y] !== targetFormArr[x][y]) {
        return false;
      }
    }
  }
  return true;
}

//Loads target form pattern on DOM and global array depending on selected question number; players may not ammend this pattern
function loadTargetForm(num) {
  for (let x = 0; x < questionBank[num].boardSize; x++) {
    targetFormArr.push([]);
    for (let y = 0; y < questionBank[num].boardSize; y++) {
      let newCell = document.createElement("div");
      newCell.className = "cell";
      newCell.id = "target-" + x + "-" + y;
      newCell.style.height = targetFormDimension / questionBank[num].boardSize + "px";
      newCell.style.width = targetFormDimension / questionBank[num].boardSize + "px";
      if (questionBank[num].finalForm[x][y] === ALIVE) {
        newCell.classList.add(ALIVE);
        targetFormArr[x].push(ALIVE);
      } else {
        newCell.classList.add(DEAD);
        targetFormArr[x].push(DEAD);
      }
      targetFormDiv.appendChild(newCell);
    }
  }
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
  for (let x = 0; x < currentBoardSize; x++) {
    for (let y = 0; y < currentBoardSize; y++) {
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
      if (arrayCellDetails[i].surrLiveCells < 2 || arrayCellDetails[i].surrLiveCells > 3) {
        gamePlayArr[arrayCellDetails[i].xCoor][arrayCellDetails[i].yCoor] = DEAD;
      }
    } else if (arrayCellDetails[i].state === DEAD) {
      if (arrayCellDetails[i].surrLiveCells === 3) {
        gamePlayArr[arrayCellDetails[i].xCoor][arrayCellDetails[i].yCoor] = ALIVE;
      }
    }
  }
  // console.log(gamePlayArr);
  printArrayToGameBoard(gamePlayArr);
  //sets interval that playGame function is triggered and cells change state
  if (timer === 0) {
    timer = setInterval(playGame, 1000);
  }
  if (checkWin()) {
    endGame();
    winMsgSelector.textContent = winMsg;
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

function clearBoard(event) {
  if (gameProgressState === true) {
    gameProgressState = false;
  }
  gameBoardDiv.innerHTML = "";
  gamePlayArr = [];
  winMsgSelector.innerHTML = "";
  initGameBoard(currentBoardSize);
}

//Prints current gamePlayArr to DOM
function printArrayToGameBoard(arrayName) {
  for (let x = 0; x < currentBoardSize; x++) {
    for (let y = 0; y < currentBoardSize; y++) {
      let cellId = x + "-" + y;
      //console.log(cellId);
      if (arrayName[x][y] === ALIVE) {
        document.getElementById(cellId).classList.remove(DEAD);
        document.getElementById(cellId).classList.add(ALIVE);
      } else {
        document.getElementById(cellId).classList.remove(ALIVE);
        document.getElementById(cellId).classList.add(DEAD);
      }
    }
  }
}

function printAndPushArrayToGameBoard(arrayName) {
  for (let x = 0; x < currentBoardSize; x++) {
    for (let y = 0; y < currentBoardSize; y++) {
      let cellId = x + "-" + y;
      //console.log(cellId);
      if (arrayName[x][y] === ALIVE) {
        document.getElementById(cellId).classList.remove(DEAD);
        document.getElementById(cellId).classList.add(ALIVE);
        gamePlayArr[x][y] = ALIVE;
      } else {
        document.getElementById(cellId).classList.remove(ALIVE);
        document.getElementById(cellId).classList.add(DEAD);
        gamePlayArr[x][y] = DEAD;
      }
    }
  }
}

//Modifies x coordinate if on the edge
function getX(x) {
  if (x === -1) {
    x = currentBoardSize - 1;
  } else if (x === currentBoardSize) {
    x = 0;
  }
  return x;
}

//Modifies y coordinate if on the edge
function getY(y) {
  if (y === -1) {
    y = currentBoardSize - 1;
  } else if (y === currentBoardSize) {
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

initQuestionButton();

// function saveGameForQns() {
//   if (gameProgressState === false) {
//     if (qnsClickCount === 1) {
//       qnsBank[qnsId] = {};
//       qnsBank[qnsId].answer = JSON.parse(JSON.stringify(gamePlayArr));
//       qnsClickCount++;
//     }
//     else if (qnsClickCount === 2) {
//       qnsBank[qnsId].puzzle = JSON.parse(JSON.stringify(gamePlayArr));
//       qnsClickCount++;
//     }
//     else if (qnsClickCount === 3) {
//       console.log(gamePlayArr);
//       qnsBank[qnsId].finalForm = JSON.parse(JSON.stringify(gamePlayArr));
//       qnsClickCount++;
//     }
//     else if (qnsClickCount === 4) {
//       qnsBank[qnsId].boardSize = boardSize;
//       qnsClickCount = 1;
//       qnsId++;
//     }
//   }
//   console.log(qnsBank);
//   localStorage.setItem("GOLQnsBank", JSON.stringify(qnsBank));
// }
