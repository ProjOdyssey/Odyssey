name: "Bug Report"
description: "Report an issue with Odyssey"
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: "## Describe the bug"
  - type: textarea
    attributes:
      label: "What happened?"
      description: "A clear and concise description of the bug."
      placeholder: "Example: When I try to trade an item, it disappears."
      render: markdown
  - type: textarea
    attributes:
      label: "Steps to Reproduce"
      description: "Steps to reproduce the bug."
      placeholder: "1. Go to 'Marketplace'\n2. Click on 'Trade Item'\n3. Observe the error"
  - type: textarea
    attributes:
      label: "Expected Behavior"
      description: "What should have happened?"
  - type: input
    attributes:
      label: "Game Version"
      description: "Enter the version number (e.g., v0.1.2)"
