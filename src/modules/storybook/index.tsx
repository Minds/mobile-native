import React, { ReactNode, useState } from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { PathConfig } from '@react-navigation/native';
import { Button, Layout, Theme, View } from '@minds/ui';
import { ErrorGlobalWrapper } from 'components';
// prettier-ignore
import {
  StorybookScreen,
  ButtonsScreen,
} from './screens'; // end-of-screen-list HYGEN
import { storages } from '~/common/services/storage/storages.service';
import { SafeAreaView } from 'react-native-safe-area-context';

const { Navigator, Screen } = createStackNavigator();
export function StorybookNavigator(): JSX.Element {
  return (
    <ErrorGlobalWrapper>
      <ThemeWrapper>
        <Navigator screenOptions={{ headerShown: false }}>
          <Screen name="Storybook" component={StorybookScreen} />
          <Screen name="Buttons" component={ButtonsScreen} />
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
        <SafeAreaView style={safeStyle}>
          <View mt="$1" mx="$3" mb="$1" fd={'row'} jc="space-between">
            <Button
              circular
              sSize="m"
              onPress={() =>
                setTheme(oldTheme => (oldTheme === 'dark' ? 'light' : 'dark'))
              }>
              {theme === 'dark' ? 'L' : 'D'}
            </Button>
            <Button onPress={() => storages.app.setBool('storybook', false)}>
              close
            </Button>
          </View>
          {children}
        </SafeAreaView>
      </Layout>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
    </Theme>
  );
}

const safeStyle = { flex: 1 };

export { HubStorybookWidget } from './widgets';

export default StorybookNavigator;
