import { observable, action, reaction } from 'mobx'

/**
 * Tabs store
 */
class TabsStore {

  @observable.ref tabstate = {};

  /**
   * Set state
   * @param {state} state
   */
  @action
  setState(state) {
    this.tabstate = state;
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

  @action
  reset() {
    this.tabstate = {};
  }

}

export default new TabsStore();
