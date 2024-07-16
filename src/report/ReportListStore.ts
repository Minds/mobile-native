import { observable, action } from 'mobx';

export default class ReportListStore {
  /**
   * list is refreshing
   */
  @observable refreshing = false;

  /**
   * list loaded
   */
  @observable loaded = false;

  /**
   * list load error
   */
  @observable errorLoading = false;

  /**
   * list next offset
   * if loaded == true and offset == '' there is no more data
   */
  @observable offset = '';

  /**
   * Fetched data
   */
  appeals: Array<any> = [];

  /**
   * Set or add to the list
   * @param {Object} list
   * @param {boolean} replace
   */
  @action
  setList(list, replace = false) {
    if (list.appeals) {
      if (replace) {
        list.appeals.forEach(appeal => {
          appeal._list = this;
        });
        this.appeals = list.appeals;
      } else {
        list.appeals.forEach(appeal => {
          appeal._list = this;
          this.appeals.push(appeal);
        });
      }
    }

    this.loaded = true;
    this.offset = list.offset;
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
  }

  @action
  prepend(appeal) {
    appeal._list = this;
    this.appeals.unshift(appeal);
  }

  @action
  removeIndex(index) {
    this.appeals.splice(index, 1);
  }

  remove(appeal) {
    const index = this.appeals.findIndex(e => e === appeal);
    if (index < 0) return;
    this.removeIndex(index);
  }

  getIndex(appeal) {
    return this.appeals.findIndex(e => e === appeal);
  }

  @action
  async clearList(updateLoaded = true) {
    this.appeals = [];
    this.offset = '';
    this.errorLoading = false;
    if (updateLoaded) {
      this.loaded = false;
    }
    return true;
  }

  @action
  async refresh(keepAppeals = false) {
    this.refreshing = true;
    this.errorLoading = false;
    if (!keepAppeals) this.appeals = [];
    this.offset = '';
    this.loaded = false;
    return true;
  }

  @action
  refreshDone() {
    this.refreshing = false;
  }

  @action
  cantLoadMore() {
    return this.loaded && !this.offset && !this.refreshing;
  }
}
