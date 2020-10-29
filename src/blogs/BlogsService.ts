import api from './../common/services/api.service';
import type { ApiResponse } from './../common/services/api.service';
import { getStores } from '../../AppStores';

interface BlogApiResponse extends ApiResponse {
  blog: any;
}

interface BlogListApiResponse extends ApiResponse {
  entities: Array<any>;
  offset: string;
}

/**
 * Blogs Service
 */
class BlogsService {
  /**
   * Load Blogs
   */
  async loadList(filter, offset) {
    let endpoint =
      filter === 'suggested'
        ? 'api/v2/entities/suggested/blogs' +
          (getStores().hashtag.all ? '/all' : '')
        : 'api/v1/blog/' + filter;

    const data = await api.get<BlogListApiResponse>(endpoint, {
      limit: 12,
      offset: offset,
    });
    return {
      entities: data.entities || [],
      offset: data['load-next'] || '',
    };
  }

  /**
   * Load a blog entity
   * @param {string} guid
   */
  loadEntity(guid) {
    return api.get<BlogApiResponse>('api/v1/blog/' + guid);
  }
}

export default new BlogsService();
