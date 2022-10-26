---
to: "<%= `${absPath}/.hygen/screen/new/screen-index-add.ts.ejs.t` %>"
---
---
to: "screens/index.ts"
inject: true
before: "end-of-screen-list"
skip_if: export \{ <%%= CamelName%>Screen,
---
export { <%%= CamelName%>Screen } from './<%%= dashName%>/<%%= camelName%>.screen';
