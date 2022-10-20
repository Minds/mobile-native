---
to: "<%= `${absPath}/.hygen/screen/new/main-index-add-links.tsx.ejs.t` %>"
---
---
to: "<%%= deeplink ? `${absPath}/index.tsx` : null%>"
inject: true
before: "end-of-navigation-links"
skip_if: <%%= CamelName%>\:\s\'<%%= dashName%>\/\:id\?\',
---
    <%%= CamelName%>: '<%%= dashName%>/:id?',