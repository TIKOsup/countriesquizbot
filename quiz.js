const { InlineKeyboard, InputMediaBuilder, InputFile } = require("grammy");
// const RestCountriesApi = require("./rest-countries-api.js");
const axios = require("axios");

function quizStart(ctx) {
    console.log("<<< Quiz started. >>>");

    const quizInlineKeyboard = new InlineKeyboard()
        .text("1")
        .text("2")
        .text("3")
        .text("4");

    axios.get("https://restcountries.com/v3.1/name/kazakhstan").then((res) => res.json())
        .then((json) => {
            console.log(json.data);
            const question = InputMediaBuilder.photo(new InputFile(json.data.flags.png), 
            { caption: "Which country's flag is shown above?" });
            ctx.replyWithMediaGroup([question]);
    });

    // const question = InputMediaBuilder.photo(new InputFile(result.flags.png), 
    //     { caption: "Which country's flag is shown above?" });
    // ctx.replyWithMediaGroup([photo]);
}

module.exports = { quizStart };