### **Adding in templates for issues/features**

In the repository root, create a folder called .github. We do not already have this in website-v2 or boostlook. We do have this in website-v2-docs. 

Inside .github, create a folder named ISSUE\_TEMPLATE.

Structure should look like:

```
.github/
└── ISSUE_TEMPLATE/
```

Templates can be added in two ways: 

* Markdown templates (e.g., bug\_report.md, feature\_request.md)  
* YAML forms (for more interactive forms, e.g., bug\_report.yml)

#### **Example: Markdown Template Bug Report**

Create a file called bug\_report.md in .github/ISSUE\_TEMPLATE/ with content like:

```
---
name: Bug Report
about: Report a bug to help us improve the project
title: "[Bug]: "
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment (please complete the following information):**
 - OS: [e.g. Windows, Mac]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

#### **Example: YAML Form Template Bug Report**

Create a file called bug\_report.yml in .github/ISSUE\_TEMPLATE/ with content like:

```
name: Bug Report
description: File a bug report
title: "[Bug]: "
labels: [bug]
body:
  - type: markdown
    attributes:
      value: |
       Thanks for reporting a bug!
  - type: input
    id: what-happened
    attributes:
      label: What happened?
      description: Tell us what happened.
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: How can we reproduce the issue?
    validations:
      required: true
  - type: input
    id: environment
    attributes:
      label: Environment
      description: OS/Browser/Version, etc.
  - type: textarea
    id: additional
    attributes:
      label: Additional Context
      description: Any other details?
```

Add, commit, and push the new files to the proper repository:

```
git add .github/ISSUE_TEMPLATE/bug_report.md
git commit -m "Add bug report issue template"
git push
```

(or use the GitHub web UI to create and commit these files)

Go to the Issues tab and click “New Issue.” You should now see the new templates as options.

Follow the steps above to create/add the following feature request template (markdown).

```
---
name: Feature Request
about: Suggest an idea for this project
title: "[Feature]: "
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex: I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

Follow the steps above to create/add the following feature request template (yaml).

```
name: Feature Request
description: Suggest an idea for this project
title: "[Feature]: "
labels: [enhancement]
body:
  - type: markdown
    attributes:
      value: |
       Thanks for taking the time to suggest a feature!
  - type: textarea
    id: problem
    attributes:
      label: Is your feature request related to a problem?
      description: Please describe the problem or need.
    validations:
      required: false
  - type: textarea
    id: solution
    attributes:
      label: Describe the solution you'd like
      description: What would you like to see happen?
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Describe alternatives you've considered
      description: Have you thought of any alternatives?
    validations:
      required: false
  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Any other context or screenshots?
    validations:
      required: false
```

Comparisons between the two options:

| Feature | YAML Issue Forms (`.yml`) | Markdown Issue Templates (`.md`) |
| ----- | ----- | ----- |
| **User Experience** | **Interactive Form:** Presents contributors with a user-friendly form containing distinct input fields, dropdown menus, checkboxes, and more. | **Pre-populated Text:** Fills the issue body with Markdown text that the user must manually edit or replace. |
| **Structure & Validation** | **Highly Structured:** Enforces a specific structure for issue submissions. You can make certain fields mandatory, preventing the submission of incomplete reports. | **Loosely Guided:** Offers a suggested structure using headers and comments within the Markdown, but users can easily deviate from it or omit information. |
| **Input Types** | **Rich & Varied:** Supports a range of input types, including single-line text fields (`input`), multi-line text areas (`textarea`), dropdown selectors (`dropdown`), and checklists (`checkboxes`). | **Text-Only:** Limited to a single, large text area. All information is provided as text. |
| **Readability for Submitter** | **Clear & Concise:** The form layout makes it easy for contributors to understand what information is required for each section. | **Can Be Cluttered:** The template can become cluttered with instructional comments within the Markdown, which the user must manually remove. |
| **Data Consistency** | **High:** The structured nature of the forms ensures that the information received is consistent and in a predictable format, making it easier for maintainers to parse and act on. | **Low to Medium:** The lack of enforcement means that the completeness and format of submissions can vary significantly. |
| **Maintainer Overhead** | **Reduced Back-and-Forth:** By requiring specific information upfront, it minimizes the need for maintainers to ask for more details. | **Potential for Follow-up:** Maintainers often need to follow up with contributors to gather missing information. |
| **Setup Complexity** | **More Involved:** Requires learning the specific YAML syntax for defining the form elements and their attributes. | **Simple:** Straightforward to create, as it's just a standard Markdown file. |

