//@ts-nocheck
import {
  CommonActions,
  StackActions,
  SwitchActions,
} from '@react-navigation/native';

let _navigator = null;

function getStateFrom(nav) {
  if (nav.routes && nav.routes[nav.index].state) {
    return getStateFrom(nav.routes[nav.index].state);
  }
  return nav.routes[nav.index];
}

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function getCurrentState() {
  const root = _navigator.getRootState();
  return getStateFrom(root);
}

function navigate(...args) {
  _navigator.navigate(...args);
}

function push(...args) {
  _navigator.dispatch(StackActions.push(...args));
}

function goBack() {
  _navigator.dispatch(CommonActions.goBack());
}

function jumpTo(route) {
  _navigator.dispatch(SwitchActions.jumpTo({ route }));
}

function reset(routeName, params) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [CommonActions.navigate({ routeName: routeName })],
  });
  _navigator.dispatch(resetAction);
}

function addListener(name, fn) {
  return _navigator.addListener(name, fn);
}

// add other navigation functions that you need and export them

export default {
  navigate,
  jumpTo,
  reset,
  getCurrentState,
  push,
  setTopLevelNavigator,
  goBack,
  addListener,
};
