---
to: "src/modules/main/modules.tsx"
inject: true
before: "end-of-modules - HYGEN"
skip_if: <%= CamelName%>Components,
---
  <%= CamelName%>Components,