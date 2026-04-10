
import mongoose, { Schema } from 'mongoose'

export default mongoose.model('Quiz', new Schema({
    title: { type: String, required: true, unique: true },
    questions: [
        { 
            text: { type: String, required: true },
            isCorrect: { type: Boolean, required: true }
        },
    ],
}))