
import auth from "@/middlewares/auth.middleware"
import Quiz from "@/models/Quiz"
import User from "@/models/User"
import mongoose from "mongoose"

import { Router } from "express"
const router = Router()

function isEmpty(value: string): Boolean {
    return value.trim() === ""
}

router.get("/", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    const list = await Quiz.find().lean()

    res.render("admin/index", { list })
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
router.get("/create", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    res.render("admin/create")
})

router.post("/create", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    const errors: string[] = []

    try {
        const { title, questions } = req.body

        if (!title || isEmpty(title)) {
            errors.push("Title cannot be empty")
        }

        if (!questions || isEmpty(questions)) {
            errors.push("Questions cannot be empty")
        }

        const parsed = typeof questions === "string"
            ? JSON.parse(questions)
            : questions

        parsed.forEach((q: { text: string; answers: any[] }, i: number) => {
            if (!q.text || isEmpty(q.text)) {
                errors.push(`Answer ${i + 1} cannot be empty`)
            }

            const hasCorrect = q.answers?.some(a => a.isCorrect)

            if (!hasCorrect) {
                errors.push(`Question ${i + 1} must have at least one correct answer`)
            }
        })

        if (errors.length !== 0) throw new Error()

        await Quiz.create({
            title,
            questions: parsed
        })

        console.debug(`Created a new Quiz: '${title}'`)

        res.redirect("/admin/")
    } catch (err) {
        if (errors.length === 0) {
            errors.push("Failed to create Quiz")
        }

        console.error(`Failed to create quiz: ${err}`)
        res.status(500).render("admin/create", { createErrors: errors })
    }
})

router.post("/delete", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    const { quizid } = req.body
    const errors: string[] = []

    if (!mongoose.Types.ObjectId.isValid(quizid)) return res.status(400).json({ error: "Invalid quiz ID!" })

    try {
        const quiz = await Quiz.findById(quizid)
        if (!quiz) {
            errors.push("Quiz not found")            
        }

        if (errors.length !== 0) throw new Error()
            
        await Quiz.findByIdAndDelete(quizid)
        await User.updateMany(
            { "highScores.id": quizid },
            { $pull: { highScores: { id: quizid }}}
        )

        res.redirect("/admin")
    } catch (err) {
        console.error(`Failed to delete quiz: ${err}`)
        res.status(500).render("admin/index", { errors })
    } 
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
export default router