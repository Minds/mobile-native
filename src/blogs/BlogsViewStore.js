import {
  observable,
  action,
  inject
} from 'mobx'
import blogService from './BlogsService';
import BlogModel from './BlogModel';

/**
 * Blogs View Store
 */
class BlogsViewStore {

  @observable blog = null;

  /**
   * Load blog
   * @param {string} guid
   */
  @action
  loadBlog(guid) {
    return blogService.loadEntity(guid)
      .then(result => {
        this.setBlog(result.blog);
      });
  }

  /**
   * Reset the store
   */
  @action
  reset() {
    this.blog = null;
  }

  /**
   * Set blog
   * @param {object} blog
   */
  @action
  setBlog(blog) {
    this.blog = BlogModel.checkOrCreate(blog);
  }
}

export default BlogsViewStore;