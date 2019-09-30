import api from './../common/services/api.service';
import stores from '../../AppStores';

/**
 * Blogs Service
 */
class BlogsService {

  /**
   * Load Blogs
   */
  async loadList(filter, offset) {

    let endpoint = (filter === 'suggested') ?
    'api/v2/entities/suggested/blogs' + (stores.hashtag.all ? '/all' : '' ) :
    'api/v1/blog/' + filter;

    const data = await api.get(endpoint, { limit: 12, offset: offset });
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
    return api.get('api/v1/blog/'+guid);
  }

}

export default new BlogsService();