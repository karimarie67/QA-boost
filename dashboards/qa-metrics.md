# 📊 QA Metrics Dashboard - Boost.org

> **Automated Quality Gate Report**

**Last Updated:** Tuesday, March 24, 2026 at 12:20 PM | **Env:** STAGING | **Branch:** main
**Run:** [#169](https://github.com/karimarie67/QA-documentation/actions/runs/23498684090)

---

## 🎯 Executive Summary

| Metric | Current Value | Status |
|--------|---------------|----------------|
| **Pass Rate** | **94.7%** | 🟡 Good |
| **Duration** | **33m 58s** | ⚠️ Long |
| **Total Tests** | 38 | 36 Pass / 2 Fail |
| **Functional** | 16 Tests | ✅ Active |

---

### 🌐 Browser Breakdown

| Project | Pass Rate | Status |
|---|---|---|
| **staging** | 97.3% | 🟡 |
| **link-checker** | 0.0% | 🔴 |


---

## 🔍 Detailed Test Results

### 🔥 Smoke Tests
| Test Name | Status | Duration | Project |
|-----------|--------|----------|---------|
| Homepage loads with key elements | ✅ passed | 2.2s | staging |
| Navigation menu links work correctly | ✅ passed | 5.9s | staging |
| Libraries page displays and links to documentation | ✅ passed | 7.9s | staging |
| Download section works correctly | ✅ passed | 4.1s | staging |
| Search bar works with basic query | ✅ passed | 3.7s | staging |
| Homepage is responsive on mobile | ✅ passed | 1.5s | staging |


### 🧩 Functional Tests (Errors, Docs, Search)
| Test Name | Status | Duration | Project |
|-----------|--------|----------|---------|
| 404 page displays appropriate error message | ✅ passed | 1.7s | staging |
| Broken documentation link returns appropriate error | ✅ passed | 1.2s | staging |
| Invalid search query handles gracefully | ✅ passed | 1.5s | staging |
| Malformed URL redirects or shows error appropriately | ✅ passed | 5.2s | staging |
| Broken external links are identified | ✅ passed | 2.8s | staging |
| Form validation errors display correctly | ✅ passed | 1.7s | staging |
| Download links return valid HTTP status codes | ✅ passed | 2.9s | staging |
| Download file names are correct format | ✅ passed | 2.6s | staging |
| Version selector displays available versions | ✅ passed | 2.4s | staging |
| Download page displays file sizes | ✅ passed | 2.2s | staging |

*... and 6 more tests*


### 🔄 Regression Tests
| Test Name | Status | Duration | Project |
|-----------|--------|----------|---------|
| Homepage loads and displays key elements | ✅ passed | 11.4s | staging |
| Search bar is visible and functional | ✅ passed | 3.9s | staging |
| Navigation menu links work | ✅ passed | 28.2s | staging |
| Responsive design adapts to mobile viewport | ✅ passed | 2.0s | staging |
| Logo redirects to homepage | ✅ passed | 4.4s | staging |
| Footer links are accessible | ✅ passed | 5.9s | staging |
| Main content loads on library page | ✅ passed | 3.6s | staging |
| External links are valid | ❌ failed | 6.8s | staging |
| GitHub links point to correct repositories | ✅ passed | 1.1s | staging |
| Documentation page loads and displays content | ✅ passed | 4.1s | staging |

*... and 4 more tests*


### 📦 Version Tests
| Test Name | Status | Duration | Project |
|-----------|--------|----------|---------|
| Libraries page loads and displays version information | ✅ passed | 6.2s | staging |
| Releases page loads and displays release information | ✅ passed | 3.1s | staging |


---

## 📈 History (Last 10 Runs)
| Date | Pass Rate | Duration | Failures |
|------|-----------|----------|----------|
| Mar 24 | 94.7% | 33m 58s | 2 |
| Mar 24 | 100.0% | 26.6s | 0 |
| Jan 21 | 100.0% | 4m 4s | 0 |
| Jan 21 | 100.0% | 5.0s | 0 |
| Jan 21 | 100.0% | 21.9s | 0 |
| Jan 5 | 100.0% | 22.2s | 0 |
| Jan 5 | 100.0% | 4m 8s | 0 |
| Jan 5 | 100.0% | 21.5s | 0 |
| Jan 5 | 100.0% | 20.3s | 0 |
| Jan 5 | 100.0% | 20.1s | 0 |

---
