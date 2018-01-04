import { observable, action, autorun } from 'mobx'

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
    return autorun(() => {
      fn(this.tabstate);
    });
  }
}

export default new TabsStore();
