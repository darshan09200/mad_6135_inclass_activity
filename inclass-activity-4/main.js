import { randomNumber, randomizePosition } from "../utils/index.js";

const MAX_LIVES = 3;
const WORD_PER_LEVEL = 5;
const START_TIME = 15 * 1000;

const level1 = [
  "cat",
  "dog",
  "sun",
  "hat",
  "pen",
  "car",
  "sky",
  "bus",
  "box",
  "toy",
  "fox",
  "key",
  "jam",
  "nut",
  "lip",
];

const level2 = [
  "cake",
  "tree",
  "lamp",
  "moon",
  "book",
  "rose",
  "fish",
  "bird",
  "fork",
  "kite",
  "door",
  "song",
  "rain",
  "dice",
  "ring",
];

const level3 = [
  "apple",
  "chair",
  "dance",
  "earth",
  "grape",
  "happy",
  "jelly",
  "knife",
  "lemon",
  "music",
  "ocean",
  "piano",
  "queen",
  "snake",
  "table",
];

const level4 = [
  "banana",
  "camera",
  "dancer",
  "family",
  "guitar",
  "hidden",
  "jacket",
  "laptop",
  "mellow",
  "orange",
  "puzzle",
  "rocket",
  "school",
  "turtle",
  "window",
];

const levels = [level1, level2, level3, level4];

const scores = [];

let currentLevel = 1;
let lives = MAX_LIVES;
let wordsRemaining = WORD_PER_LEVEL;
let time = START_TIME;

let points = 0;

let timeoutRef;
let wordDroppingRef;

const gameBoard = document.getElementById("gameBoard");
const animatedWord = document.getElementById("animatedWord");
const livesEl = document.getElementById("lives");
const score = document.getElementById("score");
const scoreBoard = document.getElementById("score-board");
const restart = document.getElementById("restart");

class WordsForLevel {
  constructor(level) {
    this.level = level;
    this.words = randomizePosition(
      levels.slice(0, level).reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
      }, [])
    );
    if (currentLevel > 4) {
      this.words = this.words.map(randomizeCase);
    }
    if (currentLevel > 6) {
      this.words = this.words.map(randomizePosition);
    }
    this.previousWords = [];
  }
  pickRandomWord() {
    const randomizedWords = randomizePosition(this.words);
    const randomIndex = randomNumber(0, randomizedWords.length - 1);
    const chosenWord = randomizedWords[randomIndex];

    if (
      this.previousWords.indexOf(chosenWord) > -1 &&
      randomizedWords.length >= WORD_PER_LEVEL
    ) {
      return this.pickRandomWord();
    }
    this.previousWords.push(chosenWord);
    return chosenWord;
  }
}

let wordsForLevel = new WordsForLevel(currentLevel);

const updateScoreBoard = () => {
  if (scores.length > 0)
    scoreBoard.innerHTML = scores
      .map((score) => {
        return `<tr>
            <td>${score}</td>
          </tr>`;
      })
      .join("");
  else
    scoreBoard.innerHTML = `<tr>
            <td>No Record</td>
          </tr>`;
};

const onGameOver = () => {
  clearTimeout(timeoutRef);
  clearTimeout(wordDroppingRef);

  scores.push(points);
  scores.sort((a, b) => a - b);
  scores.reverse();

  currentLevel = 1;
  lives = MAX_LIVES;
  wordsRemaining = WORD_PER_LEVEL;
  time = START_TIME;
  points = 0;

  wordsForLevel = new WordsForLevel(currentLevel);

  updateScoreBoard();

  restart.style.display = "block";

  lastWord = undefined;
  wordTyped = "";
};

restart.onclick = () => {
  restart.style.display = "none";
  livesEl.innerText = lives;
  score.innerText = 0;
  init();
};

const proceedToNextLevel = () => {
  currentLevel++;
  wordsRemaining = WORD_PER_LEVEL;
  wordsForLevel = new WordsForLevel(currentLevel);
  time *= 0.75;
  if (time < 200) {
    window.alert("You won");
    onGameOver();
  }
};

let roundTimeoutRef;

let lastWord;
let wordTyped = "";

const updateWordColor = () => {
  Array.from(animatedWord.children).forEach((el, i) => {
    const letter = wordTyped[i];

    if (el.innerHTML === letter) {
      el.classList.add("correct");
    } else if (letter) {
      el.classList.add("incorrect");
    } else {
      el.className = "";
    }
  });
};

const isValid = () => {
  if (currentLevel < 4) {
    return wordTyped.toLowerCase() === lastWord;
  }
  return wordTyped === lastWord;
};

const onKeyPress = (event) => {
  if (event.which === 8) {
    wordTyped = wordTyped.slice(0, Math.max(wordTyped.length - 1, 0));
    console.log(wordTyped);
  } else if (String.fromCharCode(event.keyCode).match(/^[a-zA-Z]{1}$/g)) {
    wordTyped += event.key;

    if (isValid()) {
      onRoundEnd();
    } else if (wordTyped.length === lastWord.length) {
      onTimeout();
      clearTimeout(roundTimeoutRef);
    }
  }
  updateWordColor();
};

const onRoundEnd = (skip) => {
  clearTimeout(roundTimeoutRef);
  if (!skip) points += lastWord.length;
  score.innerText = points;
  document.body.removeEventListener("keydown", onKeyPress);

  wordsRemaining--;
  wordTyped = "";

  if (wordsRemaining <= 0) {
    proceedToNextLevel();
  }

  startNextRound();
};

const onTimeout = () => {
  lives--;
  livesEl.innerText = lives;
  if (lives <= 0) {
    document.body.removeEventListener("keydown", onKeyPress);
    window.alert("You lost");
    onGameOver();
    return;
  }
  onRoundEnd(true);
};
const dropWord = () => {
  const word = wordsForLevel.pickRandomWord();
  animatedWord.innerHTML = word
    .split("")
    .map((letter) => `<span>${letter}</span>`)
    .join("");
  lastWord = word;

  document.body.addEventListener("keydown", onKeyPress);
};

let lastCoord = 0;
const animateWord = () => {
  animatedWord.style.top = `${lastCoord}px`;

  lastCoord += 2;

  if (lastCoord >= gameBoard.getBoundingClientRect().height) {
    clearInterval(wordDroppingRef);
    onTimeout();
    clearTimeout(roundTimeoutRef);
  }
};

const startNextRound = () => {
  animatedWord.style.top = "0px";
  lastCoord = 0;
  dropWord();
  clearInterval(wordDroppingRef);
  console.log(time / 1000);
  wordDroppingRef = setInterval(animateWord, time / 1000);
};

const init = () => {
  startNextRound();
  updateScoreBoard();
};

init();

const randomizeCase = (str) => {
  return str
    .split("")
    .map((l) => {
      const isUpper = randomNumber(0, 1) === 1;
      if (isUpper) return l.toUpperCase();
      else return l.toLowerCase();
    })
    .join("");
};
