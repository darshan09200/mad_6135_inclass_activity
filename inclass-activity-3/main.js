import { randomColor } from "../utils/index.js";

const SQUARE_WIDTH = 50;

const square = document.getElementById("square");

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

let speed = 3;
let angle = randomAngle();

let lastCoord = {
  x: randomNumber(0, window.innerWidth - SQUARE_WIDTH),
  y: randomNumber(0, window.innerHeight - SQUARE_WIDTH),
};

let signX = randomSign();
let signY = randomSign();

const init = () => {
  setInterval(() => {
    if (lastCoord.x >= window.innerWidth - SQUARE_WIDTH || lastCoord.x <= 0) {
      signX *= -1;
      randomize();
    }
    if (lastCoord.y >= window.innerHeight - SQUARE_WIDTH || lastCoord.y <= 0) {
      signY *= -1;
      randomize();
    }

    lastCoord.x += speed * signX * Math.cos(angle);
    lastCoord.y += speed * signY * Math.sin(angle);

    square.style.left = `${lastCoord.x}px`;
    square.style.top = `${lastCoord.y}px`;
  }, 0.01);
};

const randomizeColor = () => {
  square.style.backgroundColor = randomColor();
};

const randomizeSpeed = () => {
  speed = randomFloat(1, 3);
};
const randomizeAngle = () => {
  angle = randomAngle();
};

const randomize = () => {
  randomizeColor();
  randomizeSpeed();
  randomizeAngle();
};

init();
