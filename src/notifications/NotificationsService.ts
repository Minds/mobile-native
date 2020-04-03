//@ts-nocheck
import api from './../common/services/api.service';
import { abort, isNetworkFail } from '../common/helpers/abortableFetch';
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
      if (!(isNetworkFail(err))) {
        logService.exception('[NotificationsService]', err);
      }
      throw err;
    }
  }
}

export function getCount() {
  return api.get('api/v1/notifications/count');
}

export function getSingle(guid) {
  return api.get(`api/v1/notifications/single/${guid}`);
}

export function getSettings() {
  return api.get('api/v1/notifications/settings');
}

export function setSetting(id, toggle) {
  return api.post('api/v1/notifications/settings', { id, toggle });
}