
import auth from "@/middlewares/auth.middleware"
import { Router } from "express"
const router = Router()

router.get("/", auth.guestAuth, async (req, res) => {
    res.render("index")
})

export default router