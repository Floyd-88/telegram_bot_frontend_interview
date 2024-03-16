import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const questions = require('./questions.json');

export const getRandomQuestions = (ctx) => {
    let thema = ctx.message.text.toLowerCase();

    if(thema === "случайный вопрос") {
        thema = randomProperty(questions)
    }
    const arrayThema = questions[thema]
    const random = Math.floor(Math.random() * arrayThema.length) 
   
    if(random == ctx.session.randomIndex) {
       return getRandomQuestions(ctx)
    } else {
        ctx.session.randomIndex = random
    }
    arrayThema[random]['type'] = thema
    return arrayThema[random]
}

export const getCorrectAnswer = (id, type) => {
    const typeArray = type.split("-")[0]
    const question = questions[typeArray].find(i => i.id == id)   
    if(!question.hasOptions) {
        return question.answer
    } else {
        const correct_answer = question.options.find(i => i.isCorrect)
        return correct_answer['text']
    }
}

const randomProperty = function (obj) {
    let keys = Object.keys(obj);
    return keys[ keys.length * Math.random() << 0]
};