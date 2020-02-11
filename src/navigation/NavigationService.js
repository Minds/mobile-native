import { NavigationActions, StackActions, SwitchActions } from '@react-navigation/native';

let _navigator = null;

function getStateFrom(nav) {
  let state = nav.routes[nav.index];
  if (state.routes) {
    state = getStateFrom(state);
  }
  return state;
}

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function getState() {
  return _navigator.state.nav;
}

function getCurrentState() {
  return getStateFrom(_navigator.state.nav);
}

function navigate(routeName, params) {
  _navigator.navigate(routeName, params);
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

function addListener(name, fn) {
  return _navigator.addListener(name,fn);
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
  goBack,
  addListener,
};