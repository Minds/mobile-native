import RNPhotoEditor from 'react-native-photo-editor';
import { measureHeights } from '@bigbee.dev/react-native-measure-text-size';
import RichEmbedStore from '../common/stores/RichEmbedStore';
import i18n from '../common/services/i18n.service';
import hashtagService from '../common/services/hashtag.service';
import api from '../common/services/api.service';
import ActivityModel from '../newsfeed/ActivityModel';
import mindsConfigService from '../common/services/minds-config.service';
import supportTiersService from '../common/services/support-tiers.service';
import settingsStore from '../settings/SettingsStore';
import attachmentService from '../common/services/attachment.service';
import logService from '../common/services/log.service';
import { runInAction } from 'mobx';
import { Image, Platform } from 'react-native';
import getNetworkError from '~/common/helpers/getNetworkError';
import { showNotification } from 'AppMessages';
import { SupermindRequestParam } from './SupermindComposeScreen';
import NavigationService from '../navigation/NavigationService';
import MultiAttachmentStore from '~/common/stores/MultiAttachmentStore';
import SupermindRequestModel from '../supermind/SupermindRequestModel';
import { storeRatingService } from 'modules/store-rating';
import { PickedMedia } from '~/common/services/image-picker.service';
import { confirmSupermindReply } from './SupermindConfirmation';
import { Media } from '../common/stores/AttachmentStore';
import type GroupModel from '../groups/GroupModel';
import type { SupportTiersType } from '../wire/WireTypes';
import { pushAudienceSelector } from './ComposeAudienceSelector';
import { regex } from '~/services';
import PermissionsService from '~/common/services/permissions.service';

/**
 * Display an error message to the user.
 * @param {string} message
 */
const showError = message => {
  showNotification(message, 'danger', 3000);
};

const DEFAULT_MONETIZE = {
  type: 'tokens',
  min: 0,
};

export type ComposeAudience = {
  type: 'public' | 'plus' | 'membership' | 'group';
  value?: string;
  tier?: SupportTiersType;
  group?: GroupModel;
};

export type ComposeCreateMode =
  | 'post'
  | 'monetizedPost'
  | 'boost'
  | 'supermind';

/**
 * Composer store
 */
