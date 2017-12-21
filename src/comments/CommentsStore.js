import {
  observable,
  action
} from 'mobx'

import {
  getComments,
  postComment,
  updateComment
} from './CommentsService';

import Comment from './Comment';

/**
 * Comments Store
 */
class CommentsStore {
  @observable comments = [];
  @observable actions = [];
  @observable refreshing = false;
  @observable loaded = false;
  @observable saving = false;

  guid = '';
  reversed = true;
  loadNext = '';
  loadPrevious = '';
  socketRoom = '';

  /**
   * Load Comments
   */
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

  @action
  updateComment(comment, description) {
    this.saving = true;
    return updateComment(comment.guid, description)
      .finally(action(() => {
        this.saving = false;
      }))
      .then(() => {
        this.setCommentDescription(comment, description);
      });
  }

  @action
  setCommentDescription(comment, description) {
    comment.description = description;
  }

  @action
  setActions(actions) {
    this.actions = actions;
  }

  cantLoadMore(guid) {
    return this.loaded && !this.offset && !this.refreshing && this.guid === guid;
  }
}

export default new CommentsStore();