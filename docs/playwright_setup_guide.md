# Boost.org QA Automation Framework - Onboarding Guide

> **Welcome!** This guide will get you from zero to running automated tests on Boost.org in a single day. Since you're already familiar with the codebase as a frontend dev, we'll focus on the QA-specific setup and workflow.

---

## 📋 Table of Contents
1. [What You're Taking Over](#what-youre-taking-over)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Understanding the Test Structure](#understanding-the-test-structure)
4. [Running Your First Tests](#running-your-first-tests)
5. [How the Helper Files Work](#how-the-helper-files-work)
6. [Integrating CI/CD into website-v2](#integrating-cicd-into-website-v2)
7. [Daily QA Workflow](#daily-qa-workflow)
8. [Debugging & Troubleshooting](#debugging--troubleshooting)
9. [Quick Reference](#quick-reference)

---

## What You're Taking Over

You're inheriting a fully functional QA automation setup with:
- **Complete test suites** for boost.org (staging + production)
- **CI/CD pipeline** running in GitHub Actions (currently in separate QA repo)
- **Live dashboard** showing test results and metrics
- **Helper architecture** that makes writing new tests easy

---

## Prerequisites & Setup

### What You Need Installed

```bash
# Check if you have these (you probably already do)
node --version    # Should be v18 or higher
npm --version     # Should be v9 or higher
git --version     # Any recent version

# Install VS Code extension (recommended)
# Search for "Playwright Test for VSCode" in extensions
```

### Step 1: Clone the QA Repo (For Reference)

```bash
# Clone the existing QA repo to see how everything works
git clone https://github.com/karimarie67/QA-documentation.git
cd QA-documentation

# Install dependencies
npm install

# Install Playwright browsers (one-time setup)
npx playwright install
```

**Note**: This repo is your reference. You'll eventually move this setup into `boostorg/website-v2`.

### Step 2: Verify Everything Works

```bash
# Run a quick smoke test to make sure everything's set up correctly
npm run test:smoke

# If that works, you're good to go!
```

**Expected output**: You should see tests running in the terminal, and they should mostly pass (some flakiness is normal on first run).

---

## Understanding the Test Structure

Before you start moving things around, let's understand what you're working with.

### Project Layout

```
QA-documentation/
├── .github/workflows/
│   └── qa-tests.yml              # CI/CD pipeline (you'll move this)
│
├── tests/
│   ├── smoke_tests.spec.js           # Quick health checks (5-10 min)
│   ├── boost_io_tests.spec.js        # Main functional tests (30-60 min)
│   └── boost_version_tests.spec.js   # Version-specific tests
│   ├── documentation_tests.spec.js   # Verify docs
│   ├── error_handling_tests.spec.js  #Check for 404s, etc.
│   └── download_search_tests.spec.js # Verify search and download functionality
|
├── Helper Files (the magic sauce):
│   ├── config-helper.js          # Environment switching (staging/prod)
│   ├── test-helpers.js           # Reusable test functions
│   ├── selectors.js              # Page element locators
│   └── utils.js                  # General utilities
│
├── playwright.config.js          # Main Playwright config
├── package.json                  # Dependencies & npm scripts
└── README.md                     # Current documentation
```

### Test Categories

**1. Smoke Tests** (`smoke_tests.spec.js`)
- Run on every PR before merge
- Fast (5-10 minutes)
- Tests critical paths only
- Examples: Homepage loads, main nav works, search functions

**2. Functional Tests** (`boost_io_tests.spec.js`)
- Run after merge to `develop` branch
- Slower (30-60 minutes)
- Tests complete user journeys
- Examples: Full search flows, library filtering, documentation navigation

**3. Version Tests** (`boost_version_tests.spec.js`)
- Run on `develop` branch
- Tests version-specific functionality
- Examples: Release downloads, version comparisons

---

## Running Your First Tests

### Local Development Commands

```bash
# Run ALL tests (takes a while)
npm test

# Run just smoke tests (recommended for testing)
npm run test:smoke

# Run specific test file
npm test tests/boost_io_tests.spec.js

# Run with browser visible (great for debugging)
npm run test:headed

# Run in Playwright UI mode (interactive debugging)
npm run test:ui

# Run specific test by name
npm test -- --grep "TC_FUNC_001"
```

### Environment Switching

```bash
# Test against staging (default)
npm run test:staging

# Test against production (be careful!)
npm run test:production

# Or set environment inline
ENVIRONMENT=production npm test
```

### Understanding Test Output

```bash
# When you run tests, you'll see:
Running 15 tests using 3 workers
  ✓ TC_SMOKE_001: Homepage loads successfully (2s)
  ✓ TC_SMOKE_002: Main navigation is accessible (1s)
  ✗ TC_FUNC_015: Search filters apply correctly (30s)
    
# After tests complete:
npm run test:report  # Opens HTML report in browser
```

---

## How the Helper Files Work

Understanding these will make your life MUCH easier when writing new tests.

### config-helper.js - Environment Management

**What it does**: Handles switching between staging and production

```javascript
// In your tests, you use it like this:
import { getConfig } from '../config-helper.js';

test('Example test', async ({ page }) => {
  const config = getConfig();
  await page.goto(config.baseUrl);  // Automatically uses correct environment
  // config.baseUrl is either boost.org or stage.boost.org
});
```

**Why it matters**: Write tests once, run them anywhere. No hardcoded URLs.

### test-helpers.js - Reusable Test Functions

**What it does**: Common test actions wrapped in functions

```javascript
// Instead of writing this in every test:
await page.waitForLoadState('networkidle');
await page.waitForSelector('.search-results');
await expect(page.locator('.search-results')).toBeVisible();

// You call this:
await testHelpers.waitForSearchResults(page);
```

**Common helpers you'll use**:
- `waitForPageLoad(page)` - Wait for page to fully load
- `waitForSearchResults(page)` - Wait for search results to appear
- `clickAndWaitForNavigation(page, selector)` - Click link and wait for page change
- `verifyElementVisible(page, selector)` - Check if element exists and is visible

### selectors.js - Page Element Locators

**What it does**: Centralized list of all element selectors

```javascript
// Instead of scattered selectors throughout your tests:
await page.click('.header-nav-item:has-text("Libraries")');

// You use named selectors:
import { SELECTORS } from '../selectors.js';
await page.click(SELECTORS.navigation.librariesLink);
```

**Why it matters**: When the UI changes, you update ONE file instead of 50 tests.

### utils.js - General Utilities

**What it does**: Logging, timing, data helpers

```javascript
// Helpful for debugging
import { logTestStep, measurePerformance } from '../utils.js';

logTestStep('Searching for "algorithm"');
const timing = await measurePerformance(page, async () => {
  await page.fill('input[type="search"]', 'algorithm');
});
console.log(`Search took ${timing}ms`);
```

---

## Integrating CI/CD into website-v2

This is your main task. Here's the step-by-step process:

### Phase 1: Understand Current Setup

**Current state**: 
- QA tests live in `karimarie67/QA-documentation`
- CI/CD runs there, testing boost.org from outside
- website-v2 has no QA automation

**Goal state**:
- QA tests live in `boostorg/website-v2` 
- CI/CD runs there as part of the main workflow
- Tests run on every PR and merge

### Phase 2: Create QA Directory in website-v2

```bash
# In the website-v2 repo
cd boostorg/website-v2

# Create QA directory structure
mkdir -p qa-tests/tests
mkdir -p qa-tests/.github/workflows

# You'll copy files here
```

### Phase 3: Copy Files Over

**Files to copy from QA-documentation to website-v2**:

```
QA-documentation/                    →    website-v2/qa-tests/
├── tests/                           →    ├── tests/
│   ├── smoke_tests.spec.js          →    │   ├── smoke_tests.spec.js
│   ├── boost_io_tests.spec.js       →    │   ├── boost_io_tests.spec.js
│   └── boost_version_tests.spec.js  →    │   └── boost_version_tests.spec.js
├── config-helper.js                 →    ├── config-helper.js
├── test-helpers.js                  →    ├── test-helpers.js
├── selectors.js                     →    ├── selectors.js
├── utils.js                         →    ├── utils.js
├── playwright.config.js             →    ├── playwright.config.js
└── package.json                     →    ├── package.json (merge scripts)
```

### Phase 4: Modify GitHub Actions Workflow

**Current workflow** (in QA-documentation):
```yaml
# .github/workflows/qa-tests.yml
name: QA Test Suite - Boost.org

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
```

**What you need to change for website-v2**:

```yaml
# website-v2/.github/workflows/qa-tests.yml
name: QA Tests

on:
  pull_request:
    branches: [ develop, main ]
    # Run smoke tests on every PR
    
  push:
    branches: [ develop ]
    # Run full regression after merge to develop
    
  schedule:
    - cron: '0 */6 * * *'

jobs:
  smoke-tests:
    # Runs on every PR (pre-merge gate)
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./qa-tests  # Important!
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: qa-tests/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run Smoke Tests
        run: npm run test:smoke
        env:
          CI: true
          ENVIRONMENT: staging
      
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: smoke-test-results
          path: qa-tests/playwright-report/
  
  regression-tests:
    # Runs after merge to develop
    if: github.event_name == 'push' && github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./qa-tests
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: qa-tests/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run Regression Tests
        run: npm test
        env:
          CI: true
          ENVIRONMENT: staging
      
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: regression-test-results
          path: qa-tests/playwright-report/
```

### Phase 5: Update package.json for website-v2

**In `website-v2/qa-tests/package.json`**, make sure you have:

```json
{
  "name": "boost-qa-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test tests/smoke_tests.spec.js",
    "test:boost-io": "playwright test tests/boost_io_tests.spec.js",
    "test:version": "playwright test tests/boost_version_tests.spec.js",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report",
    "test:staging": "ENVIRONMENT=staging playwright test",
    "test:production": "ENVIRONMENT=production playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.48.0"
  }
}
```

### Phase 6: Update Paths in Config Files

**In `playwright.config.js`**, update paths:

```javascript
export default defineConfig({
  testDir: './tests',  // This stays the same
  
  // Update output directories if needed
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  // Rest of config stays the same...
});
```

### Phase 7: Test Locally Before Pushing

```bash
# In website-v2/qa-tests/
npm install
npx playwright install

# Run smoke tests to verify everything works
npm run test:smoke

# If that works, you're ready to commit!
```

### Phase 8: Create PR for Integration

```bash
# In website-v2/
git checkout -b add-qa-automation
git add qa-tests/
git commit -m "Add QA automation framework

- Integrate Playwright test suite from QA-documentation repo
- Add smoke tests (run on PRs)
- Add regression tests (run on develop)
- Configure GitHub Actions workflow
- Add helper files for test maintainability"

git push origin add-qa-automation
```

**In your PR description, include**:
- Link to QA-documentation repo
- Explanation of smoke vs regression tests
- How to run tests locally
- What the CI/CD workflow does

---

## Daily QA Workflow

Once everything's integrated, here's your typical day:

### Morning: Check Test Results

1. Go to [Actions tab](https://github.com/boostorg/website-v2/actions)
2. Check overnight scheduled runs
3. Review any failures
4. File bugs if needed

### When PR is Created:

1. Smoke tests run automatically
2. Review results in PR checks
3. If tests fail:
   - Check if it's a real bug
   - Or if selectors need updating
   - Update tests if UI changed legitimately

### After PR Merges to Develop:

1. Regression tests run automatically
2. Review full test results
3. Monitor for new failures
4. Update dashboard (it auto-updates, but verify)

### Writing New Tests:

```javascript
// In tests/boost_io_tests.spec.js
import { test, expect } from '@playwright/test';
import { getConfig } from '../config-helper.js';
import { SELECTORS } from '../selectors.js';
import * as helpers from '../test-helpers.js';

test('TC_FUNC_XXX: Your test description', async ({ page }) => {
  const config = getConfig();
  
  // Navigate to page
  await page.goto(`${config.baseUrl}/your-page`);
  await helpers.waitForPageLoad(page);
  
  // Perform actions
  await page.click(SELECTORS.yourElement);
  
  // Assert results
  await expect(page.locator(SELECTORS.yourResult)).toBeVisible();
});
```

---

## Debugging & Troubleshooting

### Common Issues

#### Tests Not Running in GitHub Actions

**Problem**: Workflow doesn't trigger
**Solution**: 
- Check workflow file is in `.github/workflows/`
- Verify YAML syntax (tabs vs spaces matter!)
- Check branch names match your triggers

#### Tests Fail Locally But Pass in CI

**Problem**: Environment differences
**Solution**:
```bash
# Run in CI mode locally
CI=true npm test

# Check if it's a timing issue
npm test -- --timeout=60000
```

#### Element Not Found Errors

**Problem**: Selectors out of date
**Solution**:
```bash
# Use Playwright's inspector to find new selectors
npx playwright codegen https://stage.boost.org

# Update selectors.js with new values
```

#### Tests Are Flaky

**Problem**: Tests pass sometimes, fail other times
**Solution**:
```javascript
// Add more explicit waits
await page.waitForLoadState('networkidle');
await page.waitForSelector(SELECTORS.yourElement);

// Or use retry logic
await expect(page.locator(SELECTORS.yourElement))
  .toBeVisible({ timeout: 10000 });
```

### Debugging Commands

```bash
# Run single test with visible browser
npm test -- --grep "TC_FUNC_001" --headed

# Run with Playwright inspector (step through test)
npm run test:debug

# Run with trace (records everything)
npm test -- --trace on

# View trace after test
npx playwright show-trace trace.zip
```

### Using Playwright's Tools

```bash
# Generate new test interactively (records your actions)
npx playwright codegen https://stage.boost.org

# View last test run in UI
npx playwright show-report

# Check which browsers are installed
npx playwright list
```

---

## Quick Reference

### Essential Commands

```bash
# Running tests
npm test                          # All tests
npm run test:smoke                # Just smoke tests
npm run test:headed               # See browser
npm test -- --grep "keyword"      # Specific tests

# Debugging
npm run test:ui                   # Interactive mode
npm run test:debug                # Step through
npm run test:report               # View results

# Environments
npm run test:staging              # Stage environment
npm run test:production           # Production (careful!)

# CI/CD
# Manual trigger: Actions → qa-tests.yml → Run workflow
```

### File Quick Reference

| File | Purpose | When to Edit |
|------|---------|--------------|
| `tests/*.spec.js` | Test files | Adding/modifying tests |
| `selectors.js` | Element locators | UI changes |
| `test-helpers.js` | Reusable functions | New common patterns |
| `config-helper.js` | Environment config | New environments |
| `playwright.config.js` | Test runner config | Test behavior changes |
| `.github/workflows/qa-tests.yml` | CI/CD pipeline | Changing when tests run |

### Getting Help

**When tests fail**:
1. Check the HTML report: `npm run test:report`
2. Look at screenshots in `test-results/`
3. Run with `--headed` to see what's happening

**When writing new tests**:
1. Copy existing test as template
2. Use `codegen` to find selectors
3. Test locally before pushing

**When stuck**:
- Check existing tests for examples
- Read Playwright docs: https://playwright.dev
- Ask in #boost-website Slack channel

---

## Next Steps

1. **Day 1**: Clone repos, run tests locally, understand structure
2. **Day 2-3**: Create QA directory in website-v2, copy files over
3. **Day 4**: Configure GitHub Actions workflow
4. **Day 5**: Test everything locally, create PR
5. **Week 2**: Monitor first few CI/CD runs, fix any issues
6. **Ongoing**: Maintain tests as site changes, add new coverage

---

## Important Notes

- **Smoke tests must be fast** - They're a pre-merge gate, keep under 10 minutes
- **Don't test against production frequently** - Use staging for development
- **Update selectors.js when UI changes** - Don't put selectors in test files
- **Keep tests independent** - Each test should work on its own
- **CI/CD is your friend** - If it's not automated, it won't get done consistently

---

**Questions?** Check the existing tests in the QA-documentation repo for examples, visit https://playwright.dev/docs/intro or check with some of the Boost folks
