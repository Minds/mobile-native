import {
  observable,
  action,
  reaction,
  computed
} from 'mobx';

/**
 * Navigation Store
 */
export default class NavigationStore {
  /**
   * Previous screen
   */
  previousScreen = '';

  /**
   * State
   */
  @observable.ref navigationState = {
    index: 0,
    routes: [
      { key: "Loading", routeName: "Loading" },
    ],
  }

  /**
   * Current screen
   */
  @computed get currentScreen() {
    return this._getRouteName(this.navigationState);
  }


  /**
   * Constructor
   * @param {Navigator} nav
   */
  constructor(nav) {
    this.navigator = nav;
  }

  /**
   * Run on screen change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onScreen(fn) {
    return reaction(
      () => this.currentScreen,
      screen => {
        fn(screen);
      },
      { fireImmediately: true }
    );
  }

  /**
   * Run on screen enter
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onEnterScreen(screen, fn) {
    return reaction(
      () => this.currentScreen,
      currentScreen => {
        if (screen == currentScreen) fn(screen);
      },
      { fireImmediately: true }
    );
  }

  /**
   * Run on screen leave
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onLeaveScreen(screen, fn) {
    return reaction(
      () => this.currentScreen,
      currentScreen => {
        if (screen == this.previousScreen) fn(screen);
      },
      { fireImmediately: true }
    );
  }

  /**
   * Dispatch
   */
  @action dispatch = (action, stackNavState = true) => {
    // set previous
    this.previousScreen = this.currentScreen;
    // stack state?
    const previousNavState = stackNavState ? this.navigationState : null;
    return this.navigationState = this.navigator
      .router
      .getStateForAction(action, previousNavState);
  }

  /**
   * Get name from state
   * @param {object} navigationState
   */
  _getRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this._getRouteName(route);
    }
    return route.routeName;
  }
}
