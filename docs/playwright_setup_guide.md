# Playwright Test Setup & CI/CD Integration Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Configuration Files](#configuration-files)
6. [Test Architecture](#test-architecture)
7. [Running Tests](#running-tests)
8. [Debugging & Troubleshooting](#debugging--troubleshooting)
9. [CI/CD Integration with GitHub Actions](#cicd-integration-with-github-actions)
10. [Best Practices & Maintenance](#best-practices--maintenance)

## Project Overview

This Playwright test suite is designed to test the boost.org website (both production and staging environments). The project includes:

- **Functional tests** for core user journeys
- **Smoke tests** for basic site functionality
- **Cross-browser testing** support
- **Flexible environment configuration**
- **Comprehensive debugging and logging**
- **CI/CD integration** with GitHub Actions

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **VS Code** (recommended) with Playwright extension

## Project Structure

```
playwright-boost-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions workflow
├── tests/
│   └── boost_io_tests.spec.js      # Main test file
├── test-results/                   # Test execution reports
├── playwright-report/              # HTML reports
├── config-helper.js                # Environment & URL configuration
├── test-helpers.js                 # Reusable test utilities
├── selectors.js                    # Page element selectors
├── utils.js                        # General utility functions
├── playwright.config.js            # Playwright configuration
├── package.json                    # Project dependencies
└── README.md                       # This documentation
```

## Installation & Setup

### 1. Initialize the Project

```bash
# Create project directory
mkdir playwright-boost-tests
cd playwright-boost-tests

# Initialize npm project
npm init -y
```

### 2. Install Playwright

```bash
# Install Playwright and browsers
npm install -D @playwright/test
npx playwright install

# Install additional dependencies if needed
npm install -D dotenv  # For environment variables
```

### 3. Create Core Files

Create the following files in your project root:

**package.json** (update scripts section):
```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report",
    "test:staging": "ENVIRONMENT=staging playwright test",
    "test:production": "ENVIRONMENT=production playwright test"
  }
}
```

## Configuration Files

### playwright.config.js

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // Global test configuration
  use: {
    // Base URL for tests
    baseURL: process.env.ENVIRONMENT === 'production' 
      ? 'https://boost.org' 
      : 'https://stage.boost.org',
    
    // Browser context options
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Extended timeouts for boost.org
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web server for local development
  webServer: process.env.CI ? undefined : {
    command: 'echo "Using external boost.org site"',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Architecture

### Helper Files Overview

Our test architecture uses several helper files to maintain clean, reusable code:

1. **config-helper.js** - Environment and URL management
2. **test-helpers.js** - Reusable test functions  
3. **selectors.js** - Page element selectors
4. **utils.js** - General utility functions

### Key Features

- **Environment flexibility** - Easy switching between staging/production
- **Smart element detection** - Fallback selectors for robust tests
- **Comprehensive logging** - Detailed test execution information
- **Error handling** - Graceful failure management
- **Reusable patterns** - DRY principle implementation

### Test Categories

**Smoke Tests (TC_SMOKE_xxx)**
- Basic site functionality
- Navigation testing
- Critical path verification

**Functional Tests (TC_FUNC_xxx)**  
- Detailed user journey testing
- Form interactions
- Complex workflows

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run with headed browser (see what's happening)
npm run test:headed

# Run with Playwright UI for debugging
npm run test:ui

# Run specific test
npx playwright test --grep "TC_FUNC_001"

# Run against staging environment
npm run test:staging

# Run against production environment  
npm run test:production
```

### Browser-Specific Testing

```bash
# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on mobile devices
npx playwright test --project="Mobile Chrome"
```

### Debugging Options

```bash
# Debug mode (step through tests)
npm run test:debug

# Run with verbose logging
DEBUG=pw:api npx playwright test

# Generate and view HTML report
npm run test:report
```

## Debugging & Troubleshooting

### Common Issues & Solutions

**1. Tests Not Showing in UI**
- Verify file naming: `*.spec.js` or `*.test.js`
- Check import statements in test files
- Ensure helper files exist and are properly exported

**2. Element Not Found Errors**
- Use Playwright inspector: `npx playwright codegen boost.org`
- Check if elements are in iframes
- Verify element visibility and timing

**3. Timeout Issues**
- Increase timeouts in `playwright.config.js`
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use `page.waitForSelector()` for dynamic content

**4. Environment Issues**
- Verify environment variables are set correctly
- Check network connectivity to target sites
- Ensure proper SSL certificate handling

### Debugging Tools

```bash
# Record a new test interactively
npx playwright codegen https://stage.boost.org

# Run tests with trace viewer
npx playwright test --trace on

# View traces after test execution
npx playwright show-trace trace.zip
```

### Logging & Monitoring

The test suite includes comprehensive logging:
- Test execution progress
- Element interaction details
- Performance metrics
- Error details and stack traces

## CI/CD Integration with GitHub Actions

### GitHub Actions Workflow

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    # Run tests daily at 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  test-staging:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests (Staging)
      run: ENVIRONMENT=staging npm test
      env:
        CI: true
    
    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-staging
        path: playwright-report/
        retention-days: 30
    
    - name: Upload test artifacts
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: test-results-staging
        path: test-results/
        retention-days: 30

  test-production:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    needs: test-staging
    environment: production
    # Only run production tests on main branch
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests (Production)
      run: ENVIRONMENT=production npm test
      env:
        CI: true
    
    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-production
        path: playwright-report/
        retention-days: 30

  notify:
    runs-on: ubuntu-latest
    needs: [test-staging, test-production]
    if: always()
    
    steps:
    - name: Notify on failure
      if: needs.test-staging.result == 'failure' || needs.test-production.result == 'failure'
      uses: 8398a7/action-slack@v3
      with:
        status: failure
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        message: "Playwright tests failed! Check the GitHub Actions logs."
```

### Advanced CI/CD Features

**1. Matrix Testing Strategy**

```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    environment: [staging, production]
    
steps:
  - name: Run tests for ${{ matrix.browser }} on ${{ matrix.environment }}
    run: |
      ENVIRONMENT=${{ matrix.environment }} \
      npx playwright test --project=${{ matrix.browser }}
```

**2. Conditional Test Execution**

```yaml
- name: Run smoke tests only for PRs
  if: github.event_name == 'pull_request'
  run: npx playwright test --grep "SMOKE"

- name: Run all tests for main branch
  if: github.ref == 'refs/heads/main'
  run: npm test
```

**3. Performance Monitoring Integration**

```yaml
- name: Upload performance data
  run: |
    # Extract performance metrics from test results
    node scripts/extract-performance-metrics.js
    
- name: Post performance comment on PR
  uses: actions/github-script@v7
  with:
    script: |
      // Post performance results as PR comment
      const fs = require('fs');
      const metrics = JSON.parse(fs.readFileSync('performance-metrics.json'));
      // ... comment posting logic
```

### Environment Configuration

**GitHub Secrets Setup:**
- `SLACK_WEBHOOK` - For failure notifications
- `TEST_USER_EMAIL` - Test account credentials
- `TEST_USER_PASSWORD` - Test account credentials

**GitHub Environments:**
- `staging` - For staging environment tests
- `production` - For production environment tests (with approval required)

### Test Result Integration

**1. GitHub Status Checks**
- Tests must pass before PR merge
- Branch protection rules enforcement
- Required status checks configuration

**2. Test Reports**
- HTML reports uploaded as artifacts
- JUnit XML for integration with other tools
- JSON results for custom processing

**3. Notifications**
- Slack notifications for failures
- Email alerts for critical issues
- GitHub issue creation for persistent failures

## Best Practices & Maintenance

### Code Quality

**1. Test Organization**
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests independent and atomic

**2. Selector Strategy**
- Prefer data-testid attributes
- Use semantic selectors when possible
- Implement fallback selector strategies

**3. Error Handling**
- Implement comprehensive error logging
- Use try-catch blocks for external dependencies
- Provide meaningful error messages

### Performance Optimization

**1. Test Execution**
- Run tests in parallel when possible
- Use page.goto() efficiently
- Minimize browser context creation

**2. Resource Management**
- Close pages and contexts properly
- Use beforeAll/afterAll for setup/teardown
- Implement test data cleanup

### Maintenance Schedule

**Weekly:**
- Review test execution results
- Update selectors for UI changes
- Check for new test scenarios

**Monthly:**
- Update Playwright version
- Review and optimize test performance
- Update documentation

**Quarterly:**
- Comprehensive test review
- Architecture evaluation
- Tool and process improvements

### Monitoring & Alerts

**Key Metrics to Track:**
- Test success/failure rates
- Test execution duration
- Browser compatibility issues
- Environment-specific failures

**Alert Thresholds:**
- >5% increase in test failures
- >50% increase in execution time
- Critical path test failures

---

## Getting Help

**Resources:**
- [Playwright Documentation](https://playwright.dev/)
- [GitHub Repository Issues](https://github.com/your-org/playwright-boost-tests/issues)
- Team Slack channel: #qa-automation

**Common Commands Quick Reference:**
```bash
# Quick test run
npm run test:e2e

# Debug specific test
npx playwright test --grep "TC_FUNC_001" --debug

# Generate new selectors
npx playwright codegen https://stage.boost.org

# View latest report
npm run test:e2e:report
```

This documentation covers the complete setup and integration of your Playwright test suite. The architecture we've built together provides a solid foundation for reliable, maintainable automated testing.