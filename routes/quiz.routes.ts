
import auth from "@/middlewares/auth.middleware"
import Quiz from "@/models/Quiz"
import User from "@/models/User"

import { Router } from "express"
const router = Router()

router.get("/", auth.userAuth, async (req, res) => {
    const list = await Quiz.find({})

    res.render("quiz/list", { list })
})

router.get("/highscores", auth.userAuth, async (req, res) => {
    // TODO: Parse quiz names to high scores, also get max questions, so you can do `${value} out of ${total}` 

    const user = await User.findById(res.locals.user.id)
    if (!user) return res.status(404).json({ message: `User not found` })

    res.render("quiz/highscores", { highscores: user.highScores })
})

// get question & it's answers
router.post("/start", auth.userAuth, async (req, res) => {
    const { quizid } = req.body
    const quiz = await Quiz.findById(quizid).lean()
    if (!quiz) return res.status(404).json({ error: "Cannot find quiz!" })

    const questions = quiz.questions.map(q => ({
        ...q,
        answers: q.answers.map(({ text }) => ({ text }))
    }))
    
    res.render("quiz/view", { questions, quizid })
})

router.post('/end', auth.userAuth, async (req, res) => {
    const { quizid, results } = req.body
    const quiz = await Quiz.findById(quizid).lean()

    if (!quiz) return res.status(404).json({ error: "Cannot find quiz!" })
    if (!results) return res.status(404).json({ error: "No results provided!" })

    let correct = 0

    for (const result of results) {
        const question = quiz.questions.find(
            (q) => q._id.toString() === result.questionId
        )
        if (!question) continue

        const isCorrect = question.answers.some(
            (a) => a.text === result.selectedAnswer && a.isCorrect === true
        )
        if (isCorrect) correct++
    }

    const total = quiz.questions.length

    const user = await User.findById(res.locals.user.id)
    if (!user) return res.status(404).json({ message: `User not found `})

    const existing = user.highScores.find((hs) => hs.id === quizid)
    if (existing) {
        if (correct > existing.score) {
            existing.score = correct
        }
    } else {
        user.highScores.push({ id: quizid, score: correct })
    }

    await user.save()
    return res.json({
        correct,
        total
    })
})

export default router