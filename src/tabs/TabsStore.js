import { observable, action, reaction } from 'mobx'

/**
 * Tabs store
 */
class TabsStore {
  @observable.ref tabstate = {};
  @observable currentTab = 'Newsfeed';

  /**
   * Set state
   * @param {state} state
   */
  @action
  setState(state) {
    this.tabstate = state;
    this.currentTab = state.scene.route.key;
  }

  /**
   * Run on state change
   * (runs every time the user tap a tab button, even if it is the current tab)
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onState(fn) {
    return reaction(
      () => this.tabstate,
      state => fn(state),
      { fireImmediately: true}
    );
  }

  /**
   * Run on tab change
   * @return dispose (remember to dispose!)
   * @param {function} fn
   */
  onTab(fn) {
    return reaction(
      () => this.currentTab,
      tab => fn(tab),
      { fireImmediately: true }
    );
  }
}

export default new TabsStore();
