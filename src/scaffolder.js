import tiged from "tiged"
import { replaceInFiles } from "./lib/filesystem.js"

export async function scaffoldProject({ template, targetDir }) {
    // template.id should be the branch name, tag, or value
    const uri = `hraza01/airframe-templates#${template.branch || template.id || template.value}`

    const emitter = tiged(uri, {
        disableCache: true,
        force: true,
        verbose: false,
    })

    try {
        await emitter.clone(targetDir)
    } catch (error) {
        throw new Error(`Failed to scaffold project: ${error.message}`)
    }
}

export async function customizeProject({
    targetDir,
    projectName,
    dagAuthor,
    template,
}) {
    try {
        await replaceInFiles(targetDir, {
            __PROJECT_NAME__: projectName,
            __DAG_ID__: projectName,
            __DAG_AUTHOR__: dagAuthor,
        })

        // Cleanup for Advanced template
        if (template && template.label === "Advanced") {
            await replaceInFiles(targetDir, {
                "# fmt: off\\n": "",
                "# isort: off\\n": "",
                "# isort: on\\n": "",
                "# fmt: on\\n": "",
            })
        }
    } catch (error) {
        throw new Error(`Failed to customize project files: ${error.message}`)
    }
}
