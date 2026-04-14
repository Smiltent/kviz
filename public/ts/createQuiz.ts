
const addQuestionButton = document.getElementById("addQuestion") as HTMLButtonElement

interface Quiz {
    title: String,

    questions: [{ 
        question: String,
        answers: [{ 
            text: String,
            isCorrect: Boolean
        }]
    }]
}

