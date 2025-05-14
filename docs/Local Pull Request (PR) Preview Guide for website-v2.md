# Local Pull Request (PR) Preview Guide: website-v2

This guide outlines how to check out, build, and test Pull Requests (PRs) on your local development environment for the `website-v2` project.

## Prerequisites

*   `website-v2` project cloned.
*   Initial local development environment setup completed as per the project's `README.md` (Docker, Python 3.11, `.env` configured, `nvm`/`yarn` for CSS, etc.).
* An `upstream` remote configured in your local Git repository to point to the main `boostorg/website-v2` repository. If you haven't done this:
    ```bash
    # Run this once from your project directory
    git remote add upstream https://github.com/boostorg/website-v2.git
    ```
*   Familiarity with basic Git commands.

## Previewing a PR

Let's use PR #1768 (`julioest:fix-anchor-links` into `boostorg:develop`) as an example.

1.  **Navigate to Project Directory:**
    ```bash
    cd path/to/website-v2
    ```

2.  **Ensure Your Local `develop` Branch is Up-to-Date:**
   ```bash
   git checkout develop
   git fetch upstream develop
   git rebase upstream/develop
   ```

3.  **Fetch and Checkout the PR:**
    This command fetches the PR's changes from the main `boostorg` repository (referred to as `upstream`) and creates a new local branch for it.

    For PR #1768, you can name your local branch something like `preview/1768-fix-anchor-links`:
    ```bash
    # e.g. git fetch upstream refs/pull/1768/head:preview/1768-fix-anchor-links
    git fetch upstream refs/pull/PR_NUMBER/head:your-local-branch-name
    
    ```
    Then, switch to your new local branch:
    ```bash
    # e.g. git checkout preview/1768-fix-anchor-links
    git checkout your-local-branch-name
    ```
    *(Alternatively, if you have the GitHub CLI `gh` installed and configured: `gh pr checkout 1768`)*

4.  **Rebuild Assets & Restart Services:**
    PRs can introduce changes to code, Python dependencies, Node.js packages, or static assets like CSS. These steps ensure your local environment reflects these changes.

    *   **Rebuild CSS:**
        (Ensure you are using the correct Node.js version, e.g., Node 20 via `nvm use 20` if you switched versions)
        ```bash
        # Install/update yarn packages if package.json or yarn.lock changed in the PR
        yarn install

        # Build the CSS (use 'yarn dev-windows' if you are on Windows)
        yarn build
        ```

    *   **Rebuild Docker Images and Restart Services:**
        The `--build` flag is essential to incorporate changes like the updated `styles.css` or any modifications to the `Dockerfile` or Python requirements.
        ```bash
        # Stop any currently running services (if any)
        docker compose down

        # Build images (especially the 'web' service) and start services
        docker compose up --build
        ```

5.  **Test the Changes:**
    Open your web browser and navigate to your local development site, typically:
    `http://localhost:8000` (or the port configured in your `.env` file). 
    Verify the changes introduced by the PR.

## Updating an Active PR Branch

If a PR you've already checked out (e.g., `preview/1768-fix-anchor-links`) gets updated on GitHub with new commits:

1.  Make sure you are on your local branch for that PR:
    ```bash
    git checkout preview/1768-fix-anchor-links
    ```
2.  Ensure you have no uncommitted local changes on this branch. Stash or commit them if necessary.
3.  Fetch the latest changes for that specific PR and reset your local branch to it:
    ```bash
    # Format: git fetch origin refs/pull/PR_NUMBER/head
    #         git reset --hard FETCH_HEAD
    git fetch origin refs/pull/1768/head
    git reset --hard FETCH_HEAD
    ```
4.  After updating the code, **repeat Step 4 (Rebuild Assets & Restart Services)** from the "Previewing a PR" section to ensure all changes are applied locally.

## Key Reminders & Suggestions

*   **Always Rebuild:** After checking out a PR or pulling updates to an existing PR branch, *always* rebuild CSS assets (Step 4a) and rebuild Docker images using `docker compose up --build` (Step 4b). This is the most common reason for not seeing changes.
*   **Check PR Description:** Look at the PR description on GitHub for any special testing instructions or notes from the developer.
*   **`just` command:** The project `README.md` mentions a `justfile`. Where you'll  find convenient shortcuts for some of these command sequences.
