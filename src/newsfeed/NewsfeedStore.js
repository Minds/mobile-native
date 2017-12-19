import { observable, action } from 'mobx'

import { getFeed, toggleComments, toggleMuteNotifications } from './NewsfeedService';

/**
 * News feed store
 */
class NewsfeedStore {
  @observable entities   = [];
  @observable offset     = '';
  @observable refreshing = false;
  @observable loaded = false;


  /**
   * Load feed
   */
  loadFeed() {
    return getFeed(this.offset)
      .then(
        feed => {
          this.setFeed(feed);
        }
      )
      .catch(err => {
        console.log('error', err);
      });
  }

  @action
  setFeed(feed) {
    this.loaded = true;
    if (feed.entities) {
      this.entities = [... this.entities, ...feed.entities];
    }
    this.offset = feed.offset;
  }

  @action
  clearFeed() {
    this.entities = [];
    this.offset   = '';
    this.loaded   = false;
  }

  @action
  refresh() {
    this.refreshing = true;
    this.entities   = [];
    this.offset     = '';
    this.loaded     = false;
    this.loadFeed()
      .finally(action(() => {
        this.refreshing = false;
      }));
  }

  /*Activity Methods */
  @action
  toggleCommentsAction(guid) {
    let index = this.entities.findIndex(x => x.guid == guid);
    alert(index)
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
    alert(index)
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

}

export default new NewsfeedStore();