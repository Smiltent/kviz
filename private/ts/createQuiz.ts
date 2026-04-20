
const questionContainer = document.getElementById("qContainer") as HTMLDivElement
const questionAddButton = document.getElementById("qAddButton") as HTMLButtonElement
const questionForm = document.getElementById("qForm") as HTMLFormElement
const questionInput = document.getElementById("qInput") as HTMLInputElement

interface Answers {
    text: String;
    isCorrect: Boolean;
}

interface Questions {
    question: string;
    answers: Answers[];
}

questionAddButton.addEventListener("click", () => {
    const qDiv = document.createElement("div")
    qDiv.classList.add("question")

    qDiv.innerHTML = `
        <hr>
        <input type="text" placeholder="Question text" class="question-text" required>
        <div class="answers"></div>

        <button type="button" class="qAnswerBtn">Add Answer</button>
    `

    qDiv.querySelector(".qAnswerBtn")?.addEventListener("click", (e) => {
        const answersDiv = (e.target as HTMLButtonElement).parentElement?.querySelector(".answers")
        const aDiv = document.createElement("div")

        aDiv.innerHTML = `
            <input type="text" placeholder="Answer text" class="answer-text" required>
            <label>
                <input type="checkbox" class="is-correct">
                Correct
            </label>
        `
        answersDiv?.appendChild(aDiv)
    })

    questionContainer.appendChild(qDiv)
})

questionForm.addEventListener("submit", () => {
    const questions: Questions[] = []

    document.querySelectorAll(".question").forEach(qDiv => {
        const questionText = (qDiv.querySelector(".question-text") as HTMLInputElement).value
        const answers: Answers[] = []

        qDiv.querySelectorAll(".answers > div").forEach(aDiv => {
            const text = (aDiv.querySelector(".answer-text") as HTMLInputElement).value
            const isCorrect = (aDiv.querySelector(".is-correct") as HTMLInputElement).checked

            answers.push({
                text,
                isCorrect
            })
        })

        questions.push({
            question: questionText,
            answers
        })
    })

    questionInput.value = JSON.stringify(questions)
})