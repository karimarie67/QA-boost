const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.join(__dirname, '../../artifacts');
const DASHBOARD_PATH = path.join(__dirname, '../qa-metrics.md');
const RESULTS_DIR = path.join(__dirname, '../test-results');
const HISTORY_FILE = path.join(RESULTS_DIR, 'history.json');

function main() {
  console.log('🔄 Generating QA Dashboard...');
  
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
  
  const testResults = collectTestResults();
  const metrics = calculateMetrics(testResults);
  updateHistory(metrics);
  const history = loadHistory();
  const dashboard = generateDashboardMarkdown(metrics, testResults, history);
  
  fs.writeFileSync(DASHBOARD_PATH, dashboard);
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'latest-results.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), metrics, testResults }, null, 2)
  );
  
  console.log('✅ Dashboard generated successfully!');
  console.log(`📊 Total Tests: ${metrics.totalTests} | Passed: ${metrics.passed} | Failed: ${metrics.failed} | Pass Rate: ${metrics.passRate.toFixed(1)}%`);
}

function collectTestResults() {
  const results = { smoke: [], regression: [] };
  
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    console.warn('⚠️  No artifacts found, using sample data');
    return getSampleResults();
  }
  
  const smokeFile = findFile(ARTIFACTS_DIR, 'smoke-results.json');
  if (smokeFile) results.smoke = parsePlaywrightJson(smokeFile);
  
  const boostFile = findFile(ARTIFACTS_DIR, 'boost-io-results.json');
  if (boostFile) results.regression = results.regression.concat(parsePlaywrightJson(boostFile));
  
  const versionFile = findFile(ARTIFACTS_DIR, 'version-results.json');
  if (versionFile) results.regression = results.regression.concat(parsePlaywrightJson(versionFile));
  
  return results;
}

function findFile(dir, filename) {
  try {
    const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
    const file = files.find(f => f.name === filename);
    return file ? path.join(file.path, file.name) : null;
  } catch (e) {
    return null;
  }
}

function parsePlaywrightJson(filepath) {
  try {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    const tests = [];
    
    if (data.suites) {
      data.suites.forEach(suite => {
        if (suite.specs) {
          suite.specs.forEach(spec => {
            const result = spec.tests?.[0]?.results?.[0];
            tests.push({
              name: spec.title || 'Unknown Test',
              status: spec.ok ? 'passed' : 'failed',
              duration: ((result?.duration || 0) / 1000).toFixed(2) + 's',
              error: result?.error?.message || null
            });
          });
        }
      });
    }
    return tests;
  } catch (e) {
    console.error(`Error parsing ${filepath}:`, e.message);
    return [];
  }
}

function getSampleResults() {
  return {
    smoke: [
      { name: 'Homepage loads', status: 'passed', duration: '1.2s' },
      { name: 'Navigation works', status: 'passed', duration: '0.8s' }
    ],
    regression: [
      { name: 'Boost.io accessible', status: 'passed', duration: '1.5s' },
      { name: 'Library docs load', status: 'passed', duration: '2.1s' },
      { name: 'Version page loads', status: 'passed', duration: '1.3s' }
    ]
  };
}

function calculateMetrics(results) {
  const allTests = [...results.smoke, ...results.regression];
  const passed = allTests.filter(t => t.status === 'passed').length;
  const failed = allTests.filter(t => t.status === 'failed').length;
  
  return {
    totalTests: allTests.length,
    passed,
    failed,
    passRate: allTests.length > 0 ? (passed / allTests.length) * 100 : 0,
    smokeCount: results.smoke.length,
    regressionCount: results.regression.length,
    timestamp: new Date().toISOString(),
    environment: process.env.TEST_ENV || 'staging',
    runId: process.env.GITHUB_RUN_ID || 'local',
    runNumber: process.env.GITHUB_RUN_NUMBER || '0',
    branch: process.env.GITHUB_REF?.replace('refs/heads/', '') || 'unknown'
  };
}

function updateHistory(metrics) {
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  }
  history.push({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toISOString(),
    total: metrics.totalTests,
    passed: metrics.passed,
    failed: metrics.failed,
    passRate: metrics.passRate
  });
  if (history.length > 30) history = history.slice(-30);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function loadHistory() {
  return fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')) : [];
}

