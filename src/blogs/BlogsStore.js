import { observable, action } from 'mobx'

import blogService from './BlogsService';
import BlogModel from './BlogModel';

/**
 * Blogs store
 */
class BlogsStore {

  @observable.shallow entities = [];

  @observable refreshing = false
  @observable filter     = 'trending';
  @observable loaded     = false;

  offset = '';

  async loadList() {
    try {
      const response = await blogService.loadList(this.filter, this.offset)
      this.setEntities(response);
    } catch (err) {
      console.error('error', err);
    }
  }

  @action
  setEntities(response) {
    this.loaded = true;
    if (response.blogs) {
      if (this.offset) {
        response.blogs.shift();
      }
      response.blogs = BlogModel.createMany(response.blogs);
      response.blogs.forEach(element => {
        this.entities.push(element);
      });
    }
    this.offset = response.offset || '';
  }

  @action
  clearFeed() {
    this.entities = [];
    this.offset = '';
    this.loaded = false;
  }

  @action
  refresh(guid) {
    this.loaded = false;
    this.refreshing = true;
    this.entities = [];
    this.offset = ''
    this.loadFeed(guid)
      .finally(action(() => {
        this.refreshing = false;
      }));
  }

  @action
  setFilter(filter) {
    this.filter = filter;
  }

  @action
  reset() {
    this.entities = [];
    this.refreshing = false
    this.filter = 'trending';
    this.loaded = false;
    this.offset = '';
  }

}

export default new BlogsStore();