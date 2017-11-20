import { observable, action } from 'mobx'

import { getFeed, getCount } from './NotificationsService';

class NotificationsStore {
  @observable entities   = []
  @observable offset     = ''
  @observable loading    = false;
  @observable refreshing = false;
  @observable unread = 0;

  moreData     = true;
  poolInterval = null;

  constructor() {
    // load count on start
    this.loadCount();
    // start polling for count every 10 seconds
    this.startPoolCount();

    // fix to clear the interval when are developing with hot reload (timers not was cleared automaticaly)
    if (module.hot) {
      module.hot.accept(() => {
        if (this.poolInterval)
          clearInterval(this.poolInterval);
      });
    }
  }

  loadFeed() {
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

  loadCount() {
    getCount().then(data => {
      this.setUnread(data.count);
    });
  }

  startPoolCount() {
    this.poolInterval = setInterval(() => {
       this.loadCount();
    }, 10000);
  }

  @action
  setUnread(count) {
    this.unread = count;
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