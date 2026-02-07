import fs from "fs-extra"
import path from "path"

export async function replaceInFiles(dir, replacements) {
    const files = await getFiles(dir)

    for (const file of files) {
        // Only process text files we care about, e.g., .py, .md, .txt, .json
        // For a DAG template, .py is critical.
        if (shouldProcess(file)) {
            let content = await fs.readFile(file, "utf8")
            let changed = false

            for (const [key, value] of Object.entries(replacements)) {
                // Replace all occurrences
                const regex = new RegExp(key, "g")
                if (regex.test(content)) {
                    content = content.replace(regex, value)
                    changed = true
                }
            }

            if (changed) {
                await fs.writeFile(file, content, "utf8")
            }
        }
    }
}

async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
        dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name)
            return dirent.isDirectory() ? getFiles(res) : res
        }),
    )
    return Array.prototype.concat(...files)
}

function shouldProcess(filePath) {
    const ext = path.extname(filePath)
    // Add extensions you want to scan for replacement
    return [".py", ".md", ".json", ".txt", ".yaml", ".yml"].includes(ext)
}
