import { observable, action } from 'mobx'

import { getFeed } from './../notifications/NotificationsService';

class NotificationsStore {
  @observable entities   = []
  @observable offset     = ''
  @observable moreData   = true;
  @observable loading    = false;
  @observable refreshing = false

  loadFeed() {
    console.log('loading notifications from '+this.offset);
    if (!this.moreData || this.loading) {
      return;
    }
    this.loading = true;

    getFeed(this.offset)
      .then( feed => {
        this.setFeed(feed);
      })

      .catch(err => {
        console.log('error');
      })
  }

  @action
  setFeed(feed) {
    this.entities = [... this.entities, ...feed.entities],
    this.offset = feed.offset,
    this.moreData = feed.entities.length,
    this.loading = false,
    this.refreshing = false
  }

  @action
  refresh() {
    this.refreshing = true;

    setTimeout(() => {
      this.refreshing = false;
    }, 1000);
  }
}

export default new NotificationsStore();