import { NavigationActions, StackActions, SwitchActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function getState() {
  return _navigator.state.nav;
}

function getCurrentState() {
  return _navigator.state.nav.routes[_navigator.state.nav.index];
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function push(routeName, params) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params,
    })
  );
}

function goBack() {
  _navigator.dispatch(NavigationActions.back());
}

function jumpTo(route) {
  _navigator.dispatch(SwitchActions.jumpTo({ route }));
}

function reset(routeName, params) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: routeName })
    ]
  });
  _navigator.dispatch(resetAction);
}

// add other navigation functions that you need and export them

export default {
  navigate,
  getState,
  jumpTo,
  reset,
  getCurrentState,
  push,
  setTopLevelNavigator,
  goBack
};