
const questionContainer = document.getElementById("qContainer") as HTMLDivElement
const questionAddButton = document.getElementById("qAddButton") as HTMLButtonElement
const questionForm = document.getElementById("qForm") as HTMLFormElement
const questionInput = document.getElementById("qInput") as HTMLInputElement
const formError = document.getElementById("qFormError") as HTMLParagraphElement

interface Answers {
    text: String;
    isCorrect: Boolean;
}

interface Questions {
    question: string;
    answers: Answers[];
}

function createAnswer() {
    const aDiv = document.createElement("div")
    aDiv.classList.add("qAnswerRow")

    aDiv.innerHTML = `
        <label class="qCorrectLabel">
            <input type="checkbox" class="qIsCorrect">
        </label>
        <input type="text" placeholder="Answer" class="qAnswerText" required>
        <button type="button" class="qRemoveAnswerBtn">Remove</button>
    `

    aDiv.querySelector(".qRemoveAnswerBtn")?.addEventListener("click", () => {
        aDiv.remove()
    })

    return aDiv
}

function reNumberQuestions() {
    questionContainer.querySelectorAll(".qQuestion").forEach((q, i) => {
        const span = q.querySelector(".qNumber")
        if (span) {
            span.textContent = `${i + 1}. `
        }
    })
}

// add more questions
questionAddButton.addEventListener("click", () => {
    const qDiv = document.createElement("div")
    qDiv.classList.add("qQuestion")

    qDiv.innerHTML = `
        <div class="qCreateTitle flex">
            <span class="qNumber"></span>
            <input type="text" placeholder="Question" class="qQuestionText" required>
            <button type="button" class="qRemoveQuestionBtn betterBtn qDelete">Remove</button>
        </div>  
        <div class="qAnswers"></div>

        <p class="red qQuestionError" role="alert"></p>
        <button type="button" class="qAnswerBtn betterBtn">Add Answer</button>
    `

    let answers = qDiv.querySelector(".qAnswers")
    for (let i = 0; i < 4; i++) {
        answers?.appendChild(createAnswer())
    }

    qDiv.querySelector(".qRemoveQuestionBtn")?.addEventListener("click", () => {
        qDiv.remove()
        reNumberQuestions()
    })

    qDiv.querySelector(".qAnswerBtn")?.addEventListener("click", (e) => {
        const answersDiv = (e.target as HTMLButtonElement).parentElement?.querySelector(".qAnswers")
        const aDiv = createAnswer()

        answersDiv?.appendChild(aDiv)
    })

    questionContainer.appendChild(qDiv)
    reNumberQuestions()
})

questionForm.addEventListener("submit", (e) => {
    let valid = true

    formError.textContent = ""
    questionContainer.querySelectorAll(".qQuestionError").forEach(el => {
        el.textContent = ""
    })
    
    const que = document.querySelectorAll(".qQuestion")
    if (que.length === 0) {
        formError.textContent = "Add at least one question!!"
        return e.preventDefault()
    }

    que.forEach((q, i) => {
        const checkboxes = q.querySelectorAll(".qIsCorrect")
        const hasCorrect = Array.from(checkboxes).some(
            cb => (cb as HTMLInputElement).checked
        )

        if (!hasCorrect) {
            valid = false
            const err = q.querySelector(".qQuestionError")
            if (err) {
                err.textContent = "This question needs at least one correct answer!!"
            }
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