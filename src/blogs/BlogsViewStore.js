import {
  observable,
  action
} from 'mobx';
import BlogModel from './BlogModel';
import entitiesService from '../common/services/entities.service';

/**
 * Blogs View Store
 */
class BlogsViewStore {

  @observable.ref blog = null;

  /**
   * Load blog
   * @param {string} guid
   */
  @action
  async loadBlog(guid) {
    const urn = 'urn:entity:' + guid; 
    const blog = await entitiesService.single(urn);
    // keep the _list if the entity has one
    if (this.blog) {
      this.blog.update(blog);
    } else {
      this.setBlog(blog);
    }
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