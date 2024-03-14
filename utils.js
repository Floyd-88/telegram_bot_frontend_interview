import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const questions = require('./questions.json');

export const getRandomQuestions = (thema) => {
    const arrayThema = questions[thema]
    const randomIndex = Math.floor(Math.random() * arrayThema.length)
    return arrayThema[randomIndex]
}
