
import auth from "@/middlewares/auth.middleware"
import Quiz from "@/models/Quiz"

import e, { Router } from "express"
const router = Router()

router.get("/", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    const list = await Quiz.find().lean()

    res.render("admin/index", { list })
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
// TODO, for view: better design and functionallity, add remove question and answers
router.get("/create", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    res.render("admin/create")
})

router.post("/create", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    const errors: string[] = []

    try {
        const { title, questions } = req.body

        if (!title) {
            errors.push("Title shouldn't be empty")
        }

        if (!questions) {
            errors.push("Questions shouldn't be empty")
        }

        const parsed = typeof questions === "string"
            ? JSON.parse(questions)
            : questions

        parsed.forEach((q: { answers: any[] }, i: number) => {
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

    try {
        const quiz = await Quiz.findById(quizid)
        if (!quiz) {
            errors.push("Quiz not found")            
        }

        if (errors.length !== 0) throw new Error()
            
        await Quiz.findByIdAndDelete(quizid)

        res.redirect("/admin")
    } catch (err) {
        console.error(err)
        res.status(500).json({ errors })
    } 
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
export default router