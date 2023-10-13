import { randomColor } from "../utils/index.js";

const startGameButton = document.getElementById("startGame");
const gameState = document.getElementById("gameState");

const canvas = document.getElementById("canvas");
const ball = document.getElementById("ball");
const player1Hole = document.getElementById("player1Hole");
const player2Hole = document.getElementById("player2Hole");
const player1Paddle = document.getElementById("player1Paddle");
const player2Paddle = document.getElementById("player2Paddle");

const gameScoreBoard = document.getElementById("gameScoreBoard");

const player1Won = document.getElementById("player1Won");
const player1Lost = document.getElementById("player1Lost");

const player2Won = document.getElementById("player2Won");
const player2Lost = document.getElementById("player2Lost");

const BALL_WIDTH = 32;
const PADDLE_WIDTH = BALL_WIDTH / 2;
const PADDLE_HEIGHT = canvas.getBoundingClientRect().height * 0.2;
const HOLE_HEIGHT = PADDLE_HEIGHT * 2;
const GAP_BETWEEN_HOLE_AND_PADDLE = 32;
const DISTANCE_BETWEEN_CANVAS_AND_PADDLE = 16;

const randomFloat = (min, max) => {
  // generate a random number within the given range
  return Math.random() * (max - min) + min;
};
const randomNumber = (min, max) => {
  // generate a random number within the given range
  return Math.round(randomFloat(min, max));
};

const randomSign = () => {
  return randomNumber(-1, 1) > 0 ? 1 : -1;
};

const randomAngle = () => {
  return randomFloat((30 * Math.PI) / 180, (50 * Math.PI) / 180);
};

let difficultyLevel = 0.5;
const getSpeed = () => {
  if (difficultyLevel === -1 || difficultyLevel === 3) return randomFloat(1, 3);
  return difficultyLevel;
};
const getAngle = () => {
  if (difficultyLevel === -1) return randomAngle();
  return 40;
};

let speed = getSpeed();
let angle = getAngle();
let isGameRunning = false;

const lastCoord = {
  x: (canvas.getBoundingClientRect().width - BALL_WIDTH) / 2,
  y: (canvas.getBoundingClientRect().height - BALL_WIDTH) / 2,
};

const player1HoleCoords = {
  x: 0,
  y: (canvas.getBoundingClientRect().height - HOLE_HEIGHT) / 2,
};

const player2HoleCoords = {
  x: canvas.getBoundingClientRect().width - 1,
  y: (canvas.getBoundingClientRect().height - HOLE_HEIGHT) / 2,
};

const DEFAULT_PLAYER1_PADDLE_COORDS = {
  x: GAP_BETWEEN_HOLE_AND_PADDLE,
  y: (canvas.getBoundingClientRect().height - PADDLE_HEIGHT) / 2,
};

const player1PaddleCoords = {
  ...DEFAULT_PLAYER1_PADDLE_COORDS,
};

const DEFAULT_PLAYER2_PADDLE_COORDS = {
  x:
    canvas.getBoundingClientRect().width -
    GAP_BETWEEN_HOLE_AND_PADDLE -
    PADDLE_WIDTH,
  y: (canvas.getBoundingClientRect().height - PADDLE_HEIGHT) / 2,
};

const player2PaddleCoords = {
  ...DEFAULT_PLAYER2_PADDLE_COORDS,
};

let signX = randomSign();
let signY = randomSign();

let matchScores = [
  {
    player1: {
      score: [],
      won: 0,
      loose: 0,
    },
    player2: {
      score: [],
      won: 0,
      loose: 0,
    },
    won: "",
  },
];

const getComputedCounts = () => {
  return matchScores.reduce(
    (acc, curr) => {
      if (curr.won === "1") {
        acc.player1.won += 1;
        acc.player2.loose += 1;
      } else if (curr.won === "2") {
        acc.player1.loose += 1;
        acc.player2.won += 1;
      }
      return acc;
    },
    {
      player1: {
        won: 0,
        loose: 0,
      },
      player2: {
        won: 0,
        loose: 0,
      },
    }
  );
};

