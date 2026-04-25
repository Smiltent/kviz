
const button = document.querySelector(".qDelete") as HTMLInputElement
const form = button.closest("form") as HTMLFormElement

let click = 0

button.addEventListener("click", (e) => {
    e.preventDefault()
    click++

    if (click < 4) {
        button.value = `Delete Quiz (confirm ${click}/3)`
    } else {
        form.submit()
    }
})