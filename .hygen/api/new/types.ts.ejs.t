---
to: "src/app/sdk/<%=changeCase.camelCase(info.title.replace('minds',''))%>.types.ts"
---
/**
 * <%= info.title%>
 * <%- info.description %>
 * version: <%= info.version%>
 */

<% Object.entries(types).forEach(function([key, { required, type, properties, oneOf }]) { -%>
<% if (!properties && !oneOf) { -%>
export type <%=getTypeFromName(key)%> = unknown;
<%} else if (properties || oneOf?.[0]?.properties) {-%>
export type <%=getTypeFromName(key)%> = {
<% Object.entries(properties || oneOf?.[0]?.properties || {}).forEach(function([p, val]) { -%>
  /* <%= val?.description || p%> */
  <%=p%><%=required?.includes(p) ? '' : '?' %>: <%- getTypeValue(val)%>
<%})-%>};
<%} else if (oneOf) {-%>
export type <%=getTypeFromName(key)%> =
<% oneOf.forEach(function(p) { -%>
  | <%=getTypeFromName(p['$ref'])%>
<%})-%>;
<%}-%>
<% }); %>
