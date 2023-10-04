export const randomNumber = (min, max) => {
  // generate a random number within the given range
  return Math.round(Math.random() * (max - min) + min);
};

// convert number into hexadecimal and add padding if required
export const getHex = (number) => number.toString(16).padStart(2, "0");

export const randomColor = () => {
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

/**
 * @param {any[]|string} arr
 * @returns any[]
 */
export const randomizePosition = (arr) => {
  const newArr = [...arr];
  for (let i = 0; i < newArr.length; i++) {
    const index = randomNumber(0, newArr.length - 1);
    const item = newArr[i];
    newArr[i] = newArr[index];
    newArr[index] = item;
  }
  if (typeof arr === "string") return newArr.join("");
  return newArr;
};
