import "dotenv/config";
import { Bot, GrammyError, HttpError, Keyboard } from "grammy";

const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", async (ctx) => {
  const keyboard = new Keyboard()
    .text("HTML")
    .text("CSS")
    .row()
    .text("JavaScript")
    .text("Vue")
    .resized();

  await ctx.reply(
    "Привет! Я <b>Frontend Interview Bot</b>\n Я помогу тебе подготовиться к собеседованию по фронтенду!",
    { parse_mode: "HTML" }
  );

  await ctx.reply('Выберите тему для проверки знаний 👇👇👇', {
    reply_markup: keyboard,
  });
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
