const { Bot, InlineKeyboard } = require("grammy");
const config = require("./config.json");
const quiz = require("./quiz.js");

const bot = new Bot(config.token);


bot.command("start", (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
        .text("Start the Quiz", "start")
        .text("Options", "options");

    ctx.reply("Welcome to Countries Quiz Bot!" +
        " Right now Bot's functionality on progress." +
        " To start press \"start quiz\" button.", 
        { reply_markup: inlineKeyboard });
});

bot.callbackQuery("start", async (ctx) => {
    quiz.quizStart(ctx);
    await ctx.answerCallbackQuery({
        text: "You pressed 'Start' button."
    });
});

bot.callbackQuery("options", async (ctx) => {
    await ctx.answerCallbackQuery({
        text: "You pressed 'Options' button."
    })
});

bot.callbackQuery("true", async (ctx) => {
    ctx.reply("Correct 👍");
    await quiz.createQuestion(ctx);
});

bot.callbackQuery("false", async (ctx) => {
    ctx.reply("Incorrect 👎");
    await quiz.createQuestion(ctx);
});

bot.callbackQuery("stop", async (ctx) => {
    ctx.reply("Quiz stopped.")
    await ctx.answerCallbackQuery({
        text: "You pressed 'Stop' button."
    })
})



bot.start();