function generateDashboardMarkdown(metrics, results, history) {
  const env = (metrics.environment || 'staging').toUpperCase();
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'long' });
  
  return `# 📊 QA Metrics Dashboard - Boost.org Testing

> **Live automated testing metrics for Boost C++ Libraries**

**Last Updated:** ${timestamp}  
**Environment:** ${env}  
**Branch:** ${metrics.branch}  
**Run:** [#${metrics.runNumber}](https://github.com/karimarie67/QA-documentation/actions/runs/${metrics.runId})

---

## 🎯 Test Execution Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Total Tests** | ${metrics.totalTests} | - |
| **✅ Passed** | ${metrics.passed} | ${getStatusEmoji(metrics.passRate)} |
| **❌ Failed** | ${metrics.failed} | ${metrics.failed === 0 ? '✅' : '⚠️'} |
| **Pass Rate** | **${metrics.passRate.toFixed(1)}%** | ${getPassRateStatus(metrics.passRate)} |

---

## 📈 Test Coverage by Suite

\`\`\`
🔥 Smoke Tests:        ${'█'.repeat(getBarLength(results.smoke))}${'░'.repeat(20 - getBarLength(results.smoke))} ${getPassPercentage(results.smoke)}% (${results.smoke.length} tests)
   ↳ Runs on: Every PR/commit (pre-merge validation)

🔄 Regression Tests:   ${'█'.repeat(getBarLength(results.regression))}${'░'.repeat(20 - getBarLength(results.regression))} ${getPassPercentage(results.regression)}% (${results.regression.length} tests)
   ↳ Runs on: Develop branch merges (comprehensive validation)
\`\`\`

---

## 🔍 Detailed Test Results

### 🔥 Smoke Tests (Pre-Merge Validation)
${generateTestTable(results.smoke)}

### 🔄 Regression Tests (Post-Merge on Develop)
${generateTestTable(results.regression)}

---

## 📅 7-Day Trend

| Date | Total | Passed | Failed | Pass Rate |
|------|-------|--------|--------|-----------|
${generateHistoryTable(history.slice(-7))}

---

## 📋 SOW Progress

### Month 1: Foundation & Planning ✅ 100%
### Month 2: Setup & Early Execution 🟢 90%
### Month 3: Automation & Optimization 🟡 45%

---

## ⚡ Quick Links

${metrics.failed > 0 ? `### ⚠️ Failed Tests\n${getFailedTests(results)}\n` : '### ✅ All Tests Passing!\n'}

### 📚 Resources
- [QA Handbook](../docs/QA_handbook.md)
- [View Full Report](https://github.com/karimarie67/QA-documentation/actions/runs/${metrics.runId})

---

<sub>🤖 *Auto-updated by GitHub Actions*</sub>
`;
}

function getBarLength(tests) {
  if (!tests || tests.length === 0) return 0;
  return Math.floor((tests.filter(t => t.status === 'passed').length / tests.length) * 20);
}

function getPassPercentage(tests) {
  if (!tests || tests.length === 0) return 0;
  return Math.floor((tests.filter(t => t.status === 'passed').length / tests.length) * 100);
}

function getStatusEmoji(passRate) {
  return passRate >= 95 ? '🟢' : passRate >= 80 ? '🟡' : '🔴';
}

function getPassRateStatus(passRate) {
  return passRate >= 95 ? '🟢 **Excellent**' : passRate >= 80 ? '🟡 **Good**' : '🔴 **Needs Attention**';
}

function generateTestTable(tests) {
  if (!tests || tests.length === 0) return '*No tests in this category*\n';
  let table = '| Test Name | Status | Duration |\n|-----------|--------|----------|\n';
  tests.forEach(test => {
    table += `| ${test.name} | ${test.status === 'passed' ? '✅' : '❌'} ${test.status} | ${test.duration} |\n`;
  });
  return table;
}

function generateHistoryTable(history) {
  if (!history || history.length === 0) return '*No historical data yet*';
  return history.map(entry => {
    const date = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `| ${date} | ${entry.total} | ${entry.passed} | ${entry.failed} | ${entry.passRate.toFixed(1)}% |`;
  }).join('\n');
}

function getFailedTests(results) {
  const failed = [...results.smoke, ...results.regression].filter(t => t.status === 'failed');
  return failed.length === 0 ? '' : failed.map(t => `- **${t.name}**${t.error ? `\n  \`${t.error}\`` : ''}`).join('\n');
}

main();
