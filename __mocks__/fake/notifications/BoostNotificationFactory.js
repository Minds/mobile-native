/**
 *
 * @param {string} notification_view notifiction type
 * @param {*} entityType
 * @param {*} impressions
 * @param {*} title
 */
export default function(notification_view, entityType='activity', impressions=100, title='some title') {
  return {
    notification_view,
    params: {
      impressions,
      bid:100,
      points:
      impressions,
      channel: 'someChannel',
      message: 'some message',
      group: {
        name: 'someGroup'
      },
      to_username: 'toUser',
      from_username: 'fromUser',
      amount: 1000
    },
    entityObj: {
      type: entityType,
      title,
      name: title,
      ownerObj: {
        name:'some owner'
      }
    },
    fromObj: {
      username: 'someUser',
      name: 'someUser'
    },
    from: {
      username: 'someUser',
      name: 'someUser'
    }
  }
}