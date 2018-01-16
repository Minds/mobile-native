import api from './api.service';

class MindsService {
  settings;

  async getSettings() {
    if (!this.settings) {
      let settings = await api.get('api/v1/minds/settings');

      if (settings) {
        this.settings = settings;
      }
    }

    return this.settings;
  }
}

export default new MindsService();
