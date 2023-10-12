import { randomNumber, randomizePosition } from "../utils/index.js";

const emojis = ["🤪", "🫡", "🫠", "😃", "😄", "😕", "🙁", "😜"];
const SIZE = emojis.length / 2;

const gameBoard = document.getElementById("gameBoard");
const attemptsBoard = document.getElementById("attempts-board");
const scoreBoard = document.getElementById("score-board");
const restart = document.getElementById("restart");
const time = document.getElementById("time");
const movesEl = document.getElementById("moves");

let currentGameEmojis = [...emojis, ...emojis];
let gameStartedAt;

let moves = 0;

const scores = [
  {
    moves: 9,
    time: 100,
    finished: true,
  },
  {
    moves: 10,
    time: 100,
    finished: false,
  },
  {
    moves: 10,
    time: 100,
    finished: true,
  },
  {
    moves: 112,
    time: 100,
    finished: true,
  },
  {
    moves: 9,
    time: 99,
    finished: true,
  },
];

const generateNewPuzzle = () => {
  currentGameEmojis = randomizePosition(currentGameEmojis);
};

let didGameStart = false;
const startGame = () => {
  generateNewPuzzle();
  didGameStart = false;
  const gameBoardNumberHtml = currentGameEmojis.map((puzzleEmoji, index) => {
    return `${
      index % SIZE === 0 ? "<div class='row'>" : ""
    }<div class="puzzle-emoji" id="puzzle-${puzzleEmoji}"  data-emoji="${puzzleEmoji}"><span>${puzzleEmoji}</span></div>${
      (index + 1) % SIZE === 0 ? "</div>" : ""
    }`;
  });

  gameBoard.innerHTML = `<div class="puzzle-wrapper"><div class="puzzle" id="puzzle">${gameBoardNumberHtml.join(
    ""
  )}</div></div>`;
};

startGame();

let lastClicked;
let lastClickTimer;
const columnSelector = ".puzzle-emoji";
document.querySelectorAll(columnSelector).forEach((el) => {
  el.onclick = function () {
    if (!lastClicked) {
      lastClicked = this;
      lastClickTimer = setTimeout(() => {
        this.classList.remove("show");
        lastClicked = null;
        lastClickTimer = null;
      }, 3000);
      this.classList.toggle("show");
    } else {
      this.classList.toggle("show");
      clearTimeout(lastClickTimer);
      if (lastClicked.dataset.emoji === this.dataset.emoji) {
        lastClicked.classList.add("correct");
        this.classList.add("correct");
      } else {
        lastClicked.classList.add("incorrect");
        this.classList.add("incorrect");
      }
      lastClickTimer = null;
      const cloned = lastClicked;
      lastClicked = null;
      onBothOpened();
      setTimeout(() => {
        if (cloned.dataset.emoji === this.dataset.emoji) {
          //   cloned.classList.add("correct");
          //   this.classList.add("correct");
        } else {
          this.classList.remove("show");
          cloned.classList.remove("show");
        }
        cloned.classList.remove("incorrect");
        this.classList.remove("incorrect");
      }, 1000);
    }
    if (!didGameStart) {
      onGameStarted();
    }
  };
});

const updateCurrentGameEmojis = () => {
  currentGameEmojis = Array.from(document.querySelectorAll(columnSelector)).map(
    (el) => parseInt(el.dataset.number)
  );
};

const onBothOpened = () => {
  moves++;
  movesEl.innerHTML = moves;

  if (isGameWon()) {
    onGameEnd();
  }
};

let timer;
const updateStats = () => {
  time.innerText = Math.floor(
    (new Date().valueOf() - gameStartedAt.valueOf()) / 1000
  );
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
  if (gameStartedAt)
    scores.unshift({
      moves,
      time: Math.floor((new Date().valueOf() - gameStartedAt.valueOf()) / 1000),
      finished: !!finished,
    });
  gameStartedAt = null;
  moves = 0;
  updateScoreBoard();
  clearInterval(timer);
};

const isGameWon = () => {
  return (
    document.querySelectorAll(columnSelector).length ===
    document.querySelectorAll(columnSelector + ".correct").length
  );
};

const getScores = (printScores) => {
  if (printScores.length > 0)
    return printScores
      .map(({ moves, time, finished }) => {
        return `<tr>
            <td class="${!finished ? "unfinished" : ""}">
			Time: ${time},
			Moves: ${moves}
			</td>
          </tr>`;
      })
      .join("");
  else
    return `<tr>
            <td>No Record</td>
          </tr>`;
};

const updateScoreBoard = () => {
  attemptsBoard.innerHTML = getScores(scores);
  const sortedScores = JSON.parse(JSON.stringify(scores))
    .filter(({ finished }) => finished)
    .sort(
      (
        { time: aTime, moves: aMoves, finished: aFinished },
        { time: bTime, moves: bMoves, finished: bFinished }
      ) => {
        if (bTime > aTime) {
          return -1;
        }
        if (bTime < aTime) {
          return 1;
        }
        if (bMoves > aMoves) {
          return -1;
        }
        if (bMoves < aMoves) {
          return 1;
        }
        return 0;
      }
    );
  scoreBoard.innerHTML = getScores(sortedScores);
};

restart.onclick = () => onGameEnd(false);

updateScoreBoard();
