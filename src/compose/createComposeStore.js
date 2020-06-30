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
import featuresService from '../common/services/features.service';
import mindsService from '../common/services/minds.service';
import supportTiersService from '../common/services/support-tiers.service';
import settingsStore from '../settings/SettingsStore';

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

const DEFAULT_MONETIZE = {
  type: 'tokens',
  min: 0,
};

/**
 * Composer store
 */
export default function (props) {
  return {
    isRemind: false,
    isEdit: false,
    mode: settingsStore.composerMode,
    videoPoster: null,
    entity: null,
    attachment: new AttachmentStore(),
    nsfw: [],
    tags: [],
    wire_threshold: DEFAULT_MONETIZE,
    embed: new RichEmbedStore(),
    text: '',
    title: '',
    time_created: null,
    mediaToConfirm: null,
    extra: null,
    posting: false,
    get canEditMetadata(): boolean {
      if (!this.entity) {
        return true;
      } else if (this.entity.remind_object) {
        return false;
      }

      return !this.entity.perma_url || !this.entity.entity_guid;
    },
    onScreenFocused() {
      const params = props.route.params;
      if (
        !params ||
        (!params.entity && !params.mode && !params.media && !params.text)
      ) {
        return;
      }

      this.isRemind = params.isRemind;
      this.isEdit = params.isEdit;
      this.entity = params.entity || null;

      this.mode = params.mode
        ? params.mode
        : this.isRemind || this.isEdit
        ? 'text'
        : settingsStore.composerMode;

      if (params.media) {
        this.mode = 'text';
        this.mediaToConfirm = params.media;
        this.attachment.attachMedia(params.media);
      }

      if (params.text) {
        this.setText(params.text);
        this.mode = 'text';
      }

      if (this.isEdit) {
        this.hydrateFromEntity();
      }

      // clear params to avoid repetition
      props.navigation.setParams({
        entity: undefined,
        media: undefined,
        mode: undefined,
        isRemind: undefined,
        text: undefined,
      });
    },
    hydrateFromEntity() {
      this.text = this.entity.message || '';
      this.time_created = this.entity.time_created * 1000;
      this.title = this.entity.title || '';
      this.nsfw = this.entity.nsfw || [];
      this.tags = this.entity.tags || [];
      this.wire_threshold = this.entity.wire_threshold || DEFAULT_MONETIZE;

      if (this.entity.custom_type === 'batch') {
        this.attachment.setMedia('image', this.entity.entity_guid);
        this.mediaToConfirm = {
          type: 'image',
          uri: this.entity.custom_data[0].src,
          width: this.entity.custom_data[0].width,
          height: this.entity.custom_data[0].height,
        };
      } else if (this.entity.custom_type === 'video') {
        this.attachment.setMedia('video', this.entity.entity_guid);
        this.videoPoster = { url: this.entity.custom_data.thumbnail_src };
      } else if (this.entity.entity_guid || this.entity.perma_url) {
        // Rich embeds (blogs included)
        this.embed.setMeta({
          entityGuid: this.entity.entity_guid || null,
          url: this.entity.perma_url,
          title: this.entity.title || '',
          description: this.entity.blurb || '',
          thumbnail: this.entity.thumbnail_src || '',
        });
      }
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

      this.tags.push(tag);
    },
    /**
     * Remove a tag
     * @param {string} tag
     */
    removeTag(tag) {
      const index = this.tags.findIndex((v) => v === tag);
      if (index !== -1) {
        this.tags.splice(index, 1);
      }
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
      settingsStore.setComposerMode(this.mode);
    },
    /**
     * Set mode video
     */
    setModeVideo() {
      this.mode = 'video';
      settingsStore.setComposerMode(this.mode);
    },
    /**
     * Set mode text
     */
    setModeText() {
      this.mode = 'text';
      settingsStore.setComposerMode(this.mode);
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
      this.isEdit = false;
      this.nsfw = [];
      this.time_created = null;
      this.wire_threshold = DEFAULT_MONETIZE;
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
      this.mode = settingsStore.composerMode;
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
            this.clear(false);
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
      if (this.posting) {
        return;
      }

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

      const paywall = this.wire_threshold && this.wire_threshold.min;

      let newPost = {
        message: this.text,
        wire_threshold: featuresService.has('plus-2020')
          ? this.wire_threshold || null
          : paywall
          ? this.wire_threshold.min
          : null,
        paywall,
        time_created:
          Math.floor(this.time_created / 1000) || Math.floor(Date.now() / 1000),
      };

      if (this.title) {
        newPost.title = this.title;
      }

      newPost.nsfw = this.nsfw || [];

      if (this.attachment.guid) {
        newPost.entity_guid = this.attachment.guid;
        newPost.license = this.attachment.license;
      }

      if (this.embed.meta) {
        newPost = Object.assign(newPost, this.embed.meta);
      }

      if (props.route.params && props.route.params.group) {
        newPost.container_guid = props.route.params.group.guid;
        // remove the group to avoid reuse it on future posts
        props.navigation.setParams({ group: undefined });
      }

      // keep the container if it is an edited activity
      if (this.isEdit && typeof this.entity.container_guid !== 'undefined') {
        newPost.container_guid = this.entity.containerGuid;
      }

      if (this.tags.length) {
        newPost.tags = this.tags;
      }

      this.setPosting(true);

      const guidParam = this.isEdit ? `/${this.entity.guid}` : '';

      try {
        const response = await api.post(`api/v2/newsfeed${guidParam}`, newPost);
        if (response && response.activity) {
          if (this.isEdit) {
            this.entity.update(response.activity);
            this.entity.setEdited('1');
            return this.entity;
          }
          return ActivityModel.create(response.activity);
        }
      } finally {
        this.setPosting(false);
      }
    },
    async saveMembsershipMonetize(urn, expires = null) {
      this.wire_threshold = {
        support_tier: { urn, expires },
      };
    },
    async saveCustomMonetize(usd, has_usd, has_tokens) {
      const supportTier = await supportTiersService.createPrivate(
        usd,
        has_usd,
        has_tokens,
      );
      this.wire_threshold = {
        support_tier: {
          urn: supportTier.urn,
          expires: supportTier.expires,
        },
      };
    },
    async savePlusMonetize(expires) {
      this.wire_threshold = {
        support_tier: {
          urn: (await mindsService.getSettings()).plus.support_tier_urn,
          expires,
        },
      };
    },
  };
}
