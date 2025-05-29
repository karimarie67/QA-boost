# 404 Errors Report

**Generated**: May 29, 2025  
**Source**: Xenu Link Sleuth 1.3.9 beta report for Boost.org

## Summary
- **Total 404 Errors**: 14
- **Categories Affected**: Build documentation, development test pages, contributor guide, JSON documentation

## Detailed List
| Page URL | Link URL | Link Text | Error Code |
|----------|----------|-----------|------------|
| https://www.boost.org/build/doc/html/bbv2/overview/configuration.html | https://www.boost.org/build/doc/html/bbv2/overview/configuration.html/ | redir | 404 (not found) |
| https://www.boost.org/development/tests/develop/developer/date_time.html | https://www.boost.org/development/tests/develop/developer/date_time.html/ | redir | 404 (not found) |
| https://www.boost.org/development/tests/develop/developer/flyweight.html | https://www.boost.org/development/tests/develop/developer/flyweight.html/ | redir | 404 (not found) |
| https://www.boost.org/development/tests/develop/developer/program_options.html | https://www.boost.org/development/tests/develop/developer/program_options.html/ | redir | 404 (not found) |
| https://www.boost.org/development/tests/master/developer/json.html | https://www.boost.org/development/tests/master/developer/json.html/ | redir | 404 (not found) |
| https://www.boost.org/doc/contributor-guide/ | https://www.boost.org/doc/contributor-guide/"https://plausible.io/js/script.manual.js" | (none) | 404 (not found) |
| https://www.boost.org/doc/contributor-guide/contributor-community-introduction.html | https://www.boost.org/doc/contributor-guide/"https://plausible.io/js/script.manual.js" | (none) | 404 (not found) |
| https://www.boost.org/doc/contributor-guide/contributors-faq.html | https://www.boost.org/doc/contributor-guide/"https://plausible.io/js/script.manual.js" | (none) | 404 (not found) |
| https://www.boost.org/doc/contributor-guide/design-guide/design-best-practices.html | https://www.boost.org/doc/contributor-guide/design-guide/"https://plausible.io/js/script.manual.js" | (none) | 404 (not found) |
| https://www.boost.org/doc/contributor-guide/getting-involved.html | https://www.boost.org/doc/contributor-guide/"https://plausible.io/js/script.manual.js" | (none) | 404 (not found) |
| https://www.boost.org/doc/contributor-guide/index.html | https://www.boost.org/doc/contributor-guide/"https://plausible.io/js/script.manual.js" | (none) | 404 (not found) |
| https://www.boost.org/doc/contributor-guide/requirements/library-requirements.html | https://www.boost.org/doc/contributor-guide/requirements/"https://plausible.io/js/script.manual.js" | (none) | 404 (not found) |
| https://www.boost.org/doc/contributor-guide/superproject/overview.html | https://www.boost.org/doc/contributor-guide/superproject/"https://plausible.io/js/script.manual.js" | (none) | 404 (not found) |
| https://www.boost.org/doc/contributor-guide/testing/intro.html | https://www.boost.org/doc/contributor-guide/testing/"https://plausible.io/js/script.manual.js" | (none) | 404 (not found) |

## Observations
- **Contributor Guide Links**: Eight errors are due to malformed links combining contributor guide paths with a Plausible.io script, indicating a documentation build error.
- **Development Test Pages**: Four errors involve test pages (`date_time`, `flyweight`, `program_options`, `json`), which may be removed or unpublished.
- **Build Documentation**: One error in `bbv2` documentation is due to a trailing slash.

## Recommendations
- **Fix Contributor Guide Links**: Correct the Plausible.io script inclusion in the build process.
- **Verify Test Pages**: Confirm with Boost.org maintainers if test pages are deprecated or need redirection.
- **Correct Build Documentation**: Remove the trailing slash in the `bbv2` link.
- **Prioritization**: Focus on contributor guide links (high impact), then test pages, and finally the build documentation.