//Global variables
let speed = 1000;
let boardSizeDimension = 600;
let targetFormDimension = 300;
let gamePlayArr = [];
let targetFormArr = [];
let boardSize = 30;
let currentBoardSize;
let gameProgressState = false;
const ALIVE = "alive";
const DEAD = "dead";
let timer = 0;
let generationCount = 0;
const questionBank = puzzles;
let savedGame2DArr = JSON.parse(window.localStorage.getItem("savedGames")) || [];
let gameName;
let highScore = JSON.parse(window.localStorage.getItem("highScore")) || 0;
// let qnsBank = {};
// let qnsClickCount = 1;
// let qnsId = 1;
let qnsProgressState = false;
let totalQns = 6;
let gameModeState = "puz";
const sandBoxPrompt = "Challenge yourself by creating a constantly evolving cell culture!";
const qnsText = {
  q1:
    "Reach the target form in 2 clicks and 1 generation. <br><br> Each click can change dead (i.e. white) cells to live (i.e. black) cells or vice versa. <br><br> Press 'start game' when you are ready to simulate the generations.",
  q2:
    "Reach the target form in 2 clicks and 1 generation. <br><br> Each click can change dead (i.e. white) cells to live (i.e. black) cells or vice versa. <br><br> Press 'start game' when you are ready to simulate the generations.",
  q3:
    "Reach the target form in 2 clicks and 4 generations. <br><br> Each click can change dead (i.e. white) cells to live (i.e. black) cells or vice versa. <br><br> Press 'start game' when you are ready to simulate the generations.",
  q4:
    "Reach the target form in 2 clicks and 4 generations. <br><br> Each click can change dead (i.e. white) cells to live (i.e. black) cells or vice versa. <br><br> Press 'start game' when you are ready to simulate the generations.",
  q5:
    "Reach the target form in 4 clicks and 2 generations. <br><br> Each click can change dead (i.e. white) cells to live (i.e. black) cells or vice versa. <br><br> Press 'start game' when you are ready to simulate the generations.",
  q6:
    "Reach the target form in 2 clicks and 5 generations. <br><br> Each click can change dead (i.e. white) cells to live (i.e. black) cells or vice versa. <br><br> Press 'start game' when you are ready to simulate the generations."
};
let winMsg = "You found a match!";

//DOM GET variables
const gameBoardDiv = document.getElementById("game-board");
const startButtonSelector = document.querySelector("#start-button button");
const endButtonSelector = document.querySelector("#end-button button");
const clearButtonSelector = document.querySelector("#clear-button button");
const saveButtonSelector = document.querySelector("#save-button button");
const targetFormDiv = document.getElementById("target-form-board");
const qnsTextSelector = document.getElementById("qns-text");
const winMsgSelector = document.getElementById("win-msg");
const genCountNumSelector = document.getElementById("gen-count-num");
const modeButtonSelector = document.querySelector("#toggle-button button");
const gameModeSpan = document.getElementById("mode");
const savedGamesDiv = document.getElementById("saved-games");
const randomBoardSelector = document.querySelector("#random-board-button button");

