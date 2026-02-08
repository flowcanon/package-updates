# Package updates

A collection of [GitHub composite actions](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action)
for automating dependency updates and opening pull requests with changelogs.

## Actions

| Action | Description |
|--------|-------------|
| [`node`](#node) | Updates npm dependencies via `npm-check-updates` |
| [`php`](#php) | Updates Composer dependencies |
| [`python`](#python) | Updates Pipenv or Poetry dependencies (auto-detected) |

## Usage

Create a workflow that runs on a schedule (e.g. weekly) to keep dependencies up to date:

```yaml
name: Package updates

on:
  schedule:
    - cron: "0 0 * * 1"
  workflow_dispatch: ~

concurrency:
  group: ${{ github.workflow }}
  cancel-in-progress: true

jobs:
  backend-updates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: flowcanon/package-updates/python@v1
        with:
          title: (Deps) Package updates [backend]
          commit: Package updates [backend]
          branch: package-updates/backend
          post-update: |
            poetry export --only main,dev --without-hashes > requirements.txt
          reviewers: |
            myuser

  frontend-updates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: flowcanon/package-updates/node@v1
        with:
          title: (Deps) Package updates [frontend]
          commit: Package updates [frontend]
          branch: package-updates/frontend
          reviewers: |
            myuser
```

## Node

Updates npm dependencies using [npm-check-updates](https://github.com/raineorshine/npm-check-updates),
runs `npm update && npm install`, and opens a pull request with a lockfile diff.

Requires an `.nvmrc` file in the repository root.

### Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `title` | Pull request title | `Package updates [node]` |
| `branch` | Pull request branch name | `package-updates/node` |
| `commit` | Commit message | Falls back to `title` |
| `post-update` | Commands to run after updating | |
| `labels` | Comma or newline separated list of labels | `dependencies`, `javascript` |
| `assignees` | Comma or newline separated list of assignees | |
| `reviewers` | Comma or newline separated list of reviewers | |

### Outputs

| Output | Description |
|--------|-------------|
| `package-changes` | The package changes in the update |
| `pull-request-number` | The pull request number |
| `pull-request-url` | The URL of the pull request |
| `pull-request-operation` | `created`, `updated`, or `closed` |
| `pull-request-head-sha` | The commit SHA of the pull request branch |

## PHP

Updates Composer dependencies via `composer update` and opens a pull request with a lockfile diff.

### Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `title` | Pull request title | `Package updates [php]` |
| `branch` | Pull request branch name | `package-updates/php` |
| `commit` | Commit message | Falls back to `title` |
| `post-update` | Commands to run after updating | |
| `labels` | Comma or newline separated list of labels | `dependencies`, `php` |
| `assignees` | Comma or newline separated list of assignees | |
| `reviewers` | Comma or newline separated list of reviewers | |

### Outputs

| Output | Description |
|--------|-------------|
| `package-changes` | The package changes in the update |
| `pull-request-number` | The pull request number |
| `pull-request-url` | The URL of the pull request |
| `pull-request-operation` | `created`, `updated`, or `closed` |
| `pull-request-head-sha` | The commit SHA of the pull request branch |

## Python

Updates Python dependencies and opens a pull request with a lockfile diff.
Automatically detects the package manager:

- **Pipenv** — if `Pipfile.lock` is present, runs `pipenv update`
- **Poetry** — if `poetry.lock` is present, runs `poetry update`

### Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `title` | Pull request title | `Package updates [python]` |
| `branch` | Pull request branch name | `package-updates/python` |
| `commit` | Commit message | Falls back to `title` |
| `post-update` | Commands to run after updating | |
| `labels` | Comma or newline separated list of labels | `dependencies`, `python` |
| `assignees` | Comma or newline separated list of assignees | |
| `reviewers` | Comma or newline separated list of reviewers | |

### Outputs

| Output | Description |
|--------|-------------|
| `package-changes` | The package changes in the update |
| `pull-request-number` | The pull request number |
| `pull-request-url` | The URL of the pull request |
| `pull-request-operation` | `created`, `updated`, or `closed` |
| `pull-request-head-sha` | The commit SHA of the pull request branch |
