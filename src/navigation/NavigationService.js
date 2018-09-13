import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function getState() {
  console.log(_navigator.state.nav);
  return _navigator.state.nav;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function reset(routeName, params) {
  const resetAction = StackActions.reset({
    index: 0,
      actions: [
          NavigationActions.navigate({ routeName: routeName })
      ]
    })
  _navigator.dispatch(resetAction);
}

// add other navigation functions that you need and export them

export default {
  navigate,
  getState,
  reset,
  setTopLevelNavigator,
};