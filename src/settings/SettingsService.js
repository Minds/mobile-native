import api from './../common/services/api.service';


/**
 * Settings Service
 */
class SettingsService {

  /**
   * Load Categories
   */
  loadCategories() {
    const rcategories = [];
    return api.get('api/v1/categories')
      .then((categories) => {
        for (let id in categories.categories) {
          rcategories.push({
            id: id,
            label: categories.categories[id],
            selected: false
          });
        }
        rcategories.sort((a, b) => a.label > b.label ? 1 : -1);
        return rcategories;
      });
  }
}

export default new SettingsService();