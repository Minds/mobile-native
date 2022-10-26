---
to: "<%=absPath%>/widgets/hub<%=CamelName%>.widget.tsx"
---
import React from 'react';

import { ListItemWithNavigation } from 'components/.';
import { useTranslation } from 'utils/locales';

export function Hub<%= CamelName%>Widget({ icon }: { icon: string }): JSX.Element {
  const { t } = useTranslation('<%= camelName%>Module');
  return (
    <ListItemWithNavigation title={t('<%= CamelName%>')} iconLeft={icon} screen={'<%= CamelName%>'} />
  );
}
