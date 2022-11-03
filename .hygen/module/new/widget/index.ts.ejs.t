---
to: "<%=absPath%>/widgets/index.ts"
---
export { Hub<%= CamelName%>Widget } from './Hub<%= CamelName%>Widget';
<% if (widget) { -%>
export { <%=CamelName%>Widget } from './<%=CamelName%>Widget';
<%} -%>
// end-of-widget-list - HYGEN
