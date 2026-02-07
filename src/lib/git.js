import { execa } from "execa"

export async function initGitRepo(dir) {
    try {
        await execa("git", ["init"], { cwd: dir })
        return true
    } catch (error) {
        // Silently fail if git init fails, or throw if critical.
        // For a scaffolding tool, it's usually better to warn than crash.
        // But for now, we'll just throw so the caller can decide.
        throw new Error(`Failed to initialize git repository: ${error.message}`)
    }
}
