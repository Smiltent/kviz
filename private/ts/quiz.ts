
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
        progressBar.setAttribute("aria-valuemax", String(total))
    }

    if (progressBarLabel) {
        progressBarLabel.textContent = `${currentIdx} / ${total}`
    }
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function showQuestion() {
    const errorEl = document.getElementById("quizError")
    if (errorEl) {
        errorEl.textContent = ""
    }
            
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
        radio.classList.add("visuallyHidden")

        const label = document.createElement("label")
        label.htmlFor = id
        label.textContent = answer.text

        const wrapper = document.createElement("div")
        wrapper.classList.add("answer-option")
        wrapper.appendChild(radio)
        wrapper.appendChild(label)

        wrapper.addEventListener("click", () => {
            radio.checked = true
            answersContainer.querySelectorAll(".answer-option").forEach(el => el.classList.remove("selected")) 
            wrapper.classList.add("selected")
        })

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
    const errorEl = document.getElementById("quizError")
    if (errorEl) {
        errorEl.textContent = ""
    }
    
    const selected = document.querySelector<HTMLInputElement>(
        'input[name="quizAnswer"]:checked'
    )

    if (!selected) {
        if (errorEl) {
            errorEl.textContent = "Please select an answer before continuing!!"
        }
        return
    }

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
        const res = await fetch("/quiz/end", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ quizid, results })
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => null)
            throw new Error(errorData?.error ?? `Server error: ${res.status}`)
        }

        const data: QuizEndResponse = await res.json()
        showResults(data)
    } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred"
        container.innerHTML = `
            <h1>Something went wrong!</h1>
            <p>${message}</p>
        `
    }
}

function showResults(data: QuizEndResponse) {
    const container = document.querySelector(".quiz")
    if (!container) return

    let sec = 5

    container.innerHTML = `
        <div class="header flex">
            <h1>Quiz Complete!</h1>
        </div>
        
        <p>You scored ${data.correct} out of ${data.total}!</p>
    `

    const countdownEl = document.getElementById("quizRedirect")

    const timer = setInterval(() => {
        sec--
        if (countdownEl) {
            countdownEl.textContent = String(sec)
        }

        if (sec <= 0) {
            clearInterval(timer)
            window.location.href = "/quiz"
        }
    }, 1000)
}

(window as any).init = init