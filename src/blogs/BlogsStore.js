import { observable, action } from 'mobx'

import blogService from './BlogsService';

/**
 * Blogs store
 */
class BlogsStore {

  @observable.shallow entities = [];

  @observable refreshing = false
  @observable filter     = 'featured';
  @observable loaded     = false;

  offset = '';

  loadList() {
    return blogService.loadList(this.filter, this.offset)
      .then(response => {
        this.setEntities(response);
      })
      .catch(err => {
        console.error('error', err);
      });
  }

  @action
  setEntities(response) {
    this.loaded = true;
    if (response.blogs) {
      if (this.offset) {
        response.blogs.shift();
      }
      response.blogs.forEach(element => {
        this.entities.push(element);
      });
    }
    this.offset = response.offset || '';

    console.log('loaded '+this.entities.slice().length);
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

}

export default new BlogsStore();