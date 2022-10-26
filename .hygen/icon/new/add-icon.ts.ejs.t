---
to: "src/modules/iconsList.ts"
inject: true
before: "end-of-modules HYGEN"
skip_if: ": '<%= name%>'"
---
  '<%= name%>': <%=h.changeCase.pascal(name)%>,
