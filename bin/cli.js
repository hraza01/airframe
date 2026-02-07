#!/usr/bin/env node

import { main } from "../src/main.js"
import chalk from "chalk"

main().catch((err) => {
    console.error(chalk.red("Unexpected error:"), err)
    process.exit(1)
})
