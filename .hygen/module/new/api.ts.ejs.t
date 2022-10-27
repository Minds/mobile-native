---
to: "<%=api ? `${absPath}/api/index.ts` : null %>"
---
import api, { ApiResponse } from 'services/api';

export type <%= CamelName%> = {
  title: string;
  subtitle: string;
};

export const get<%= PluralName%> = (param: string) =>
  api.get<ApiResponse & <%= CamelName%>[]>(`/v1/<%= pluralName%>/${param}`);

export const create<%=CamelName%> = (params: <%= CamelName%>) =>
  api.post<ApiResponse & <%= CamelName%>>('/v1/<%= pluralName%>', { ...params });

// end-of-api-methods - HYGEN
