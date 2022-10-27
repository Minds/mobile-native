---
to: "<%= `${absPath}/index.tsx` %>"
---
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PathConfig } from '@react-navigation/native';
import { ErrorGlobalWrapper } from 'components';
// prettier-ignore
import {
  <%= CamelName%>Screen,
} from './screens'; // end-of-screen-list HYGEN

const { Navigator, Screen } = createStackNavigator();
export function <%= CamelName%>Navigator(): JSX.Element {
  return (
    <ErrorGlobalWrapper>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="<%= CamelName%>" component={<%= CamelName%>Screen} />
        {/* end-of-navigator HYGEN */}
      </Navigator>
    </ErrorGlobalWrapper>
  );
}

export const <%= CamelName%>: PathConfig<Record<string, unknown>> = {
  initialRouteName: '<%= CamelName%>',
  screens: {
    <%= CamelName%>: '<%= dashName%>/:id?',
  }, // end-of-navigation-links HYGEN
};

export { <%= widget ? `${CamelName}Widget, ` : ''%>Hub<%= CamelName%>Widget } from './widgets';
