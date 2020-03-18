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
const showError = message => {
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
export default function(props) {
  // is reminds?
  const isRemind = props.route.params && props.route.params.isRemind;
  const entity = props.route.params ? props.route.params.entity : null;

  return {
    isRemind,
    entity,
    attachment: new AttachmentStore(),
    nsfw: [],
    wire_threshold: 0,
    embed: new RichEmbedStore(),
    posting: false,
    mode: isRemind ? 'text' : 'photo',
    text: '',
    title: '',
    mediaToConfirm: null,
    time_created: null,
    extra: null,
    /**
     * @returns {Array} tags
     */
    get tags() {
      const hash = /(^|\s)\#(\w*[a-zA-Z_]+\w*)/gim;
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
      if (this.tags.some(t => t === tag)) {
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
        ``,
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
    clear() {
      if (this.mediaToConfirm) {
        this.mediaToConfirm = null;
      }
      if (this.attachment.hasAttachment) {
        if (this.attachment.uploading) {
          this.attachment.cancelCurrentUpload();
        } else {
          this.attachment.delete();
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
      this.mode = 'photo';
    },
    /**
     * On media
     * @param {object} image
     * @param {string} mode
     */
    onMedia(image, mode = 'confirm') {
      this.mediaToConfirm = image;
      this.mode = mode;
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
        wire_threshold: this.wire_threshold,
        time_created: this.time_created || Math.floor(Date.now() / 1000),
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
        newPost.container_guid = this.props.route.params.group.guid;
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
            response = await api.post('api/v1/newsfeed', newPost);
          } finally {
            this.setPosting(false);
          }

          if (response.activity) {
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
