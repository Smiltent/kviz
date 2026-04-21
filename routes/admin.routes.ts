
import auth from "@/middlewares/auth.middleware"
import Quiz from "@/models/Quiz"

import { Router } from "express"
const router = Router()

router.get("/dashboard", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    res.render("admin/dashboard")
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

router.get("/quiz/list", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    const list = await Quiz.find().lean()
    res.render("admin/quiz/list", { list })
})

router.get("/quiz/create", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    res.render("admin/quiz/create")
})

router.post("/quiz/create", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    const errors: string[] = []

    try {
        const { title, questions } = req.body

        if (!title) {
            errors.push("Title shouldn't be empty")
        }

        if (!questions) {
            errors.push("Questions shouldn't be empty")
        }

        if (errors.length !== 0) throw new Error()

        const parsed = typeof questions === "string"
            ? JSON.parse(questions)
            : questions

        await Quiz.create({
            title,
            questions: parsed
        })

        console.debug(`Created a new Quiz: '${title}'`)

        res.redirect("/admin/quiz/list")
    } catch (err) {
        if (errors.length === 0) {
            errors.push("Failed to create Quiz")
        }

        console.error(`Failed to create quiz: ${err}`)
        res.status(500).render("admin/quiz/create", { errors: errors })
    }
})

router.post("/quiz/delete", auth.userAuth, auth.requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.body

        const quiz = await Quiz.findById(id)
        if (!quiz) return res.redirect("/admin/quiz/list")
            
        await Quiz.findByIdAndDelete(id)

        res.redirect("/admin/quiz/list")
    } catch (err) {
        console.error(err)
        res.status(500).render("admin/quiz/view", { id: req.body?.id, errors: ["Failed to delete Quiz"] })
    } 
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

export default router