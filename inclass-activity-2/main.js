import { randomColor } from "../utils/index.js";

const START_DIAMETER = 50;
const END_DIAMETER = 400;
const PULSATING_SECOND = 5;
const COLOR_CHANGE_SECOND = 1;

const pulsatingElement = document.getElementById("pulsating");

let isShrinking = false;

// Speed = Distance / Time
const time = (END_DIAMETER - START_DIAMETER) / PULSATING_SECOND;

const init = () => {
  setInterval(() => {
    const { width } = pulsatingElement.getBoundingClientRect();

    if (width >= END_DIAMETER) {
      isShrinking = true;
    } else if (width <= START_DIAMETER) {
      isShrinking = false;
    }

    let newRadius = isShrinking ? width - 5 : width + 5;

    pulsatingElement.style.width = `${newRadius}px`;
    pulsatingElement.style.height = `${newRadius}px`;
    pulsatingElement.style.borderRadius = `${newRadius}px`;
  }, time);

  setInterval(() => {
    pulsatingElement.style.backgroundColor = randomColor();
  }, COLOR_CHANGE_SECOND * 1000);
};

init();
