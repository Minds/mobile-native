---
to: "<%= `${absPath}/.hygen/screen/new/main-index-import.tsx.ejs.t` %>"
---
---
to: <%%= `${absPath}/index.tsx`%>
inject: true
before: "end-of-screen-list"
skip_if: <%%= CamelName%>Screen,
---
  <%%= CamelName%>Screen,