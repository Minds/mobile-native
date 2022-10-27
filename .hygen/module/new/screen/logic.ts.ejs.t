---
to: "<%=api ? `${absPath}/screens/${dashName}/${camelName}.logic.ts` : null %>"
---
import React, { useEffect, useRef, useState } from 'react';
import { LoadingWrapper } from 'components/.';
import { get<%=PluralName%>, <%=CamelName%> } from '../../api';

type <%=PluralName%>Hook = {
  <%=pluralName%>?: <%=CamelName%>[];
  loadingRef: React.RefObject<LoadingWrapper>;
};

export function use<%= PluralName%>(): <%=PluralName%>Hook {
  const [<%=pluralName%>, set<%=PluralName%>] = useState<<%=CamelName%>[]>();
  const loadingRef = useRef<LoadingWrapper>(null);

  useEffect(() => {
    const retrieve<%= PluralName%> = async () => {
      loadingRef?.current?.loadingStart();
      // your code here, ex:
      const data = await get<%= PluralName%>('');
      set<%= PluralName%>(data);
      loadingRef?.current?.loadingStop();
    };
    retrieve<%= PluralName%>();
  }, []);
  return { <%=pluralName%>, loadingRef };
}
