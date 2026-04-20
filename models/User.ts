
import mongoose, { Schema } from 'mongoose'

export default mongoose.model('User', new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    
    highScores: [{
        id: { type: String, required: true },
        score: { type: String, required: true}
    }]
}))