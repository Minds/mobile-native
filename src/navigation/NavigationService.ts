//@ts-nocheck
import {
  CommonActions,
  StackActions,
  SwitchActions,
} from '@react-navigation/native';
import analyticsService from '~/common/services/analytics.service';

let _navigator = null;

export function getTopLevelNavigator() {
  return _navigator;
}

function getStateFrom(nav) {
  if (nav.routes && nav.routes[nav.index].state) {
    return getStateFrom(nav.routes[nav.index].state);
  }
  return nav.routes[nav.index];
}

export function setTopLevelNavigator(navigatorRef) {
  //TODO: remove after we check the push notification issue
  console.log(
    'SETTING TOP LEVEL NAVIGATION ' + (navigatorRef ? 'WITH VALUE' : 'NULL'),
  );
  _navigator = navigatorRef;
}

function getCurrentState() {
  const root = _navigator.getRootState();
  return getStateFrom(root);
}

function navigate(...args) {
  _navigator.navigate(...args);
}

function setParams(params) {
  _navigator.dispatch(CommonActions.setParams(params));
}

function dispatch(...args) {
  _navigator.dispatch(...args);
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

function addListener(name, fn) {
  return _navigator?.addListener(name, fn);
}

/**
 * Runs every time the navigation state changes
 */
function onStateChange() {
  if (!_navigator) {
    return;
  }
  const currentRouteName = _navigator.getCurrentRoute()?.name;

  // record analytics event for screen view
  analyticsService.onNavigatorStateChange(currentRouteName);
}

export default {
  dispatch,
  navigate,
  jumpTo,
  getCurrentState,
  push,
  setTopLevelNavigator,
  goBack,
  addListener,
  onStateChange,
  setParams,
};
