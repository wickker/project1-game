//Global variables
let gamePlayArr = [];
let boardSize = 10;
let gameProgressState = false;

//DOM get variables
let gameBoardDiv = document.getElementById("game-board");
let startButtonSelector = document.querySelector("#start-button button");

//Initialize empty game board
function initGameBoard() {
  for (let x = 0; x < boardSize; x++) {
    gamePlayArr.push([]);
    for (let y = 0; y < boardSize; y++) {
      gamePlayArr[x].push("dead");
      let newCell = document.createElement("div");
      newCell.className = "cell";
      newCell.classList.add("dead");
      newCell.id = x + "-" + y;
      newCell.style.height = 450 / boardSize + "px";
      newCell.style.width = 450 / boardSize + "px";
      newCell.addEventListener("click", playerSetUp);
      gameBoardDiv.appendChild(newCell);
    }
  }
  startButtonSelector.addEventListener("click", playGame);
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
    if (arrayLiveCellCount[i][2] === "alive") {
      if (arrayLiveCellCount[i][3] < 2 || arrayLiveCellCount[i][3] > 3) {
        gamePlayArr[arrayLiveCellCount[i][0]][arrayLiveCellCount[i][1]] =
          "dead";
      }
    } else if (arrayLiveCellCount[i][2] === "dead") {
      if (arrayLiveCellCount[i][3] === 3) {
        gamePlayArr[arrayLiveCellCount[i][0]][arrayLiveCellCount[i][1]] =
          "alive";
      }
    }
  }
  // //Modifies edge cell state
  // for (let i = 0; i < boardSize; i++) {
  //   for (let z = 0; z < boardSize; z++) {
  //     if (i === 0 || z === 0 || i === boardSize - 1 || z === boardSize - 1) {
  //       if (gamePlayArr[i][z] === "alive") {
  //         gamePlayArr[i][z] = "dead";
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
      if (gamePlayArr[x][y] === "alive") {
        document.getElementById(cellId).classList.remove("dead");
        document.getElementById(cellId).classList.add("alive");
      } else {
        document.getElementById(cellId).classList.remove("alive");
        document.getElementById(cellId).classList.add("dead");
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
    if (checkingArray[i] === "alive") {
      aliveCells++;
    }
  }
  return aliveCells;
}

initGameBoard();
