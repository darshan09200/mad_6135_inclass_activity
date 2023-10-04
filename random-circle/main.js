/**
 * Part 1:
 * a. Create a canvas with width:800px and height:600px.
 * b. Create a circle of random radius between 10px and 30px at a random coordinate.
 * c. The circles should not touch the borders of the canvas
 * d. This should happen after every 15 sec
 *
 * Part 2:
 * a. Keep drawing the circles until the count reaches 30 and then clear the canvas
 * b. Start again but now until the count reached 20 and then clear the canvas
 * c. Start again but now until it reaches 10 and then show "Game Over"
 */
const MIN_RADIUS = 10;
const MAX_RADIUS = 30;

const TIMER = 15;

const DISABLE_OVERLAP = true;

let attempts = 0;

const START_CIRCLE_COUNT = 30;
const EVERY_ROUND_DEDUCTION = 10;

const roundDetails = {
  allowedCount: START_CIRCLE_COUNT,
  currentCount: 0,
};

let MAX_ATTEMPTS;

let intervalRef;

const init = () => {
  paper.install(window);

  initRandomizer();
};

const initRandomizer = () => {
  const canvas = document.getElementById("canvas");
  paper.setup(canvas);

  const { width, height } = paper.view.size;
  MAX_ATTEMPTS = Math.ceil((width / MIN_RADIUS) * (height / MIN_RADIUS));

  drawRandomCircle();
  intervalRef = setInterval(drawRandomCircle, TIMER * 1000);

  paper.view.draw();
};

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const drawRandomCircle = () => {
  if (roundDetails.currentCount >= roundDetails.allowedCount) {
    project.activeLayer.removeChildren();

    roundDetails.allowedCount -= EVERY_ROUND_DEDUCTION;
    roundDetails.currentCount = 0;

    if (roundDetails.allowedCount === 0) {
      drawTextWithAnimation();
      return;
    }
  }

  roundDetails.currentCount += 1;

  const { width, height } = paper.view.size;

  const randomRadius = randomNumber(MIN_RADIUS, MAX_RADIUS);
  const randomXCoord = randomNumber(randomRadius, width - randomRadius);
  const randomYCoord = randomNumber(randomRadius, height - randomRadius);

  var circle = new Shape.Circle({
    center: new Point(randomXCoord, randomYCoord),
    radius: randomRadius,
    fillColor: randomColor(),
  });

  project.activeLayer.addChild(circle);
  paper.view.draw();
};

const randomColor = () => {
  const randomRedCode = randomNumber(0, 255);
  const randomGreenCode = randomNumber(0, 255);
  const randomBlueCode = randomNumber(0, 255);
  const color = `#${randomRedCode.toString(16)}${randomGreenCode.toString(
    16
  )}${randomBlueCode.toString(16)}`;

  if (
    randomRedCode === randomGreenCode &&
    randomGreenCode === randomBlueCode &&
    (randomRedCode === 255 || randomRedCode === 0)
  ) {
    window.alert(
      `Congratulations on being incredibly lucky! Your chances of randomly selecting ${
        randomRedCode === 255 ? "white" : "black"
      } color are approximately 0.00000596%.`
    );
  }

  return color;
};

const drawTextWithAnimation = () => {
  const { width, height } = paper.view.size;

  project.activeLayer.removeChildren();

  clearInterval(intervalRef);

  const gameOver = new PointText({
    point: [width / 2, height / 2],
    content: "Game Over",
    justification: "center",
    fillColor: "blue",
    fontSize: 24,
  });

  gameOver.onFrame = () => {
    // http://paperjs.org/tutorials/animation/creating-animations/#animating-colors
    gameOver.fillColor.hue += 1;

    // gameOver.fillColor = randomColor();
  };

  const tryAgain = new PointText({
    point: [width / 2, height / 2],
    content: "Try Again",
    justification: "center",
    fillColor: "black",
    fontSize: 16,
  });

  const totalHeight = gameOver.bounds.height + tryAgain.bounds.height;

  gameOver.position.y -= totalHeight / 2 + 4;
  tryAgain.position.y += totalHeight / 2 + 4;

  const { point, size } = tryAgain.bounds;
  const tryAgainWrapper = new Shape.Rectangle({
    point: [point.x - 16, point.y - 8],
    size: [size.width + 32, size.height + 16],
    fillColor: "lightgrey",
    radius: 5,
  });

  const tryAgainGroup = new Group([tryAgainWrapper, tryAgain]);

  tryAgainGroup.onClick = () => {
    project.activeLayer.removeChildren();
    roundDetails.allowedCount = START_CIRCLE_COUNT;
    roundDetails.currentCount = 0;

    initRandomizer();
  };

  paper.view.draw();
};

init();
