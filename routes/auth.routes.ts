
import auth from "@/middlewares/auth.middleware"
import Auth from "@/services/Auth"

import { Router } from "express"
const router = Router()

const COOKIE = {
    httpOnly: true,
    secure: process.env.ENV === 'prod',
    sameSite: 'strict' as 'strict',
    maxAge: 24 * 60 * 60 * 1000
}

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
router.post("/register", auth.guestAuth, async (req, res) => {
    let errors: string[] = []

    try {
        const { username, password } = req.body

        if (username.length < 3) {
            errors.push("Username must be between 3 and 20 characters")
        }
        if (username.match(/[^a-zA-Z0-9_]/)) {
            errors.push("Username must contain only letters, numbers and underscores")
        }
        if (password.length < 6 || password.length > 64) {
            errors.push("Password must be between 6 and 64 characters")
        }
        if (errors.length !== 0) throw new Error()

        const token = await Auth.register(username, password)
        res.cookie('token', token, COOKIE)

        res.redirect('/quiz')
    } catch (err) {
        if (err instanceof Error && err.message) {
            errors.push(err.message)
        }
        
        res.status(400).render("index", { registerErrors: errors })
    }
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

router.post("/login", auth.guestAuth, async (req, res) => {
    try {
        const { username, password } = req.body

        const token = await Auth.login(username, password)
        res.cookie('token', token, COOKIE)

        res.redirect("/quiz")
    } catch (err) {
        console.error("LOGIN ERROR:", err)

        const error = err instanceof Error ? err.message : "An error occurred"
        res.status(400).render("index", { loginErrors: [error] })
    }
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

router.post("/logout", auth.userAuth, async (req, res) => {
    res.clearCookie("token")
    res.redirect("/")
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==


export default router