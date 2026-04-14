
import mongoose, { Schema } from 'mongoose'

export default mongoose.model('Quiz', new Schema({
    title: { type: String, required: true, unique: true },       // "Sports"

    questions: [{ 
        question: { type: String, require: true },               // "Which one of these are a sport?"
        answers: [{ 
            text: { type: String, required: true },              // "Football"
            isCorrect: { type: Boolean, required: true }         // true
        }]
    }]
}))