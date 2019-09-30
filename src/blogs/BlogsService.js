import api from './../common/services/api.service';
import stores from '../../AppStores';
import FeedsService from './../common/services/feeds.service';

/**
 * Blogs Service
 */
class BlogsService {

  /**
   * Load Blogs
   */
  async loadList(filter, offset) {
    let endpoint = '';
    let oldBlogsApi = 'api/v1/blog/' + filter;
    if (filter != 'network') {
      const feedsService = new FeedsService();
      feedsService.setEndpoint('api/v2/feeds/container/968187695744425997/blogs');
      await feedsService.fetchRemoteOrLocal();
      const entities = await feedsService.getEntities();
      return {
        entities: entities || [],
        offset: '',
      };
    } else {
      endpoint = (filter === 'suggested') ?
      'api/v2/entities/suggested/blogs' + (stores.hashtag.all ? '/all' : '' ) :
      oldBlogsApi;
    }
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