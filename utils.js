import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const questions = require('./questions.json');
// let randomIndex;

export const getRandomQuestions = (ctx) => {
    const thema = ctx.message.text.toLowerCase();
    const arrayThema = questions[thema]
    const random = Math.floor(Math.random() * arrayThema.length) 
   
    if(random == ctx.session.randomIndex) {
       return getRandomQuestions(ctx)
    } else {
        ctx.session.randomIndex = random
    }
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