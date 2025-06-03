# Boost.org QA Handbook

## Overview
This QA Handbook outlines the Quality Assurance processes, tools, and test coverage for the boost.org website, including the boostorg/website-v2, boostorg/website-v2-docs, and boostorg/boostlook repositories. It serves as a reference for QA team members to ensure consistent testing, bug reporting, and release validation, with a strong focus on the critical library documentation. The handbook is designed to be simple, maintainable, and useful for both new and experienced team members.

### Objectives
- Catch critical bugs before production, especially in library documentation.
- Ensure stable and predictable deployments.
- Maintain high test coverage for core user flows and documentation.
- Streamline onboarding for new QA team members.

---

## QA Processes

### 1. Bug Reporting & Triage
**Purpose**: Identify and prioritize issues to maintain website quality.  
**Process**:
- **Definition**:
  - **Bug**: A defect that breaks functionality (e.g., broken documentation links, login failure).
  - **Enhancement**: A new feature or improvement (e.g., improved search filters).
- **Reporting**:
  - File bugs in GitHub Issues using the bug template:
    - **Fields**: Description, Steps to Reproduce, Expected vs. Actual Behavior, Severity (Critical, High, Medium, Low).
    - **Severity Examples**:
      - Critical: Documentation inaccessible, website crashes.
      - High: Search returns incorrect results.
      - Medium: UI misalignment in documentation.
      - Low: Minor typo in text.
  - Assign labels: `bug`, `documentation`, `severity-critical`, etc.
- **Triage**:
  - QA Lead reviews and prioritizes bugs weekly.
  - Dev team acknowledges and assigns bugs within 48 hours.
  - Bugs are prioritized based on severity and impact (e.g., documentation bugs take precedence).

**Tools**: GitHub Issues.

### 2. Test Execution
 segmentationfault **Purpose**: Validate website functionality and documentation accuracy through manual and automated testing.  
**Process**:
- **Manual Testing**:
  - Execute test cases stored in TestRail or GitHub Wiki.
  - Focus on core user flows:
    - Website: Homepage navigation, login/signup, search.
    - Documentation: Library browsing, version switching, search, link validation.
    - Boostlook: Theme consistency, accessibility.
  - Record results in TestRail or Wiki, noting pass/fail and any defects.
- **Automated Testing**:
  - Run Playwright tests in the CI/CD pipeline (GitHub Actions).
  - Types of tests:
    - **Smoke**: Homepage loads, login works, documentation renders.
    - **Regression**: Validate existing features after updates (e.g., new boost releases).
    - **Functional**: Test specific features (e.g., documentation search accuracy).
  - Tests run on every commit and pull request; builds fail if critical tests fail.
- **Frequency**:
  - Manual tests: Before major releases or when automation is incomplete.
  - Automated tests: On every code change (push or pull request).

**Tools**: Playwright, TestRail or GitHub Wiki.

### 3. CI/CD Integration
**Purpose**: Embed QA into the development pipeline for fast feedback.  
**Process**:
- **Setup**:
  - Playwright tests are integrated into GitHub Actions workflows.
  - Tests run in headless Chrome and Firefox (Safari for cross-browser validation).
- **Triggers**:
  - On push: Run smoke tests to catch basic issues.
  - On pull request: Run smoke and regression tests to validate changes.
  - On deploy: Run post-deploy smoke tests in staging/production.
- **Failure Handling**:
  - Builds fail if smoke or critical regression tests fail (exit code 1).
  - QA Lead reviews test failures and files bugs if needed.
- **Optimization**:
  - Use Playwright sharding for parallel test execution.
  - Trigger targeted tests based on changed files (e.g., documentation tests for website-v2-docs changes).

**Tools**: GitHub Actions, Playwright.

### 4. Release Validation
**Purpose**: Ensure releases are stable and meet quality standards.  
**Process**:
- **Pre-Release Checklist**:
  - Run full automated smoke and regression test suites.
  - Execute manual tests for high-impact areas (e.g., documentation search, version switching).
  - Conduct User Acceptance Testing (UAT) with 2–3 C++ developers to validate documentation usability.
- **Post-Deploy Checklist** (10–15 minutes):
  - Automated: Run smoke tests (homepage, login, documentation access).
  - Manual: Spot-check latest boost release documentation and key user flows.
- **Documentation**:
  - Checklists are stored in this handbook and updated before each release.

**Tools**: Playwright, TestRail or GitHub Wiki.

### 5. Metrics & Reporting
**Purpose**: Track QA performance and identify improvement areas.  
**Process**:
- **Metrics**:
  - Test pass rate: Percentage of tests passing per build.
  - Bugs found per sprint: Categorized by severity (Critical, High, Medium, Low).
  - Deployment success rate: Percentage of deploys without critical issues.
- **Reporting**:
  - Generate weekly reports via GitHub Actions or Grafana.
  - Share reports with the dev team to discuss trends (e.g., recurring documentation bugs).
