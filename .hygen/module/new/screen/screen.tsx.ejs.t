---
to: <%= `${absPath}/screens/${dashName}/${camelName}.screen.tsx`%>
---
import React from 'react'
import { View } from 'react-native'
import { ScreenWrapper, Text } from 'components/.'
import { globalStyles } from 'styles/.'
import { useTranslation } from 'modules/locales'
<% if (api) { -%>
import { use<%=PluralName%> } from './<%= camelName%>.logic'
<% } -%>
<% if (store) { -%>
import { use<%=CamelName%>Store } from '../../store'
<% } -%>
<% if (assets) { -%>
import { <%=CamelName%> } from './assets'
<% } -%>

export function <%= CamelName%>Screen(): JSX.Element {
  const { t } = useTranslation('<%= camelName%>Module')
<% if (api) { -%>
  const { <%=pluralName%>, wrapperHandle } = use<%=PluralName%>()
<% } -%>
<% if (store) { -%>
  const [get<%=CamelName%>, set<%=CamelName%>] = use<%=CamelName%>Store()
<% } -%>

  return (
    <ScreenWrapper scrollEnabled={false} hasTopNavigator<%= api ? ' ref={wrapperHandle}' : ''-%>>
<% if (assets) { -%>
      <<%= CamelName%> />
<% } -%>
      <Text testID={'header-<%=dashName%>-text'} category={'h4'}>
        {t('Hello <%= CamelName%>')}
      </Text>
      <View style={globalStyles.paddingVertical} />
<% if (api) { -%>
      {/* you must modify the code below */}
      {<%=pluralName%>?.map((item, index) => (
        <Text key={`${index}`}>{`${item?.name}`}</Text>
      ))}
<% } -%>
    </ScreenWrapper>
  )
}
