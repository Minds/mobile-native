import { observable, action } from 'mobx';
import discoveryService from './DiscoveryService';

// TODO: all store are too similar make a common to be DRY
class DiscoveryStore {
  @observable.shallow entities = [];
  @observable refreshing = false;

  offset = '';
  
  /**
   * Load feed
   */
  loadFeed() {
    return discoveryService.getFeed(this.offset)
      .then(feed => {
        this.setFeed(feed);
      })
      .catch(err => {
        console.log('error', err);
      });
  }

  @action
  setFeed(feed) {
    if (feed.entities) {
      feed.entities.forEach(element => {
        this.entities.push(element);
      });
    }
    this.offset = feed.offset;
  }

  @action
  clearFeed() {
    this.entities = [];
    this.offset   = '';
  }

  @action
  refresh() {
    this.refreshing = true;
    this.entities   = [];
    this.offset     = ''
    this.loadFeed()
      .finally(action(() => {
        this.refreshing = false;
      }));
  }
}

export default new DiscoveryStore();
