const fs = require('fs');
const path = require('path');

// --- CONFIGURATION: QUALITY GATES ---
// Adjust these values to change the pass/fail thresholds in the dashboard
const QUALITY_GATES = {
  SMOKE_TARGET: 100,      // Smoke tests must be perfect
  REGRESSION_TARGET: 95,  // Regression allows small margin for known flakes
  VERSION_TARGET: 98,     // Version checks should be high
  MAX_DURATION_SEC: 300   // Warning if total suite takes > 5 mins
};

const ARTIFACTS_DIR = path.join(__dirname, '../../artifacts');
const DASHBOARD_PATH = path.join(__dirname, '../qa-metrics.md');
const RESULTS_DIR = path.join(__dirname, '../test-results');
const HISTORY_FILE = path.join(RESULTS_DIR, 'history.json');

function main() {
  console.log('🔄 Generating QA Dashboard (v2.0 - Robust Stats)...');
  
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
  
  const testResults = collectTestResults();
  const metrics = calculateMetrics(testResults);
  
  updateHistory(metrics);
  const history = loadHistory();
  
  // Calculate trends based on history
  const trends = calculateTrends(metrics, history);
  
  const dashboard = generateDashboardMarkdown(metrics, testResults, history, trends);
  
  fs.writeFileSync(DASHBOARD_PATH, dashboard);
  
  // Save detailed latest results
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'latest-results.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), metrics, testResults }, null, 2)
  );
  
  console.log('✅ Dashboard generated successfully!');
  console.log(`📊 Pass Rate: ${metrics.passRate.toFixed(1)}% | Duration: ${formatDuration(metrics.totalDuration)}`);
}

function collectTestResults() {
  const results = { smoke: [], regression: [], version: [] };
  
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    console.warn('⚠️  No artifacts directory found - Using Sample Data');
    return getSampleResults();
  }
  
  const files = {
    smoke: path.join(ARTIFACTS_DIR, 'smoke-test-results/smoke-results.json'),
    regression: path.join(ARTIFACTS_DIR, 'boost-io-test-results/boost-io-results.json'),
    version: path.join(ARTIFACTS_DIR, 'version-test-results/version-results.json')
  };

  for (const [key, filepath] of Object.entries(files)) {
    if (fs.existsSync(filepath)) {
      console.log(`Found ${key} results: ${filepath}`);
      results[key] = parsePlaywrightJson(filepath);
    } else {
      console.log(`No ${key} results found`);
    }
  }
  
  if (results.smoke.length === 0 && results.regression.length === 0 && results.version.length === 0) {
    return getSampleResults();
  }
  
  return results;
}

function parsePlaywrightJson(filepath) {
  try {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    const tests = [];
    
    function traverse(node) {
      if (node.specs) {
        node.specs.forEach(spec => {
          if (spec.tests) {
            spec.tests.forEach(test => {
              if (test.results && test.results.length > 0) {
                const result = test.results[0];
                tests.push({
                  name: spec.title || test.title || 'Unknown Test',
                  status: result.status === 'passed' ? 'passed' : 'failed',
                  // Store as raw number for math, convert to string for display later
                  durationSec: (result.duration || 0) / 1000, 
                  error: result.errors && result.errors.length > 0 ? result.errors[0].message : null
                });
              }
            });
          }
        });
      }
      if (node.suites) node.suites.forEach(suite => traverse(suite));
    }
    
    traverse(data);
    return tests;
  } catch (e) {
    console.error(`✗ Error parsing ${filepath}:`, e.message);
    return [];
  }
}

