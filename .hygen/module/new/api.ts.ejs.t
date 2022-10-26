---
to: "<%=api ? `${absPath}/api/index.ts` : null %>"
---
import { ApiConnector, to } from 'services/api';

export async function get<%= PluralName%>(param: string): Promise<unknown> {
  const { response } = await to(
    ApiConnector.getInstance()
      .get(`/v1/<%= pluralName%>/${param}`)
      .then((result) => result?.data),
  );
  return response;
}

// end-of-api-methods - HYGEN
