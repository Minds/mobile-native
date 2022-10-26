---
to: "<%= `${absPath}/.hygen/widget/new/widget-index-add.ts.ejs.t` %>"
---
---
to: "widgets/index.ts"
inject: true
before: "end-of-widget-list"
skip_if: export \{ <%%= CamelName%>Widget,
---
export { <%%= CamelName%>Widget } from './<%%= camelName%>.widget';
