//@ts-nocheck
import { observable, action } from 'mobx';

import ReportListStore from './ReportListStore';
import reportService from './ReportService';
import logService from '../common/services/log.service';
import { isNetworkError } from '~/common/services/ApiErrors';

export default class ReportStore {
  @observable filter = 'review';

  list = new ReportListStore();
  @observable loading = false;

  /**
   * Load list
   */
  async loadList() {
    this.setLoading(true);
    this.list.setErrorLoading(false);

    try {
      const response = await reportService.get(this.filter, this.list.offset);

      if (response.appeals) {
        if (this.list.offset) {
          response.appeals.shift();
        }
        this.list.setList(response);
      }

      return response;
    } catch (err) {
      if (!isNetworkError(err)) {
        logService.exception('[ReportStore] loadList', err);
      }
      this.list.setErrorLoading(true);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Reload list
   */
  async reload() {
    this.list.clearList();
    this.loadList();
  }

  @action
  async refresh() {
    await this.list.refresh();
    await this.loadList();
    this.list.refreshDone();
  }

  /**
   * Set filter
   * @param {string} filter
   */
  @action
  setFilter(filter) {
    this.filter = filter;
  }

  /**
   * Set loading
   * @param {boolean} value
   */
  @action
  setLoading(value) {
    this.loading = value;
  }

  @action
  reset() {
    this.loading = false;
    this.list.clearList();
    this.filter = 'network';
  }
}
