# 📊 QA Metrics Dashboard - Boost.org

> **Automated Quality Gate Report**

**Last Updated:** Thursday, July 2, 2026 at 9:23 AM | **Env:** STAGING | **Branch:** main
**Run:** [#170](https://github.com/karimarie67/QA-documentation/actions/runs/28593134600)

---

## 🎯 Executive Summary

| Metric | Current Value | Status |
|--------|---------------|----------------|
| **Pass Rate** | **97.9%** | 🟡 Good |
| **Duration** | **4m 21s** | ✅ Good |
| **Total Tests** | 47 | 46 Pass / 1 Fail |
| **Functional** | 25 Tests | ✅ Active |

---

### 🌐 Browser Breakdown

| Project | Pass Rate | Status |
|---|---|---|
| **staging** | 97.9% | 🟡 |


---

## 🔍 Detailed Test Results

### 🔥 Smoke Tests
| Test Name | Status | Duration | Project |
|-----------|--------|----------|---------|
| Homepage loads with key elements | ✅ passed | 1.8s | staging |
| Navigation menu links work correctly | ✅ passed | 4.1s | staging |
| Libraries page displays and links to documentation | ✅ passed | 9.6s | staging |
| Download section works correctly | ✅ passed | 4.5s | staging |
| Search bar works with basic query | ✅ passed | 3.9s | staging |
| Homepage is responsive on mobile | ✅ passed | 1.5s | staging |


### 🧩 Functional Tests (Errors, Docs, Search)
| Test Name | Status | Duration | Project |
|-----------|--------|----------|---------|
| 404 page displays appropriate error message | ✅ passed | 1.6s | staging |
| Broken documentation link returns appropriate error | ✅ passed | 1.3s | staging |
| Invalid search query handles gracefully | ✅ passed | 1.4s | staging |
| Malformed URL redirects or shows error appropriately | ✅ passed | 5.2s | staging |
| Broken external links are identified | ✅ passed | 3.0s | staging |
| Form validation errors display correctly | ✅ passed | 1.5s | staging |
| Download links return valid HTTP status codes | ✅ passed | 2.6s | staging |
| Download file names are correct format | ✅ passed | 2.0s | staging |
| Version selector displays available versions | ✅ passed | 2.2s | staging |
| Download page displays file sizes | ✅ passed | 3.5s | staging |

*... and 15 more tests*


### 🔄 Regression Tests
| Test Name | Status | Duration | Project |
|-----------|--------|----------|---------|
| Homepage loads and displays key elements | ✅ passed | 6.0s | staging |
| Search bar is visible and functional | ✅ passed | 4.8s | staging |
| Navigation menu links work | ✅ passed | 27.6s | staging |
| Responsive design adapts to mobile viewport | ✅ passed | 1.4s | staging |
| Logo redirects to homepage | ✅ passed | 5.6s | staging |
| Footer links are accessible | ✅ passed | 2.1s | staging |
| Main content loads on library page | ✅ passed | 5.4s | staging |
| External links are valid | ❌ failed | 6.8s | staging |
| GitHub links point to correct repositories | ✅ passed | <1s | staging |
| Documentation page loads and displays content | ✅ passed | 3.1s | staging |

*... and 4 more tests*


### 📦 Version Tests
| Test Name | Status | Duration | Project |
|-----------|--------|----------|---------|
| Libraries page loads and displays version information | ✅ passed | 7.2s | staging |
| Releases page loads and displays release information | ✅ passed | 3.9s | staging |


---

## 📈 History (Last 10 Runs)
| Date | Pass Rate | Duration | Failures |
|------|-----------|----------|----------|
| Jul 2 | 97.9% | 4m 21s | 1 |
| Mar 24 | 94.7% | 33m 58s | 2 |
| Mar 24 | 100.0% | 26.6s | 0 |
| Jan 21 | 100.0% | 4m 4s | 0 |
| Jan 21 | 100.0% | 5.0s | 0 |
| Jan 21 | 100.0% | 21.9s | 0 |
| Jan 5 | 100.0% | 22.2s | 0 |
| Jan 5 | 100.0% | 4m 8s | 0 |
| Jan 5 | 100.0% | 21.5s | 0 |
| Jan 5 | 100.0% | 20.3s | 0 |

---
