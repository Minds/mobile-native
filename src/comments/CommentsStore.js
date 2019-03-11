import {
  observable,
  action
} from 'mobx'

import { Platform } from 'react-native';

import {
  getComments,
  postComment,
  updateComment,
  deleteComment,
  getCommentsReply,
  postReplyComment,
  updateReplyComment,
  deleteReplyComment
} from './CommentsService';

import Comment from './Comment';
import CommentModel from './CommentModel';
import socket from '../common/services/socket.service';
import session from '../common/services/session.service';
import AttachmentStore from '../common/stores/AttachmentStore';
import attachmentService from '../common/services/attachment.service';
import {toggleExplicit} from '../newsfeed/NewsfeedService';
import RichEmbedStore from '../common/stores/RichEmbedStore';

const COMMENTS_PAGE_SIZE = 6;

/**
 * Comments Store
 */
export default class CommentsStore {

  @observable comments = [];
  @observable refreshing = false;
  @observable loaded = false;
  @observable saving = false;
  @observable text = '';
  @observable loading = false;
  @observable errorLoading = false;

  // attachment store
  attachment = new AttachmentStore();
  // embed store
  embed = new RichEmbedStore();

  entity = null;
  guid = '';
  reversed = true;
  loadNext = '';
  loadPrevious = '';
  socketRoomName = '';

  // parent for reply
  parent = null;

  getParentPath() {
    return (this.parent && this.parent.child_path) ? this.parent.child_path : '0:0:0';
  }

  /**
   * Set the entity
   * @param {object} entity
   */
  setEntity(entity) {
    this.entity = entity;
  }

  /**
   * Load Comments
   */
  @action
  async loadComments(guid, descending = true, comment_guid = 0) {
    if (this.cantLoadMore(guid)) {
      return;
    }
    this.guid = guid;

    this.loading = true;
    this.setErrorLoading(false);

    this.include_offset = '';
    const parent_path = this.getParentPath();

    try {

      const response = await getComments(this.guid, parent_path, descending, this.loadPrevious, this.include_offset, COMMENTS_PAGE_SIZE, comment_guid);

      this.loaded = true;
      this.setComments(response, descending);
      this.checkListen(response);
    } catch (err) {
      this.setErrorLoading(true);
      console.log('error', err);
    } finally {
      this.loading = false;
    }
  }

  @action
  setErrorLoading(value) {
    this.errorLoading = value;
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
    socket.subscribe('comment', this.commentSocket);
    socket.subscribe('reply', this.replySocket);
    socket.subscribe('vote', this.voteSocket);
    socket.subscribe('vote:cancel', this.voteCancelSocket);
  }

  @action
  replySocket = (guid) => {
    for (let i = 0; i < this.comments.length; i++) {
      if (this.comments[i]._guid == guid) {
        this.comments[i].replies_count++;
      }
    }
  }

  @action
  voteSocket = (guid, owner_guid, direction) => {
    if (owner_guid === session.guid) {
      return;
    }
    let key = 'thumbs:' + direction + ':count';
    for (let i = 0; i < this.comments.length; i++) {
       if (this.comments[i]._guid == guid) {
         this.comments[i][key]++;
       }
     }
   };

   @action
   voteCancelSocket = (guid, owner_guid, direction) => {
    if (owner_guid === session.guid) {
      return;
    }
    let key = 'thumbs:' + direction + ':count';
    for (let i = 0; i < this.comments.length; i++) {
      if (this.comments[i]._guid == guid) {
        this.comments[i][key]--;
      }
    }
   };

  /**
   * Stop listen for socket
   */
  unlisten() {
    socket.leave(this.socketRoomName);
    socket.unsubscribe('comment', this.commentSocket);
    socket.unsubscribe('reply', this.replySocket);
    socket.unsubscribe('vote', this.voteSocket);
    socket.unsubscribe('vote:cancel', this.voteCancelSocket);
  }

