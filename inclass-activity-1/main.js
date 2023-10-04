// Constants
const SQUARE_SIZE = 50; // size of the square
const TIMER = 0.01 * 1000; // 10ms
const MOVEMENT = 2; // no of pixels to move after `TIMER` ellapsed
const HALT = 2 * 1000; // 2sec
const START_COLOR = "blue";
const MAX_ROUNDS = 10; // max no of round after which it should show "Game Over"

let timerRef; // ref to store the interval reference to clear later

let lastCoord = 0; // last recorded coordinate
/**
 * reverse from the direction it moves, meaning if the value is top we are moving towards bottom
 * Similarly,
 * top => bottom
 * left => right
 * bottom => top
 * right => left
 */
let origin = "top";
let coveredSide = 0; // no. of sides it covered
let isReverse = false; // is the square traveling in reverse direction
let count = 0; // the number of times it revolved around the screen

// has the square element
const square = document.getElementById("square");

// has the scoreWrapper element
const scoreWrapper = document.getElementById("scoreWrapper");
// has the score element
const score = document.getElementById("score");

// has the gameOver element
const gameOverElement = document.getElementById("gameOver");
// has the tryAgain element
const tryAgainButton = document.getElementById("tryAgain");

// Attach onclick to tryAgain button. This will reset the game and start from beginning
tryAgainButton.onclick = (e) => {
  // Reset all the values
  count = 0;
  lastCoord = 0;
  origin = "top";
  coveredSide = 0;
  isReverse = false;

  // hide the gameOverElement
  gameOverElement.style.display = "none";
  // show the scoreWrapper
  scoreWrapper.style.display = "flex";

  // Restart the timer
  initTimer();
};

const initTimer = () => {
  // update score with latest count
  score.innerText = count;

  // start timer to move square and store the ref for future use
  timerRef = setInterval(moveSquare, TIMER);

  // change the background color to a random value
  square.style.background = randomColor();
};

const moveSquare = () => {
  // Increment the last coord by `MOVEMENT`
  lastCoord += MOVEMENT;

  // refer getWindowLimit for explanation
  if (lastCoord >= getWindowLimit() - SQUARE_SIZE) {
    const isVertical = origin === "top" || origin === "bottom";
    // Increase the count as one more side was covered
    coveredSide++;

    // reset lastCoord since we are starting with a new side
    lastCoord = 0;

    // if all 4 sizes are covered we have completed a round
    if (coveredSide >= 4) {
      // reset the covered side as we are starting a new round
      coveredSide = 0;

      // select opposite of current origin
      origin = getOppositeOrigin();

      // return here as we want to wait for some time which is handled by `resumeAfterHalt`
      return resumeAfterHalt();
    } else {
      if (isVertical) {
        /**
         * If the current origin is top then we reached at the bottom of the screen now we want to move towards right.
         * So the new value would be `left`. Remember the values are opposite
         */
        origin = origin === "top" ? "left" : "right";
      } else {
        /**
         * If the current origin is left then we reached at the right corner of the screen now we want to move towards top.
         * So the new value would be `bottom`. Remember the values are opposite
         */
        origin = origin === "left" ? "bottom" : "top";
      }
      // get a reverse value if we are moving in opposite direction
      if (isReverse) {
        origin = getOppositeOrigin();
      }
    }
    // change the background color to a random value
    square.style.background = randomColor();
    // reset opposite origin as it would affect the style
    square.style[getOppositeOrigin()] = null;
  }

  // move the square from `origin` to `lastCoord px`
  square.style[origin] = `${lastCoord}px`;
};

const getWindowLimit = () => {
  /**
   * if origin is `top` or `bottom` check if the current coordinate has reached the end of the screen
   * Here we are doing window.innerHeight - SQUARE_SIZE because the coordinate represents the top coordinate
   * so we can either do `lastCoord + SQUARE_SIZE >= window.innerHeight` or `lastCoord >= window.innerHeight - SQUARE_SIZE`
   *
   */
  if (origin === "top" || origin === "bottom") return window.innerHeight;
  /**
   * if the origin is not `top` or `bottom` it can only be `left` and `right`.
   * So directly check we reached at extreme horizontal sides.
   *
   * We are doing the same thing here .
   * window.innerWidth - SQUARE_SIZE because the coordinate represents the left coordinate
   * so we can either do `lastCoord + SQUARE_SIZE >= window.innerWidth` or `lastCoord >= window.innerWidth - SQUARE_SIZE`
   */
  return window.innerWidth;
};

const resumeAfterHalt = () => {
  // We completed a round

  // clear the interval which is running
  clearInterval(timerRef);

  // now we should move in reverse direction of what was earlier
  isReverse = !isReverse;

  // increase the count for no of rounds completed
  count++;

  // update the score
  score.innerText = count;

  if (count < MAX_ROUNDS) {
    // if no of rounds completed is not fulfilled restart the game again in `HALT` sec
    setTimeout(initTimer, HALT);
  } else {
    // if we have completed all rounds its game over
    gameOver();
  }
};

const gameOver = () => {
  // clear the interval which is running
  clearInterval(timerRef);
  // hide the scoreWrapper
  scoreWrapper.style.display = "none";
  // show the gameOverElement
  gameOverElement.style.display = "flex";
};

const getReverse = (isReverse, val, possibilityA, possibilityB) => {
  // if its not reverse return original
  if (!isReverse) return val;
  // if it is reverse check if val is equal to a, if yes then return b, otherwise return a
  return possibilityA === val ? possibilityB : possibilityA;
};

// Check the current origin and return the opposite origin
const getOppositeOrigin = () => {
  const possibilities = ["top", "left", "bottom", "right"];
  // If i move move 2 step ahead within the array its always the opposite
  const index = (possibilities.indexOf(origin) + 2) % 4;
  return possibilities[index];
};

const randomNumber = (min, max) => {
  // generate a random number within the given range
  return Math.round(Math.random() * (max - min) + min);
};

// convert number into hexadecimal and add padding if required
const getHex = (number) => number.toString(16).padStart(2, "0");

const randomColor = () => {
  // generate 3 random number between 0 to 255 which would represent red, green, and blue
  const randomRedCode = randomNumber(0, 255);
  const randomGreenCode = randomNumber(0, 255);
  const randomBlueCode = randomNumber(0, 255);
  // convert the numbers into hexadecimal and join them to create a random hex color
  const color = `#${getHex(randomRedCode)}${getHex(randomGreenCode)}${getHex(
    randomBlueCode
  )}`;

  if (
    randomRedCode === randomGreenCode &&
    randomGreenCode === randomBlueCode &&
    (randomRedCode === 255 || randomRedCode === 0)
  ) {
    /**
     * check if its either black(0) or white(255), because its a very rare scenario that
     * all three random numbers are same and either 0 or 255, so just let the user know
     * how lucky they are.
     */

    window.alert(
      `Congratulations on being incredibly lucky! Your chances of randomly selecting ${
        randomRedCode === 255 ? "white" : "black"
      } color are approximately 0.00000596%.`
    );
  }

  // return the random color
  return color;
};

// start the game on page load
initTimer();
