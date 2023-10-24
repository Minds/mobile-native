//@ts-nocheck
import { observable, action } from 'mobx';

import blogService from './BlogsService';
import BlogModel from './BlogModel';
import OffsetListStore from '../common/stores/OffsetListStore';
import logService from '../common/services/log.service';
import { isNetworkError } from '~/common/services/ApiErrors';

/**
 * Blogs store
 */
class BlogsStore {
  list = new OffsetListStore();
  @observable loading = false;
  @observable filter = 'network';

  /**
   * Load list
   */
  async loadList() {
    this.setLoading(true);
    this.list.setErrorLoading(false);

    try {
      const response = await blogService.loadList(
        this.filter,
        this.list.offset,
      );

      if (response.entities) {
        if (this.list.offset) {
          response.entities.shift();
        }
        response.entities = BlogModel.createMany(response.entities);
        this.list.setList(response);
      }

      return response;
    } catch (err) {
      if (!isNetworkError(err)) {
        logService.exception('[BlogStore] loadList', err);
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

export default BlogsStore;
