import "dotenv/config";
import { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard, session } from "grammy";
import { getRandomQuestions, getCorrectAnswer } from "./utils.js";
const bot = new Bot(process.env.BOT_API_KEY);

function initial() {
    return { randomIndex: null };
  }

  bot.use(session({ initial }));

//событие срабатывает при старте бота
bot.command("start", async (ctx) => {
  const keyboard = new Keyboard()
    .text("HTML")
    .text("CSS")
    .row()
    .text("JavaScript")
    .text("Vue")
    .row()
    .text("Случайный вопрос")
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
bot.hears(["HTML", "CSS", "JavaScript", "Vue", "Случайный вопрос"], async (ctx) => {
  const question = getRandomQuestions(ctx);
  let inlineKeyboard;
  //если вопрос с вариантами ответов - отразить их
  if (question?.hasOptions) {
    const buttonRow = question.options.map((i) => InlineKeyboard.text(
          i.text,
          JSON.stringify({
            type: `${question?.type}-option`,
            questionId: question?.id,
            isCorrect: i.isCorrect,
          })
        ),
    );
    inlineKeyboard = InlineKeyboard.from([buttonRow]);
  } else { //если вопрос без вариантов - отразить кнопку "получить ответ"
    inlineKeyboard = new InlineKeyboard().text(
      "Получить ответ",
      JSON.stringify({
        type: question?.type,
        questionId: question?.id,
      })
    );
  }
  await ctx.reply(
    `Вопрос по категории ${question?.type}:\n\n${question?.text}`,
    { reply_markup: inlineKeyboard }
  );
});
// ------

//отсеживание нажатия на инлайн кнопки
bot.on("callback_query:data", async (ctx) => {
    const cbData = JSON.parse(ctx.callbackQuery.data)
    const correctAnswer = getCorrectAnswer(cbData.questionId, cbData.type)
    
    if(cbData.type.includes('option')) {
        if(cbData.isCorrect) {
            await ctx.reply("Верно 👍")
        } else {
            await ctx.reply(`Не верно ❌\nПравильный ответ:\n\n"${correctAnswer}"` )
        }
    } else {
        await ctx.reply(correctAnswer, {disable_web_page_preview: true} )
    }
    await ctx.answerCallbackQuery()
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
