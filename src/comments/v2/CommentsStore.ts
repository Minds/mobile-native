import { observable, action, runInAction } from 'mobx';

import {
  getComments,
  postComment,
  updateComment,
  deleteComment,
  getComment,
} from '../CommentsService';

import CommentModel from './CommentModel';
import socket from '../../common/services/socket.service';
import session from '../../common/services/session.service';
import AttachmentStore from '../../common/stores/AttachmentStore';
import attachmentService from '../../common/services/attachment.service';
import { toggleExplicit } from '../../newsfeed/NewsfeedService';
import RichEmbedStore from '../../common/stores/RichEmbedStore';
import logService from '../../common/services/log.service';
import NavigationService from '../../navigation/NavigationService';
import { isNetworkFail } from '../../common/helpers/abortableFetch';
import type ActivityModel from '../../newsfeed/ActivityModel';
import type BlogModel from '../../blogs/BlogModel';
import type GroupModel from '../../groups/GroupModel';
import { showNotification } from '../../../AppMessages';
import i18n from '../../common/services/i18n.service';

const COMMENTS_PAGE_SIZE = 6;

/**
 * Comments Store
 */
export default class CommentsStore {
  @observable.shallow comments: Array<CommentModel> = [];
  @observable refreshing = false;
  @observable loaded = false;
  @observable saving = false;
  @observable text = '';
  @observable mature = 0;
  @observable loadingPrevious = false;
  @observable loadingNext = false;
  @observable showInput = false;

  @observable errorLoadingPrevious = false;
  @observable errorLoadingNext = false;

  level = 0;
  focusedUrn = null;

  // attachment store
  attachment = new AttachmentStore();
  // embed store
  embed = new RichEmbedStore();

  entity: ActivityModel | BlogModel | GroupModel;
  guid = '';
  reversed = true;
  loadNext = '';
  loadPrevious = '';
  socketRoomName = '';
  edit?: CommentModel;

  // parent for reply
  parent: CommentModel | null = null;

  constructor(entity) {
    this.focusedUrn = this.getFocuedUrn();
    this.entity = entity;
  }

  getParentPath() {
    return this.parent && this.parent.child_path
      ? this.parent.child_path
      : '0:0:0';
  }

  @action
  toggleMature = () => {
    this.mature = this.mature ? 0 : 1;
  };

  @action
  setShowInput(value: boolean, edit?: CommentModel) {
    this.showInput = value;
    if (this.edit && !edit) {
      this.text = '';
    }
    this.edit = edit;
    if (edit) {
      this.text = edit.description || '';
    }
  }

  /**
   * Set the entity
   * @param {object} entity
   */
  setEntity(entity) {
    this.entity = entity;
  }

  /**
   * Set focused urn
   * @param {String|null} value
   */
  setFocusedUrn(value) {
    this.focusedUrn = value;
  }

  /**
   * Get level
   */
  getLevel() {
    if (this.parent) {
      if (this.parent.parent) {
        return 2;
      }
      return 1;
    }
    return 0;
  }

  /**
   * Get focused urn
   */
  getFocuedUrn() {
    const params = NavigationService.getCurrentState().params;

    let value = null;

    if (params && params.focusedUrn) value = params.focusedUrn;

    return value;
  }

  /**
   * Load Comments
   */
  @action
  async loadComments(descending = true) {
    const guid = this.entity.entity_guid || this.entity.guid;

    if (this.cantLoadMore(guid, descending)) {
      return;
    }
    this.guid = guid;

    if (descending) {
      this.setErrorLoadingPrevious(false);
      this.loadingPrevious = true;
    } else {
      this.setErrorLoadingNext(false);
      this.loadingNext = true;
    }

    const parent_path = this.getParentPath();

    try {
      const response = await getComments(
        this.focusedUrn,
        this.guid,
        parent_path,
        this.getLevel(),
        COMMENTS_PAGE_SIZE,
        descending ? null : this.loadNext,
        descending ? this.loadPrevious : null,
        descending,
      );

      runInAction(() => {
        this.loaded = true;
        this.setComments(response, descending);
      });

      this.checkListen(response);
    } catch (err) {
      console.log(err);
      if (descending) {
        this.setErrorLoadingPrevious(true);
      } else {
        this.setErrorLoadingNext(true);
      }
      if (!isNetworkFail(err)) {
        logService.exception('[CommentsStore] loadComments', err);
      }
    } finally {
      runInAction(() => {
        if (descending) {
          this.loadingPrevious = false;
        } else {
          this.loadingNext = false;
        }
      });
      // use only once
      this.focusedUrn = null;
    }
  }

  @action
  setErrorLoadingNext(value) {
    this.errorLoadingNext = value;
  }

  @action
  setErrorLoadingPrevious(value) {
    this.errorLoadingPrevious = value;
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
  };

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
  commentSocket = async (parent_guid, owner_guid, guid) => {
    if (owner_guid === session.guid) {
      return;
    }

    try {
      const comment = await getComment(this.guid, guid, this.getParentPath());
      if (comment) {
        this.comments.push(CommentModel.create(comment));
      }
    } catch (err) {
      logService.exception('[CommentsStore] commentSocket', err);
    }
  };

  /**
   * Set comment text
   * @param {string} text
   */
  @action
  setText = (text: string, mature?: number) => {
    this.text = text;
    this.embed.richEmbedCheck(text);
    if (mature !== undefined) {
      this.mature = mature;
    }
  };

