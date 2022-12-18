import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PathConfig } from '@react-navigation/native';
import { ErrorGlobalWrapper } from 'components';
// prettier-ignore
import {
  StorybookScreen,
  ButtonsScreen,
} from './screens'; // end-of-screen-list HYGEN

const { Navigator, Screen } = createStackNavigator();
export function StorybookNavigator(): JSX.Element {
  return (
    <ErrorGlobalWrapper>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="Buttons" component={ButtonsScreen} />
        <Screen name="Storybook" component={StorybookScreen} />
        {/* end-of-navigator HYGEN */}
      </Navigator>
    </ErrorGlobalWrapper>
  );
}

export const Storybook: PathConfig<Record<string, unknown>> = {
  initialRouteName: 'Storybook',
  screens: {
    Storybook: 'storybook/:id?',
  }, // end-of-navigation-links HYGEN
};

export { HubStorybookWidget } from './widgets';

export default StorybookNavigator;
