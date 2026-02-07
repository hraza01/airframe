# Airframe

> The blueprint for scalable Airflow DAGs

Airframe is a CLI tool designed to scaffold production-ready Apache Airflow DAG projects with best practices built-in. It helps you quickly customize and generate DAG structures from curated templates, ensuring consistency and scalability across your data pipelines.

## Features

- 🚀 **Interactive Scaffolding**: Easy-to-use CLI wizard to set up your project.
- 📦 **Curated Templates**: Choose from a variety of pre-defined DAG patterns (fetched dynamically from the [Airframe Template Registry](https://github.com/hraza01/airframe-templates)).
- 🔧 **Best Practices**: Enforces a structured project layout within your `dags/` directory.
- 🛠 **Automated Setup**: Handles directory creation, variable substitution, and Git initialization.

## Prerequisites

- **Node.js**: Version 20.5.0 or higher.
- **Airflow Environment**: You must run this tool from the root of your Airflow project (specifically, a directory that contains a `dags/` folder).

## Usage

To start a new Airframe project, run the following command in your terminal:

```bash
npx create-airframe-dag@latest
```

Follow the interactive prompts to:

1.  Define your project details (Name, Author).
2.  Select a template.
3.  Scaffold the project into your `dags/` directory.

### Options

- `--airflow-path <path>`: Specify the path to your Airflow root directory if you are not running the command from there.
- `-v, --version`: Show the current CLI version.
- `-h, --help`: Show help information.

## How It Works

1.  **Checks Environment**: Verifies that a `dags/` directory exists in the current (or specified) location.
2.  **Fetches Templates**: Retrieves the latest templates from the central registry.
3.  **Collects Details**: Prompts you for formatting configuration and project metadata.
4.  **Generates Code**: Creates a new directory `dags/<project-name>`, generates the boilerplate code for the selected template, and customizes it with your provided details.
5.  **Git Init**: Initializes a new Git repository within the specific project folder for version control.

## Project Structure

Airframe creates the following structure for each project:

```
your-airflow-env/
└── dags/
    └── <airframe_project_name>/   # Created by Airframe
        ├── README.md              # Project-specific documentation
        ├── .gitignore             # Git ignore file for the project
        ├── main.py                # DAG definition
        ├── sql/                   # Directory for SQL files
        └── ...                    # Other files
```

## Contributing

Created by [@hraza01](https://github.com/hraza01).
