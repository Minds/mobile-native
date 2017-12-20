import {
  observable,
  action
} from 'mobx'

import {
  getComments,
  postComment
} from './CommentsService';
import Comment from './Comment';

/**
 * Comments Store
 */
class CommentsStore {
  @observable comments = [];
  @observable refreshing = false;
  @observable loaded = false;
  
  guid = '';
  reversed = true;
  loadNext = '';
  loadPrevious = '';
  socketRoom = '';
  
  /**
   * Load Comments
   */
  @action
  loadComments(guid) {
    if (this.cantLoadMore(guid)) {
      return;
    }
    this.guid = guid;
    
    return getComments(this.guid, this.reversed, this.loadNext, this.loadPrevious)
      .then(action(response => {
        this.loaded = true;
        this.setComments(response)
      }))
      .catch(err => {
        console.log('error', err);
      });
  }

  @action
  setComments(response) {
    if (response.comments) {
      response.comments.forEach(comment => {
          this.comments.push(comment);
      });
    }
    this.reversed = response.reversed;
    this.loadNext = response.loadNext;
    this.loadPrevious = response.loadPrevious;
    this.socketRoom = response.socketRoom;
  }

  @action
  setComment(comment) {
    this.comments.push(comment);
  }

  @action
  post(text) {
    return postComment(this.guid, text).then((data) => {
      this.setComment(data.comment);
    });
  }

  @action
  clearComments() {
    this.comments = [];
    this.reversed = '';
    this.loadNext = '';
    this.loadPrevious = '';
    this.socketRoom = '';
    this.loaded = false;
  }

  @action
  refresh() {
    this.refreshing = true;
    clearComments();
  }

  @action
  refreshDone() {
    this.refreshing = false;
  }

  cantLoadMore(guid) {
    return this.loaded && !this.offset && !this.refreshing && this.guid === guid;
  }


}

export default new CommentsStore();