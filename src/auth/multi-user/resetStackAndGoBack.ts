import { CommonActions } from '@react-navigation/native';
import serviceProvider from '~/services/serviceProvider';

/**
 * set the App route as the root of the stack and the current screen as the second and active screen
 * goBack after 500ms (enough time for App component
 * to render and the navigation to be registered).
 *
 * We do this because
 * 1. after login, the root stack changes and our previous
 *    screen may not exist
 * 2. to keep the bottomsheet close transition
 */
export const resetStackAndGoBack = () => {
  setTimeout(() => {
    serviceProvider.navigation.goBack();
  }, 300);

  serviceProvider.navigation.dispatch(state => {
    return CommonActions.reset({
      routes: [{ name: 'App' }, state.routes[state.routes.length - 1]],
      index: 1,
    });
  });
};