export default function (props) {
  return {
    selection: {
      start: 0,
      end: 0,
    },
    scrollOffset: 0,
    textHeight: 26,
    portraitMode: false,
    noText: false,
    isRemind: false,
    isEdit: false,
    accessId: 2,
    mode: settingsStore.composerMode,
    isTitleOpen: false,
    /**
     * what compose mode is allowed? photo, video, and null for any
     */
    allowedMode: null,
    videoPoster: null,
    entity: null as ActivityModel | null,
    attachments: new MultiAttachmentStore(),
    nsfw: [] as number[],
    tags: [] as string[],
    wire_threshold: DEFAULT_MONETIZE as any,
    embed: new RichEmbedStore(),
    text: '',
    title: '',
    time_created: undefined as number | undefined,
    mediaToConfirm: null as Media | null,
    extra: null,
    posting: false,
    group: null as GroupModel | null,
    initialized: false,
    audience: { type: 'public' } as ComposeAudience,
    createMode: 'post' as ComposeCreateMode,
    /**
     * the supermind request that is built from the SupermindComposeScreen
     */
    supermindRequest: undefined as SupermindRequestParam | undefined,
    /**
     * the supermind object which is passed from the SupermindConsole and used for supermind reply functionality.
     * The existence of this object means the composer is being used to reply to a supermind
     */
    supermindObject: undefined as SupermindRequestModel | undefined,
    /**
     * The onSave from route params, called after submitting
     */
    onSaveCallback: undefined as ((entity: ActivityModel) => void) | undefined,
    onScreenFocused() {
      const params = props.route.params;
      if (this.initialized || !params) {
        this.initialized = true;
        return;
      }
      this.initialized = true;

      this.noText = Boolean(params.noText);
      this.portraitMode = params.portrait;
      this.isRemind = params.isRemind;
      this.isEdit = params.isEdit;
      this.allowedMode = params.allowedMode;
      this.entity = params.entity || null;
      this.supermindObject = params.supermindObject;
      this.onSaveCallback = params.onSave;

      if (params.audience) {
        this.audience = params.audience;
        if (this.audience.group) {
          this.setGroup(this.audience.group);
        }
      }

      if (params.createMode) {
        this.setCreateMode(params.createMode, true);
      }

      this.mode = params.mode
        ? params.mode
        : this.isRemind || this.isEdit
        ? 'text'
        : settingsStore.composerMode;

      // if noText is enabled the first screen shouldn't be text.
      if (this.mode === 'text' && this.noText) {
        this.mode = 'photo';
      }

      if (params.media) {
        this.mode = 'text';
        this.mediaToConfirm = params.media;
        this.attachments.attachMedia(params.media);
      }

      if (params.text) {
        this.setText(params.text);
        this.mode = 'text';
      }

      if (this.isEdit) {
        this.hydrateFromEntity();
      }

      if (params.group) {
        this.audience = {
          type: 'group',
          value: params.group.guid,
          group: params.group,
        };
        this.group = params?.group;
      }

      if (params.openSupermindModal) {
        const channel =
          params.supermindTargetChannel || params.entity?.ownerObj;
        this.openSupermindModal(channel ? { channel } : undefined, true);
      }

      // clear params to avoid repetition
      props.navigation.setParams({
        group: undefined,
        entity: undefined,
        media: undefined,
        mode: undefined,
        isRemind: undefined,
        text: undefined,
        portrait: undefined,
        noText: undefined,
      });
    },
    setAudience(audience: ComposeAudience) {
      this.audience = audience;
    },
    async setCreateMode(
      mode: ComposeCreateMode,
      clearComposeOnClose?: boolean,
    ) {
      if (mode === 'supermind') {
        if (!(await this.openSupermindModal(undefined, clearComposeOnClose))) {
          return false;
        }
      } else {
        this.supermindRequest = undefined;
      }

      if (mode === 'monetizedPost') {
        await pushAudienceSelector({
          store: this,
          mode: 'monetized',
        });
        if (
          this.audience.type !== 'membership' &&
          this.audience.type !== 'plus'
        ) {
          return false;
        }
      }

      this.createMode = mode;
      return true;
    },
    setGroup(group: GroupModel | null) {
      this.group = group;
    },
    setScrollOffset(value: number) {
      this.scrollOffset = value;
    },
    selectionChanged(e) {
      this.selection = e.nativeEvent.selection;
      const fontSmall = this.attachments.hasAttachment || this.text.length > 85;

      measureHeights({
        texts: [this.text.substr(0, this.selection.start)],
        width: 326,
        fontFamily: 'Roboto_400Regular',
        fontSize: fontSmall ? 18 : 22,
      })
        .then(result => (this.textHeight = Math.max(result[0], 26)))
        .catch(err => console.error('error ======>', err));
    },
    onPost(entity, isEdit) {
      const { popToTop } = props.navigation;

      this.onSaveCallback?.(entity);

      if (this.createMode === 'boost') {
        props.navigation.replace('BoostScreenV2', {
          entity: entity,
          boostType: 'post',
        });
      } else {
        popToTop();
      }

      if (!isEdit && !this.time_created) {
        ActivityModel.events.emit('newPost', entity);
      } else {
        ActivityModel.events.emit('edited', entity);
      }

      this.clear(false);
    },
    hydrateFromEntity() {
      const entity = this.entity;

      if (!entity) {
        console.error("Entity doesn't exist");
        return;
      }

      this.text = entity.message || '';
      this.time_created = Number(entity.time_created) * 1000;
      this.title = entity.title || '';
      this.isTitleOpen = Boolean(this.title);
      this.nsfw = entity.nsfw || [];
      this.tags = entity.tags || [];
      this.wire_threshold = entity.wire_threshold || DEFAULT_MONETIZE;

      if (entity.custom_type === 'batch') {
        entity.custom_data?.forEach(m => {
          this.attachments
            .addAttachment(false)
            .setMedia('image', m.guid, m.src, m.width, m.height);
        });
      } else if (entity.custom_type === 'video') {
        this.attachments
          .addAttachment(false)
          .setMedia('video', entity.custom_data?.guid);
      } else if (entity.entity_guid || entity.perma_url) {
        // Rich embeds (blogs included)
        this.embed.setMeta({
          entityGuid: entity.entity_guid || null,
          url: entity.perma_url,
          title: entity.title || '',
          description: entity.blurb || '',
          thumbnail: entity.thumbnail_src || '',
        });
      }
    },
    setAccessId(value) {
      this.accessId = value;
    },
    setTokenThreshold(value) {
      value = parseFloat(value);
      if (isNaN(value) || value < 0) {
        this.wire_threshold.min = 0;
      } else {
        this.wire_threshold.min = value;
      }
    },
    setTimeCreated(time?: number | null) {
      this.time_created = time ?? undefined;
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
     * Edit the current post image
     */
    async editImage() {
      const mediaToConfirm = this.mediaToConfirm;
      if (!mediaToConfirm || !mediaToConfirm.type.startsWith('image')) {
        return;
      }

      try {
        RNPhotoEditor.Edit({
          path: mediaToConfirm.uri.replace('file://', ''),
          stickers: ['sticker6', 'sticker9'],
          hiddenControls: ['save', 'share'],
          onDone: _result => {
            Image.getSize(
              mediaToConfirm.uri,
              (w, h) => {
                runInAction(() => {
                  if (mediaToConfirm.key) {
                    mediaToConfirm.key++;
                  } else {
                    mediaToConfirm.key = 0;
                  }

                  if (
                    Platform.OS === 'android' &&
                    typeof mediaToConfirm.pictureOrientation === 'number' &&
                    mediaToConfirm.pictureOrientation <= 2
                  ) {
                    mediaToConfirm.width = h;
                    mediaToConfirm.height = w;
                  } else {
                    mediaToConfirm.width = w;
                    mediaToConfirm.height = h;
                  }
                });
              },
              err => console.log(err),
            );
          },
        });
      } catch (err) {
        logService.exception(err);
      }
    },
    /**
     * Add tag
     * @param {string} tag
     */
    addTag(tag: string) {
      if (this.tags.length === hashtagService.maxHashtags) {
        this.maxHashtagsError();
        return false;
      }
      if (this.tags.some(t => t === tag)) {
        return false;
      }

      this.tags.push(tag);
      return true;
    },
    /**
     * Remove a tag
     * @param {string} tag
     */
    removeTag(tag) {
      const index = this.tags.findIndex(v => v === tag);
      if (index !== -1) {
        this.tags.splice(index, 1);
      }
    },
    parseTags() {
      let matched = this.text.match(regex.hash);
      if (matched) {
        // unique results
        const results = matched.map(v => v.trim().slice(1));
        const all = [...new Set(results.concat(this.tags))];

        if (all.length <= hashtagService.maxHashtags) {
          this.tags = all;
          return true;
        } else {
          this.maxHashtagsError();
          return false;
        }
      }
      return true;
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

      if (!this.attachments.hasAttachment && !this.isRemind) {
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
     * Set selection
     */
    setSelection(selection) {
      this.selection = selection;
    },
    /**
     * Set mode photo
     */
    setModePhoto(clear = true) {
      if (clear) this.clear();
      this.mode = 'photo';
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
      if (this.attachments.hasAttachment) {
        this.attachments.clear(deleteMedia);
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
      this.wire_threshold = DEFAULT_MONETIZE;
      this.tags = [];
      this.group = null;
      this.createMode = 'post';
    },
    /**
     * On media
     * @param {object} media
     * @param {string} mode
     */
    onMedia(media: Media, mode = 'confirm') {
      setTimeout(() => {
        this.mediaToConfirm = media;
        this.mediaToConfirm.key = 1;
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
     * Select media from gallery
     */
    async selectFromGallery(mode) {
      const max = 4 - this.attachments.length;

      if (max === 0) {
        showNotification(i18n.t('capture.max4Images'));
        return;
      }

      const response = await attachmentService.gallery(
        mode || 'All',
        false, // crop
        max, // max files allowed
      );

      if (response) {
        this.onMediaFromGallery(response);
      }
    },
    /**
     * On media selected from gallery
     */
    async onMediaFromGallery(media: PickedMedia | PickedMedia[]) {
      const canUploadVideo = PermissionsService.canUploadVideo();
      if (Array.isArray(media)) {
        media.forEach(mediaItem => {
          if (!canUploadVideo && mediaItem.type?.startsWith('video')) {
            showError(i18n.t('composer.create.mediaVideoError'));
            return;
          }

          this.attachments.attachMedia(
            {
              ...mediaItem,
              type: mediaItem.mime,
            },
            this.extra,
          );
        });
        this.mode = 'text';
      } else {
        if (this.portraitMode && media.height < media.width) {
          showError(i18n.t('capture.mediaPortraitError'));
          return;
        }
        if (!canUploadVideo && media.type?.startsWith('video')) {
          showError(i18n.t('composer.create.mediaVideoError'));
          return;
        }
        this.attachments.attachMedia(
          {
            ...media,
            type: media.mime,
          },
          this.extra,
        );
        this.mode = 'text';
      }
    },
    /**
     * Accept media
     */
    acceptMedia() {
      if (!this.mediaToConfirm) {
        console.error('No media attached');
        return;
      }

      this.attachments.attachMedia(this.mediaToConfirm, this.extra);
      this.mode = 'text';
    },
    /**
     * is the composer input valid or not. Is it ready to be submitted?
     */
    get isValid() {
      const isEmpty =
        !this.attachments.hasAttachment &&
        !this.text &&
        (!this.embed.meta || !this.embed.meta.url) &&
        !this.isRemind;

      return !isEmpty;
    },
    /**
     * Submit post
     */
    async submit() {
      if (!this.entity && this.isEdit) {
        console.error("Entity isn't available");
        return;
      }

      if (this.posting) {
        return;
      }

      // parse tags from text
      if (!this.parseTags()) {
        return false;
      }

      try {
        // Plus Monetize?
        if (
          this.wire_threshold &&
          'support_tier' in this.wire_threshold &&
          this.wire_threshold.support_tier.urn ===
            mindsConfigService.settings.plus.support_tier_urn
        ) {
          // Must have tags
          if (this.tags.length === 0) {
            showError(i18n.t('capture.noHashtags'));
            return false;
          }

          // Mustn't have external links
          if (
            this.embed.hasRichEmbed &&
            !this.embed.meta?.url.toLowerCase().includes('minds.com')
          ) {
            showError(i18n.t('capture.noExternalLinks'));
            return false;
          }
        }

        // is uploading?
        if (this.attachments.hasAttachment && this.attachments.uploading) {
          showError(i18n.t('capture.pleaseTryAgain'));
          return false;
        }

        // Something to post?
        if (!this.isValid) {
          showError(i18n.t('capture.nothingToPost'));
          return false;
        }

        let newPost: PostPayload = {
          message: this.text,
          access_id: this.accessId,
        };

        if (this.supermindRequest) {
          newPost.supermind_request = {
            ...this.supermindRequest,
            receiver_username: this.supermindRequest.channel.username,
            receiver_guid: this.supermindRequest.channel.guid,
          };
        }

        if (this.supermindObject) {
          if (
            !(await confirmSupermindReply(
              props.navigation,
              !!this.supermindObject?.twitter_required,
            ))
          ) {
            return;
          }
          newPost.supermind_reply_guid = this.supermindObject.guid;
        }

        // monetization
        if (
          this.paywalled &&
          !this.supermindRequest &&
          !this.isSupermindReply
        ) {
          newPost.paywall = true;
          newPost.wire_threshold = this.wire_threshold;
        }

        // add remind
        if (this.isRemind) {
          newPost.remind_guid = this.entity?.guid;
        }

        if (this.title) {
          newPost.title = this.title;
        }

        newPost.nsfw = this.nsfw || [];

        if (this.attachments.hasAttachment) {
          newPost.attachment_guids = this.attachments.getAttachmentGuids();
          newPost.is_rich = false;
          newPost.license = this.attachments.license;
        }

        if (this.embed.meta) {
          newPost = Object.assign(newPost, this.embed.meta);
        }

        if (this.group) {
          newPost.container_guid = this.group.guid;
          newPost.access_id = this.group.guid; // TODO: confirm this
        }

        // keep the container if it is an edited activity
        if (this.isEdit && typeof this.entity?.container_guid !== 'undefined') {
          newPost.container_guid = this.entity.container_guid;
        }

        if (this.tags.length) {
          newPost.tags = this.tags;
        }

        if (this.time_created) {
          newPost.time_created = this.buildTimestamp(this.time_created);
        }

        this.setPosting(true);

        const reqPromise = this.isEdit
          ? api.post(`api/v3/newsfeed/activity/${this.entity!.guid}`, newPost)
          : api.put('api/v3/newsfeed/activity', newPost);

        const response = await reqPromise;

        if (!response) {
          return null;
        }

        if (this.isEdit) {
          this.entity!.update(response);
          this.entity!.setEdited('1');
          return this.entity;
        }

        storeRatingService.track('createPost', true);

        if (this.supermindRequest) {
          showNotification(i18n.t('supermind.requestSubmitted'), 'success');
        }

        return ActivityModel.create(response);
      } catch (e) {
        const message = getNetworkError(e);
        if (message) {
          showError(message);
        } else {
          showError(i18n.t('errorMessage') + '\n' + i18n.t('pleaseTryAgain'));
        }
        logService.exception(e);
      } finally {
        this.setPosting(false);
      }
    },
    setRemindEntity(entity) {
      this.entity = entity;
      this.isRemind = true;
    },
    async saveMembsershipMonetize(support_tier) {
      this.wire_threshold = { support_tier };
    },
    async saveCustomMonetize(usd, has_usd, has_tokens) {
      const support_tier = await supportTiersService.createPrivate(
        usd,
        has_usd,
        has_tokens,
      );
      this.wire_threshold = { support_tier };
    },
    async savePlusMonetize(expires) {
      this.wire_threshold = {
        support_tier: {
          urn: mindsConfigService.getSettings().plus.support_tier_urn,
          expires,
        },
      };
    },
    clearWireThreshold() {
      this.wire_threshold = DEFAULT_MONETIZE;
    },
    get haveSupportTier() {
      return (
        this.wire_threshold &&
        'support_tier' in this.wire_threshold &&
        this.wire_threshold.support_tier.urn
      );
    },
    get paywalled() {
      return (
        this.haveSupportTier ||
        (this.wire_threshold && this.wire_threshold.min > 0)
      );
    },
    isGroup() {
      return !!props.route?.params?.group;
    },
    maxHashtagsError() {
      showError(
        i18n.t('capture.maxHashtags', {
          maxHashtags: hashtagService.maxHashtags,
        }),
      );
    },
    openSupermindModal(
      supermindRequest?: Partial<SupermindRequestParam>,
      closeComposerOnClear?: boolean,
    ) {
      return new Promise(resolve => {
        NavigationService.navigate('SupermindCompose', {
          data: supermindRequest || this.supermindRequest,
          closeComposerOnClear,
          onSave: (payload: SupermindRequestParam) => {
            this.supermindRequest = payload;
            this.createMode = 'supermind';
            resolve(payload);
          },
          onClear: () => {
            this.supermindRequest = undefined;
            resolve(undefined);
          },
        });
      });
    },
    get isSupermindReply() {
      return Boolean(this.supermindObject);
    },
    /**
     * Builds a Unix timestamp based off current state (up to seconds)
     */
    buildTimestamp(timestamp: number): number | null {
      const date = new Date(timestamp);

      date.setSeconds(0);

      return Math.floor(date.getTime() / 1000);
    },
    toggleTitle() {
      if (this.isTitleOpen) {
        this.title = '';
      }
      this.isTitleOpen = !this.isTitleOpen;
    },
  };
}

type PostPayload = {
  message?: string;
  access_id?: string | number;
  time_created?: number | null;
  supermind_request?: SupermindRequestParam & {
    receiver_username: string;
    receiver_guid: string;
  };
  supermind_reply_guid?: string;
  paywall?: boolean;
  wire_threshold?: typeof DEFAULT_MONETIZE;
  remind_guid?: string;
  title?: string;
  nsfw?: number[];
  attachment_guids?: string[];
  is_rich?: boolean;
  license?: string;
  container_guid?: string;
  tags?: string[];
};
