import { initCommand } from "./commands/init.js"
import { printHelp, printVersion } from "./ui/display.js"
import chalk from "chalk"
import fs from "fs-extra"

// Enforce Node Version Check
const requiredVersion = 20
const currentVersion = process.versions.node.split(".")[0]
if (currentVersion < requiredVersion) {
    console.error(
        chalk.red(
            `Error: Node.js version ${requiredVersion}+ is required. You are running version ${process.versions.node}.`,
        ),
    )
    process.exit(1)
}

// Read package.json for version
const pkg = fs.readJsonSync(new URL("../package.json", import.meta.url))

export async function main() {
    const args = process.argv.slice(2)
    // Basic argument parsing
    let command = args[0]
    let airflowPath

    // Check for --airflow-path argument anywhere
    const pathIndex = args.indexOf("--airflow-path")
    if (pathIndex !== -1 && args[pathIndex + 1]) {
        airflowPath = args[pathIndex + 1]
        // If the command was actually the path flag (e.g. "airframe --airflow-path ... init")
        // we need to find the real command.
        // Simple heuristic: First arg that isn't a flag or a value of a flag.
        // For now, let's just stick to typical usage or basic filter.
        if (command === "--airflow-path") {
            // Try to find the real command
            const nonFlagArgs = args.filter(
                (arg, idx) =>
                    arg !== "--airflow-path" &&
                    args[idx - 1] !== "--airflow-path",
            )
            command = nonFlagArgs[0]
        }
    }

    // Handle flags anywhere
    if (args.includes("--version") || args.includes("-v")) {
        printVersion(pkg.version)
        process.exit(0)
    }

    if (args.includes("--help") || args.includes("-h")) {
        printHelp()
        process.exit(0)
    }

    // If no command is provided, default to "init"
    if (!command) {
        command = "init"
    }

    // Handle commands
    switch (command) {
        case "init":
            await initCommand({ airflowPath })
            break
        default:
            printHelp()
            break
    }
}
