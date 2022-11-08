---
to: <%= `${absPath}/screens/${dashName}/${CamelName}Screen.tsx`%>
---
import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
<% if (api) { -%>
import { use<%=PluralName%> } from './<%= camelName%>.logic';
<% } -%>
<% if (store) { -%>
import { use<%=CamelName%>Store } from '../../store';
<% } -%>

export function <%= CamelName%>Screen(): JSX.Element {
  const { t } = useTranslation('<%= camelName%>Module');
<% if (api) { -%>
  const { <%=pluralName%>, loadingRef } = use<%=PluralName%>();
<% } -%>
<% if (store) { -%>
  const [get<%=CamelName%>, set<%=CamelName%>] = use<%=CamelName%>Store();
<% } -%>

  return (
    <ScrollView <%= api ? 'ref={loadingRef}' : ''-%>>
<% if (assets) { -%>
      <<%= CamelName%> />
<% } -%>
      <Text testID={'header-<%=dashName%>-text'}>{t('Hello <%= CamelName%>')}</Text>
<% if (api) { -%>
      {/* you must modify the code below */}
      {<%=pluralName%>?.map((item, index) => (
        <Text key={`${index}`}>{`${item?.title}`}</Text>
      ))}
<% } -%>
    </ScrollView>
  );
}
