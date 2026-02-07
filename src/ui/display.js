import { intro, outro, log } from "@clack/prompts"
import chalk from "chalk"
import terminalLink from "terminal-link"
import figlet from "figlet"

export function printBanner() {
    console.clear()
    console.log(
        chalk.cyan(figlet.textSync("AIRFRAME", { font: "ANSI Shadow" })),
    )
    const authorLink = terminalLink("@hraza01", "https://github.com/hraza01")
    console.log(
        chalk.dim.blackBright(
            `                                         — created by ${authorLink}\n`,
        ),
    )
}

export function showWelcome(workingDir) {
    printBanner()
    intro(chalk.bold.cyanBright("The blueprint for scalable Airflow DAGs"))

    // Explicit note about Airflow support
    log.info(chalk.dim("Supports Apache Airflow 2.0 (2.8 or higher)"))
    logWorkingDir(workingDir)
    log.warn(chalk.dim("Press CTRL+C to exit the Airframe CLI.\n"))
}

export function logWorkingDir(dir = process.cwd()) {
    log.warn(
        `You are about to initialize an Airframe project in this directory:\n${chalk.dim(dir)}`,
    )
}

export function showCompletion({ targetDir }) {
    outro(chalk.green.bold(`Airframe project initialized.`))

    console.log(
        chalk.bold.magenta(
            `Project directory: ${chalk.underline(targetDir)}\n`,
        ),
    )

    console.log(chalk.bold.blueBright("Happy Orchestrating!"))
}

export function printHelp() {
    printBanner()

    console.log(chalk.bold("Usage:"))
    console.log("  npx create-airframe-dag@latest [options]\n")

    console.log(chalk.bold("Options:"))
    console.log(
        "  --airflow-path <path>   Specify the path to your Airflow root directory",
    )
    console.log("  -v, --version           Show version number")
    console.log("  -h, --help              Show this help message\n")

    console.log(chalk.dim("Examples:"))
    console.log("  npx create-airframe-dag@latest")
    console.log("  npx create-airframe-dag@latest --version\n")
}

export function printVersion(version) {
    console.log(chalk.bold(`v${version}`))
}

// Helper to wrap text with indentation for subsequent lines
function formatDescription(text, width, indent) {
    if (!text) return ""
    const words = text.split(" ")
    let lines = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
        if (currentLine.length + 1 + words[i].length <= width) {
            currentLine += " " + words[i]
        } else {
            lines.push(currentLine)
            currentLine = words[i]
        }
    }
    lines.push(currentLine)

    return lines.join("\n" + indent)
}

export function displayTemplates(templates) {
    log.info(chalk.bold("Available Templates"))

    const maxLabelLen = Math.max(...templates.map((t) => t.label.length))

    templates.forEach((t) => {
        const pad = " ".repeat(maxLabelLen - t.label.length)
        const indent = " ".repeat(maxLabelLen + 4)
        const desc = formatDescription(t.description || "", 45, indent)

        log.message(`${chalk.cyan(t.label)}${pad}    ${chalk.dim(desc)}`)
    })
}
