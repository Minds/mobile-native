import api, { ApiResponse } from './../common/services/api.service';
import { abort, isNetworkFail } from '../common/helpers/abortableFetch';
import logService from '../common/services/log.service';
import { FilterType } from './NotificationsStore';

interface NotificationsServiceResponse extends ApiResponse {
  [key: string]: any;
}

export default class NotificationsService {
  async getFeed(offset: string, filter: FilterType) {
    // abort previous call
    abort(this);

    try {
      const data = await (<Promise<NotificationsServiceResponse>>(
        api.get(
          'api/v1/notifications/' + filter,
          { offset: offset, limit: 15 },
          this,
        )
      ));
      return {
        entities: data.notifications,
        offset: data['load-next'],
      };
    } catch (err) {
      // ignore aborts
      if (err.code === 'Abort') {
        return;
      }
      if (!isNetworkFail(err)) {
        logService.exception('[NotificationsService]', err);
      }
      throw err;
    }
  }
}

export function getCount(): Promise<NotificationsServiceResponse> {
  return api.get('api/v1/notifications/count');
}

export function getSingle(guid: string): Promise<NotificationsServiceResponse> {
  return api.get(`api/v1/notifications/single/${guid}`);
}

export function getSettings(): Promise<NotificationsServiceResponse> {
  return api.get('api/v1/notifications/settings');
}

export function setSetting(id, toggle): Promise<NotificationsServiceResponse> {
  return api.post('api/v1/notifications/settings', { id, toggle });
}
