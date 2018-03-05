import { observable, action } from 'mobx'
import blogService from './BlogsService';
import BlogModel from './BlogModel';

/**
 * Blogs View Store
 */
class BlogsViewStore {
  @observable blog = {};

  /**
   * Load blog
   * @param {string} guid
   */
  loadBlog(guid) {
    return blogService.loadEntity(guid)
      .then(result => {
        this.setBlog(BlogModel.create(result.blog));
      });
  }

  /**
   * Set blog
   * @param {object} blog
   */
  @action
  setBlog(blog) {
    this.blog = blog;
  }
}

export default new BlogsViewStore();