function changeMode(event) {
  generationCount = 0;
  displayGenCount();
  //Change game mode to SANDBOX
  if (gameModeState === "puz") {
    gameModeState = "sandbox";
    gameModeSpan.textContent = "Sandbox";
    let puzElements = document.getElementsByClassName("puz");
    for (let i = 0; i < puzElements.length; i++) {
      puzElements[i].classList.add("hidden");
    }
    let sandBoxElements = document.getElementsByClassName("sandbox");
    for (let z = 0; z < sandBoxElements.length; z++) {
      sandBoxElements[z].classList.remove("hidden");
    }
    targetFormDiv.innerHTML = "";
    targetFormDimension = 0;
    targetFormDiv.style.height = targetFormDimension + "px";
    targetFormDiv.style.width = targetFormDimension + "px";
    boardSizeDimension = 700;
    gameBoardDiv.style.height = boardSizeDimension + "px";
    gameBoardDiv.style.width = boardSizeDimension + "px";
    document.getElementById("center").style.width = boardSizeDimension + "px";
    qnsTextSelector.textContent = sandBoxPrompt;
    clearBoardForSandBox();
    createAndDisplayAllSavedElements();
    if (highScore !== 0) {
      displayHighScoreAndClearButton();
    }
  } //Change game mode to PUZZLE
  else if (gameModeState === "sandbox") {
    gameModeState = "puz";
    gameModeSpan.textContent = "Puzzle";
    let sandBoxElements = document.getElementsByClassName("sandbox");
    for (let i = 0; i < sandBoxElements.length; i++) {
      sandBoxElements[i].classList.add("hidden");
    }
    let puzElements = document.getElementsByClassName("puz");
    for (let z = 0; z < puzElements.length; z++) {
      puzElements[z].classList.remove("hidden");
    }
    targetFormDimension = 300;
    targetFormDiv.style.height = targetFormDimension + "px";
    targetFormDiv.style.width = targetFormDimension + "px";
    boardSizeDimension = 600;
    gameBoardDiv.style.height = boardSizeDimension + "px";
    gameBoardDiv.style.width = boardSizeDimension + "px";
    document.getElementById("center").style.width = boardSizeDimension + "px";
    qnsTextSelector.textContent = "";
    savedGamesDiv.innerHTML = "";
    clearBoardForPuz();
  }
}

//Initialize empty game board - PUZZLE MODE
function initGameBoardPuz(size) {
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
  endButtonSelector.addEventListener("click", endGamePuz);
}

//Initialize empty game board - SANDBOX MODE
function initGameBoardSandBox(size) {
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
  currentBoardSize = size;
  speed = 1000;
  startButtonSelector.addEventListener("click", playGame);
  endButtonSelector.addEventListener("click", endGameSandBox);
  clearButtonSelector.addEventListener("click", clearBoardForSandBox);
  saveButtonSelector.addEventListener("click", saveGameForPlayer);
  randomBoardSelector.addEventListener("click", randomBoard);
  document.getElementById("dcr").addEventListener("click", decreaseSpeed);
  document.getElementById("inc").addEventListener("click", increaseSpeed);
}