function calculateMetrics(results) {
  const allTests = [...results.smoke, ...results.regression, ...results.version];
  const passed = allTests.filter(t => t.status === 'passed').length;
  const failedTests = allTests.filter(t => t.status === 'failed');
  
  // Calculate total duration
  const totalDuration = allTests.reduce((acc, t) => acc + (t.durationSec || 0), 0);

  return {
    totalTests: allTests.length,
    passed,
    failed: failedTests.length,
    failedTestNames: failedTests.map(t => t.name), // Store names for flakiness tracking
    passRate: allTests.length > 0 ? (passed / allTests.length) * 100 : 0,
    totalDuration: totalDuration,
    smokeCount: results.smoke.length,
    regressionCount: results.regression.length,
    versionCount: results.version.length,
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
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) {
      console.warn('⚠️ Could not parse history file, starting fresh.');
    }
  }
  
  const runNumber = process.env.GITHUB_RUN_NUMBER || '0';
  
  const newEntry = {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toISOString(),
    total: metrics.totalTests,
    passed: metrics.passed,
    failed: metrics.failed,
    passRate: metrics.passRate,
    duration: metrics.totalDuration, // NEW: Tracking duration
    failedTestNames: metrics.failedTestNames, // NEW: Tracking specific failures
    runNumber: runNumber
  };
  
  // Remove existing entry for this run (idempotency)
  history = history.filter(entry => entry.runNumber !== runNumber);
  history.push(newEntry);
  
  // Keep last 50 runs
  if (history.length > 50) history = history.slice(-50);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function loadHistory() {
  return fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')) : [];
}

// NEW: Trend Calculation Logic
function calculateTrends(metrics, history) {
  if (history.length < 2) return { durationDiff: 0, flakyTests: [] };

  // 1. Duration Trend (vs previous run)
  const prevRun = history[history.length - 2]; // -1 is current, -2 is previous
  const durationDiff = metrics.totalDuration - (prevRun.duration || 0);

  // 2. Flakiness Detection
  // Look at last 10 runs. If a test failed > 1 time, it's a "Top Offender"
  const recentHistory = history.slice(-10);
  const failureCounts = {};
  
  recentHistory.forEach(run => {
    if (run.failedTestNames && Array.isArray(run.failedTestNames)) {
      run.failedTestNames.forEach(name => {
        failureCounts[name] = (failureCounts[name] || 0) + 1;
      });
    }
  });

  // Filter for tests that failed at least twice in recent history
  const flakyTests = Object.entries(failureCounts)
    .filter(([name, count]) => count > 1)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // Sort by most frequent

  return { durationDiff, flakyTests };
}

function generateDashboardMarkdown(metrics, results, history, trends) {
  const env = (metrics.environment || 'staging').toUpperCase();
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' });
  
  // Duration Logic
  const durationSign = trends.durationDiff > 0 ? '🔺 Slower' : 'Hz Faster';
  const durationColor = trends.durationDiff > 5 ? '🔴' : '🟢'; // Red if >5s slower
  const durationText = `${formatDuration(metrics.totalDuration)} (${durationColor} ${Math.abs(trends.durationDiff).toFixed(1)}s ${durationSign})`;

  return `# 📊 QA Metrics Dashboard - Boost.org

> **Automated Quality Gate Report**

**Last Updated:** ${timestamp} | **Env:** ${env} | **Branch:** ${metrics.branch}
**Run:** [#${metrics.runNumber}](https://github.com/karimarie67/QA-documentation/actions/runs/${metrics.runId})

---

## 🎯 Executive Summary

| Metric | Current Value | Trend / Status |
|--------|---------------|----------------|
| **Pass Rate** | **${metrics.passRate.toFixed(1)}%** | ${getPassRateStatus(metrics.passRate)} |
| **Execution Time** | **${durationText}** | ${metrics.totalDuration > QUALITY_GATES.MAX_DURATION_SEC ? '⚠️ Long Running' : '✅ Optimized'} |
| **Total Tests** | ${metrics.totalTests} | ${metrics.passed} Passing / ${metrics.failed} Failed |
| **Flakiness** | ${trends.flakyTests.length} Recurring Issues | ${trends.flakyTests.length > 0 ? '⚠️ Unstable' : '✅ Stable'} |

---

## ⚠️ Top Flaky / Recurring Failures
${generateFlakyTable(trends.flakyTests)}

---

## 🔍 Detailed Test Results

### 🔥 Smoke Tests (Target: ${QUALITY_GATES.SMOKE_TARGET}%)
${generateTestTable(results.smoke)}

### 🔄 Regression Tests (Target: ${QUALITY_GATES.REGRESSION_TARGET}%)
${generateTestTable(results.regression)}

### 📦 Version Tests (Target: ${QUALITY_GATES.VERSION_TARGET}%)
${generateTestTable(results.version)}

---

## 📈 Performance & History (Last 10 Runs)

| Date | Pass Rate | Duration | Failures | Status |
|------|-----------|----------|----------|--------|
${generateHistoryTable(history.slice(-10))}

---

## 🐛 Quality Gate Status

| Gate | Current | Target | Status |
|------|---------|--------|--------|
| **Smoke Reliability** | ${calculatePassRate(results.smoke)}% | ${QUALITY_GATES.SMOKE_TARGET}% | ${getGateEmoji(calculatePassRate(results.smoke), QUALITY_GATES.SMOKE_TARGET)} |
| **Regression Reliability** | ${calculatePassRate(results.regression)}% | ${QUALITY_GATES.REGRESSION_TARGET}% | ${getGateEmoji(calculatePassRate(results.regression), QUALITY_GATES.REGRESSION_TARGET)} |
| **Version Compatibility** | ${calculatePassRate(results.version)}% | ${QUALITY_GATES.VERSION_TARGET}% | ${getGateEmoji(calculatePassRate(results.version), QUALITY_GATES.VERSION_TARGET)} |

---
`;
}