const updateScoreBoard = () => {
  let gameScoreBoardHtml = "";

  ["player1", "player2"].forEach((player, i) => {
    const scores =
      matchScores[matchScores.length - 1][player].score.join("</td><td>");
    gameScoreBoardHtml += `<tr>
	<td>Player ${i + 1}</td>
	${scores?.length > 0 ? `<td>${scores}</td>` : ""}
	</tr>`;
  });

  gameScoreBoard.innerHTML = gameScoreBoardHtml;

  const { player1, player2 } = getComputedCounts();
  player1Won.innerText = player1.won;
  player1Lost.innerText = player1.loose;

  player2Won.innerText = player2.won;
  player2Lost.innerText = player2.loose;
};
const setupHole = () => {
  player1Hole.style.height = `${HOLE_HEIGHT}px`;
  player1Hole.style.left = `${player1HoleCoords.x}px`;
  player1Hole.style.top = `${player1HoleCoords.y}px`;

  player2Hole.style.height = `${HOLE_HEIGHT}px`;
  player2Hole.style.left = `${player2HoleCoords.x}px`;
  player2Hole.style.top = `${player2HoleCoords.y}px`;
};

const updatePaddles = () => {
  player1Paddle.style.height = `${PADDLE_HEIGHT}px`;
  player1Paddle.style.width = `${PADDLE_WIDTH}px`;
  player1Paddle.style.left = `${player1PaddleCoords.x}px`;
  player1Paddle.style.top = `${player1PaddleCoords.y}px`;

  player2Paddle.style.height = `${PADDLE_HEIGHT}px`;
  player2Paddle.style.width = `${PADDLE_WIDTH}px`;
  player2Paddle.style.left = `${player2PaddleCoords.x}px`;
  player2Paddle.style.top = `${player2PaddleCoords.y}px`;
};

let interval;

const onMatchEnd = () => {
  isGameRunning = false;
  gameState.innerText = "Paused";
  startGameButton.style.display = "block";
  matchScores = [
    {
      player1: {
        score: [],
        won: 0,
        loose: 0,
      },
      player2: {
        score: [],
        won: 0,
        loose: 0,
      },
      won: "",
    },
  ];
};

const onGameEnd = () => {
  matchScores.push({
    player1: {
      score: [],
      won: 0,
      loose: 0,
    },
    player2: {
      score: [],
      won: 0,
      loose: 0,
    },
    won: "",
  });

  const { player1, player2 } = getComputedCounts();
  if (matchScores.length >= 3) {
    if (player1.won >= 3) {
      alert("Player 1 won");
      onMatchEnd();
      return;
    } else if (player2.won >= 3) {
      alert("Player 2 won");
      onMatchEnd();
      return;
    }
  }

  startGame();
};

const onRoundEnd = (player) => {
  clearInterval(interval);

  const [player1Result, player2Result] =
    player === "1" ? ["L", "W"] : ["W", "L"];

  const currentMatch = matchScores[matchScores.length - 1];

  currentMatch.player1.score.push(player1Result);
  currentMatch.player2.score.push(player2Result);

  currentMatch.player1.won += 1 * (player1Result === "L" ? 0 : 1);
  currentMatch.player1.loose += 1 * (player1Result === "W" ? 0 : 1);

  currentMatch.player2.won += 1 * (player2Result === "L" ? 0 : 1);
  currentMatch.player2.loose += 1 * (player2Result === "W" ? 0 : 1);

  if (currentMatch.player1.won >= 6 && currentMatch.player2.won >= 6) {
    if (Math.abs(currentMatch.player1.won - currentMatch.player2.won) >= 2) {
      if (currentMatch.player1.won > currentMatch.player2.won) {
        currentMatch.won = "1";
      } else {
        currentMatch.won = "2";
      }
      onGameEnd();
    }
  } else if (currentMatch.player1.won + currentMatch.player2.won >= 7) {
    if (currentMatch.player1.won > currentMatch.player2.won) {
      currentMatch.won = "1";
      onGameEnd();
    } else {
      currentMatch.won = "2";
      onGameEnd();
    }
  } else {
    startGame();
  }

  updateScoreBoard();
};

const randomize = () => {
  speed = getSpeed();
  angle = getAngle();
};

