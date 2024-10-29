import { observable, action } from 'mobx';
import BlogModel from './BlogModel';
import CommentsStore from '../comments/v2/CommentsStore';
import serviceProvider from '~/services/serviceProvider';
import type { BlogsService } from './BlogsService';

/**
 * Blogs View Store
 */
class BlogsViewStore {
  @observable.ref blog: BlogModel | null = null;

  comments: CommentsStore | null = null;
  service: BlogsService;

  constructor() {
    this.service = serviceProvider.resolve('blogs');
  }

  /**
   * Load blog
   * @param {string} guid
   */
  async loadBlog(guid) {
    const result = await this.service.loadEntity(guid);
    // keep the _list if the entity has one
    if (this.blog) {
      this.blog.update(result.blog);
    } else {
      await this.setBlog(result.blog);
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
  async setBlog(blog) {
    const instance = BlogModel.checkOrCreate(blog);
    this.comments = new CommentsStore(instance);

    // if the blog is paywalled we try to unlock it
    if (instance.paywall) {
      await instance.unlock();
    }
    this.blog = instance;
  }
}

export default BlogsViewStore;
