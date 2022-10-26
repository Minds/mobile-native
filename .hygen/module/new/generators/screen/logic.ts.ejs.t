---
to: "<%= `${absPath}/.hygen/screen/new/logic.ts.ejs.t` %>"
---
---
to: "<%%=api ? `${relPath}/${camelName}.logic.ts` : null %>"
---
import React, { useEffect, useRef, useState } from 'react';
import { WrapperHandle } from 'components/.';
import { get<%%=PluralName%> } from '../../api';

type <%%=CamelName%> = { name: string };
type <%%=PluralName%> = <%%=CamelName%>[] | undefined;

type <%%=PluralName%>Hook = {
  <%%=pluralName%>: <%%=PluralName%>
  wrapperHandle: React.RefObject<WrapperHandle>
};

export function use<%%= PluralName%>(): <%%=PluralName%>Hook {
  const [<%%=pluralName%>, set<%%=PluralName%>] = useState<<%%=PluralName%>>();
  const wrapperHandle = useRef<WrapperHandle>(null);

  useEffect(() => {
    const retrieve<%%= PluralName%> = async () => {
      wrapperHandle?.current?.loadingStart();
      // your code here, ex:
      const data = (await get<%%= PluralName%>('')) as <%%=PluralName%>;
      set<%%= PluralName%>(data);
      wrapperHandle?.current?.loadingStop();
    };
    retrieve<%%= PluralName%>();
  }, []);
  return { <%%=pluralName%>, wrapperHandle };
}
