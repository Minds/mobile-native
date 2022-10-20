---
to: "<%= `${absPath}/index.tsx` %>"
---
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { PathConfig } from '@react-navigation/native'
// prettier-ignore
import {
  <%= CamelName%>Screen,
} from './screens' // end-of-screen-list HYGEN

import { ErrorGlobalWrapper } from 'components/.'
import i18n from 'modules/locales'
import en from './locales/en'

const nameSpace = '<%= camelName%>Module'
i18n.addResourceBundle('en', nameSpace, en)

const { Navigator, Screen } = createStackNavigator()
export function <%= CamelName%>Navigator(): JSX.Element {
  return (
    <ErrorGlobalWrapper>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name='<%= CamelName%>' component={<%= CamelName%>Screen} />
        {/* end-of-navigator HYGEN */}
      </Navigator>
    </ErrorGlobalWrapper>
  )
}

export const <%= CamelName%>: PathConfig<Record<string, unknown>> = {
  initialRouteName: '<%= CamelName%>',
  screens: {
    <%= CamelName%>: '<%= dashName%>/:id?',
  }, // end-of-navigation-links HYGEN
}

export { <%= widget ? `${CamelName}Widget, ` : ''%>Hub<%= CamelName%>Widget } from './widgets'
