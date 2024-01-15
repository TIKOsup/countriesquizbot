const { InlineKeyboard, InputMediaBuilder, InputFile } = require("grammy");
// const RestCountriesApi = require("./rest-countries-api.js");
const axios = require("axios");

function quizStart(ctx) {
    sendQuestion(ctx);
}

function sendQuestion(ctx) {
    const quizOptions = new InlineKeyboard()
        .text("1")
        .text("2")
        .text("3")
        .text("4");

    axios.get("https://restcountries.com/v3.1/name/kazakhstan").then((res) => {
            let data = res.data[0];
            const question = InputMediaBuilder.photo(data.flags.png);
            ctx.replyWithMediaGroup([question]);
            ctx.reply("Which country's flag is shown above?", { reply_markup: quizOptions });
    });
}

module.exports = { quizStart };