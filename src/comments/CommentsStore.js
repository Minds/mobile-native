import {
  observable,
  action
} from 'mobx'

import {
  getComments,
  postComment
} from './CommentsService';

/**
 * Comments Store
 */
class CommentsStore {
  @observable comments = [];
  guid = '';
  reversed = true;
  loadNext = '';
  loadPrevious = '';
  socketRoom = '';
  
  /**
   * Load Comments
   */
  loadComments(guid) {
    this.guid = guid;
    return getComments(this.guid, this.reversed, this.loadNext, this.loadPrevious)
      .then(response => {
        this.setComments(response)
      })
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
    return postComment(this.guid, text).then(action((data) => {
      this.setComment(data.comment);
    }));
  }

  @action
  clearComments() {
    this.comments = [];
    this.reversed = '';
    this.loadNext = '';
    this.loadPrevious = '';
    this.socketRoom = '';
  }


}

export default new CommentsStore();