- **Dashboard**:
  - Maintain a dashboard in Grafana or GitHub Actions for real-time metrics.

**Tools**: Grafana, GitHub Actions.

---

## Tools & Environments

### Tools
- **Playwright**: End-to-end testing for browser-based validation (website and documentation).
- **TestRail or GitHub Wiki**: Store and manage manual test cases.
- **GitHub Issues**: Bug tracking and triage.
- **GitHub Actions**: CI/CD pipeline for automated testing.
- **Grafana**: Metrics dashboard (optional, for advanced monitoring).
- **axe-core**: Accessibility testing (integrated with Playwright for WCAG compliance).

### Environments
- **Staging Environment**:
  - Mirrors production (same web server, database, static file hosting).
  - Configured with Docker for consistency.
  - Supports documentation rendering (markdown processing, search indexing).
- **Test Data**:
  - Anonymized datasets for documentation (e.g., sample library pages, release notes).
  - Reset scripts to refresh data between test runs.
- **Access**:
  - QA team has credentials and access to staging via a secure VPN or similar.
  - Documentation for environment setup is available in the `docs` folder of website-v2.

---

## Test Coverage Map

### Overview
The test coverage map outlines the features tested, test types (manual or automated), and priority. The focus is on high-impact areas like library documentation and core website functionality.

### Coverage Details
| **Feature**                     | **Repository**           | **Test Type**         | **Priority** | **Description**                                                                 |
|---------------------------------|--------------------------|-----------------------|--------------|---------------------------------------------------------------------------------|
| Homepage Navigation             | website-v2              | Automated (Smoke)      | P1           | Verify homepage loads, navigation bar works, and key elements are present.       |
| Login/Signup                    | website-v2              | Automated + Manual     | P1           | Validate successful login/signup with test credentials; manual UAT for usability. |
| Search Functionality            | website-v2              | Automated + Manual     | P1           | Test website-wide search; manual checks for edge cases.                          |
| Documentation Browsing          | website-v2-docs         | Automated + Manual     | P1           | Verify library pages render, navigation works, and links are valid.              |
| Documentation Search            | website-v2-docs         | Automated + Manual     | P1           | Ensure search returns accurate results; manual validation for relevance.         |
| Version Switching               | website-v2-docs         | Automated + Manual     | P1           | Test switching between boost release versions; manual checks for accuracy.       |
| Theme Consistency               | boostlook               | Automated             | P2           | Verify theme applies consistently across pages.                                  |
| Accessibility (WCAG)            | boostlook               | Automated (axe-core)  | P2           | Validate screen reader support, contrast ratios, and ARIA labels.                |

### Notes
- **P1 (Priority 1)**: Critical for user experience or business outcomes (e.g., documentation access).
- **P2 (Priority 2)**: Important but less critical (e.g., theme consistency).
- **Automation Goal**: 50% of core flows automated by Month 3.
- **Documentation Goal**: 80% test coverage (manual + automated) to ensure reliability.

---

## Quick-Start Guide for Onboarding

### Welcome to the QA Team!
This guide helps new QA team members get started with testing the boost.org website.

### Step 1: Set Up Your Environment
- **Access Repositories**:
  - Clone boostorg/website-v2, website-v2-docs, and boostlook from GitHub.
  - Request access from the dev team lead if needed.
- **Install Tools**:
  - Node.js and npm for Playwright.
  - Docker for staging environment setup.
  - Follow setup instructions in the `docs` folder of website-v2.
- **Staging Environment**:
  - Use provided credentials to access the staging server.
  - Run test data reset scripts before testing.

### Step 2: Understand the Testing Process
- **Manual Testing**:
  - Review test cases in GitHub Wiki.
  - Focus on documentation flows (browsing, search, version switching).
  - Log results and file bugs in GitHub Issues.
- **Automated Testing**:
  - Run Playwright tests locally: `npm run test`.
  - Check GitHub Actions for CI/CD test results.
- **Bug Reporting**:
  - Use the GitHub Issues bug template.
  - Assign severity and add relevant labels (e.g., `documentation`).

### Step 3: Join the Workflow
- **Daily Tasks**:
  - Review open bugs and test failures in GitHub.
  - Execute manual tests for upcoming releases.
- **Weekly Tasks**:
  - Attend QA triage meeting with the QA Lead.
  - Update test cases and documentation as needed.
- **Release Tasks**:
  - Follow pre-release and post-deploy checklists.
  - Validate documentation for new boost releases.

### Step 4: Ask Questions
- Reach out to the QA Lead or dev team via Slack or email.
- Refer to this handbook for detailed processes and tools.

---

## Maintenance
- **Update Frequency**: Review and update the handbook monthly to reflect new processes or tools.
- **Owner**: QA Lead is responsible for maintenance.
- **Storage**: Store in GitHub Wiki or the `docs` folder of website-v2 for accessibility.
