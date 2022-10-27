---
to: "<%=widget ? `${absPath}/widgets/${camelName}.logic.ts` : null %>"
---
import { useQueryApi } from 'services/hooks';
import { get<%= PluralName%> } from '../api/';

export function use<%= PluralName%>() {
  const param = 'key';
  const { data } = useQueryApi(
    ['<%= pluralName%>', param],
    () => get<%= PluralName%>(param),
    { suspense: true, refreshOnFocus: true },
  );
  return data;
}
