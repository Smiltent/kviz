
import { Router } from "express"
import Quiz from "../models/Quiz"
const router = Router()

router.get("/", async (req, res) => {
    const list = await Quiz.find()

    res.render("index", { list })
})

export default router