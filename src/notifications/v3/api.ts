import UserModel from '~/channel/UserModel';
import { fetchFeedPage, PageResponse } from '~/services';
import NotificationModel from './notification/NotificationModel';

const mapToModel = (notification: NotificationModel) => {
  notification = NotificationModel.create(notification);
  if (notification.merged_from && notification.merged_from.length > 0) {
    notification.merged_from = UserModel.createMany(notification.merged_from);
  }
  return notification;
};

/**
 * Fetch a page from the notifications feed
 * @param offset string
 * @param filter string
 */
export const fetchNotificationsPage = async (
  offset = '',
  filter = '',
): Promise<PageResponse<NotificationModel>> => {
  const params = {
    filter,
    limit: 15,
    offset,
  };

  console.log('FETCHING NOTIFICATIONS', offset);

  const data = await fetchFeedPage<NotificationModel>(
    'api/v3/notifications/list',
    'notifications',
    params,
    mapToModel,
  );

  return data;
};
