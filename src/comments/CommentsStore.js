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

import CommentModel from './CommentModel';
import socket from '../common/services/socket.service';
import session from '../common/services/session.service';

import AttachmentStore from '../common/stores/AttachmentStore';

/**
 * Comments Store
 */
export default class CommentsStore {

  @observable comments = [];
  @observable refreshing = false;
  @observable loaded = false;
  @observable saving = false;
  @observable text = '';

  // attachment store
  attachment = new AttachmentStore();

  guid = '';
  reversed = true;
  loadNext = '';
  loadPrevious = '';
  socketRoomName = '';

  /**
   * Load Comments
   */
  loadComments(guid, limit = 25) {
    if (this.cantLoadMore(guid)) {
      return;
    }
    this.guid = guid;

    return getComments(this.guid, this.reversed, this.loadPrevious, limit)
      .then(action(response => {
        response.comments = CommentModel.createMany(response.comments);
        this.loaded = true;
        this.setComments(response);
        this.checkListen(response);
      }))
      .catch(err => {
        console.log('error', err);
      });
  }

  /**
   * Check for socketRoomName and start listen
   * @param {object} response
   */
  checkListen(response) {
    if (!this.socketRoomName && response.socketRoomName) {
      this.socketRoomName = response.socketRoomName;
      this.listen();
    }
  }

  /**
   * Listen for socket
   */
  listen() {
    socket.join(this.socketRoomName);
    socket.subscribe('comment', this.comment);
  }
  /**
   * Stop listen for socket
   */
  unlisten() {
    socket.leave(this.socketRoomName);
    socket.unsubscribe('comment', this.comment);
  }

  /**
   * socket comment message
   */
  comment = (parent_guid, owner_guid, guid, more) => {
    if (owner_guid === session.guid) {
      return;
    }

    this.loadNext = guid;
    this.loadComments(this.guid, 1);
  }

  @action
  setText(txt) {
    this.text = txt;
  }

  @action
  setComments(response) {
    if (response.comments) {
      let comments = this.comments;
      this.comments = [];
      this.comments = response.comments.concat(CommentModel.createMany(comments));
    }
    this.reversed = response.reversed;
    this.loadNext = response['load-next'];
    this.loadPrevious = response['load-previous'];
  }

  @action
  setComment(comment) {
    this.comments.unshift(comment);
  }

  /**
   * Post comment
   */
  post() {
    this.saving = true;

    const comment = {
      comment: this.text
    }

    if (this.attachment.guid) {
      comment.attachment_guid = this.attachment.guid;
    }

    return postComment(this.guid, comment)

      .then((data) => {
        this.setComment(data.comment);
        this.setText('');
        this.attachment.clear();
      })
      .finally(action(() => {
        this.saving = false;
      }))
      .catch(err => {
        console.log(err);
        alert('Error sending comment');
      })
  }

  @action
  clearComments() {
    this.comments = [];
    this.reversed = '';
    this.loadNext = '';
    this.loadPrevious = '';
    this.socketRoomName = '';
    this.loaded = false;
    this.saving = false;
    this.text = '';
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

  cantLoadMore(guid) {
    return this.loaded && !(this.loadPrevious) && !this.refreshing && this.guid === guid;
  }

  @action
  reset() {
    this.comments = [];
    this.refreshing = false;
    this.loaded = false;
    this.saving = false;
    this.guid = '';
    this.reversed = true;
    this.loadNext = '';
    this.loadPrevious = '';
    this.socketRoomName = '';
  }

}