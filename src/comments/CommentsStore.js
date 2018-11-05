import {
  observable,
  action
} from 'mobx'

import {
  getComments,
  postComment,
  updateComment,
  deleteComment
} from './CommentsService';

import Comment from './Comment';

import CommentModel from './CommentModel';
import socket from '../common/services/socket.service';
import session from '../common/services/session.service';
import AttachmentStore from '../common/stores/AttachmentStore';
import {toggleExplicit} from '../newsfeed/NewsfeedService';
import RichEmbedStore from '../common/stores/RichEmbedStore';

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
  embed = new RichEmbedStore();

  guid = '';
  reversed = true;
  loadNext = '';
  loadPrevious = '';
  socketRoomName = '';

  /**
   * Load Comments
   */
  loadComments(guid, limit = 12) {
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

  /**
   * Set comment text
   * @param {string} text
   */
  @action
  setText(text) {
    this.text = text;
    this.embed.richEmbedCheck(text);
  }

  /**
   * Set comments array from response
   * @param {response} response
   */
  @action
  setComments(response) {
    if (response.comments) {
      let comments = this.comments;
      this.comments = [];
      this.comments = response.comments.concat(CommentModel.createMany(comments));

      if (response.comments.length < 11) { //nothing more to load
        response['load-previous'] = '';
      }
    }
    this.reversed = response.reversed;
    this.loadNext = response['load-next'];
    this.loadPrevious = response['load-previous'];
  }

  /**
   * Add a comment
   * @param {object} comment
   */
  @action
  setComment(comment) {
    this.comments.push(CommentModel.create(comment));
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

    if (this.embed.meta) {
      Object.assign(comment, this.embed.meta);
    }

    return postComment(this.guid, comment)

      .then((data) => {
        this.setComment(data.comment);
        this.setText('');
        this.embed.clearRichEmbedAction();
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

  /**
   * Clear comments
   */
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

  /**
   * Refresh
   */
  @action
  refresh() {
    this.refreshing = true;
    clearComments();
  }

  /**
   * Refresh done
   */
  @action
  refreshDone() {
    this.refreshing = false;
  }

  /**
   * Update comment
   * @param {objecft} comment
   * @param {string} description
   */
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

  /**
   * Set comment description
   * @param {object} comment
   * @param {string} description
   */
  @action
  setCommentDescription(comment, description) {
    comment.description = description;
  }

  /**
   * Cant load more
   * @param {string} guid
   */
  cantLoadMore(guid) {
    return this.loaded && !(this.loadPrevious) && !this.refreshing && this.guid === guid;
  }

  /**
   * Reset
   */
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

  /**
   * Comment toggle explicit
   * @param {string} guid
   */
  @action
  commentToggleExplicit(guid) {
    let index = this.comments.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let comment = this.comments[index];
      let value = !comment.mature;
      return toggleExplicit(guid, value)
        .then(action(response => {
          comment.mature = value;
          this.comments[index] = comment;
        }))
        .catch(action(err => {
          comment.mature = !value;
          this.comments[index] = comment;
          console.log('error');
        }));
    }
  }

  /**
   * Delete
   * @param {string} guid
   */
  @action
  async delete(guid) {
    let index = this.comments.findIndex(x => x.guid == guid);
    if(index >= 0) {
      let entity = this.comments[index];

      const result = await deleteComment(guid);

      this.comments.splice(index, 1);
    }
  }

}