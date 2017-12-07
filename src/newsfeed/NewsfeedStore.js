import { observable, action } from 'mobx'

import { getFeed } from './NewsfeedService';

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
  updateThumbCounter(guid, attr, increase) {
    let user_guids = attr + ':user_guids';
    let counter = attr + ':count';
    alert(guid + attr + increase.toString())
    for (var i=0; i < this.entities.length; i++) {
      if (this.entities[i].guid === guid) {
        if(increase){
          this.entities[i][counter]++;
          this.entities[i][user_guids] = [guid];
        }else{
          this.entities[i][counter]--;
          delete this.entities[i][user_guids][guid];
        }
      }
    }
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
}

export default new NewsfeedStore();