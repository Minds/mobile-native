import React, { ReactNode, useState } from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { PathConfig } from '@react-navigation/native';
import { Button, Layout, Theme } from '@minds/ui';
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
      <ThemeWrapper>
        <Navigator screenOptions={{ headerShown: false }}>
          <Screen name="Buttons" component={ButtonsScreen} />
          <Screen name="Storybook" component={StorybookScreen} />
          {/* end-of-navigator HYGEN */}
        </Navigator>
      </ThemeWrapper>
    </ErrorGlobalWrapper>
  );
}

export const Storybook: PathConfig<Record<string, unknown>> = {
  initialRouteName: 'Storybook',
  screens: {
    Storybook: 'storybook/:id?',
  }, // end-of-navigation-links HYGEN
};

type ThemeWrapperProps = { children?: ReactNode };
function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <Theme name={theme}>
      <Layout>
        <Button
          circular
          mt="$7"
          mb="$2"
          mx="$3"
          onPress={() =>
            setTheme(oldTheme => (oldTheme === 'dark' ? 'light' : 'dark'))
          }>
          {theme === 'dark' ? 'L' : 'D'}
        </Button>
        {children}
      </Layout>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
    </Theme>
  );
}

export { HubStorybookWidget } from './widgets';

export default StorybookNavigator;
