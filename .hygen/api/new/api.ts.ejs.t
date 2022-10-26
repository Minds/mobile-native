---
to: "src/app/sdk/<%=changeCase.camelCase(info.title.replace('minds',''))%>.ts"
---
/**
 * <%= info.title%>
 * <%- info.description %>
 * version: <%= info.version%>
 */

<% const types = []-%>
<% Object.entries(paths).forEach(function([key, value]) { -%>
<% Object.entries(value).forEach(function([verb, {deprecated, summary, description, operationId, parameters, requestBody, responses}]) {
  if (deprecated && ignoreDeprecated || !['get', 'post', 'put', 'patch', 'delete'].includes(verb)) {
    return
  } -%>
/**
 * <%- summary%>
 *
 * <%- removeMarkdown(description)%>
 */
<%
  const contentType = extractContentType(requestBody?.content);
  if (contentType) {
    types.push(contentType);
  }
  const payload = getPayload(contentType);
  const queryParams = extractParams(parameters) ;
  const params = [...queryParams, payload].filter(n => n).join(', ');
  const responseType = extractResponse(responses);
  const responseStatus = extractStatus(responses);
  if (responseType) {
    types.push(responseType);
  }
-%>
export const <%= changeCase.camelCase(operationId)%> = (<%- params%>): Promise<%-`<${responseType || 'boolean'}>`%> =>
  ApiConnector.getInstance()
    .<%= verb%><%-responseType ? `<${responseType}>`: ''%>(<%-formatPath(key)%><%= payload ? ', payload' : queryParams.length > 0 ? `, { params: { ${queryParams.map((q) => q.split(':')[0]).join(', ')}} }`: ''%>)
<% if (responseType) { -%>
    .then((response) => response.data)
<%} else { -%>
    .then((response) => response.status === <%=responseStatus%>)
<%} -%>
<% });%>
<% }); %>
import { ApiConnector } from 'services/api';
import {
<% [...new Set(types)].forEach(function(type) { -%>
  <%=type%>,
<%})-%>
} from './<%=changeCase.camelCase(info.title.replace('minds',''))%>.types';
