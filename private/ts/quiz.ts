
let shuffleQuestions: Question[] = []
let currentIdx: number = 0
let results: Result[] = []
let quizid: string = ""

interface Answer {
    text: string
    isCorrect: boolean
}

interface Question {
    question: string
    answers: Answer[]
    _id: string
}

interface Result {
    questionId: string
    selectedAnswer: string
}

interface QuizEndResponse {
    correct: number
    total: number
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5)
}

function init(data: Question[], id: string) {
    shuffleQuestions = shuffle(data)
    quizid = id
    showQuestion()
}

function updateProgressBar() {
    const progressBar = document.getElementById("quizProgressBar")
    const progressBarLabel = document.getElementById("quizProgressLabel")

    const total = shuffleQuestions.length
    const percent = total > 0 ? (currentIdx / total) * 100 : 0

    if (progressBar) {
        progressBar.style.width = `${percent}%`

        progressBar.setAttribute("aria-valuenow", String(currentIdx))
        progressBar.setAttribute("aria-valuenow", String(total))
    }

    if (progressBarLabel) {
        progressBarLabel.textContent = `${currentIdx} / ${total}`
    }
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function showQuestion() {
    if (currentIdx >= shuffleQuestions.length) return submitResults()
    
    const qq = shuffleQuestions[currentIdx]
    if (!qq) return

    const shuffledAnswers = shuffle(qq.answers)
    updateProgressBar()

    const questionElement = document.getElementById("quizQuestion")
    if (questionElement) {
        if (/[!?.]$/.test(qq?.question)) {
            questionElement.textContent = `Q${currentIdx + 1}: ${qq?.question}`
        } else {
            questionElement.textContent = `Q${currentIdx + 1}: ${qq?.question}?`
        }
    }

    const answersContainer = document.getElementById("quizAnswers")
    if (!answersContainer) return

    answersContainer.innerHTML = ""

    shuffledAnswers.forEach((answer: Answer, i: number) => {
        const id = `answer${i + 1}`

        const radio = document.createElement("input")
        radio.type = "radio"
        radio.name = "quizAnswer"
        radio.id = id
        radio.value = answer.text

        const label = document.createElement("label")
        label.htmlFor = id
        label.textContent = answer.text

        const wrapper = document.createElement("div")
        wrapper.classList.add("answer-option")
        wrapper.appendChild(radio)
        wrapper.appendChild(label)

        answersContainer.appendChild(wrapper)
    })

    const btn = document.createElement("input")
    btn.type = "submit"
    btn.id = "nextBtn"

    btn.value = currentIdx === shuffleQuestions.length -1 ? "Finish" : "Next"
    btn.onclick = handleNext

    answersContainer.appendChild(btn)
}

function handleNext() {
    const selected = document.querySelector<HTMLInputElement>(
        'input[name="quizAnswer"]:checked'
    )

    if (!selected) return alert("Please submit an answer! 😤😤😤")

    results.push({
        questionId: shuffleQuestions[currentIdx]!._id,
        selectedAnswer: selected.value
    })

    currentIdx++;
    showQuestion()
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
async function submitResults() {
    const container = document.querySelector(".quiz")
    if (!container) return

    container.innerHTML = `<p>Submitting...</p>`

    try {
        const res = await fetch ("/quiz/end", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ quizid, results })
        })

        if (!res.ok) throw new Error(`Server error: ${res.status}`)

        const data: QuizEndResponse = await res.json()
        showResults(data)
    } catch (err) {
        container.innerHTML = `
            <h1>Something went wrong!</h1>
        `
    }
}

function showResults(data: QuizEndResponse) {
    const container = document.querySelector(".quiz")
    if (!container) return

    container.innerHTML = `
        <div class="header flex">
            <div class="qTitle flex">
                <h1>Quiz Complete!</h1>
                <a href="/quiz">main page</a>
            </div>
        </div>
        
        <p>You scored ${data.correct} out of ${data.total}!
    `
}

(window as any).init = init