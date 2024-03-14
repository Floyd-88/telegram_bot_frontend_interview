import "dotenv/config";
import { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } from "grammy";
import { getRandomQuestions } from "./utils.js";
const bot = new Bot(process.env.BOT_API_KEY);

//событие срабатывает при старте бота
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

  await ctx.reply("Выберите тему для проверки знаний 👇", {
    reply_markup: keyboard,
  });
});
// ----------

//выбор кнопки с темой
bot.hears(["HTML", "CSS", "JavaScript", "Vue"], async (ctx) => {
  const thema = ctx.message.text.toLowerCase();
  const question = getRandomQuestions(thema);
  let inlineKeyboard;

  //если вопрос с вариантами ответов - отразить их
  if (question.hasOptions) {
    const buttonRow = question.options.map((i) => InlineKeyboard.text(
          i.text,
          JSON.stringify({
            type: `${thema}-option`,
            questionId: i.id,
            isCorrect: i.isCorrect,
          })
        ),
    );
    inlineKeyboard = InlineKeyboard.from([buttonRow]);
  } else { //если вопрос без вариантов - отразить кнопку "получить ответ"
    inlineKeyboard = new InlineKeyboard().text(
      "Получить ответ",
      JSON.stringify({
        type: thema,
        questionId: question.id,
      })
    );
  }
  await ctx.reply(
    `Вопрос по категории <b>${ctx.message.text}</b>:\n\n${question.text}`,
    { reply_markup: inlineKeyboard, parse_mode: "HTML" }
  );
});
// ------

//отсеживание нажатия на инлайн кнопки
bot.on("callback_query:data", async (ctx) => {
  if (ctx.callbackQuery.data === "cancel") {
    ctx.reply("Отменено");
    await ctx.answerCallbackQuery(); // remove loading animation
    return;
  } else {
    const cbData = JSON.parse(ctx.callbackQuery.data);
    ctx.reply(`${cbData.type} составляющая фронтенда`);
    await ctx.answerCallbackQuery();
  }
});
// -----------------

//отслеживание ошибок
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
// ------------
bot.start();
