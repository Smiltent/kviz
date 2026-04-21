
import auth from "@/middlewares/auth.middleware"
import Quiz from "@/models/Quiz"

import { Router } from "express"
const router = Router()

router.get("/", auth.userAuth, async (req, res) => {
    const list = await Quiz.find({})

    res.render("quiz/list", { list })
})

// get question & it's answers
router.post("/q/start", auth.userAuth, async (req, res) => {
    const { quizid } = req.body
    const quiz = await Quiz.findById(quizid).lean()

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
router.post("/q/:quizid/:answerid/:nr", async (req, res) => {
    const { quizid, answerid, nr } = req.params

    const quiz = await Quiz.findById(quizid).lean()
    if (!quiz) return res.status(400).json({ error: "Can't find Quiz" })
    
    const question = quiz.questions[Number(nr)]
    if (!question) return res.status(400).json({ error: "Can't find Question" })    

    const answer = question.answers.find(a => a._id.toString() === answerid)
    res.json({ correct: answer?.isCorrect ?? false })
})

export default router