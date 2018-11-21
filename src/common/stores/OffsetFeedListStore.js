import { observable, action } from 'mobx';

import { getFeed, toggleComments, follow, unfollow , toggleExplicit, toggleFeatured, deleteItem, monetize, update} from '../../newsfeed/NewsfeedService';

import channelService from '../../channel/ChannelService';

import OffsetListStore from './OffsetListStore';
/**
 * Common infinite scroll list
 */
export default class OffsetFeedListStore extends OffsetListStore {

  /*Activity Methods */
  @observable saving = false;

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

  // @action
  // toggleFeaturedStore(guid, category) {
  //   let index = this.entities.findIndex(x => x.guid == guid);
  //   if(index >= 0) {
  //     let entity =  this.entities[index];
  //     let value = !entity.featured;
  //     return toggleFeatured(guid, value, category)
  //       .then(action(response => {
  //         entity.featured = value;
  //         this.entities[index] = entity;
  //       }))
  //       .catch(action(err => {
  //         console.log('error');
  //       }));
  //   }
  // }

  @action
  newsfeedToggleExplicit(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      let value = !entity.mature;
      return toggleExplicit(guid, value)
        .then(action(response => {
          entity.mature = value;
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
  newsfeedToogleFollow(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      const entity = this.entities[index];
      const method = entity['is:following'] ? unfollow : follow;
      return method(guid)
        .then(action(response => {
          entity['is:following'] = !entity['is:following'];
          this.entities[index] = entity;
        }))
        .catch(action(err => {
          entity['is:following'] = !entity['is:following'];
          this.entities[index] = entity;
          console.log('error', err);
        }));
    }
  }

  @action
  toggleMonetization(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      let value = !entity.monetized;
      return monetize(guid, value)
        .then(action(response => {
          entity.monetized = value;
          this.entities[index] = entity;
        }))
        .catch(action(err => {
          entity.monetized = !value;
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

  @action
  deleteEntity(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.entities[index];
      return deleteItem(guid)
        .then(action(response => {
          this.entities.splice(index, 1);
        }))
        .catch(action(err => {
          console.log('error');
        }));
    }
  }

  @action
  updateActivity(activity, message) {
    this.saving = true;
    activity.message = message;
    return update(activity)
      .finally(action(() => {
        this.saving = false;
      }))
      .then(() => {
        this.setActivityMessage(activity, message);
      });
  }

  @action
  setActivityMessage(activity, message) {
    activity.message = message;
    activity.edited  = 1;
  }
}