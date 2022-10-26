import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MainNavigator, useNavigationReset } from './navigator';
import { linking } from './linking';
import { AppLoading } from './app-loading';
import { ThemeProvider } from 'containers/theme';
import StatusBar from 'components/statusBar.component';
import { DeveloperMenu } from 'containers/developer/screens/developer/developer.screen';

/**
 * In the lack of a better place to load the container locales
 * we can keep it here.
 * Will we need translations outside the screens as well?
 */

require('./locales');

export default function MainApp(): JSX.Element {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AppLoading>
        {props => (
          <ThemeProvider {...props}>
            <StatusBar />
            <DeveloperMenu>
              <NavigationContainer linking={linking}>
                <MainNavigator />
              </NavigationContainer>
            </DeveloperMenu>
          </ThemeProvider>
        )}
      </AppLoading>
    </QueryClientProvider>
  );
}

export { useDeviceLogin } from './screens/login/login.logic';
export { useCurrentAccountDetails } from './widgets/subscriptionPicker.logic';

export { useSubscription, subscription, setSubscription } from './store';
export { useNavigationReset };
