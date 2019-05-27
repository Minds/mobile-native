import api from './../common/services/api.service';
import { abort } from '../common/helpers/abortableFetch';
import logService from '../common/services/log.service';

export default class NotificationsService {

  async getFeed(offset, filter) {

    // abort previous call
    abort(this);

    try {
      const data = await api.get('api/v1/notifications/' + filter, { offset: offset, limit: 15 }, this);
      return {
        entities: data.notifications,
        offset: data['load-next'],
      }
    } catch(err) {
      // ignore aborts
      if (err.code === 'Abort') return;
      if (!(typeof err === 'TypeError' && err.message === 'Network request failed')) {
        logService.exception('[NotificationsService]', err);
      }
      throw "Ooops";
    }
  }

}

export function getCount() {
  return api.get('api/v1/notifications/count');
}

export function getSettings() {
  return api.get('api/v1/notifications/settings');
}

export function setSetting(id, toggle) {
  return api.post('api/v1/notifications/settings', { id, toggle });
}