const didTouchXCorner = () => {
  if (
    lastCoord.x <= player1HoleCoords.x &&
    lastCoord.y + BALL_WIDTH >= player1HoleCoords.y &&
    lastCoord.y + BALL_WIDTH <= player1HoleCoords.y + HOLE_HEIGHT
  ) {
    onRoundEnd("1");
    return false;
  }

  if (
    lastCoord.x + BALL_WIDTH >= player2HoleCoords.x &&
    lastCoord.y + BALL_WIDTH >= player2HoleCoords.y &&
    lastCoord.y + BALL_WIDTH <= player2HoleCoords.y + HOLE_HEIGHT
  ) {
    onRoundEnd("2");
    return false;
  }

  if (
    lastCoord.x <= player1PaddleCoords.x + PADDLE_WIDTH &&
    lastCoord.y + BALL_WIDTH >= player1PaddleCoords.y &&
    lastCoord.y <= player1PaddleCoords.y + PADDLE_HEIGHT
  ) {
    randomize();
    return true;
  }
  if (
    lastCoord.x + BALL_WIDTH >= player2PaddleCoords.x &&
    lastCoord.y + BALL_WIDTH >= player2PaddleCoords.y &&
    lastCoord.y <= player2PaddleCoords.y + PADDLE_HEIGHT
  ) {
    randomize();
    return true;
  }

  if (
    lastCoord.x >= canvas.getBoundingClientRect().width - BALL_WIDTH ||
    lastCoord.x <= 0
  ) {
    return true;
  }

  return false;
};

const resetPaddles = () => {
  player1PaddleCoords.y = DEFAULT_PLAYER1_PADDLE_COORDS.y;
  player2PaddleCoords.y = DEFAULT_PLAYER2_PADDLE_COORDS.y;
  updatePaddles();
};

const onKeyPress = (event) => {
  if (event.keyCode === 32) {
    if (isGameRunning) {
      clearInterval(interval);
      isGameRunning = false;
      gameState.innerText = "Paused";
    } else {
      resumeGame();
    }
    return;
  }
  if (!isGameRunning) return;
  if (event.keyCode == "38") {
    // up arrow
    player2PaddleCoords.y -= 20;
  } else if (event.keyCode == "40") {
    // down arrow
    player2PaddleCoords.y += 20;
  } else {
    const char = String.fromCharCode(
      event.keyCode || event.which
    )?.toLowerCase();
    if (char == "w") {
      player1PaddleCoords.y -= 20;
    } else if (char == "s") {
      player1PaddleCoords.y += 20;
    }
  }

  player1PaddleCoords.y = Math.min(
    canvas.getBoundingClientRect().height -
      DISTANCE_BETWEEN_CANVAS_AND_PADDLE -
      PADDLE_HEIGHT,
    Math.max(player1PaddleCoords.y, DISTANCE_BETWEEN_CANVAS_AND_PADDLE)
  );
  player2PaddleCoords.y = Math.min(
    canvas.getBoundingClientRect().height -
      DISTANCE_BETWEEN_CANVAS_AND_PADDLE -
      PADDLE_HEIGHT,
    Math.max(player2PaddleCoords.y, DISTANCE_BETWEEN_CANVAS_AND_PADDLE)
  );
  updatePaddles();
};

const attackGameControls = () => {
  document.body.addEventListener("keydown", onKeyPress);
};

const resumeGame = () => {
  isGameRunning = true;
  gameState.innerText = "Active";
  startGameButton.style.display = "none";

  interval = setInterval(() => {
    if (didTouchXCorner()) {
      signX *= -1;
    }
    if (
      lastCoord.y >= canvas.getBoundingClientRect().height - BALL_WIDTH ||
      lastCoord.y <= 0
    ) {
      signY *= -1;
    }

    lastCoord.x += speed * signX * Math.cos(angle);
    lastCoord.y += speed * signY * Math.sin(angle);

    ball.style.left = `${lastCoord.x}px`;
    ball.style.top = `${lastCoord.y}px`;
  }, 0.01);
  updateScoreBoard();
};
const startGame = () => {
  lastCoord.x = (canvas.getBoundingClientRect().width - BALL_WIDTH) / 2;
  lastCoord.y = (canvas.getBoundingClientRect().height - BALL_WIDTH) / 2;
  resetPaddles();
  resumeGame();
};

const init = () => {
  setupHole();
  updatePaddles();
  ball.style.left = `${lastCoord.x}px`;
  ball.style.top = `${lastCoord.y}px`;

  attackGameControls();
};

init();

startGameButton.onclick = () => {
  startGame();
};

document.getElementById("difficultyLevel").onchange = (event) => {
  event.target.blur();
  difficultyLevel = parseInt(event.target.value);
  randomize();
};
