
import type { NextFunction, Request, Response } from "express"
import User from "../models/User"
import jwt from "jsonwebtoken"

async function userAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.token
        if (!token) throw new Error("Unauthorized")

        const payload: any = jwt.verify(token, String(process.env.JWT_SECRET))

        const user = await User.findById(payload.id)
        if (!user) throw new Error("Cannot find user")

        return next()
    } catch (err) {
        return res.redirect("/")
    }
}

async function guestAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.token
        if (token) throw new Error("Authorized")

        return next()
    } catch (err) {
        return res.redirect("/")
    }
}

export default { userAuth, guestAuth }