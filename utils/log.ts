
import chalk from "chalk"
import path from "path"

const YELLOW = chalk.bgHex("hsl(49, 77%, 49%)")
const ORANGE = chalk.bgHex("#f05e0a")
const BLUE = chalk.bgHex("#1e66f5")
const GRAY = chalk.bgHex("#232634")
const RED = chalk.bgHex("#d20f39")

function getTime() {
    const date = new Date()

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    const seconds = String(date.getSeconds()).padStart(2, '0')
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0')

    return `${hours}:${minutes}:${seconds}.${milliseconds}`
}

function getCaller() {
    const stack = new Error().stack
    if (!stack) return "unknown"

    const lines = stack.split("\n")

    const caller = lines[3]
    if (!caller) return "unknown"

    const match =
        caller.match(/\((.*):(\d+):(\d+)\)/) ||
        caller.match(/at (.*):(\d+):(\d+)/)

    if (!match) return "unknown"

    const filePath = match[1] ?? "?"
    const line = match[2] ?? "?"

    return `${path.basename(filePath)}:${line}`
}

export default function logging(debugMode: boolean) {
    const base = (level: string, ...args: any[]) => {
        const caller = getCaller()

        process.stdout.write(
            `${level}${GRAY(` [${caller}] ${getTime()} `)} ${args}\n`
        )
    }

    console.log = (...args) => base("", ...args)
    console.warn = (...args) => base(`${YELLOW(" warn ")}`, ...args)
    console.error = (...args) => base(`${RED(" error ")}`, ...args)
    console.info = (...args) => base(`${BLUE(" info ")}`, ...args)

    debugMode == true ? console.debug = (...args) => base(`${ORANGE(" debug ")}`, ...args) : console.debug = () => {}
    console.debug("Debug mode is enabled")
}