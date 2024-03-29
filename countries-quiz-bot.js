const { Bot, InlineKeyboard, Keyboard, session } = require("grammy");
const config = require("./config.json");
const quiz = require("./quiz.js");

const bot = new Bot(config.token);

function createInitialSessionData() {
    return {
        quizStatus: false,
        countriesOrder: [],
        orderNum: 0,
        currentCountryName: "",
        questionNum: 0,
        rightAnswers: 0,
        wrongAnswers: 0
    };
}
bot.use(session({ initial: createInitialSessionData }));

bot.command("start", (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
        .text("Start the Quiz", "start")
        .text("Options", "options");

    ctx.reply("Welcome to Countries Quiz Bot!" +
        " Right now Bot's functionality on progress." +
        " To start press \"start quiz\" button.", 
        { reply_markup: inlineKeyboard });
});

bot.command("quiz", (ctx) => {
    if (!ctx.session.quizStatus) {
        ctx.session.quizStatus = !ctx.session.quizStatus;
        quiz.quizStart(ctx);
    }
});

bot.callbackQuery("start", async (ctx) => {
    if (!ctx.session.quizStatus) {
        ctx.session.quizStatus = !ctx.session.quizStatus;
        quiz.quizStart(ctx);
        await ctx.answerCallbackQuery({
            text: "You pressed 'Start' button."
        });
    }
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
    quiz.stopQuiz(ctx);
});

bot.on("message:text", async (ctx) => {
    if (ctx.session.quizStatus) {
        let answer = ctx.session.currentCountryName;
        if (answer === ctx.msg.text) {
            ctx.session.rightAnswers += 1;
            ctx.reply("Correct 👍");
        } else {
            ctx.session.wrongAnswers += 1;
            ctx.reply(`Incorrect 👎. Right answer is <b>${answer}</b>`, 
                { parse_mode: "HTML" });
        }
        setTimeout(() => {
            quiz.createQuestion(ctx, ctx.session.countriesOrder[ctx.session.orderNum]);
        }, 2000);
    }
});

// Make Telegram display a list of commands
bot.api.setMyCommands([
    { command: "start", description: "Greet the bot" },
    { command: "quiz", description: "Start the Quiz" }
]);


bot.start();