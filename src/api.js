export async function fetchTemplates() {
    const MANIFEST_URL =
        "https://raw.githubusercontent.com/hraza01/airframe-templates/main/templates.json"

    try {
        const response = await fetch(MANIFEST_URL)
        if (!response.ok) {
            throw new Error(`Failed to fetch templates: ${response.statusText}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        throw new Error(
            `Could not connect to template registry: ${error.message}`,
        )
    }
}
