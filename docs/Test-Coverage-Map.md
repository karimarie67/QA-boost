# Test Coverage Map

## Overview
This document maps test coverage for boost.org automated testing, showing what's tested, test types, and current status.

## Automated Test Coverage

### Smoke Tests (smoke_tests.spec.js)
**Purpose:** Quick validation of critical paths  
**Execution:** Every PR/commit (5-10 minutes)  
**Coverage:**
- Homepage accessibility and load time
- Navigation menu functionality
- Basic page rendering
- Critical user paths

### Boost.io Tests (boost_io_tests.spec.js)
**Purpose:** Comprehensive boost.org functionality  
**Execution:** Develop branch after merge (15-25 minutes)  
**Coverage:**
- Library documentation pages
- Documentation search functionality
- Content navigation and links
- Library browsing features

### Version Tests (boost_version_tests.spec.js)
**Purpose:** Version-specific functionality validation  
**Execution:** Develop branch after merge (10-15 minutes)  
**Coverage:**
- Release version pages
- Version navigation
- Download links validation
- Release-specific documentation

## Manual Test Cases

Reference the following for manual test documentation:
- `Functional-Table 1.csv` - Functional test cases
- `Regression-Table 1.csv` - Regression test cases

## Coverage Metrics

**Current Automation:** 75%  
**Target:** 80%

| Area | Automated | Manual | Total |
|------|-----------|--------|-------|
| Critical Paths | 100% | 0% | 100% |
| Core Features | 80% | 20% | 100% |
| Edge Cases | 50% | 50% | 100% |

## Future Coverage Plans

**Planned Additions:**
- Cross-browser testing expansion (Firefox, Safari)
- Performance benchmarking
- Visual regression testing
- Accessibility testing integration

---
