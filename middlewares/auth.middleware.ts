
import type { NextFunction, Request, Response } from "express"
import User from "@/models/User"
import jwt from "jsonwebtoken"

interface AuthReq extends Request {
    user?: {
        id: string,
        username: string,
        roles: string[]
    }
}

async function userAuth(req: AuthReq, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.token
        if (!token) return res.status(401).json({ error: "Unauthorized"})

        const payload: any = jwt.verify(token, String(process.env.JWT_SECRET))

        const user = await User.findById(payload.id)
        if (!user) {
            res.clearCookie("token")
            return res.status(404).json({ error: "User account not found, you've been logged out!" })
        }

        req.user = user
        return next()
    } catch (err) {
        return res.redirect("/")
    }
}

async function guestAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.token
        if (token) return res.status(403).json({ error: "Forbidden"})

        return next()
    } catch (err) {
        return res.redirect("/quiz")
    }
}

function requireRole(role: string) {
    return async (req: AuthReq, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({error: "Unauthorized"})
        if (!req.user.roles.includes(role)) return res.status(403).json({error: "Forbidden"})

        next()
    }
}

export default { userAuth, guestAuth, requireRole }