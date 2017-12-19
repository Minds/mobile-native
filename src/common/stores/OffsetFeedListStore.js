import { observable, action } from 'mobx';

import OffsetListStore from './OffsetListStore';
/**
 * Common infinite scroll list
 */
export default class OffsetFeedListStore extends OffsetListStore {

  /*Activity Methods */

  @action
  toggleCommentsAction(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity =  this.entities[index];
      let value = !entity.comments_disabled;
      return toggleComments(guid, value)
        .then(action(response => {
          this.entities[index] = response.entity;
        }))
        .catch(action(err => {
          entity.comments_disabled = !value;
          this.entities[index] = entity;
          console.log('error');
        }));
    }
  }

  @action
  newsfeedToggleExplicit(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      let value = !entity.mature;
      return toggleExplicit(guid, value)
        .then(action(response => {
          entity.mature = !value;
          this.entities[index] = entity;
        }))
        .catch(action(err => {
          entity.mature = !value;
          this.entities[index] = entity;
          console.log('error');
        }));
    }
  }

  @action
  newsfeedToggleMute(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      let value = !entity['is:muted'];
      return toggleMuteNotifications(guid, value)
        .then(action(response => {
          entity['is:muted'] = value;
          this.entities[index] = entity;
        }))
        .catch(action(err => {
          entity['is:muted'] = !value;
          this.entities[index] = entity;
          console.log('error');
        }));
    }
  }

  @action
  newsfeedToggleSubscription(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      let value = !entity.ownerObj.subscribed;
      return channelService.toggleSubscription(entity.ownerObj.guid, value)
        .then(action(response => {
          entity.ownerObj.subscribed = value;
          this.entities[index] = entity;
        }))
        .catch(action(err => {
          entity.ownerObj.subscribed = !value;
          this.entities[index] = entity;
          console.log('error');
        }));
    }
  }

}