---
to: "src/modules/main/modules.tsx"
inject: true
before: "end-of-tab-list"
skip_if: "name: '<%= CamelName%>',"
---
  {
    name: '<%= CamelName%>',
    iconName: 'settings',
  },