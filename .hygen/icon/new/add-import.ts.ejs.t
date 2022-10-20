---
to: "src/components/iconsList.ts"
inject: true
before: "end-of-svg-imports HYGEN"
skip_if: from \'<%= name%>\'
---
  <%=h.changeCase.pascal(name)%>,