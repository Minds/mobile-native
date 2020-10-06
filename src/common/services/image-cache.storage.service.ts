import moment from 'moment';
import storageService from './storage.service';

class ImageCacheStorageService {
  async removeOlderThan(days: number) {
    const imageKeys = await storageService.getKeys('images');
    for (let key of imageKeys) {
      const savedAt = await storageService.getItem(key);

      if (moment().diff(moment(savedAt), 'days') >= days) {
        await storageService.removeItem(key);
      }
    }
  }

  checkCacheExists(uri: string) {
    return storageService.getItem(`images:${uri}`);
  }

  addCache(uri: string) {
    return storageService.setItem(`images:${uri}`, Date.now());
  }
}

export default new ImageCacheStorageService();
