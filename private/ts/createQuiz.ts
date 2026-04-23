
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

// add more questions
questionAddButton.addEventListener("click", () => {
    const qDiv = document.createElement("div")
    qDiv.classList.add("qQuestion")

    qDiv.innerHTML = `
        <hr class="pbHr">
        <div class="qCreateTitle flex">
            <input type="text" placeholder="Question" class="qQuestionText" required>
            <button type="button" class="qRemoveQuestionBtn">Remove</button>
        </div>  
        <div class="qAnswers"></div>

        <button type="button" class="qAnswerBtn">Add Answer</button>
    `

    qDiv.querySelector(".qRemoveQuestionBtn")?.addEventListener("click", () => {
        qDiv.remove()
    })

    qDiv.querySelector(".qAnswerBtn")?.addEventListener("click", (e) => {
        const answersDiv = (e.target as HTMLButtonElement).parentElement?.querySelector(".qAnswers")
        const aDiv = document.createElement("div")

        aDiv.innerHTML = `
            <input type="checkbox" class="qIsCorrect">
            <input type="text" placeholder="Answer" class="qAnswerText" required>

            <button type="button" class="qRemoveAnswerBtn">Remove</button>
        `

        aDiv.querySelector(".qRemoveAnswerBtn")?.addEventListener("click", () => {
            aDiv.remove()
        })

        answersDiv?.appendChild(aDiv)
    })

    questionContainer.appendChild(qDiv)
})

questionForm.addEventListener("submit", (e) => {
    let valid = true

    // validate if the questions has at least one correct selected
    const que = document.querySelectorAll(".qQuestion")
    if (que.length === 0) {
        alert("Please add at least one question!! 😡😡😡")
        return e.preventDefault()
    }

    que.forEach((q, i) => {
        const checkboxes = q.querySelectorAll(".qIsCorrect")
        const hasCorrect = Array.from(checkboxes).some(
            cb => (cb as HTMLInputElement).checked
        )

        if (!hasCorrect) {
            valid = false
            alert(`Question ${i + 1} must have at least one correct answer`)
        }
    })

    if (!valid) return e.preventDefault()

    const questions: Questions[] = []

    // parse for backend submittion
    document.querySelectorAll(".qQuestion").forEach(qDiv => {
        const questionText = (qDiv.querySelector(".qQuestionText") as HTMLInputElement).value
        const answers: Answers[] = []

        qDiv.querySelectorAll(".qAnswers > div").forEach(aDiv => {
            const text = (aDiv.querySelector(".qAnswerText") as HTMLInputElement).value
            const isCorrect = (aDiv.querySelector(".qIsCorrect") as HTMLInputElement).checked

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