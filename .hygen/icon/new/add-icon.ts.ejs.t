---
to: "src/components/iconsList.ts"
inject: true
before: "end-of-components HYGEN"
skip_if: ": '<%= name%>'"
---
  '<%= name%>': <%=h.changeCase.pascal(name)%>,