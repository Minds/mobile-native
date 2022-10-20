---
to: "<%=store ? `${absPath}/store.ts` : null %>"
---
import createStore from 'teaful'

type <%= CamelName%>StateType = {
  value: string
}

export const {
  useStore: use<%=CamelName%>Store,
  getStore: get<%=CamelName%>Store,
  setStore: set<%=CamelName%>Store,
} = createStore<<%= CamelName%>StateType>({ value: '' })
