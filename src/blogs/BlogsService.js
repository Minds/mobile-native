import api from './../common/services/api.service';


/**
 * Blogs Service
 */
class BlogsService {

  /**
   * Load Blogs
   */
  async loadList(filter, offset) {
    try {
      const data = await api.get('api/v1/blog/' + filter, { limit: 12, offset: offset });
      return {
        entities: data.entities || [],
        offset: data['load-next'] || '',
      };
    } catch (err) { }
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