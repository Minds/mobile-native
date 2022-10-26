---
to: "<%= fixtures ? `src/app/sdk/${changeCase.camelCase(info.title.replace('minds',''))}.fixtures.ts` : null%>"
---
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * <%= info.title%>
 * <%- info.description %>
 * version: <%= info.version%>
 */
<% const some_types = []-%>
<% Object.entries(types).forEach(function([key, val]) { -%>
<% const { type, properties, example } = val -%>
<% some_types.push(getTypeFromName(key))-%>
<% if (!properties && !example) { -%>
export const <%=changeCase.camelCase(getTypeFromName(key))%>: <%=getTypeFromName(key)%> = undefined;
<%} else if (example) { -%>
export const <%=changeCase.camelCase(getTypeFromName(key))%>: <%=getTypeFromName(key)%> = <%- type === 'string' ? `'${example}'`: getDeepValue(val)%>;
<%} else {-%>
export const <%=changeCase.camelCase(getTypeFromName(key))%>: <%=getTypeFromName(key)%> = {
<% Object.entries(properties).forEach(function([p, val]) { -%>
  <%=p%>: <%- getDeepValue(val, 0) %>,
<%})-%>};
<%}-%>
<% }); %>

import {
<% [...new Set(some_types)].forEach(function(type) { -%>
  <%=type%>,
<%})-%>
} from './<%=changeCase.camelCase(info.title.replace("10x",""))%>.types';
