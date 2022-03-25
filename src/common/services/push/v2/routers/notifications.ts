import navigation from '../../../../../navigation/NavigationService';
import {
  error,
  parseByEntityType,
  parseComment,
  parseReward,
} from '../parsers';

class NotificationsRouter {
  notifications_routes = {
    friends: (data: any) =>
      navigation.push('Channel', { guid: data.json.entity_guid }),
    group_invite: (data: any) =>
      navigation.push('GroupView', { guid: data.json.entity_guid }),
    like: parseByEntityType,
    downvote: parseByEntityType,
    group_activity: parseByEntityType,
    feature: parseByEntityType,
    tag: parseByEntityType,
    remind: (data: any) =>
      navigation.push('App', {
        screen: 'Activity',
        params: { guid: data.json.entity_guid },
      }),
    comment: parseComment,
    rewards_reminder: parseReward,
    rewards_summary: parseReward,
  };

  navigate(data: any) {
    data.json.type in this.notifications_routes
      ? this.notifications_routes[data.json.type](data)
      : error(data, 'Unknown notification');
  }
}

export default new NotificationsRouter();
