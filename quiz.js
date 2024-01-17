const { Keyboard, InputMediaBuilder } = require("grammy");
// const RestCountriesApi = require("./rest-countries-api.js");
const axios = require("axios");

let countriesData;
let currentCountry;

/* Main logic of the quiz.
   Starts after pressing the "Start the Quiz" inline btn */
async function quizStart(ctx) {
    await axios.get("https://restcountries.com/v3.1/all").then((res) => {
        countriesData = res.data;
        createQuestion(ctx);
    });
}

/* Checks the entered text with the answer */
function checkAnswer(answer) {
    return currentCountry === answer;
}

/* Takes a random country, creates an array of options */
async function createQuestion(ctx) {
    let pickedCountry = countriesData[getRandomNum(countriesData.length)];
    currentCountry = pickedCountry.name.common;
    console.log(currentCountry);
    let options = getQuestionOptions(countriesData, pickedCountry.name.common, 4)
    await sendQuestion(ctx, pickedCountry.flags.png, options);
}

/* Sends flag image and a question with options */
async function sendQuestion(ctx, flag, options) {
    const optionsRows = options.map((label) => [Keyboard.text(label)]);
    const optionsKeyboard = Keyboard.from(optionsRows).resized().oneTime().toFlowed(2);

    const question = InputMediaBuilder.photo(flag);
    await ctx.replyWithMediaGroup([question]);
    await ctx.reply("Which country's flag is shown above?", { reply_markup: optionsKeyboard });
}

/* Creates an array of options */
function getQuestionOptions(countriesData, rightCountryName, optionsNum) {

    // Randomly shuffles an array element's order
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = getRandomNum(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let options = [rightCountryName];

    // Fills an array with incorrect options
    for (let i = 0; options.length < optionsNum; i++) {
        let falseOption = countriesData[getRandomNum(countriesData.length)].name.common;
        // Adds only unique countries as options
        if (!options.includes(falseOption)) options.push(falseOption);
    }

    options = shuffle(options);
    options.push("Stop Quiz 🫡");

    return options;
}

/* Returns random number with maximum value as a parameter */
function getRandomNum(max) {
    return Math.floor(Math.random() * max);
}


module.exports = { quizStart, createQuestion, checkAnswer };