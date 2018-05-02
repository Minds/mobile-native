import api from '../../services/api.service';

class UserTypeaheadService {
  async search(query, limit=8) {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      let result = await api.get('api/v2/search/suggest/user', {
        q: query,
        limit,
        hydrate: 1
      });

      if (!result) {
        return [];
      }

      return result.entities || [];
    } catch (e) {
      console.error('UserTypeaheadService', e);
      return [];
    }
  }
}

export default new UserTypeaheadService();
