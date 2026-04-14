
import auth from "../middlewares/auth.middleware"
import Auth from "../services/Auth"

import { Router } from "express"
const router = Router()

const COOKIE = {
    httpOnly: true,
    secure: process.env.ENV === 'prod',
    sameSite: 'strict' as 'strict',
    maxAge: 24 * 60 * 60 * 1000
}

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

router.get("/register", auth.guestAuth, async (req, res) => {
    res.render("auth/register")
})

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

        res.redirect('/')
    } catch (err) {
        res.status(400).render("auth/register", { errors })
    }
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

router.get("/login", auth.guestAuth, async (req, res) => {
    res.render("auth/login")
})

router.post("/login", auth.guestAuth, async (req, res) => {
    try {
        const { username, password } = req.body

        const token = await Auth.login(username, password)
        res.cookie('token', token, COOKIE)

        res.redirect("/")
    } catch (err) {
        res.status(400).render("auth/login", { errors: [err] })
    }
})

// ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==

export default router