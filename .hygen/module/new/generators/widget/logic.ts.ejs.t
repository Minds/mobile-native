---
to: "<%= `${absPath}/.hygen/widget/new/logic.ts.ejs.t` %>"
---
---
to: "widgets/<%%=camelName%>.logic.ts"
---
import { useQueryApi } from 'services/hooks'
import { get<%= PluralName%> } from '../api'
import { subscription } from 'modules/main'

export type <%%= CamelName%> = {
  title: string
  subtitle: string
}

export function use<%%= PluralName%>(): <%%= CamelName%>[] {
  const [partyKey] = subscription.partyKey()

  const { data } = useQueryApi(
    ['get<%= PluralName%>', partyKey],
    () => get<%= PluralName%>(partyKey),
    { suspense: true, refreshOnFocus: true },
  )
  return data as <%%= CamelName%>[]
}
