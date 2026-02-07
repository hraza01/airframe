import fs from "fs-extra"
import path from "path"

export function formatTargetDir(projectName, baseDir = process.cwd()) {
    return path.resolve(baseDir, "dags", projectName)
}

export function checkDagsDirectory(baseDir = process.cwd()) {
    const dagsPath = path.resolve(baseDir, "dags")
    return fs.existsSync(dagsPath) && fs.lstatSync(dagsPath).isDirectory()
}

export async function getExistingProjects(baseDir = process.cwd()) {
    const dagsPath = path.resolve(baseDir, "dags")
    if (!fs.existsSync(dagsPath)) return []
    const dirents = await fs.readdir(dagsPath, { withFileTypes: true })
    return dirents
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
}
