import { randomNumber, randomizePosition } from "../utils/index.js";

const SIZE = 4;

const gameBoard = document.getElementById("gameBoard");
const scoreBoard = document.getElementById("score-board");
const restart = document.getElementById("restart");
const time = document.getElementById("time");
const movesEl = document.getElementById("moves");

const numbers = [...Array(SIZE * SIZE).keys()];

let currentGameNumbers = [...numbers];
let gameStartedAt = new Date();

let moves = 0;
const getAdjacentNumbers = () => {
  const position = currentGameNumbers.indexOf(0);
  const row = Math.floor(position / SIZE);
  const col = position % SIZE;
  const adjacentNumbers = [];

  // Define the four possible directions: up, down, left, and right.
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
  ];

  for (const direction of directions) {
    const newRow = row + direction.row;
    const newCol = col + direction.col;

    // Check if the new row and column are within bounds.
    if (newRow >= 0 && newRow < SIZE && newCol >= 0 && newCol < SIZE) {
      const newPosition = newRow * SIZE + newCol;
      adjacentNumbers.push(currentGameNumbers[newPosition]);
    }
  }

  return adjacentNumbers;
};

let adjacentNumbers = getAdjacentNumbers();
const scores = [
  {
    moves: 10,
    time: 100,
    finished: true,
  },
  {
    moves: 10,
    time: 100,
    finished: false,
  },
];

const isSolvable = (puzzle) => {
  const size = Math.sqrt(puzzle.length);
  const flatPuzzle = puzzle.flat();
  let inversionCount = 0;

  for (let i = 0; i < flatPuzzle.length - 1; i++) {
    for (let j = i + 1; j < flatPuzzle.length; j++) {
      if (flatPuzzle[i] && flatPuzzle[j] && flatPuzzle[i] > flatPuzzle[j]) {
        inversionCount++;
      }
    }
  }

  // Find the row number of the blank tile.
  const blankIndex = flatPuzzle.indexOf(0);
  const blankRow = Math.floor(blankIndex / size) + 1; // Add 1 because row numbers start from 1.

  if (size % 2 === 1) {
    // For odd-sized grids, check if the inversion count is even.
    return inversionCount % 2 === 0;
  } else {
    // For even-sized grids, apply the rules based on blank tile position and inversion count.
    if (blankRow % 2 === 0) {
      return inversionCount % 2 === 1;
    } else {
      return inversionCount % 2 === 0;
    }
  }
};

const generateNewPuzzle = () => {
  do {
    currentGameNumbers = randomizePosition(numbers);
    adjacentNumbers = getAdjacentNumbers();
  } while (!isSolvable(currentGameNumbers));
};

let didGameStart = false;
const startGame = () => {
  generateNewPuzzle();
  didGameStart = false;
  const gameBoardNumberHtml = currentGameNumbers.map((puzzleNumber, index) => {
    return `${index % SIZE === 0 ? "<div class='row'>" : ""}<div class="${
      puzzleNumber === 0 ? "empty" : ""
    } draggable" id="puzzle-${puzzleNumber}"  data-number="${puzzleNumber}">${
      puzzleNumber === 0 ? "" : puzzleNumber
    }</div>${(index + 1) % SIZE === 0 ? "</div>" : ""}`;
  });

  gameBoard.innerHTML = `<div class="puzzle-wrapper"><div class="puzzle" id="puzzle">${gameBoardNumberHtml.join(
    ""
  )}</div></div>`;
};

startGame();

var columnSelector = ".draggable";
var dragSource;

const attachDragListeners = () => {
  console.log(document.querySelectorAll(columnSelector));
  document.querySelectorAll(columnSelector).forEach((col) => {
    col.removeEventListener("dragstart", handleDragStart, false);
    col.removeEventListener("dragenter", handleDragEnter, false);
    col.removeEventListener("dragover", handleDragOver, false);
    col.removeEventListener("dragleave", handleDragLeave, false);
    col.removeEventListener("drop", handleDrop, false);
    col.removeEventListener("dragend", handleDragEnd, false);
    col.setAttribute("draggable", "false");

    if (
      adjacentNumbers.includes(parseInt(col.dataset.number)) ||
      col.dataset.number === "0"
    ) {
      col.addEventListener("dragstart", handleDragStart, false);
      col.addEventListener("dragenter", handleDragEnter, false);
      col.addEventListener("dragover", handleDragOver, false);
      col.addEventListener("dragleave", handleDragLeave, false);
      col.addEventListener("drop", handleDrop, false);
      col.addEventListener("dragend", handleDragEnd, false);
      col.setAttribute("draggable", "true");
    }
  });
};

function handleDragStart(evt) {
  dragSource = this;
  evt.target.classList.add("dragging");
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("text", this.id);
}

function handleDragOver(evt) {
  evt.dataTransfer.dropEffect = "move";
  evt.preventDefault();
}

function handleDragEnter(evt) {
  if (dragSource !== this) {
    this.classList.add("over");
  }
}

function handleDragLeave(evt) {
  this.classList.remove("over");
}

function handleDrop(evt) {
  evt.stopPropagation();

  if (dragSource !== this) {
    const clone = document
      .getElementById(evt.dataTransfer.getData("text"))
      .cloneNode(true);
    dragSource.replaceWith(this.cloneNode(true));
    this.replaceWith(clone);
    onSwapped();
  }

  evt.preventDefault();
}

function handleDragEnd(evt) {
  document.querySelectorAll(columnSelector).forEach((col) => {
    ["over", "dragging"].forEach(function (className) {
      col.classList.remove(className);
    });
  });
  updateCurrentGameNumbers();
  attachDragListeners();
}

const updateCurrentGameNumbers = () => {
  currentGameNumbers = Array.from(
    document.querySelectorAll(columnSelector)
  ).map((el) => parseInt(el.dataset.number));
  adjacentNumbers = getAdjacentNumbers();
};

attachDragListeners();

const onSwapped = () => {
  moves++;
  movesEl.innerHTML = moves;

  if (isGameWon()) {
    onGameEnd();
  }

  if (!didGameStart) {
    onGameStarted();
  }
};

let timer;
const updateStats = () => {
  time.innerText = gameStartedAt
    ? Math.floor((new Date().valueOf() - gameStartedAt.valueOf()) / 1000)
    : 0;
  movesEl.innerHTML = moves;
};
const onGameStarted = () => {
  didGameStart = true;
  gameStartedAt = new Date();
  updateStats();
  timer = setInterval(updateStats, 1000);
};

const onGameEnd = (finished = true) => {
  const gameEndAt = new Date();
  scores.unshift({
    moves,
    time: Math.floor((new Date().valueOf() - gameStartedAt.valueOf()) / 1000),
    finished: !!finished,
  });
  moves = 0;
  updateStats();
  updateScoreBoard();
  clearInterval(timer);
};

const isGameWon = () => {
  for (let i = 0; i < currentGameNumbers.length - 1; i++) {
    if (currentGameNumbers[i] !== i + 1) {
      return false;
    }
  }
};

const updateScoreBoard = () => {
  if (scores.length > 0)
    scoreBoard.innerHTML = scores
      .map(({ moves, time, finished }) => {
        return `<tr>
            <td class="${
              !finished ? "unfinished" : ""
            }">Moves: ${moves}, Time: ${time}</td>
          </tr>`;
      })
      .join("");
  else
    scoreBoard.innerHTML = `<tr>
            <td>No Record</td>
          </tr>`;
};

restart.onclick = () => onGameEnd(false);

updateScoreBoard();