  /**
   * Set comments array from response
   * @param {response} response
   */
  @action
  setComments(response, descending) {
    if (this.comments.length) {
      if (descending) {
        this.loadPrevious = response['load-previous'];
      } else {
        this.loadNext = response['load-next'];
      }
    } else {
      this.loadPrevious = response['load-previous'];
      this.loadNext = response['load-next'];
    }

    if (response.comments) {
      const comments = CommentModel.createMany(response.comments);

      if (descending) {
        comments.reverse().forEach((c) => this.comments.unshift(c));
      } else {
        comments.forEach((c) => this.comments.push(c));
      }
    }
    this.reversed = response.reversed;
  }

  /**
   * Add a comment
   * @param {object} comment
   */
  @action
  pushComment(comment) {
    this.comments.push(CommentModel.create(comment));
  }

  /**
   * Post comment
   */
  post = async () => {
    if (this.attachment.uploading) {
      showNotification(i18n.t('uploading'), 'info', 3000, 'top');
      return;
    }

    if (this.edit) {
      return this.updateComment();
    }

    this.saving = true;

    const comment = {
      comment: this.text.trim(),
      mature: this.mature,
      parent_path: this.getParentPath(),
      attachment_guid: <string | undefined>undefined,
    };

    if (this.attachment.guid) {
      comment.attachment_guid = this.attachment.guid;
    }

    if (this.embed.meta) {
      Object.assign(comment, this.embed.meta);
    }

    // Add client metada if available
    Object.assign(comment, this.entity.getClientMetadata());

    try {
      const data: any = await postComment(this.guid, comment);

      this.pushComment(data.comment);
      this.setText('', 0);
      this.setShowInput(false);
      this.embed.clearRichEmbedAction();
      this.attachment.clear();

      if (this.entity.incrementCommentsCounter) {
        this.entity.incrementCommentsCounter();
      }
    } catch (err) {
      logService.exception('[CommentsStore] post', err);
      showNotification('Error sending comment');
    } finally {
      this.saving = false;
    }
  };

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
    this.loadingNext = false;
    this.loadingPrevious = false;
    this.errorLoadingNext = false;
    this.errorLoadingPrevious = false;
    this.saving = false;
    this.text = '';
  }

  /**
   * Refresh
   */
  @action
  refresh() {
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
   * @param {string} description
   */
  @action
  async updateComment() {
    if (!this.edit) return;

    this.saving = true;

    try {
      await updateComment(this.edit.guid, this.text);
      this.setCommentDescription(this.edit, this.text);
      this.setText('');
      this.edit = undefined;
      this.setShowInput(false);
    } catch (err) {
      logService.exception('[CommentsStore] updateComment', err);
      showNotification(
        'Oops there was an error updating the comment\nPlease try again.',
      );
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
   * @param {boolean} descending
   */
  cantLoadMore(guid, descending) {
    return (
      this.loaded &&
      !(descending ? this.loadPrevious : this.loadNext) &&
      !this.refreshing &&
      this.guid === guid
    );
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
   * Attach a video
   */
  async video() {
    try {
      const response = await attachmentService.video();
      if (response) this.onAttachedMedia(response);
    } catch (e) {
      logService.exception(e);
      showNotification(e.message);
    }
  }

  /**
   * Attach a photo
   */
  async photo(fn?: () => void) {
    try {
      const response = await attachmentService.photo();

      if (fn) fn();

      if (response) this.onAttachedMedia(response);
    } catch (e) {
      logService.exception(e);
      showNotification(e.message);
    }
  }

  /**
   * On attached media
   */
  onAttachedMedia = async (response) => {
    const attachment = this.attachment;

    try {
      await attachment.attachMedia(response);
    } catch (err) {
      logService.exception('[CommentsStore] onAttachedMedia', err);
      showNotification('Oops caught upload error.');
    }
  };

  /**
   * On media type select
   */
  selectMediaType = async (i) => {
    try {
      let response;
      switch (i) {
        case 1:
          response = await attachmentService.gallery('photo', false);
          break;
        case 2:
          response = await attachmentService.gallery('video', false);
          break;
      }

      if (response) this.onAttachedMedia(response);
    } catch (err) {
      logService.exception('[CommentsStore] selectMediaType', err);
      showNotification('Oops there was an error selecting the media.');
    }
  };

  /**
   * Open gallery
   */
  async gallery(fn?: () => void) {
    try {
      const response = await attachmentService.gallery('mixed', false);

      if (fn) fn();

      // nothing selected
      if (!response) return;

      await this.attachment.attachMedia(response);
    } catch (err) {
      logService.exception('[CommentsStore] gallery', err);
    }
  }

  /**
   * Comment toggle explicit
   * @param {string} guid
   */
  @action
  commentToggleExplicit(guid) {
    let index = this.comments.findIndex((x) => x.guid == guid);
    if (index >= 0) {
      let comment = this.comments[index];
      let value = !comment.mature;
      return toggleExplicit(guid, value)
        .then(
          action(() => {
            comment.mature = value;
            this.comments[index] = comment;
          }),
        )
        .catch(
          action((err) => {
            comment.mature = !value;
            this.comments[index] = comment;
            logService.exception('[CommentsStore] commentToggleExplicit', err);
          }),
        );
    }
  }

  /**
   * Delete
   * @param {string} guid
   */
  @action
  async delete(guid) {
    let index = this.comments.findIndex((x) => x.guid == guid);
    if (index >= 0) {
      await deleteComment(guid);

      if (this.entity.decrementCommentsCounter) {
        this.entity.decrementCommentsCounter();
      }

      this.comments.splice(index, 1);
    }
  }
}
