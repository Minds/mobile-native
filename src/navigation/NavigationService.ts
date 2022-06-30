import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import analyticsService from '~/common/services/analytics.service';
import logService from '~/common/services/log.service';

function getStateFrom(nav) {
  if (nav.routes && nav.routes[nav.index].state) {
    return getStateFrom(nav.routes[nav.index].state);
  }
  return nav.routes[nav.index];
}

export const navigationRef = createNavigationContainerRef();

function getCurrentState() {
  const root = navigationRef.getRootState();
  return getStateFrom(root);
}

function navigate(...args: any) {
  return navigationRef.navigate(...args);
}

function dispatch(...args) {
  // @ts-ignore
  return navigationRef.dispatch(...args);
}

function push(...args) {
  // @ts-ignore
  return navigationRef.dispatch(StackActions.push(...args));
}

function goBack() {
  return navigationRef.dispatch(CommonActions.goBack());
}

function addListener(name, fn) {
  return navigationRef.addListener(name, fn);
}

/**
 * Runs every time the navigation state changes
 */
function onStateChange() {
  const currentRouteName = navigationRef.getCurrentRoute()?.name;

  // record analytics event for screen view
  return analyticsService.onNavigatorStateChange(currentRouteName);
}

const retry = (fn: Function, retries: number) => (...args) => {
  setTimeout(() => runIfReady(fn, retries - 1)(...args), 500);
};

/**
 * This function makes sure navigtion actions (fn) are handled gracefully by checking
 * the ready state of the navigation ref and retrying a couple of times (retries).
 * @param fn - the navigation method to run
 * @param retries - the number of times it should be retried if navigation wasn't ready
 * @returns the result of fn
 */
const runIfReady = (fn: Function, retries: number = 2) => (...args) => {
  if (!navigationRef.isReady()) {
    logService.warn(
      `[NavigationService] Attempted navigation but navigator wasn't ready. Method: ${fn.name}`,
    );
    if (retries > 0) {
      retry(fn, retries)(...args);
    }
    return null;
  }

  return fn(...args);
};

export default {
  dispatch: runIfReady(dispatch),
  navigate: runIfReady(navigate),
  getCurrentState: runIfReady(getCurrentState),
  push: runIfReady(push),
  goBack: runIfReady(goBack),
  addListener: runIfReady(addListener),
  onStateChange: runIfReady(onStateChange),
};
