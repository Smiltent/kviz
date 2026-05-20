
import auth from "@/middlewares/auth.middleware"
import Auth from "@/services/Auth"
import { isEmpty } from "@/utils/empty"

import { Router } from "express"
const router = Router()

const COOKIE = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: 'strict' as 'strict',
    maxAge: 24 * 60 * 60 * 1000
}

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
router.post("/register", auth.guestAuth, async (req, res) => {
    let errors: string[] = []

    try {
        const { username, password } = req.body

        if (!username || typeof username !== 'string' || isEmpty(username)) {
            errors.push("Username is required")
        }
        if (!password || typeof password !== 'string' || isEmpty(password)) {
            errors.push("Password is required")
        }
        if (username.length < 3 || username.length > 20) {
            errors.push("Username must be between 3 and 20 characters")
        }
        if (username.match(/[^a-zA-Z0-9_]/)) {
            errors.push("Username must contain only letters, numbers and __'s")
        }
        if (password.match(/[^a-zA-Z0-9_?!]/)) {
            errors.push("Password must contain only letters, numbers, __'s, !!'s and ??'s")
        }
        if (password.length < 6 || password.length > 64) {
            errors.push("Password must be between 6 and 64 characters")
        }
        if (errors.length !== 0) throw new Error("Cannot create account")

        const token = await Auth.register(username, password)
        res.cookie('token', token, COOKIE)

        res.redirect('/quiz')
    } catch (err) {
        if (errors.length == 0 && err instanceof Error && err.message) {
            errors.push(err.message)
        }
        
        res.status(400).render("index", { registerErrors: errors })
    }
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
router.post("/login", auth.guestAuth, async (req, res) => {
    let errors: string[] = []

    try {
        const { username, password } = req.body

        if (!username || typeof username !== 'string' || isEmpty(username)) {
            errors.push("Username is required")
        }
        if (!password || typeof password !== 'string' || isEmpty(password)) {
            errors.push("Password is required")
        }
        if (errors.length !== 0) throw new Error("Cannot authenticate")

        const token = await Auth.login(username, password)
        res.cookie('token', token, COOKIE)

        res.redirect("/quiz")
    } catch (err) {
        if (errors.length == 0 && err instanceof Error && err.message) {
            errors.push(err.message)
        }

        res.status(400).render("index", { loginErrors: errors })
    }
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
router.get("/logout", auth.userAuth, async (req, res) => {
    res.render("logout")
})

router.post("/logout", auth.userAuth, async (req, res) => {
    res.clearCookie("token")
    res.redirect("/")
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

export default router