---
to: "<%=api ? `${absPath}/api/index.ts` : null %>"
---
import axios from 'axios';

export type <%= CamelName%> = {
  title: string;
  subtitle: string;
};

export const get<%= PluralName%> = (param: string) =>
  axios
    .get<<%= CamelName%>[]>(`/v1/<%= pluralName%>/${param}`)
    .then(result => result?.data);

export const create<%=CamelName%> = (params: <%= CamelName%>) =>
  axios
    .post<<%= CamelName%>>('/v1/<%= pluralName%>', { ...params })
    .then(result => result?.data);

// end-of-api-methods - HYGEN
