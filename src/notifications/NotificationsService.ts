import api, { ApiResponse } from './../common/services/api.service';

interface NotificationsServiceResponse extends ApiResponse {
  [key: string]: any;
}

export function getSettings(): Promise<NotificationsServiceResponse> {
  return api.get('api/v1/notifications/settings');
}

export function setSetting(id, toggle): Promise<NotificationsServiceResponse> {
  return api.post('api/v1/notifications/settings', { id, toggle });
}
