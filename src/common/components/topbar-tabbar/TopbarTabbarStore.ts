import { observable, action } from 'mobx';

export default class TopbarTabBarStore {
  @observable activeTabId: string | null = null;

  @action
  setActiveTabId(id: string) {
    this.activeTabId = id;
  }
}
