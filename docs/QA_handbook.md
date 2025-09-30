# Boost.org QA Handbook

## Overview
This QA Handbook outlines the Quality Assurance processes for automated testing of boost.org. The QA framework uses end-to-end testing with Playwright, integrated into GitHub Actions CI/CD pipeline, following a shift-left testing strategy. Tests are maintained in the karimarie67/QA-documentation repository and execute against the live boost.org website and staging environments.

### Objectives
- Catch critical bugs before production through automated testing
- Ensure stable and predictable deployments via pre/post deployment validation
- Maintain high test coverage for core user flows and library documentation
- Provide fast feedback to developers through shift-left testing approach

---

## Testing Strategy - Shift-Left Approach

### Overview
We implement a shift-left testing strategy that provides fast feedback early in the development cycle while ensuring comprehensive validation before deployment.

### Branch-Based Testing
**Main Branch (Production-Ready Code):**
- Triggers: Every push to main, every PR targeting main
- Tests: Smoke tests only (5-10 minutes)
- Purpose: Fast feedback for developers, pre-merge quality gate
- Regression tests are skipped to maintain speed

**Develop Branch (Integration Testing):**
- Triggers: Every push to develop (after PR merges)
- Tests: Smoke tests + Full regression suite (30-45 minutes)
- Purpose: Comprehensive validation after code integration
- Full test coverage before staging deployment

### Why This Works
- Developers get feedback in under 10 minutes on main branch
- Comprehensive testing happens after integration on develop
- No wasted resources running hour-long tests on every commit
- Industry standard approach used by major tech companies

---

## QA Processes

### 1. Automated Test Execution
**Purpose**: Validate website functionality and documentation through automated end-to-end testing.

**Test Types**:
- **Smoke Tests**: Critical path validation (homepage loads, navigation works, basic functionality)
- **Regression Tests**: Comprehensive functionality testing (boost_io_tests.spec.js, boost_version_tests.spec.js)
- **Documentation Tests**: Library documentation accessibility and search functionality

**Execution**:
- Tests run automatically via GitHub Actions on code changes
- Test against live boost.org website and staging environments
- Results appear in live dashboard at dashboards/qa-metrics.md
- Failed tests trigger notifications and dashboard updates

**Tools**: Playwright, GitHub Actions

### 2. Bug Reporting & Triage
**Purpose**: Identify and prioritize issues found during testing.

**Definition**:
- **Bug**: A defect that breaks functionality (broken links, login failure, documentation inaccessible)
- **Enhancement**: A new feature or improvement (improved search, UI enhancements)

**Process**:
- File bugs in GitHub Issues using bug templates
- Severity levels: Critical, High, Medium, Low
- Labels: bug, documentation, severity-critical, automated-test-failure
- QA reviews and prioritizes weekly
- Documentation bugs take precedence due to high user impact

**Tools**: GitHub Issues

### 3. Release Management & Deployment
**Purpose**: Ensure stable deployments through QA validation and deployment execution.

**Pre-Deployment Process**:
- Verify all regression tests passing on develop branch (>95% pass rate)
- Review QA dashboard for test trends and critical failures
- Confirm no critical bugs open
- Notify stakeholders of planned deployment

**Deployment Process**:
- Execute deployment via scripts/deploy-website.sh in website-v2 repository
- Monitor deployment process for errors
- Document deployment time and any issues

**Post-Deployment Validation**:
- Run smoke tests against production environment
- Verify critical user flows (documentation access, search, navigation)
- Monitor error rates for first 15 minutes
- Update QA dashboard with deployment status

**Rollback Criteria**:
- Error rate >5%
- Critical functionality broken
- Documentation inaccessible
- Security issues detected

### 4. Metrics & Reporting
**Purpose**: Track QA performance and system reliability.

**Key Metrics**:
- Test Automation Coverage: 75% (target: 80%)
- Smoke Test Pass Rate: >98% target
- Regression Test Pass Rate: >95% target
- Bug Escape Rate: <5%

