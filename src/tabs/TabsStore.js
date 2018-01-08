import { observable, action, reaction } from 'mobx'

/**
 * Tabs store
 */
class TabsStore {
  @observable.ref tabstate = {};

  @action
  setState(tab) {
    this.tabstate = tab;
  }

  /**
   * Run on state change
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
}

export default new TabsStore();
