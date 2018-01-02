import api from './../common/services/api.service';


/**
 * Groups Service
 */
class GroupsService {

  /**
   * Load groups
   */
  loadList(filter, offset) {
    const rcategories = [];
    return api.get('api/v1/groups/' + filter, { limit: 12, offset: offset })
      .then((data) => {
        if (offset && data.groups) {
          data.groups.shift();
        }
        return {
          entities: data.groups || [],
          offset: data['load-next'] || '',
        };
      });
  }

  loadEntity(guid) {
    return api.get('api/v1/groups/group/'+ guid)
      .then((response) => {
        return response.group;
      });
  }
}

export default new GroupsService();