//Initialize question buttons
function initQuestionButton() {
  for (let i = 1; i < totalQns + 1; i++) {
    let qnsSelector = document.getElementById("q" + i);
    qnsSelector.addEventListener("click", loadQns);
  }
  modeButtonSelector.addEventListener("click", changeMode);
  let sandBoxElements = document.getElementsByClassName("sandbox");
  for (let i = 0; i < sandBoxElements.length; i++) {
    sandBoxElements[i].classList.add("hidden");
  }
  let puzElements = document.getElementsByClassName("puz");
  for (let z = 0; z < puzElements.length; z++) {
    puzElements[z].classList.remove("hidden");
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
  qnsTextSelector.innerHTML = qnsText[event.target.id];
  initGameBoardPuz(currentBoardSize);
  printAndPushArrayToGameBoard(questionBank[qnsNum].puzzle);
  loadTargetForm(qnsNum);
  generationCount = 0;
  displayGenCount();
  qnsProgressState = true;
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
  // console.log(arrayCellDetails);
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
  generationCount++;
  // console.log(generationCount);
  displayGenCount();
  //sets interval that playGame function is triggered and cells change state
  if (timer === 0) {
    timer = setInterval(playGame, speed);
  }
  if (gameModeState === "puz") {
    if (checkWin()) {
      endGamePuz();
      winMsgSelector.textContent = winMsg;
    }
  }
  if (gameModeState === "sandbox") {
    if (generationCount > highScore) {
      highScore = generationCount;
      localStorage.setItem("highScore", JSON.stringify(highScore));
      console.log(highScore);
    }
  }
}

//Clears interval and freezes game board, allowing player to change cell configuration
function endGameSandBox() {
  if (timer !== 0) {
    clearInterval(timer);
    timer = 0;
  }
  displayHighScoreAndClearButton();
  gameProgressState = false;
}

function displayHighScoreAndClearButton() {
  document.querySelector("#highscore").innerHTML = "";
  let newH2 = document.createElement("h2");
  newH2.textContent = "Highest generation count: " + highScore;
  document.querySelector("#highscore").appendChild(newH2);
  let newBut = document.createElement("button");
  newBut.textContent = "CLEAR HIGHEST COUNT";
  newBut.addEventListener("click", clearHighScore);
  document.querySelector("#highscore").appendChild(newBut);
}

function endGamePuz() {
  if (timer !== 0) {
    clearInterval(timer);
    timer = 0;
  }
  generationCount = 0;
  gameProgressState = false;
}

function clearBoardForPuz() {
  if (gameProgressState === true) {
    gameProgressState = false;
  }
  gameBoardDiv.innerHTML = "";
  gamePlayArr = [];
  winMsgSelector.innerHTML = "";
  initQuestionButton();
}

function clearBoardForSandBox() {
  if (gameProgressState === true) {
    gameProgressState = false;
  }
  gameBoardDiv.innerHTML = "";
  gamePlayArr = [];
  winMsgSelector.innerHTML = "";
  generationCount = 0;
  displayGenCount();
  initGameBoardSandBox(boardSize);
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

//Copies puzzle configuration to gamePlayArr and then prints to DOM
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

function displayGenCount() {
  genCountNumSelector.innerHTML = generationCount;
}

function saveGameForPlayer() {
  let dataArr = [];
  dataArr.push(gamePlayArr);
  let newDate = new Date();
  gameName = prompt("Please name your file", newDate.getDate() + "-" + newDate.getMinutes());
  gameName = savedGame2DArr.length + ". " + gameName;
  dataArr.push(gameName);
  savedGame2DArr.push(dataArr);
  localStorage.setItem("savedGames", JSON.stringify(savedGame2DArr));
  createAndDisplayAllSavedElements();
}

function createAndDisplayAllSavedElements() {
  document.querySelector("#saved-games-header").textContent = "Saved patterns:";
  savedGamesDiv.innerHTML = "";
  if (savedGame2DArr.length > 0) {
    for (let i = 0; i < savedGame2DArr.length; i++) {
      let newGame = document.createElement("p");
      newGame.textContent = savedGame2DArr[i][1];
      newGame.id = savedGame2DArr[i][1];
      newGame.classList.add("sandbox");
      newGame.classList.add("savedgamelist");
      newGame.addEventListener("click", loadSavedGame);
      document.getElementById("saved-games").appendChild(newGame);
    }
    let clearButton = document.createElement("button");
    clearButton.textContent = "CLEAR ALL SAVED PATTERNS";
    clearButton.classList.add("sandbox");
    clearButton.addEventListener("click", clearAllSavedGames);
    document.getElementById("saved-games").appendChild(clearButton);
  }
}

function loadSavedGame(event) {
  let idArr = event.target.id.split(". ");
  let arrayIndex = parseInt(idArr[0]);
  printAndPushArrayToGameBoard(savedGame2DArr[arrayIndex][0]);
}

function clearAllSavedGames() {
  window.localStorage.removeItem("savedGames");
  savedGamesDiv.innerHTML = "";
}

function clearHighScore() {
  document.querySelector("#highscore").innerHTML = "";
  window.localStorage.removeItem("highScore");
  highScore = 0;
}

function randomBoard(event) {
  for (let x = 0; x < currentBoardSize; x++) {
    for (let y = 0; y < currentBoardSize; y++) {
      let cellId = x + "-" + y;
      let randomNum = Math.floor(Math.random() * 5);
      //console.log(cellId);
      if (randomNum === 2 || randomNum === 3) {
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

function increaseSpeed() {
  speed -= 200;
  console.log(speed);
  if (timer !== 0) {
    clearInterval(timer);
    timer = 0;
  }
  else if (timer === 0) {
    timer = setInterval(playGame, speed);
  }
}

function decreaseSpeed() {
  speed += 200;
  console.log(speed);
  if (timer !== 0) {
    clearInterval(timer);
    timer = 0;
  }
  else if (timer === 0) {
    timer = setInterval(playGame, speed);
  }
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
