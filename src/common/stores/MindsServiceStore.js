import mindsService from "../services/minds.service";


export default class MindsServiceStore {
  promise;

  async getSettings() {
    if (!this.promise) {
      this.promise = mindsService.getSettings();
    }
    return this.promise;
  }

  clear() {
    this.promise = null;
  }
}