**Reporting**:
- Live dashboard auto-updates after each test run
- Historical trends tracked over 30-day periods
- Weekly review of metrics and trends
- Dashboard accessible at dashboards/qa-metrics.md

**Tools**: Custom GitHub Actions dashboard, GitHub Issues

---

## Tools & Environments

### Core Tools
- **Playwright**: End-to-end testing framework (JavaScript/Node.js)
- **GitHub Actions**: CI/CD pipeline for automated test execution
- **GitHub Issues**: Bug tracking and project management
- **Custom Dashboard**: Real-time metrics and test results (auto-generated)

### Test Environments
- **Production**: https://www.boost.org (smoke tests only for monitoring)
- **Staging**: Staging environment URL (comprehensive testing)
- **Test Configuration**: Configurable via environment variables in CI/CD

### Repository Structure
- **QA Repository**: karimarie67/QA-documentation (test code and documentation)
- **Target Repositories**: Tests execute against deployed boost.org website
- **Test Files**: smoke_tests.spec.js, boost_io_tests.spec.js, boost_version_tests.spec.js

---

## Test Coverage Map

### Current Coverage
| Feature | Test Type | Priority | Status |
|---------|-----------|----------|--------|
| Homepage Navigation | Automated (Smoke) | P1 | ✅ Automated |
| Library Documentation | Automated (Regression) | P1 | ✅ Automated |
| Search Functionality | Automated (Regression) | P1 | ✅ Automated |
| Version Navigation | Automated (Regression) | P2 | ✅ Automated |
| Download Links | Manual | P2 | 📋 Manual Process |

### Coverage Goals
- **Current**: 75% automation coverage
- **Target**: 80% automation coverage
- **Priority**: Focus on high-impact documentation and navigation features

### Test Documentation
- Manual test cases documented in CSV files (Functional-Table, Regression-Table)
- Automated test cases linked to corresponding manual test case IDs
- Test coverage tracked in docs/Test-Coverage-Map.md

---

## Operational Procedures

### Daily Operations
- Monitor GitHub Actions for test failures
- Review QA dashboard for trends and issues
- Respond to critical test failures within 2 hours
- Update bug status based on test results

### Weekly Operations
- Review and triage open bugs in GitHub Issues
- Analyze test metrics and trends
- Update test coverage documentation
- Plan test automation expansion

### Release Operations
- Execute pre-deployment checklist
- Perform deployment when approved
- Conduct post-deployment validation
- Document deployment outcomes

### Maintenance
- Update handbook monthly
- Review and optimize test suite quarterly
- Refresh test data and environments as needed

---

## Getting Started

### For New Team Members
1. **Repository Access**: Clone karimarie67/QA-documentation repository
2. **Environment Setup**: Install Node.js, npm, and Playwright (`npm install`)
3. **Run Tests Locally**: `npm test` to execute full suite
4. **Review Documentation**: Read Testing-Strategy.md and this handbook
5. **Access Dashboard**: View live metrics at dashboards/qa-metrics.md

### For Developers
1. **Understanding Test Impact**: Tests run automatically on PR creation and merge
2. **Test Results**: Check GitHub Actions tab for test status
3. **Dashboard Access**: Monitor quality metrics at dashboards/qa-metrics.md
4. **Bug Reports**: Review GitHub Issues for QA-identified bugs

### Quick Commands
```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run regression tests only  
npm run test:regression

# Generate dashboard locally
npm run dashboard
```

---

## Contact & Support

### QA Lead
- Responsible for test strategy, bug triage, and deployment coordination
- Point of contact for test failures and quality issues

### Process Updates
- Handbook updates tracked in GitHub
- Process changes discussed in team meetings
- Tool updates documented in repository README

---

*Last Updated: [Date]*  
*Maintained by: QA Team*  
*Repository: karimarie67/QA-documentation*
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
