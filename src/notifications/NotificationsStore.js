import {
  observable,
  action
} from 'mobx'

import {
  getFeed,
  getCount
} from './NotificationsService';

class NotificationsStore {
  @observable entities   = []
  @observable offset     = ''
  @observable loading    = false;
  @observable refreshing = false;
  @observable unread = 0;

  moreData     = true;
  pollInterval = null;

  constructor() {
    // load count on start
    this.loadCount();
    // start polling for count every 10 seconds
    this.startPollCount();

    // fix to clear the interval when are developing with hot reload (timers was not cleared automatically)
    if (module.hot) {
      module.hot.accept(() => {
        this.stopPollCount();
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
        this.loading = false,
        this.setFeed(feed);
      })
      .catch(err => {
        console.log('error', err);
      })
  }

  loadCount() {
    getCount().then(data => {
      this.setUnread(data.count);
    }).catch(err => {
      console.log('error', err);
    });
  }

  startPollCount() {
    this.pollInterval = setInterval(() => {
       this.loadCount();
    }, 10000);
  }

  stopPollCount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  @action
  setUnread(count) {
    this.unread = count;
  }

  @action
  setFeed(feed) {

    if (feed.entities) {
      this.entities = [... this.entities, ...feed.entities],
      this.offset = feed.offset;
    } else {
      this.moreData = false;
      return false;
    }
    this.moreData = !!this.offset;

    return true;
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