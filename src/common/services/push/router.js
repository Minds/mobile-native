
import navigation from '../navigation.service'
import session from '../session.service'
import featuresService from '../features.service';

/**
 * Push Router
 */
export default class Router {

  /**
   *
   * @param {object} notification
   */
  navigate(data) {
    if (data.uri == 'chat') {
      navigation.get().navigate('Messenger');
      //TODO: need sender guid on message to go to conversation
      //navigation.get().navigate('Conversation', { conversation: { guid: data.user_guid + ':' + session.guid } });
    } else if (data.uri == 'notification') {
      if (!data.json || !data.json.entity_guid) {
        navigation.get().navigate('Notifications')
        return;
      }

      switch (data.json.type) {
        case 'friends':
          navigation.get().navigate('Channel', { guid: data.json.entity_guid });
          break;

        case 'group_invite':
          navigation.get().navigate('GroupView', { guid: data.json.entity_guid });
          break;

        case 'like': // not implemented in engine
        case 'downvote': // not implemented in engine
        case 'group_activity':
        case 'feature':
        case 'tag':
          let entity_type = data.json.entity_type.split(':');

          if (entity_type[0] === 'comment') {
            navigation.get().navigate('Activity', { guid: data.json.parent_guid });
          } else if (entity_type[0] === 'activity') {
            navigation.get().navigate('Activity', { guid: data.json.entity_guid });
          } else if (entity_type[1] === 'blog') {
            navigation.get().navigate('BlogView', { guid: data.json.entity_guid });
          } else if (entity_type[0] === 'object') {
            navigation.get().navigate('Activity', { guid: data.json.entity_guid });
          } else {
            console.error('Unknown notification:', entity_type, data);
          }

          break;

        case 'remind':
          console.log('remind')
          navigation.get().navigate('Activity', { guid: data.json.entity_guid });
          break;

        case 'comment':
          navigation.get().navigate('Activity', { guid: data.json.child_guid ? data.json.child_guid : data.json.entity_guid });
          break;
        
        case 'rewards_reminder':
        case 'rewards_summary':
          if (featuresService.has('crypto')) {
            navigation.get().navigate('Wallet', { });
          } else {
            navigation.get().navigate('Notifications', {});
          }
          break;

        default:
          navigation.get().navigate('Notifications', {});
          console.error('Unknown notification:', data);
          break;

      }
    }
  }
}
