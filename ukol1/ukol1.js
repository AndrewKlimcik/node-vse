// initially defined constants
const max = 10;
const min = 1;
const maxNumberOfAttempts = 5;
const prompt = require('prompt-sync')({sigint: true});
// *

//asdfasdfasdf
/**
 * Generates a random int number within given interval.
 * @param min
 * @param max
 * @returns {number} generated random number
 */
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Check if the user's guess is the same as generated number.
 * @param userInput
 * @param generatedInt
 * @returns {boolean}
 */
const checkTheGuess = (userInput, generatedInt) => {
    return parseInt(userInput, 10) === generatedInt;
}

/**
 * Runs a guessing game mainly interaction with the user.
 * @param maxNumberOfAttemps
 * @returns {boolean}
 */
const runGuessing = (generatedInt, maxNumberOfAttempts) => {
    for (var i = 1; i <= maxNumberOfAttempts; i++) {
        const userGuess = prompt(`Attempt ${i}: I'm waiting for your guess... `);
        const isCorrect = checkTheGuess(userGuess, generatedInt);
        // console.log("userGuess", userGuess);
        // console.log("maxNumberOfAttemps", maxNumberOfAttemps);
        // console.log("i", i);

        if (isCorrect) {
            console.log(`You've guessed it! It was number ${generatedInt}. You've guessed it in ${i} attempts. \nYou've won.`);
            return true;
        } else if (i === maxNumberOfAttempts) {
            console.log(`You're wrong. Your guessed number ${userGuess} was not the right number and number of attempts ran out. The right number was ${generatedInt}. \nSorry, game over.`);
            return false;
        } else {
            console.log(`You're wrong. Your guessed number ${userGuess} was not the right number. Let's try again...`);
        }
    }
}

var generatedInt = getRandomInt(min, max);
// console.log("generatedInt", generatedInt);

console.log(`Let's play a little game. \nI'm thinking about one integer number between ${max} and ${min}. Try to guess the value.`);
runGuessing(generatedInt, maxNumberOfAttempts);




