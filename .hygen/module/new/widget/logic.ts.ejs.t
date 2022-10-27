---
to: "<%=widget ? `${absPath}/widgets/${camelName}.logic.ts` : null %>"
---
import { useQueryApi } from 'services/hooks';
import { get<%= PluralName%> } from '../api/';

export type <%= SingularName%> = {
  title: string;
  subtitle: string;
};

export function use<%= PluralName%>(): <%= SingularName%>[] {
  const param = 'key';
  const { data } = useQueryApi(
    ['get<%= PluralName%>', param],
    () => get<%= PluralName%>(param),
    { suspense: true, refreshOnFocus: true },
  );
  return data as <%= SingularName%>[];
}
