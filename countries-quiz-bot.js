const { Bot, InlineKeyboard, Keyboard } = require("grammy");
const config = require("./config.json");
const quiz = require("./quiz.js");

const bot = new Bot(config.token);

let quizStatus = false;
console.log(quizStatus);

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
    quizStatus = !quizStatus;
    console.log(quizStatus);
    quiz.quizStart(ctx);
    await ctx.answerCallbackQuery({
        text: "You pressed 'Start' button."
    });
});

bot.callbackQuery("options", async (ctx) => {
    const keyboard = new Keyboard()
        .text("Send location");
    ctx.reply("Keyboard", { reply_markup: keyboard });
    await ctx.answerCallbackQuery({
        text: "You pressed 'Options' button.",
    })
});

bot.hears(/stop quiz/i, async (ctx) => {
    if (quizStatus) {
        quizStatus = !quizStatus;
        console.log(quizStatus);
        await ctx.reply("Quiz Stopped.", {
            reply_markup: { remove_keyboard: true }
        });
    }
});

bot.on("message:text", async (ctx) => {
    if (quizStatus) {
        quiz.checkAnswer(ctx.msg.text) ? ctx.reply("Correct 👍") : ctx.reply("Incorrect 👎");
        await quiz.createQuestion(ctx);
    }
});


bot.start();