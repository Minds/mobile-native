/**
 * 
 * @param {string} type notifiction type
 * @param {*} entityType 
 * @param {*} impressions 
 * @param {*} title 
 */
export default function(type, entityType='activity', impressions=100, title='some title') {
  return {
    type,
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
      type,
      title,
      name: title
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