// --- HELPER FUNCTIONS ---

function formatDuration(seconds) {
  if (!seconds) return '0s';
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(0);
  return `${m}m ${s}s`;
}

function calculatePassRate(tests) {
  if (!tests || tests.length === 0) return 0;
  const passed = tests.filter(t => t.status === 'passed').length;
  return Math.round((passed / tests.length) * 100);
}

function getGateEmoji(current, target) {
  return current >= target ? '✅' : '🔴';
}

function getPassRateStatus(passRate) {
  if (passRate >= 98) return '🟢 **Excellent**';
  if (passRate >= 90) return '🟡 **Good**';
  return '🔴 **Needs Attention**';
}

function generateFlakyTable(flakyTests) {
  if (!flakyTests || flakyTests.length === 0) {
    return '> *No recurring failures detected in the last 10 runs. Great job!* 🎉';
  }
  let table = '| Test Name | Recent Failures (Last 10 Runs) |\n|-----------|--------------------------------|\n';
  flakyTests.slice(0, 5).forEach(item => {
    table += `| \`${item.name}\` | **${item.count}** 🚩 |\n`;
  });
  return table;
}

function generateTestTable(tests) {
  if (!tests || tests.length === 0) return '*No tests in this category*\n';
  const displayTests = tests.slice(0, 10);
  const remaining = tests.length - displayTests.length;
  
  let table = '| Test Name | Status | Duration |\n|-----------|--------|----------|\n';
  displayTests.forEach(test => {
    const statusIcon = test.status === 'passed' ? '✅' : '❌';
    const dur = test.durationSec < 1 ? '<1s' : `${test.durationSec.toFixed(1)}s`;
    table += `| ${test.name} | ${statusIcon} ${test.status} | ${dur} |\n`;
  });
  
  if (remaining > 0) table += `\n*... and ${remaining} more tests*\n`;
  return table;
}

function generateHistoryTable(history) {
  if (!history || history.length === 0) return '*No history yet*';
  
  return history.reverse().map(entry => {
    const date = new Date(entry.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dur = formatDuration(entry.duration);
    const passRate = parseFloat(entry.passRate).toFixed(1);
    const status = entry.passRate >= 95 ? '🟢' : (entry.passRate >= 85 ? '🟡' : '🔴');
    
    return `| ${date} | ${passRate}% | ${dur} | ${entry.failed} | ${status} |`;
  }).join('\n');
}

function getSampleResults() {
  return {
    smoke: [
      { name: 'Homepage loads', status: 'passed', durationSec: 1.2 },
      { name: 'Navigation works', status: 'passed', durationSec: 0.8 }
    ],
    regression: [
      { name: 'Boost.io accessible', status: 'passed', durationSec: 1.5 },
      { name: 'Library docs load', status: 'passed', durationSec: 2.1 },
      { name: 'Version page loads', status: 'failed', durationSec: 1.3 } // Intentional fail for sample
    ],
    version: [
      { name: 'Version compatibility check', status: 'passed', durationSec: 1.0 }
    ]
  };
}

main();