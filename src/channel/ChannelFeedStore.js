import { observable, action } from 'mobx'

import { getFeedChannel, toggleComments , toggleExplicit } from '../newsfeed/NewsfeedService';

import OffsetFeedListStore from '../common/stores/OffsetFeedListStore';
// TODO: refactor to use Newsfeed store logic (DRY)
class ChannelFeedStore {

  @observable filter      = 'feed';
  @observable showrewards = false;

  list = new OffsetFeedListStore();

  /**
   * List loading
   */
  loading = false;

  offset = '';
  guid   = null;

  setGuid(guid) {
    this.guid = guid;
  }

  loadFeed() {

    if (this.list.cantLoadMore() || this.loading) {
      return;
    }

    return getFeedChannel(this.guid, this.list.offset)
    .then(feed => {
        if (this.filter != 'rewards') {
          this.list.setList(feed);
        }
      })
      .finally(() => {
        this.loading = false;
      })
      .catch(err => {
        console.error('error');
      });
  }

  @action
  clearFeed() {
    this.list.clearList();
    this.filter      = 'feed';
    this.showrewards = false;
  }

  @action
  refresh() {
    //ignore refresh on rewards view
    if (this.filter == 'rewards') {
      return;
    }
    this.list.refresh();
    this.list.clearList();
    this.loadFeed()
      .finally(action(() => {
        this.list.refreshDone();
      }));
  }

  @action
  setFilter(filter) {
    if (filter == this.filter) return;

    this.filter = filter;

    switch (filter) {
      case 'rewards':
        this.showrewards = true;
        this.list.clearList();
        break;
      default:
        this.showrewards = false;
        this.list.clearList();
        this.loadFeed();
        break;
    }
  }
}

export default new ChannelFeedStore();