const { Keyboard, InputMediaBuilder } = require("grammy");
const axios = require("axios");

let countriesData;

/* Main logic of the quiz */
async function quizStart(ctx) {
    await axios.get("https://restcountries.com/v3.1/all").then((res) => {
        countriesData = res.data;

        // Creating the array from 0 to array length - [0,1,...,248,249]
        let countriesOrder = Array.from(Array(countriesData.length).keys());
        countriesOrder = shuffle(countriesOrder);
        ctx.session.countriesOrder = countriesOrder;

        createQuestion(ctx, ctx.session.countriesOrder[ctx.session.orderNum]);
    });
}

/* Takes a country, creates an array of options */
async function createQuestion(ctx, questionNum) {
    if (ctx.session.questionNum >= ctx.session.countriesOrder.length) {
        stopQuiz(ctx);
    }
    else {
        let pickedCountry = countriesData[questionNum];

        ctx.session.orderNum = ctx.session.orderNum + 1;
        ctx.session.questionNum = ctx.session.questionNum + 1;
        ctx.session.currentCountryName = pickedCountry.name.common;
    
        let options = getQuestionOptions(countriesData, pickedCountry.name.common, 4)
        await sendQuestion(ctx, pickedCountry.flags.png, options);
    }
}

/* Sends flag image and a question with options */
async function sendQuestion(ctx, flag, options) {
    const optionsRows = options.map((label) => [Keyboard.text(label)]);
    const optionsKeyboard = Keyboard.from(optionsRows).resized().oneTime().toFlowed(2);

    const question = InputMediaBuilder.photo(flag);
    await ctx.replyWithMediaGroup([question]);
    await ctx.reply(`Flag #${ctx.session.questionNum}. Which country's flag is shown above?`, { reply_markup: optionsKeyboard });
}

/* Creates an array of options */
function getQuestionOptions(countriesData, rightCountryName, optionsNum) {
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

function stopQuiz(ctx) {
    if (ctx.session.quizStatus) {
        ctx.session.quizStatus = !ctx.session.quizStatus;
        ctx.session.orderNum = 0;
        ctx.reply("Quiz Stopped.", {
            reply_markup: { remove_keyboard: true }
        });
    }
}

/* Randomly shuffles an array element's order */
function shuffle (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomNum(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* Returns random number with maximum value as a parameter */
function getRandomNum(max) {
    return Math.floor(Math.random() * max);
}


module.exports = { quizStart, createQuestion, stopQuiz };