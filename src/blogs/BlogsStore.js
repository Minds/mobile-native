import { observable, action } from 'mobx'

import blogService from './BlogsService';
import BlogModel from './BlogModel';
import OffsetListStore from '../common/stores/OffsetListStore';

/**
 * Blogs store
 */
class BlogsStore {

  list = new OffsetListStore();

  @observable filter = 'trending';

  async loadList() {
    try {
      const response = await blogService.loadList(this.filter, this.list.offset)

      console.log(response)
      if (response.entities) {
        if (this.list.offset) {
          response.entities.shift();
        }
        response.entities = BlogModel.createMany(response.entities);
        this.list.setList(response);
      }

      return response;
    } catch (err) {
      console.error('error', err);
    }
  }

  @action
  async refresh() {
    await this.list.refresh();
    await this.loadList();
    this.list.refreshDone();
  }

  @action
  setFilter(filter) {
    this.filter = filter;
  }

  @action
  reset() {
    this.list.clearList();
    this.filter = 'trending';
  }
}

export default BlogsStore;