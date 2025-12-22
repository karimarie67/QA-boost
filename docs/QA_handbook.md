# Boost.org QA Handbook

> **Purpose**: This handbook outlines the QA processes, tools, and workflows for automated testing of boost.org. It serves as the primary reference for maintaining quality across the Boost website ecosystem.

**Target Audience**: QA team members, developers contributing to boost.org, and anyone maintaining the test automation framework.

---

## Table of Contents
1. [Overview & Objectives](#overview--objectives)
2. [Testing Strategy - Shift-Left Approach](#testing-strategy---shift-left-approach)
3. [QA Processes](#qa-processes)
4. [Tools & Repository Structure](#tools--repository-structure)
5. [Test Coverage](#test-coverage)
6. [Daily Operations](#daily-operations)
7. [Release Management](#release-management)
8. [Metrics & Dashboard](#metrics--dashboard)
9. [Quick Start Guide](#quick-start-guide)

---

## Overview & Objectives

### What We Test
The QA framework provides automated end-to-end testing for:
- **boost.org production** (https://www.boost.org)
- **boost.org staging** (https://stage.boost.org)
- Core user journeys (documentation access, search, library navigation)
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Mobile responsiveness

### Primary Objectives
1. **Catch bugs early** - Automated tests run on every PR before code reaches production
2. **Maintain stability** - >95% test pass rate ensures reliable user experience
3. **Fast feedback** - Smoke tests complete in 5-10 minutes for quick developer iteration
4. **Comprehensive coverage** - Full regression suite validates all critical user flows
5. **Continuous monitoring** - Tests run every 6 hours to catch production issues

### Technology Stack
- **Framework**: Playwright (JavaScript/Node.js)
- **CI/CD**: GitHub Actions
- **Tracking**: GitHub Issues for bugs, live dashboard for metrics
- **Environments**: Production and staging boost.org deployments

---

## Testing Strategy - Shift-Left Approach

### Philosophy
We implement **shift-left testing** to provide fast feedback early in development while ensuring comprehensive validation before deployment. This means testing happens as early as possible in the development cycle.

### How It Works

**Pull Request Stage (Pre-Merge)**
```
Developer creates PR → Smoke tests run automatically → Pass/Fail in 5-10 min
```
- **What runs**: Smoke tests only (`smoke_tests.spec.js`)
- **Purpose**: Fast quality gate before code merges
- **Speed**: 5-10 minutes
- **Coverage**: Critical paths only (homepage, main nav, basic search)
- **Decision point**: PR cannot merge if smoke tests fail

**Develop Branch (Post-Merge)**
```
PR merges to develop → Full test suite runs → Results in 30-60 min
```
- **What runs**: Smoke + Full regression suite
  - `smoke_tests.spec.js`
  - `boost_io_tests.spec.js` (comprehensive functional tests)
  - `boost_version_tests.spec.js` (version-specific tests)
- **Purpose**: Comprehensive validation after integration
- **Speed**: 30-60 minutes
- **Coverage**: All user journeys, edge cases, cross-browser testing

**Scheduled Runs (Production Monitoring)**
```
Every 6 hours → Smoke tests against production → Dashboard updates
```
- **What runs**: Smoke tests against live production
- **Purpose**: Catch production issues, monitor uptime
- **Frequency**: Every 6 hours (0:00, 6:00, 12:00, 18:00 UTC)
- **Alerts**: Failures trigger notifications

### Why This Approach

**Benefits**:
- Developers get feedback in under 10 minutes (not 60 minutes)
- No wasted CI resources running hour-long tests on every commit
- Comprehensive testing still happens, just after integration
- Industry standard used by Google, Microsoft, Amazon, etc.

**Trade-offs**:
- Some bugs might get merged to develop (but caught before production)
- Requires good branch protection rules
- Assumes develop branch is tested before production deployment

### Branch Protection Rules

To make this work, configure GitHub branch protection:

**For `main` branch**:
- Require smoke tests to pass
- Require code review
- No direct pushes (PRs only)

**For `develop` branch**:
- Require smoke tests to pass on PR
- Full regression tests run after merge
- Staging deployment happens from here

---

## QA Processes

### 1. Automated Test Execution

**Test Types**

| Test Type | File | Runtime | When It Runs | Purpose |
|-----------|------|---------|--------------|---------|
| **Smoke Tests** | `smoke_tests.spec.js` | 5-10 min | Every PR, every 6 hours | Fast validation of critical paths |
| **Functional Tests** | `boost_io_tests.spec.js` | 30-45 min | Post-merge to develop | Comprehensive user journey testing |
| **Version Tests** | `boost_version_tests.spec.js` | 10-15 min | Post-merge to develop | Release-specific validation |

**Execution Flow**

```
1. Code Change Occurs
   ↓
2. GitHub Actions Triggered
   ↓
3. Environment Setup (Node.js, Playwright, browsers)
   ↓
4. Tests Execute Against Target Environment
   ↓
5. Results Published
   ├─ GitHub Actions log
   ├─ HTML report (artifact)
   └─ Dashboard update
   ↓
6. Notifications (if failures)
```

**Test Environments**

- **Staging** (`ENVIRONMENT=staging`): Default for all development testing
  - URL: https://stage.boost.org
  - Purpose: Safe environment for comprehensive testing
  - When: All PR tests, develop branch tests, manual testing

- **Production** (`ENVIRONMENT=production`): Limited monitoring only
  - URL: https://www.boost.org
  - Purpose: Production monitoring and validation
  - When: Scheduled runs, post-deployment validation only

**Viewing Results**

```bash
# Latest test run
# GitHub Actions → select workflow → view logs

# HTML Report (detailed)
# Actions → workflow run → Artifacts → download playwright-report

# Live Dashboard
# Navigate to dashboards/qa-metrics.md in repo
```

### 2. Bug Reporting & Triage

**What Qualifies as a Bug**

✅ **These are bugs**:
- Broken links (404 errors)
- Missing documentation pages
- Search returns no results when it should
- Navigation doesn't work
- Page doesn't load
- Console errors preventing functionality

❌ **These are NOT bugs** (they're enhancements):
- "Search could be faster"
- "This design could be better"
- "Add dark mode"
- Feature requests

**Bug Reporting Process**

1. **Verify the bug**
   - Reproduce in staging first
   - Check if it exists in production
   - Test in multiple browsers if needed

2. **File in GitHub Issues**
   - Use bug template (if available)
   - Include:
     - Clear title: "Search returns 0 results for 'algorithm'"
     - Steps to reproduce
     - Expected vs actual behavior
     - Environment (staging/production)
     - Browser/device
     - Screenshots/videos if applicable

3. **Set severity**
   - **Critical**: Site down, documentation completely inaccessible, security issue
   - **High**: Major feature broken, many users impacted
   - **Medium**: Feature partially broken, workaround exists
   - **Low**: Minor issue, cosmetic problems

4. **Add labels**
   - `bug` (required)
   - `documentation` (if doc-related)
   - `severity-critical`, `severity-high`, etc.
   - `automated-test-failure` (if caught by automation)

**Weekly Triage Process**

Every week, QA Lead reviews:
- All open bugs
- Failed test runs
- Dashboard trends

Actions:
- Prioritize based on severity and user impact
- Close fixed bugs (verify in staging first)
- Update severity if needed
- Assign to appropriate team member
- Flag urgent issues to dev team

### 3. CI/CD Integration

**GitHub Actions Workflow**

Located at: `.github/workflows/qa-tests.yml`

**Triggers**:

```yaml
on:
  pull_request:           # Run smoke tests on every PR
  push:
    branches: [develop]   # Run full suite after merge
  schedule:
    - cron: '0 */6 * * *' # Run every 6 hours
  workflow_dispatch:      # Manual trigger
```

**Job Structure**:

```
smoke-tests (runs on PRs)
  ↓
  - Install dependencies
  - Install Playwright browsers
  - Run smoke tests only
  - Upload results as artifact
  - Update dashboard

regression-tests (runs on develop)
  ↓
  - Install dependencies
  - Install Playwright browsers
  - Run ALL tests (smoke + regression + version)
  - Upload results as artifact
  - Update dashboard
  - Send notifications if failures
```

**Optimization Features**

- **Parallel execution**: Tests run in parallel workers (configurable in `playwright.config.js`)
- **Browser sharding**: Split tests across multiple browsers simultaneously
- **Artifact retention**: Test reports kept for 30 days
- **Smart caching**: Node modules cached between runs
- **Retry logic**: Failed tests retry once to handle flakiness

**Failure Handling**

When tests fail:
1. **Automatic**: GitHub Actions marks PR as failed
2. **Notification**: Dashboard updates, failures logged
3. **Human review**: QA Lead investigates within 2 hours
4. **Decision**:
   - Real bug → File issue, block PR/deployment
   - Flaky test → Fix test, allow merge
   - UI change → Update selectors, allow merge

### 4. Release Management & Deployment

**Pre-Deployment Checklist**

Before deploying to production:

- [ ] All regression tests passing on develop (>95% pass rate)
- [ ] No critical or high severity bugs open
- [ ] QA dashboard shows stable trends (no sudden drops in pass rate)
- [ ] Smoke tests passing in staging
- [ ] Stakeholders notified of deployment window

**Deployment Process**

```bash
# 1. Verify staging is healthy
npm run test:staging

# 2. Deploy (handled by deployment script in website-v2)
# This step is done by DevOps/Release Manager
cd website-v2
./scripts/deploy-website.sh

# 3. Monitor deployment
# Watch for errors in deployment logs
```

**Post-Deployment Validation** (15 minutes max)

Immediately after production deployment:

```bash
# 1. Run automated smoke tests against production
ENVIRONMENT=production npm run test:smoke

# 2. Manual spot checks (5 minutes)
```
- [ ] Homepage loads (https://www.boost.org)
- [ ] Main navigation works
- [ ] Search returns results
- [ ] Latest documentation accessible
- [ ] No console errors in browser devtools

```bash
# 3. Monitor for 15 minutes
```
- [ ] Check error rates in logs
- [ ] Verify no spike in 404s or 500s
- [ ] Confirm user traffic is normal

**Rollback Criteria**

Initiate rollback if:
- Error rate >5% (compared to pre-deployment baseline)
- Critical functionality broken (homepage down, docs inaccessible)
- Security vulnerability detected
- Smoke tests fail with critical errors

**Rollback Process**:
```bash
# Revert to previous deployment
# (Specific commands depend on deployment infrastructure)
./scripts/rollback-website.sh
```

**Post-Rollback**:
- Document what went wrong
- File bugs for all issues found
- Plan fix and retest before next deployment attempt

---

## Tools & Repository Structure

### Core Tools

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **Playwright** | E2E test framework | https://playwright.dev |
| **GitHub Actions** | CI/CD automation | In repo `.github/workflows/` |
| **GitHub Issues** | Bug tracking | Standard GitHub features |
| **Custom Dashboard** | Metrics visualization | `dashboards/qa-metrics.md` |

### Repository Structure

**Current Setup** (as of now):
```
karimarie67/QA-documentation/          # Your QA repo
├── .github/workflows/
│   └── qa-tests.yml                   # CI/CD workflow
├── tests/
│   ├── smoke_tests.spec.js            # Smoke test suite
│   ├── boost_io_tests.spec.js         # Main functional tests
│   └── boost_version_tests.spec.js    # Version-specific tests
├── Helper files:
│   ├── config-helper.js               # Environment config
│   ├── test-helpers.js                # Reusable test functions
│   ├── selectors.js                   # Element selectors
│   └── utils.js                       # Utilities
├── dashboards/
│   ├── qa-metrics.md                  # Live dashboard
│   └── scripts/generate-dashboard.js  # Dashboard generator
├── docs/
│   ├── QA_handbook.md                 # This file
│   ├── testing_strategy_doc.md        # Detailed strategy
│   ├── Test-Coverage-Map.md           # Coverage tracking
│   ├── Functional-Table 1.csv         # Functional test cases
│   └── Regression-Table 1.csv         # Regression test cases
├── playwright.config.js               # Playwright configuration
├── package.json                       # Dependencies & scripts
└── README.md                          # Quick reference
```

**Target Setup** (after integration):
```
boostorg/website-v2/                   # Main website repo
├── qa-tests/                          # New QA directory
│   ├── .github/workflows/
│   │   └── qa-tests.yml
│   ├── tests/
│   ├── config-helper.js
│   ├── test-helpers.js
│   ├── selectors.js
│   ├── utils.js
│   ├── playwright.config.js
│   ├── package.json
│   └── README.md
├── (existing website code)
└── (existing Django apps)
```

### Environment Variables

Configure in GitHub Actions or locally:

```bash
# .env file (for local testing)
ENVIRONMENT=staging                    # or 'production'
CI=false                              # Set to 'true' in GitHub Actions
PLAYWRIGHT_HEADED=false               # Set to 'true' to see browser

# Optional (for future enhancements)
SLACK_WEBHOOK_URL=https://...         # For failure notifications
```

### Access & Permissions

**What you need**:
- GitHub access to karimarie67/QA-documentation (current)
- GitHub access to boostorg/website-v2 (for integration)
- No special credentials needed (tests run against public site)

**What you DON'T need**:
- Database access (we're testing the UI, not the backend)
- SSH access to servers (all testing is external)
- AWS credentials (tests use public URLs)

---

## Test Coverage

### Current Automation Coverage

| Feature | Test File | Priority | Status | Notes |
|---------|-----------|----------|--------|-------|
| **Homepage Load** | smoke_tests.spec.js | P1 | ✅ Automated | Verifies page loads, key elements visible |
| **Main Navigation** | smoke_tests.spec.js | P1 | ✅ Automated | Tests all nav links, mobile menu |
| **Search - Basic** | smoke_tests.spec.js | P1 | ✅ Automated | Search returns results |
| **Search - Advanced** | boost_io_tests.spec.js | P1 | ✅ Automated | Filters, sorting, pagination |
| **Library Browsing** | boost_io_tests.spec.js | P1 | ✅ Automated | Library list, categories, details |
| **Documentation Access** | boost_io_tests.spec.js | P1 | ✅ Automated | Doc pages load, content visible |
| **Version Switching** | boost_version_tests.spec.js | P2 | ✅ Automated | Switch between boost versions |
| **Download Links** | boost_version_tests.spec.js | P2 | ✅ Automated | Verify download links work |
| **Mobile Navigation** | smoke_tests.spec.js | P2 | ✅ Automated | Mobile menu, touch interactions |
| **Cross-browser** | All tests | P2 | ✅ Automated | Chrome, Firefox, Safari tested |

### Coverage Metrics

- **Total Automated Tests**: ~45 test cases
- **Smoke Tests**: 15 tests (critical paths)
- **Regression Tests**: 30 tests (comprehensive coverage)
- **Current Coverage**: 75% automation (25% manual spot checks)
- **Target Coverage**: 80% automation

### Manual Test Cases

Some scenarios still require manual testing:
- Visual regression (does it look right?)
- Accessibility testing (screen reader compatibility)
- Complex user workflows (multi-step processes)
- Exploratory testing (finding unexpected issues)

Manual test cases documented in:
- `docs/Functional-Table 1.csv`
- `docs/Regression-Table 1.csv`

### Test Case Naming Convention

```
TC_[TYPE]_[NUMBER]: Description

Examples:
TC_SMOKE_001: Homepage loads successfully
TC_FUNC_015: Search with filters returns correct results
TC_VER_003: Version 1.83.0 documentation accessible
```

---

## Daily Operations

### Morning Routine (10 minutes)

```bash
# 1. Check overnight test runs
# Go to: https://github.com/karimarie67/QA-documentation/actions
# Look for: Any failed workflows

# 2. Review dashboard
# Go to: dashboards/qa-metrics.md
# Check: Pass rates, trends, new failures

# 3. Check open bugs
# Go to: GitHub Issues
# Filter by: bug, severity-critical, severity-high
```

**Decision tree**:
- All tests passed? → Move on with your day
- Tests failed? → Investigate (see Troubleshooting section)
- Critical bugs open? → Review and prioritize

### During Active Development

**When a PR is created**:
1. Smoke tests run automatically (5-10 min)
2. Check GitHub Actions for status
3. If tests fail:
   - Is it a real bug? → Comment on PR, block merge
   - Is it a test issue? → Fix test, rerun
   - Is it expected (UI change)? → Update selectors, approve

**When PR merges to develop**:
1. Full regression suite runs automatically (30-60 min)
2. Monitor for failures
3. Update dashboard
4. File bugs if issues found

### Weekly Maintenance (1 hour)

**Every week**:
- [ ] Review all open bugs
- [ ] Triage new issues
- [ ] Update test coverage map
- [ ] Check for flaky tests (tests that fail intermittently)
- [ ] Review dashboard trends
- [ ] Update this handbook if processes changed

**Monthly Tasks**:
- [ ] Update Playwright to latest version
- [ ] Review and optimize slow tests
- [ ] Archive old test reports
- [ ] Update test documentation

---

## Release Management

See [Release Management & Deployment](#4-release-management--deployment) section above for detailed process.

**Quick Reference**:

```bash
# Pre-deployment
npm run test:staging      # Verify staging is healthy

# Post-deployment
ENVIRONMENT=production npm run test:smoke  # Validate production

# If issues found
./scripts/rollback-website.sh  # Rollback deployment
```

---

## Metrics & Dashboard

### Live Dashboard

Location: `dashboards/qa-metrics.md`

**What it shows**:
- Current test pass rates
- 7-day trend (pass/fail over time)
- Failed tests (with details)
- SOW completion status
- Historical data

**How it updates**:
- Automatically after each test run
- Dashboard generation script runs in GitHub Actions
- Manual generation: `npm run dashboard` (if implemented)

### Key Metrics

**Test Pass Rate**
- **Smoke tests**: >98% target
- **Regression tests**: >95% target
- **Calculation**: (Passed tests / Total tests) × 100

**Bug Metrics**
- **Open critical bugs**: 0 target
- **Open high bugs**: <3 target
- **Bug escape rate**: <5% (bugs found in production)

**Performance Metrics**
- **Smoke test runtime**: <10 minutes
- **Full regression runtime**: <60 minutes
- **Test execution frequency**: Every 6 hours + on-demand

### Reporting

**Weekly Report** (auto-generated):
- Test execution summary
- Pass/fail trends
- New bugs filed
- Critical issues

**Monthly Report**:
- Coverage changes
- Process improvements
- Tool updates
- Roadmap progress

---

## Quick Start Guide

### For New QA Team Members

**Day 1: Setup**

```bash
# 1. Clone the repo
git clone https://github.com/karimarie67/QA-documentation.git
cd QA-documentation

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Verify setup
npm run test:smoke

# 5. View results
npm run test:report
```

**Day 2: First Test Run**

```bash
# Run against staging
npm run test:staging

# Run with visible browser (watch what happens)
npm run test:headed

# Run specific test
npm test -- --grep "TC_SMOKE_001"
```

**Day 3: Understand the Code**

Read these files in order:
1. `README.md` - Overview and quick commands
2. `docs/QA_handbook.md` - This file (processes)
3. `docs/testing_strategy_doc.md` - Detailed strategy
4. `tests/smoke_tests.spec.js` - Example tests

**Week 1: Make Your First Change**

1. Find a small bug or improvement
2. Write a test for it (or update existing test)
3. Run tests locally to verify
4. Submit PR with changes
5. Watch CI/CD run your tests

### For Developers

**Understanding Test Impact**

When you create a PR:
```
Your PR → Smoke tests run automatically → Must pass to merge
```

When you merge to develop:
```
Merge completes → Full regression runs → Dashboard updates
```

**Viewing Test Results**

1. Go to your PR
2. Scroll to checks section
3. Click "Details" next to "QA Tests"
4. View logs and reports

**What to Do If Tests Fail**

```
1. Check if it's related to your changes
   ↓
2. If yes: Fix and push new commit
   ↓
3. If no: Tag @karimarie67 (or QA Lead) in PR
   ↓
4. Tests re-run automatically on new push
```

### Common Commands

```bash
# Running tests
npm test                          # All tests
npm run test:smoke                # Quick smoke tests
npm run test:staging              # Against staging env
npm run test:production           # Against production (careful!)
npm run test:headed               # With visible browser
npm run test:ui                   # Interactive mode

# Debugging
npm run test:debug                # Step through tests
npm test -- --grep "keyword"      # Run specific tests
npm run test:report               # View HTML report

# Development
npx playwright codegen https://stage.boost.org  # Generate test code
```

---

## Troubleshooting

### Tests Failing Locally But Pass in CI

**Cause**: Environment differences (Node version, cached data, browser versions)

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Update browsers
npx playwright install

# Run in CI mode
CI=true npm test
```

### Tests Are Flaky (Pass/Fail Randomly)

**Cause**: Timing issues, network delays, race conditions

**Solution**:
```javascript
// Add explicit waits
await page.waitForLoadState('networkidle');
await page.waitForSelector(selector, { state: 'visible' });

// Increase timeout
await expect(element).toBeVisible({ timeout: 10000 });
```

### Element Not Found

**Cause**: Selectors out of date, element not yet rendered

**Solution**:
```bash
# Generate new selectors
npx playwright codegen https://stage.boost.org

# Update selectors.js with new values
```

### CI/CD Not Triggering

**Cause**: Workflow file misconfigured, branch protection rules

**Solution**:
- Check `.github/workflows/qa-tests.yml` syntax
- Verify GitHub Actions is enabled in repo settings
- Check branch protection rules allow Actions

---

## Process Updates & Maintenance

**Handbook Updates**:
- Review monthly
- Update after process changes
- Track changes in Git history

**Owner**: QA Lead (currently @karimarie67)

**Feedback**: File issues in GitHub or discuss in team meetings

---

## Contact & Support

**QA Lead**: @karimarie67
- Test strategy questions
- Bug triage
- Deployment coordination
- Process improvements

**Slack**: #boost-website
- Quick questions
- Test failures
- General discussion

**GitHub Issues**: For bug reports and feature requests

---

## Appendix: Useful Links

- **QA Repository**: https://github.com/karimarie67/QA-documentation
- **Main Website Repo**: https://github.com/boostorg/website-v2
- **Staging Site**: https://stage.boost.org
- **Production Site**: https://www.boost.org
- **Playwright Docs**: https://playwright.dev
- **Dashboard**: [dashboards/qa-metrics.md](dashboards/qa-metrics.md)

---

*Last Updated: December 2025*  
*Maintained by: QA Team*  
*Version: 2.0*
