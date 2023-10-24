//@ts-nocheck
import {
  CommonActions,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import analyticsService from '~/common/services/analytics.service';

export const navigationRef = createNavigationContainerRef();

export function getTopLevelNavigator() {
  return navigationRef;
}

function getStateFrom(nav) {
  if (nav.routes && nav.routes[nav.index].state) {
    return getStateFrom(nav.routes[nav.index].state);
  }
  return nav.routes[nav.index];
}

function getCurrentState() {
  const root = navigationRef.getRootState();
  return getStateFrom(root);
}

function navigate(...args) {
  if (navigationRef.isReady()) {
    // Perform navigation if the react navigation is ready to handle actions
    navigationRef.navigate(...args);
  } else {
    throw new Error('[NavigationService] Navigation is not ready');
  }
}

function setParams(params) {
  navigationRef.dispatch(CommonActions.setParams(params));
}

function dispatch(...args) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(...args);
  } else {
    throw new Error('[NavigationService] Navigation is not ready');
  }
}

function push(...args) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(...args));
  } else {
    throw new Error('[NavigationService] Navigation is not ready');
  }
}

function goBack() {
  navigationRef.dispatch(CommonActions.goBack());
}

function addListener(name, fn) {
  return navigationRef?.addListener(name, fn);
}

/**
 * Runs every time the navigation state changes
 */
function onStateChange() {
  if (!navigationRef) {
    return;
  }
  const currentRouteName = navigationRef.getCurrentRoute()?.name;

  // record analytics event for screen view
  analyticsService.onNavigatorStateChange(currentRouteName);
}

export default {
  dispatch,
  navigate,
  getCurrentState,
  push,
  goBack,
  addListener,
  onStateChange,
  setParams,
};