  /**
   * socket comment message
   */
  @action
  commentSocket = async(parent_guid, owner_guid, guid) => {
    if (owner_guid === session.guid) {
      return;
    }

    try {
      const response = await getComments(this.guid, this.getParentPath(), true, null, false, 1, guid);
      if (response.comments && response.comments[0]) {
        this.comments.push(CommentModel.create(response.comments[0]));
      }
    } catch(err) {
      console.log(err)
    }
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
  setComments(response, descending) {
    if (response.comments) {
      const comments = CommentModel.createMany(response.comments)
      comments.reverse().forEach(c => this.comments.unshift(c));

      if (response.comments.length < COMMENTS_PAGE_SIZE) { //nothing more to load
        response['load-previous'] = '';
      }
    }
    this.reversed = response.reversed;
    if (descending) {
      this.loadPrevious = response['load-previous'];
    } else {
      this.loadNext = response['load-previous'];
    }
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
  async post() {
    this.saving = true;

    const comment = {
      comment: this.text,
      parent_path: this.getParentPath()
    }

    if (this.attachment.guid) {
      comment.attachment_guid = this.attachment.guid;
    }

    if (this.embed.meta) {
      Object.assign(comment, this.embed.meta);
    }

    try {

      const data = await postComment(this.guid, comment);

      this.setComment(data.comment);
      this.setText('');
      this.embed.clearRichEmbedAction();
      this.attachment.clear();

      if (this.entity.incrementCommentsCounter) {
        this.entity.incrementCommentsCounter();
      }
    } catch (err) {
      console.log(err);
      alert('Error sending comment');
    } finally {
      this.saving = false;
    }
  }

  /**
   * Clear comments
   */
  @action
  clearComments() {
    this.comments = [];
    this.reversed = true;
    this.loadNext = '';
    this.loadPrevious = '';
    this.socketRoomName = '';
    this.loaded = false;
    this.loading = false;
    this.errorLoading = false;
    this.saving = false;
    this.text = '';
  }

  /**
   * Refresh
   */
  @action
  refresh(guid) {
    this.refreshing = true;
    this.clearComments();
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
  async updateComment(comment, description) {
    this.saving = true;

    try {
      await updateComment(comment.guid, description);
      this.setCommentDescription(comment, description);
    } catch (err) {
      console.log('error', err);
      alert('Oops there was an error updating the comment\nPlease try again.');
    } finally {
      this.saving = false;
    }
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
    this.clearComments();
    this.parent = null;
    this.refreshing = false;
    this.guid = '';
    this.reversed = true;
  }

  /**
   * Set parent comment
   * @param {object} parent
   */
  setParent(parent) {
    this.parent = parent;
  }

  /**
   * Delete attachment
   */
  async deleteAttachment() {
    const attachment = this.attachment;
    // delete
    const result = await attachment.delete();

    if (result === false) alert('caught error deleting the file');
  }

  /**
   * Attach a video
   */
  async video() {
    try {
      const response = await attachmentService.video();
      if (response) this.onAttachedMedia(response);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

  /**
   * Attach a photo
   */
  async photo() {
    try {
      const response = await attachmentService.photo();
      if (response) this.onAttachedMedia(response);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

  /**
   * On attached media
   */
  onAttachedMedia = async (response) => {
    const attachment = this.attachment;

    try {
      const result = await attachment.attachMedia(response);
    } catch(err) {
      console.error(err);
      alert('caught upload error');
    }
  }

  /**
   * On media type select
   */
  selectMediaType = async (i) => {
    try {
      let response;
      switch (i) {
        case 1:
          response = await attachmentService.gallery('photo');
          break;
        case 2:
          response = await attachmentService.gallery('video');
          break;
      }

      if (response) this.onAttachedMedia(response);
    } catch (e) {
      console.log(e);
      alert(e);
    }
  }

  /**
   * Open gallery
   */
  async gallery(actionSheet) {
    if (Platform.OS == 'ios') {
      try {
        const response = await attachmentService.gallery('mixed');

        // nothing selected
        if (!response) return;

        const result = await this.attachment.attachMedia(response);

        if (result === false) alert('caught upload error');

      } catch (err) {
        console.error(err);
        alert(err);
      }
    } else {
      actionSheet.show()
    }
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
          console.log('error', err);
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

      if (this.entity.decrementCommentsCounter) {
        this.entity.decrementCommentsCounter();
      }

      this.comments.splice(index, 1);
    }
  }

}