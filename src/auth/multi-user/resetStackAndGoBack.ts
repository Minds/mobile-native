import { CommonActions } from '@react-navigation/native';

/**
 * set the App route as the root of the stack and
 * goBack after 500ms (enough time for App component
 * to render and the navigation to be registered).
 *
 * We do this because
 * 1. after login, the root stack changes and our previous
 *    screen may not exist
 * 2. to keep the bottomsheet close transition
 */
export const resetStackAndGoBack = navigation => {
  navigation.dispatch(state => {
    setTimeout(() => {
      navigation.goBack();
    }, 500);

    return CommonActions.reset({
      ...state,
      routes: [{ key: 'App_SOMETHING', name: 'App' }, ...state.routes],
      index: 1,
    });
  });
};
