
import auth from "../middlewares/auth.middleware"
import Quiz from "../models/Quiz"

import { Router } from "express"
const router = Router()

router.get("/", auth.userAuth, async (req, res) => {
    const list = await Quiz.find({})

    res.render("quiz/list", { list })
})

// get question & it's answers
router.get("/q/:id", auth.userAuth, async (req, res) => {
    const { id } = req.params
    const quiz = await Quiz.findById(id)
        .lean()

    if (!quiz) {
        return res.status(404)
    }

    const questions = quiz.questions.map(q => ({
        ...q,
        answers: q.answers.map(({ text }) => ({ text }))
    }))
    res.json({ questions })

    // res.render("quiz/view", { questions })
})

// validate answer to server
router.post("/q/:quizid/a/:answerid/:nr", auth.userAuth, async (req, res) => {
    const { quizid, answerid, nr } = req.params

    const quiz = await Quiz.findById(quizid).lean()
    if (!quiz) return res.status(404)
    
    const question = quiz.questions[Number(nr)]
    if (!question) return res.status(404)

    const answer = question.answers.find(a => a._id.toString() === answerid)
    if (!answer) res.status(404)

    res.json({ correct: answer?.isCorrect! })
})

export default router