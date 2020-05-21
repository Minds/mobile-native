import { showMessage } from 'react-native-flash-message';

import AttachmentStore from '../common/stores/AttachmentStore';
import RichEmbedStore from '../common/stores/RichEmbedStore';
import i18n from '../common/services/i18n.service';
import hashtagService from '../common/services/hashtag.service';
import api from '../common/services/api.service';
import remoteAction from '../common/RemoteAction';
import ActivityModel from '../newsfeed/ActivityModel';
import { getSingle } from '../newsfeed/NewsfeedService';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * Display an error message to the user.
 * @param {string} message
 */
const showError = (message) => {
  showMessage({
    position: 'top',
    message: message,
    titleStyle: ThemedStyles.style.fontXL,
    duration: 2000,
    backgroundColor: ThemedStyles.getColor('tertiary_background'),
    type: 'error',
  });
};

/**
 * Composer store
 */
export default function (props) {
  return {
    isRemind: false,
    entity: null,
    attachment: new AttachmentStore(),
    nsfw: [],
    wire_threshold: {
      type: 'tokens',
      min: 0,
    },
    embed: new RichEmbedStore(),
    posting: false,
    mode: 'photo',
    text: '',
    title: '',
    mediaToConfirm: null,
    time_created: null,
    extra: null,
    onScreenFocused() {
      const params = props.route.params;
      if (!params || (!params.entity && !params.mode && !params.media)) {
        return;
      }

      this.isRemind = params.isRemind;
      this.entity = params.entity || null;
      const propsMode = params.mode || null;
      this.mode = propsMode ? propsMode : this.isRemind ? 'text' : 'photo';
      const mediaToConfirm = params.media || null;

      if (mediaToConfirm) {
        this.mode = 'text';
        this.mediaToConfirm = mediaToConfirm;
        this.attachment.attachMedia(mediaToConfirm);
      }

      // clear params to avoid repetition
      props.navigation.setParams({
        entity: undefined,
        media: undefined,
        mode: undefined,
        isRemind: undefined,
      });
    },
    setTokenThreshold(value) {
      value = parseFloat(value);
      if (isNaN(value) || value < 0) {
        this.wire_threshold.min = 0;
      } else {
        this.wire_threshold.min = value;
      }
    },
    setTimeCreated(time) {
      this.time_created = time;
    },
    toggleNsfw(opt) {
      if (opt === 0) {
        this.nsfw = [];
      } else {
        const index = this.nsfw.indexOf(opt);
        if (index !== -1) {
          this.nsfw.splice(index, 1);
        } else {
          this.nsfw.push(opt);
        }
      }
    },
    /**
     * @returns {Array} tags
     */
    get tags() {
      const hash = /(^|\s)\#(\w*[\u0E00-\u0E7Fa-zA-Z_]+\w*)/gim;
      const result = this.text.split(hash);
      const hashtags = [];

      for (let i = 2; i < result.length; i = i + 3) {
        hashtags.push(result[i].trim());
      }

      // remove repeated and return
      return [...new Set(hashtags)];
    },
    /**
     * Add tag
     * @param {string} tag
     */
    addTag(tag) {
      if (this.tags.length === hashtagService.maxHashtags) {
        return;
      }
      if (this.tags.some((t) => t === tag)) {
        return;
      }

      this.text += ` #${tag}`;
    },
    /**
     * Remove a tag
     * @param {string} tag
     */
    removeTag(tag) {
      this.text = this.text.replace(
        new RegExp('(^|\\s)#' + tag + '(?!\\w)', 'gim'),
        '',
      );
    },
    /**
     * Set posting
     * @param {boolean} value
     */
    setPosting(value) {
      this.posting = value;
    },
    /**
     * Set text
     * @param {string} text
     */
    setText(text) {
      this.text = text;

      if (!this.hasAttachment && !this.isRemind) {
        this.embed.richEmbedCheck(text);
      }
    },
    /**
     * Set title
     * @param {string} title
     */
    setTitle(title) {
      this.title = title;
    },
    /**
     * Set mode photo
     */
    setModePhoto() {
      this.clear();
    },
    /**
     * Set mode video
     */
    setModeVideo() {
      this.mode = 'video';
    },
    /**
     * Set mode text
     */
    setModeText() {
      this.mode = 'text';
    },
    /**
     * Clear the store to the initial values
     */
    clear(deleteMedia = true) {
      if (this.mediaToConfirm) {
        this.mediaToConfirm = null;
      }
      if (this.attachment.hasAttachment) {
        if (this.attachment.uploading) {
          this.attachment.cancelCurrentUpload();
        } else {
          if (deleteMedia) {
            this.attachment.delete();
          }
        }
        this.attachment.clear();
      }
      if (this.embed.hasRichEmbed) {
        this.embed.clearRichEmbed();
      }
      this.text = '';
      this.title = '';
      this.extra = null;
      this.mediaToConfirm = null;
      this.posting = false;
      this.entity = null;
      this.mode = 'photo';
      this.isRemind = false;
      this.nsfw = [];
      this.time_created = null;
      this.wire_threshold = 0;
    },
    /**
     * On media
     * @param {object} media
     * @param {string} mode
     */
    onMedia(media, mode = 'confirm') {
      setTimeout(() => {
        this.mediaToConfirm = media;
        this.mode = mode;
      }, 100);
    },
    /**
     * Reject acptured image
     */
    rejectImage() {
      this.mediaToConfirm = null;
      this.mode = 'photo';
    },
    /**
     * On media selected from gallery
     * @param {object} media
     */
    async onMediaFromGallery(media) {
      this.mediaToConfirm = media;
      this.acceptMedia(media);
    },
    /**
     * Accept media
     */
    acceptMedia() {
      this.attachment.attachMedia(this.mediaToConfirm, this.extra);
      this.mode = 'text';
    },
    /**
     * Remind
     */
    async remind() {
      const message = this.text;
      const metadata = this.entity.getClientMetadata();

      const post = {
        message,
        ...metadata,
      };

      return await remoteAction(
        async () => {
          this.setPosting(true);
          try {
            const data = await api.post(
              `api/v2/newsfeed/remind/${this.entity.guid}`,
              post,
            );
            if (data.guid) {
              const resp = await getSingle(data.guid);
              return ActivityModel.create(resp.activity);
            }
          } finally {
            this.setPosting(false);
          }
          return false;
        },
        '',
        0,
        false,
      );
    },
    /**
     * Submit post
     */
    async submit() {
      // is uploading?
      if (this.attachment.hasAttachment && this.attachment.uploading) {
        showError(i18n.t('capture.pleaseTryAgain'));
        return false;
      }

      // Somthing to post?
      if (
        !this.attachment.hasAttachment &&
        !this.text &&
        (!this.embed.meta || !this.embed.meta.url)
      ) {
        showError(i18n.t('capture.nothingToPost'));
        return false;
      }

      // check hashtag limit
      if (this.tags.length > hashtagService.maxHashtags) {
        showError(
          i18n.t('capture.maxHashtags', {
            maxHashtags: hashtagService.maxHashtags,
          }),
        );
        return false;
      }

      let newPost = {
        message: this.text,
        wire_threshold:
          this.wire_threshold && this.wire_threshold.min
            ? this.wire_threshold.min
            : null,
        time_created:
          Math.floor(this.time_created / 1000) || Math.floor(Date.now() / 1000),
      };

      if (this.title) {
        newPost.title = this.title;
      }

      newPost.nsfw = this.nsfw || [];

      if (this.attachment.guid) {
        newPost.attachment_guid = this.attachment.guid;
        newPost.attachment_license = this.attachment.license;
      }

      if (this.embed.meta) {
        newPost = Object.assign(newPost, this.embed.meta);
      }

      if (props.route.params && props.route.params.group) {
        newPost.container_guid = props.route.params.group.guid;
        // remove the group to avoid reuse it on future posts
        props.navigation.setParams({ group: undefined });
      }

      if (this.tags.length) {
        newPost.tags = this.tags;
      }

      return await remoteAction(
        async () => {
          if (this.posting) {
            return;
          }
          this.setPosting(true);
          let response;
          try {
            response = await api.post('api/v2/newsfeed', newPost);
          } finally {
            this.setPosting(false);
          }

          if (response && response.activity) {
            this.clear(false);
            return ActivityModel.create(response.activity);
          }
          return false;
        },
        '',
        0,
        false,
      );
    },
  };
}
