
import type { NextFunction, Request, Response } from "express"
import User from "@/models/User"
import jwt from "jsonwebtoken"

export default async function root(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token

    if (token) {
        try {
            const payload: any = jwt.verify(token, String(process.env.JWT_SECRET))
            const user = await User.findById(payload.id).lean()

            if (!user) return res.status(403).send("There has been a server error!")

            res.locals.user = {
                authorized: true,
                
                id: user._id,
                username: user.username,
            }
        } catch (err) {
            console.error(`JWT Authorization error: ${err}`)
            res.locals.user = { authorized: false }
        }
    } else {
        res.locals.user = { authorized: false }
    }

    next()
    console.debug(`${res.locals.user.authorized} ${req.ip} | ${req.method} ${res.statusCode} ${req.originalUrl}`)
}