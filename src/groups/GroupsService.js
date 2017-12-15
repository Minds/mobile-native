import api from './../common/services/api.service';


/**
 * Groups Service
 */
class GroupsService {

  /**
   * Load Categories
   */
  loadList(filter, offset) {
    const rcategories = [];
    return api.get('api/v1/groups/' + filter, { limit: 12, offset: offset })
      .then((data) => {
        return {
          groups: data.groups || [],
          offset: data['load-next'] || '',
        };
      });
  }

  loadEntity(guid) {
    return api.get('api/v1/groups/group/'+ guid)
      .then((response) => {
        console.log(response, guid)
        return response.group;
      });
  }
}

export default new GroupsService();