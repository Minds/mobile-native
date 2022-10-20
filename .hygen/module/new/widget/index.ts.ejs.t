---
to: "<%=absPath%>/widgets/index.ts"
---
export { Hub<%= CamelName%>Widget } from './hub<%= CamelName%>.widget'
<% if (widget) { -%>
export { <%=CamelName%>Widget } from './<%=camelName%>.widget'
<%} -%>
// end-of-widget-list - HYGEN
