//@ts-nocheck
import {
  CommonActions,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

// import analyticsService from '~/common/services/analytics.service';

export class NavigationService {
  navigationRef = createNavigationContainerRef();

  getTopLevelNavigator() {
    return this.navigationRef;
  }

  getStateFrom(nav) {
    if (nav.routes && nav.routes[nav.index].state) {
      return this.getStateFrom(nav.routes[nav.index].state);
    }
    return nav.routes[nav.index];
  }

  getCurrentState() {
    const root = this.navigationRef.getRootState();
    return this.getStateFrom(root);
  }

  navigate(...args) {
    if (this.navigationRef.isReady()) {
      this.navigationRef.navigate(...args);
    } else {
      throw new Error('[NavigationService] Navigation is not ready');
    }
  }

  setParams(params) {
    this.navigationRef.dispatch(CommonActions.setParams(params));
  }

  dispatch(...args) {
    if (this.navigationRef.isReady()) {
      this.navigationRef.dispatch(...args);
    } else {
      throw new Error('[NavigationService] Navigation is not ready');
    }
  }

  push(...args) {
    if (this.navigationRef.isReady()) {
      this.navigationRef.dispatch(StackActions.push(...args));
    } else {
      throw new Error('[NavigationService] Navigation is not ready');
    }
  }

  goBack() {
    this.navigationRef.dispatch(CommonActions.goBack());
  }

  addListener(name, fn) {
    return this.navigationRef?.addListener(name, fn);
  }

  onStateChange() {
    // if (!this.navigationRef) {
    //   return;
    // }
    // const currentRoute = this.navigationRef.getCurrentRoute();
    // const currentRouteName = currentRoute?.name;
    // const currentRouteParams = currentRoute?.params;
    // record analytics event for screen view
    // analyticsService.onNavigatorStateChange(currentRouteName, currentRouteParams);
  }
}
