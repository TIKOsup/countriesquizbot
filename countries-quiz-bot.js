const { Bot } = require("grammy");
const config = require("./config.json");

const bot = new Bot(config.token);


bot.command("start", (ctx) => {
    ctx.reply("Welcome to Countries Quiz Bot! Bot's functionality on progress.");
});





bot.start();