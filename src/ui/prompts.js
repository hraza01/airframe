import { text, select, isCancel, cancel } from "@clack/prompts"
import ora from "ora"

export function createSpinner() {
    return ora()
}

export async function askForProjectDetails(existingProjects = []) {
    const projectName = await text({
        message: "What is the name of your Airflow DAG?",
        hint: "This will be the name of the DAG folder and the DAG ID.",
        placeholder: "my_dag_project",
        validate(value) {
            if (!value || value.trim().length === 0)
                return "Project name is required!"
            if (/[^a-zA-Z_]/.test(value))
                return "Project name should only contain letters and underscores (no numbers, dashes, or spaces)."
            if (
                existingProjects.some(
                    (p) => p.toLowerCase() === value.toLowerCase(),
                )
            )
                return `Project "${value}" already exists in dags/ directory.`
        },
    })

    if (isCancel(projectName)) {
        cancel("Operation cancelled.")
        process.exit(0)
    }

    const dagAuthor = await text({
        message: "Who is the author of this Airflow DAG?",
        placeholder: "Anakin Skywalker",
        validate(value) {
            if (!value || value.trim().length === 0)
                return "Author name is required!"
            if (value.toLowerCase() === "airflow")
                return "Author name cannot be 'airflow'."
            if (/[^a-zA-Z\s_]/.test(value))
                return "Author name must only contain letters, spaces, and underscores."
        },
    })

    if (isCancel(dagAuthor)) {
        cancel("Operation cancelled.")
        process.exit(0)
    }

    return { projectName, dagAuthor }
}

export async function selectTemplate(templates) {
    // 1. Find max label length for padding
    const maxLabelLen = Math.max(...templates.map((t) => t.label.length))

    const options = templates.map((t) => {
        // 2. Pad label
        const pad = " ".repeat(maxLabelLen - t.label.length)
        const label = `${t.label}${pad}`

        // 3. Use standard hint property (accepting brackets to keep UI clean)
        const hint = t.hint || ""

        return {
            value: t,
            label: label,
            hint: hint,
        }
    })

    const template = await select({
        message: "Select a template to scaffold:",
        options: options,
    })

    if (isCancel(template)) {
        cancel("Operation cancelled.")
        process.exit(0)
    }

    return template
}
