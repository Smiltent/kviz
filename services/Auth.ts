
import User from "@/models/User"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

export default class Auth {
    public static async register(username: string, password: string) { 
        const existing = await User.findOne({ username })
        if (existing) throw new Error("Username is already taken")

        const hash = await bcrypt.hash(password, 12)
        await User.create({ username, password: hash })

        return this.login(username, password)
    }

    public static async login(username: string, password: string) { 
        const user = await User.findOne({ username })
        if (!user) throw new Error("User with that password not found")

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error("User with that password not found")
        
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' })
    }

    public static async delete(username: string) {
        const user = await User.findOne({ username })
        if (!user) throw new Error("User doesn't exist")

        await user.deleteOne()

        return true
    }
    
    public static async list() {
        return await User.find().select("-password -__v")
    }
} 