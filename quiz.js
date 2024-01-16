const { InlineKeyboard, InputMediaBuilder, InputFile } = require("grammy");
// const RestCountriesApi = require("./rest-countries-api.js");
const axios = require("axios");

async function quizStart(ctx) {
    let countriesData;
    await axios.get("https://restcountries.com/v3.1/all").then((res) => {
        countriesData = res.data;
    });
    let pickedCountry = countriesData[getRandomNum(countriesData.length)];
    sendQuestion(ctx, pickedCountry);
}

async function sendQuestion(ctx, data) {
    const quizOptions = new InlineKeyboard()
        .text("1")
        .text("2")
        .text("3")
        .text("4");

    const question = InputMediaBuilder.photo(data.flags.png);
    await ctx.replyWithMediaGroup([question]);
    ctx.reply("Which country's flag is shown above?", { reply_markup: quizOptions });
}

function getRandomNum(max) {
    return Math.floor(Math.random() * max);
}


module.exports = { quizStart };