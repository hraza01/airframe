import { fetchTemplates } from "../api.js"
import { scaffoldProject, customizeProject } from "../scaffolder.js"
import {
    checkDagsDirectory,
    formatTargetDir,
    getExistingProjects,
} from "../lib/env.js"
import { initGitRepo } from "../lib/git.js"
import { showWelcome, displayTemplates, showCompletion } from "../ui/display.js"
import {
    createSpinner,
    askForProjectDetails,
    selectTemplate,
} from "../ui/prompts.js"
import { log } from "@clack/prompts"
import chalk from "chalk"
import readline from "node:readline"

export async function initCommand({ airflowPath } = {}) {
    const baseDir = airflowPath ? String(airflowPath) : process.cwd()

    await showWelcome(baseDir)

    // Step 0: Check for dags directory
    if (!checkDagsDirectory(baseDir)) {
        log.error(`No "dags" directory found in path: ${baseDir}`)
        log.warn(
            "Please run `airframe init` from your airflow environment directory.",
        )
        process.exit(1)
    }

    const s = createSpinner()

    // Step 1: Fetch Templates
    let templates
    try {
        templates = await fetchTemplates()
    } catch (error) {
        console.error(chalk.red(error.message))
        process.exit(1)
    }

    // Step 2: Project Details
    const existingProjects = await getExistingProjects(baseDir)
    const { projectName, dagAuthor } =
        await askForProjectDetails(existingProjects)

    // Step 3: Select Template
    displayTemplates(templates)
    const template = await selectTemplate(templates)

    const targetDir = formatTargetDir(projectName, baseDir)

    // Step 4: Scaffold
    console.log(chalk.dim("│"))
    s.start(`Scaffolding project in ${targetDir}...`)
    try {
        await scaffoldProject({ template, targetDir })
        s.stop()
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0)
        log.success("Scaffolding complete.")
    } catch (error) {
        s.stop()
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0)
        log.error("Scaffolding failed.")
        console.error(chalk.red(error.message))
        process.exit(1)
    }

    // Step 5: Setup project
    s.start("Setting up project...")
    try {
        await customizeProject({ targetDir, projectName, dagAuthor, template })
        s.stop()
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0)
        log.success("Project setup complete.")
    } catch (error) {
        s.stop()
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0)
        log.error("Project setup failed.")
        console.error(chalk.red(error.message))
        process.exit(1)
    }

    // Step 6: Git Init
    try {
        await initGitRepo(targetDir)
    } catch (error) {
        log.warn(`Failed to initialize git repository: ${error.message}`)
    }

    // Step 7: Done
    showCompletion({ targetDir })
}
