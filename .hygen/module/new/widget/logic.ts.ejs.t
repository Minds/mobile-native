---
to: "<%=widget ? `${absPath}/widgets/${camelName}.logic.ts` : null %>"
---
import { useQueryApi } from 'services/hooks';
import { get<%= PluralName%> } from '../api/';
import { subscription } from 'modules/main';

export type <%= SingularName%> = {
  title: string
  subtitle: string
};

export function use<%= PluralName%>(): <%= SingularName%>[] {
  const [partyKey] = subscription.partyKey();

  const { data } = useQueryApi(
    ['get<%= PluralName%>', partyKey],
    () => get<%= PluralName%>(partyKey),
    { suspense: true, refreshOnFocus: true },
  );
  return data as <%= SingularName%>[];
}
