import { action, observable, runInAction } from 'mobx';

import {
  deleteComment,
  getComment,
  getComments,
  postComment,
  updateComment,
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
import type ActivityModel from '../../newsfeed/ActivityModel';
import type BlogModel from '../../blogs/BlogModel';
import type GroupModel from '../../groups/GroupModel';
import { showNotification } from '../../../AppMessages';
import i18n from '../../common/services/i18n.service';
import { isNetworkError } from '../../common/services/api.service';
import { storeRatingService } from 'modules/store-rating';
import { EventContext } from '@snowplow/react-native-tracker';
import analyticsService from '../../common/services/analytics.service';

const COMMENTS_PAGE_SIZE = 12;

/**
 * Comments Store
 */
export default class CommentsStore {
  @observable.shallow comments: Array<CommentModel> = [];
  @observable.shallow spamComments: Array<CommentModel> = [];
  @observable refreshing = false;
  @observable loaded = false;
  @observable saving = false;
  @observable text = '';
  @observable selection = { start: 0, end: 0 };
  @observable mature = 0;
  @observable loadingPrevious = false;
  @observable loadingNext = false;
  @observable showInput = false;
  @observable spamCommentsShown = false;

  @observable errorLoadingPrevious = false;
  @observable errorLoadingNext = false;

  level = 0;
  focusedCommentUrn = null;

  // attachment store
  attachment = new AttachmentStore();
  // embed store
  embed = new RichEmbedStore();

  entity: ActivityModel | BlogModel | GroupModel;
  reversed = true;
  loadNext = '';
  loadPrevious = '';
  socketRoomName = '';
  edit?: CommentModel;

  // parent for reply
  parent: CommentModel | null = null;

  constructor(entity, private analyticContexts: EventContext[] = []) {
    this.focusedCommentUrn = this.getFocusedCommentUrn();
    this.entity = entity;
  }

  getAnalyticContexts() {
    return this.analyticContexts;
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

  /**
   * @param {boolean} value a boolean whether to show the input or not
   * @param {CommentModel} edit the comment to edit
   * @param {string} text a text to put in the input when opening it, used in replies in level 2
   * @return {void}
   **/
  @action
  setShowInput(value: boolean, edit?: CommentModel, text?: string) {
    if (value && !this.entity.allow_comments) {
      return;
    }

    this.showInput = value;
    // if the text was an unfinished reply like "@someone ", remove it
    if (this.text && /^@.+ /.test(this.text)) {
      this.setText('');
    }
    if (text) {
      this.setText(text);
    }
    if (this.edit && !edit) {
      this.text = '';
    }
    this.edit = edit;
    if (this.edit && edit) {
      this.text = edit.description || '';
      const source = this.edit.getThumbSource('large');
      if (
        this.edit.custom_type === 'batch' ||
        this.edit.custom_type === 'image'
      ) {
        this.attachment.setMedia(
          'image',
          this.edit.attachment_guid,
          source.uri,
        );
      } else if (this.edit.custom_type === 'video') {
        this.attachment.setMedia(
          'video',
          this.edit.attachment_guid,
          source.uri,
        );
      }
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
    this.focusedCommentUrn = value;
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
  getFocusedCommentUrn() {
    const params = NavigationService.getCurrentState().params;

    let value = null;

    if (params && params.focusedCommentUrn) {
      value = params.focusedCommentUrn;
    }

    return value;
  }

  get guid() {
    return this.entity.entity_guid || this.entity.guid;
  }

  /**
   * Load Comments
   */
  @action
  async loadComments(descending = true) {
    if (!this.canFetch(descending)) {
      return;
    }

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
        this.focusedCommentUrn,
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
      if (!isNetworkError(err)) {
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
      this.focusedCommentUrn = null;
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
  replySocket = guid => {
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
        this.comments.unshift(CommentModel.create(comment));
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
        comments
          .reverse()
          .forEach(c => (c.spam ? this.spamComments : this.comments).push(c));
      } else {
        comments.forEach(c =>
          (c.spam ? this.spamComments : this.comments).unshift(c),
        );
      }
    }
    this.reversed = response.reversed;
  }

  showSpamComments = () => {
    this.spamCommentsShown = true;
    this.comments.push(...this.spamComments);
  };

  /**
   * Add a comment
   * @param {object} comment
   */
  @action
  pushComment(comment) {
    this.comments.unshift(CommentModel.create(comment));
  }

  /**
   * Post comment
   */
  post = async () => {
    if (this.attachment.uploading) {
      showNotification(i18n.t('uploading'), 'info', 3000);
      return;
    }

    const comment: any = {
      comment: this.text.trim(),
      attachment_guid: <string | undefined>undefined,
    };

    if (comment.comment === '' && !this.attachment.hasAttachment) {
      showNotification(i18n.t('messenger.typeYourMessage'), 'info', 3000);
      return;
    }

    if (this.attachment.guid || this.edit?.attachment_guid) {
      comment.attachment_guid = this.attachment.guid;
    }

    if (this.embed.meta && !this.attachment.hasAttachment) {
      Object.assign(comment, this.embed.meta);
    }

    if (this.edit) {
      return this.updateComment(comment);
    }

    comment.mature = this.mature;
    comment.parent_path = this.getParentPath();

    this.saving = true;

    // Add client metada if available
    Object.assign(comment, this.entity.getClientMetadata());

    try {
      const data: any = await postComment(this.guid, comment);

      this.pushComment(data.comment);
      this.setText('', 0);
      this.setShowInput(false);
      this.embed.clearRichEmbedAction();
      this.attachment.clear();
      storeRatingService.track('comment', true);
      analyticsService.trackClick('comment', this.analyticContexts);

      if (this.entity.incrementCommentsCounter) {
        this.entity.incrementCommentsCounter();
        if (this.parent) {
          this.parent.increaseReply();
        }
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
    this.spamComments = [];
    this.spamCommentsShown = false;
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
  refresh = () => {
    this.refreshing = true;
    this.clearComments();
    this.loadComments()
      .then(() => {
        this.refreshDone();
      })
      .catch(() => {
        this.refreshDone();
      });
  };

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
  async updateComment(comment: any) {
    if (!this.edit) return;

    this.saving = true;

    try {
      await updateComment(this.edit.guid, comment);
      if (this.edit.attachment_guid !== comment.attachment_guid) {
        const updatedComment: CommentModel = await getComment(
          this.guid,
          this.edit._guid,
          this.getParentPath(),
        );
        updatedComment.attachment_guid = comment.attachment_guid;
        this.edit.update(updatedComment);
      } else {
        this.setCommentDescription(this.edit, this.text);
      }
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
   * Set selection
   * @param {object} selection
   */
  @action
  setSelection(selection) {
    this.selection = selection;
  }

  canFetch(descending?: boolean) {
    const offsetToken = descending ? this.loadPrevious : this.loadNext;
    const loading = descending ? this.loadingPrevious : this.loadingNext;

    // can't fetch while already loading or refreshing
    if (loading || this.refreshing) {
      return false;
    }

    // can't fetch if backend says there are no more items
    if (this.loaded && !offsetToken) {
      return false;
    }

    return true;
  }

  /**
   * Reset
   */
  @action
  reset() {
    this.clearComments();
    this.parent = null;
    this.refreshing = false;
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
      const media = await attachmentService.video();
      if (media) this.onAttachedMedia(media);
    } catch (e) {
      logService.exception(e);
      if (e instanceof Error) {
        showNotification(e.message);
      }
    }
  }

  /**
   * Attach a photo
   */
  async photo(fn?: () => void) {
    try {
      const media = await attachmentService.photo();

      if (fn) fn();

      if (media) this.onAttachedMedia(media);
    } catch (e) {
      logService.exception(e);
      if (e instanceof Error) {
        showNotification(e.message);
      }
    }
  }

  /**
   * On attached media
   */
  onAttachedMedia = async media => {
    const attachment = this.attachment;

    try {
      await attachment.attachMedia(media);
    } catch (err) {
      logService.exception('[CommentsStore] onAttachedMedia', err);
      showNotification('Oops caught upload error.');
    }
  };

  /**
   * On media type select
   */
  selectMediaType = async i => {
    try {
      let media;
      switch (i) {
        case 1:
          media = await attachmentService.gallery('Images', false);
          break;
        case 2:
          media = await attachmentService.gallery('Videos', false);
          break;
      }

      if (media) this.onAttachedMedia({ ...media, type: media.mimme });
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
      const response = await attachmentService.gallery('All', false);

      if (fn) fn();

      // nothing selected
      if (!response) return;

      const media = Array.isArray(response) ? response[0] : response;

      await this.attachment.attachMedia({ ...media, type: media.mime });
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
    let index = this.comments.findIndex(x => x.guid == guid);
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
          action(err => {
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
    let index = this.comments.findIndex(x => x.guid == guid);
    if (index >= 0) {
      await deleteComment(guid);

      if (this.entity.decrementCommentsCounter) {
        this.entity.decrementCommentsCounter();
      }

      this.comments.splice(index, 1);
    }
  }
}
