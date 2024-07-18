import {
  AVPlaybackSourceObject,
  AVPlaybackStatus,
  Video,
  VideoFullscreenUpdate,
  VideoFullscreenUpdateEvent,
} from 'expo-av';
import Cancelable from 'promise-cancelable';
import debounce from 'lodash/debounce';
import padStart from 'lodash/padStart';
import { runInAction } from 'mobx';

import attachmentService from '../../../common/services/attachment.service';
import logService from '../../../common/services/log.service';
import apiService from '../../../common/services/api.service';
import videoPlayerService from '../../../common/services/video-player.service';
import analyticsService from '~/common/services/analytics.service';
import SettingsStore from '~/settings/SettingsStore';
import ActivityModel from '~/newsfeed/ActivityModel';
import { IS_IOS } from '~/config/Config';
import { Orientation } from '~/services';
import { showNotification } from 'AppMessages';
import i18n from '~/common/services/i18n.service';

export type Source = {
  src: string;
  size: number;
};

const createMindsVideoStore = ({
  autoplay,
  repeat,
  onProgress,
  onOverlayPress,
}: {
  autoplay?: boolean;
  repeat?: boolean;
  onProgress?: (progress: number) => void;
  onOverlayPress?: () => void;
}) => {
  const store = {
    entity: <ActivityModel | null>null,
    initialVolume: <number | null>null,
    volume: videoPlayerService.currentVolume,
    sources: null as Array<Source> | null,
    source: 0,
    currentTime: 0,
    currentSeek: <number | null>null,
    duration: 0,
    transcoding: false,
    initPromise: <null | Cancelable<void>>null,
    error: false,
    inProgress: false,
    showFullControls: false,
    showThumbnail: true,
    loaded: false,
    video: null as AVPlaybackSourceObject | null,
    showOverlay: false,
    fullScreen: false,
    player: null as Video | null,
    paused: true,
    forceHideOverlay: false,
    /**
     * Should we track unmute event? true if volume is initially 0
     */
    shouldTrackUnmuteEvent: videoPlayerService.currentVolume === 0,
    hideOverlay: () => null as any,
    setEntity(entity: ActivityModel | null) {
      this.entity = entity;
    },
    clear() {
      this.video = null;
      this.sources = null;
      this.source = 0;
      this.paused = true;
      this.showThumbnail = true;
      this.currentTime = 0;
      this.currentSeek = null;
      this.duration = 0;
      this.transcoding = false;
      this.inProgress = false;
      this.showFullControls = false;
      this.showOverlay = false;
      this.fullScreen = false;
      if (this.initPromise) {
        this.initPromise.cancel();
      }
      this.initPromise = null;
    },
    setForceHideOverlay(forceHideOverlay: boolean) {
      this.forceHideOverlay = forceHideOverlay;
    },
    setPaused(val: boolean) {
      this.paused = val;
    },
    setSource(source: number) {
      this.source = source;

      if (this.sources) {
        this.setVideo({
          uri: this.sources[this.source].src,
          headers: apiService.buildHeaders(),
        });
      }
    },
    setSources(sources: Array<Source>) {
      this.sources = sources;
      this.setVideo({
        uri: this.sources[this.source].src,
        headers: apiService.buildHeaders(),
      });
    },
    onFullscreenUpdate(event: VideoFullscreenUpdateEvent) {
      if (
        !IS_IOS &&
        event.fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS
      ) {
        Orientation.lockPortrait();
      }
    },
    toggleFullScreen() {
      videoPlayerService.setCurrent(this);
      this.player?.presentFullscreenPlayer();
      if (!IS_IOS) {
        Orientation.unlock();
      }
    },
    setInProgress(inProgress: boolean) {
      this.inProgress = inProgress;
    },
    setShowOverlay(showOverlay: boolean) {
      this.showOverlay = showOverlay;
    },
    setShowThumbnail(showThumbnail: boolean) {
      this.showThumbnail = showThumbnail;
    },
    /**
     * Sets and pre load the video
     */
    setVideo(video: AVPlaybackSourceObject | null) {
      this.video = video;
      if (video) {
        this.player?.loadAsync(video).then(_ => {
          if (!this.paused || autoplay) {
            this.play(undefined, this.paused && autoplay);
          }
        });
      }
    },
    setVolume(volume: number) {
      this.volume = volume;
      // this.player?.setVolumeAsync(volume);
      this.player?.setIsMutedAsync(!this.volume);
      videoPlayerService.setVolume(volume);
    },
    trackUnmute() {
      if (this.entity) {
        analyticsService.trackClick('video-player-unmuted', [
          analyticsService.buildEntityContext(this.entity),
        ]);
      }
    },
    toggleVolume() {
      // on first unmute call analytics
      if (!this.volume && this.shouldTrackUnmuteEvent) {
        this.trackUnmute();
        this.shouldTrackUnmuteEvent = false;
      }
      this.setVolume(this.volume ? 0 : 1);
    },
    /**
     * Set the currentTime of video
     * @param currentTime in millis
     */
    onProgress(currentTime: number) {
      this.currentTime = currentTime;
      onProgress?.(this.currentTime / this.duration);
    },
    /**
     * Set the total duration of video
     * @param duration in millis
     */
    setDuration(duration: number) {
      this.duration = duration;
    },
    async onError(err: string) {
      console.log(err);
      // this.entity is null only on video previews.
      if (!this.entity) {
        return;
      }
      this.error = true;
      this.inProgress = false;
    },
    onLoadStart() {
      this.error = false;
      //this.inProgress = true;
      this.loaded = false;
    },
    onLoadEnd() {
      this.error = false;
      this.inProgress = false;
    },
    /**
     * Called once the video has been loaded.
     * The data is streamed so all of it may not have been fetched yet,
     * just enough to render the first frame
     * @param status
     */
    onVideoLoad(status: AVPlaybackStatus) {
      if (status.isLoaded) {
        this.loaded = true;
        this.currentTime = status.positionMillis;
        this.duration = status.durationMillis || 0;
      }
      this.onLoadEnd();
    },
    formatSeconds(seconds: number) {
      var minutes = Math.floor(seconds / 60);
      var remainingSeconds = seconds % 60;
      return (
        padStart(minutes.toFixed(0), 2, '0') +
        ':' +
        padStart(remainingSeconds.toFixed(0), 2, '0')
      );
    },
    get currentTimeSeconds() {
      return this.formatSeconds(this.currentTime / 1000);
    },
    get currentSeekSeconds() {
      return this.formatSeconds((this.currentSeek || this.currentTime) / 1000);
    },
    get durationSeconds() {
      return this.formatSeconds(this.duration / 1000);
    },
    get percent() {
      const currentTimePercent =
        this.currentTime > 0 ? this.currentTime / this.duration : 0;
      return currentTimePercent * 100;
    },
    changeSeek(value) {
      this.currentSeek = value;
    },
    /**
     * used for when progress bar changes
     * @param time
     */
    async onProgressChanged(time) {
      await this.player?.setStatusAsync({ shouldPlay: false });
      this.changeSeek(null);

      if (this.loaded) {
        this.player?.setStatusAsync({
          positionMillis: time,
          shouldPlay: !this.paused,
          isLooping: Boolean(repeat),
        });
      }
    },
    async updatePlaybackCallback(status: AVPlaybackStatus) {
      if (!status.isLoaded && status.error) {
        this.onError(status.error);
      } else {
        if (status.isLoaded) {
          this.onProgress(status.positionMillis || 0);

          if (status.isPlaying) {
            this.setDuration(status.durationMillis || 0);
            videoPlayerService.enableVolumeListener();
          }
        }
      }
    },
    openControlOverlay() {
      if (onOverlayPress) {
        return onOverlayPress();
      }

      if (!this.showOverlay) {
        this.setShowOverlay(true);
      }

      this.hideOverlay();
    },
    /**
     * Play the current video and activate the player
     */
    async play(sound?: boolean, isManualPlay?: boolean) {
      // check site membership
      if (
        this.entity?.site_membership &&
        !this.entity.site_membership_unlocked
      ) {
        if (isManualPlay) {
          showNotification(
            i18n.t('membership.pleaseJoin', { membership: 'membership' }),
            'info',
            5000,
          );
        }
        return;
      }

      // check pay walled content
      if (this.entity && this.entity.paywall) {
        await this.entity.unlockOrPay();
        if (this.entity.paywall) {
          return;
        }
      }

      if (sound === undefined) {
        sound = Boolean(videoPlayerService.currentVolume);
      }

      if (!this.video) {
        try {
          await this.init();
        } catch (error) {
          // if the init fail we cancel the reproduction
          return;
        }
      }

      this.setShowOverlay(false);

      runInAction(() => {
        this.showFullControls = true;
        this.setPaused(false);
        this.volume = sound ? 1 : 0;
      });

      this.player?.setStatusAsync({
        progressUpdateIntervalMillis: 100,
        shouldPlay: true,
        isMuted: !this.volume,
        isLooping: Boolean(repeat),
      });

      if (this.initialVolume === null) {
        this.initialVolume = this.volume;
      }

      // set as the current player in the service
      videoPlayerService.setCurrent(this);
    },
    pause(unregister: boolean = true) {
      unregister && this.unregister();

      this.setPaused(true);
      this.player?.pauseAsync();
    },
    /**
     * Unregister the player from the player service
     */
    unregister() {
      if (videoPlayerService.current === this) {
        videoPlayerService.clear();
      }
    },
    /**
     * Sets the instances of the expo-av player
     */
    setPlayer(player: Video) {
      this.player = player;

      // We define hide overlay here to avoid the weird scope issue on the arrow function
      this.hideOverlay = debounce(() => {
        if (this.showOverlay) {
          this.setShowOverlay(false);
        }
      }, 4000);
    },

    /**
     * Pre init and fetch only not paywalled content
     */
    async preload() {
      if (
        !this.video && // ignore if a video is defined (passed as a prop)
        (!this.entity?.site_membership ||
          this.entity?.site_membership_unlocked) &&
        !this.entity?.paywall && // ignore if the entity is paywalled
        !SettingsStore.dataSaverEnabled
      ) {
        await this.init();
      }
    },

    /**
     * init the video
     */
    async init(): Cancelable<void> {
      if (!this.initPromise) {
        this.error = false;
        this.initPromise = this._init();
      }
      try {
        await this.initPromise;
        this.initPromise = null;
      } catch (error) {
        this.initPromise = null;
        this.error = true;
        throw error;
      }
    },

    /**
     * Prefetch the sources and the video
     */
    _init(): Cancelable<void> {
      return new Cancelable(async (resolve, reject) => {
        if ((!this.sources || this.sources.length === 0) && this.entity) {
          try {
            const videoObj: any = await attachmentService.getVideo(
              this.entity.attachments && this.entity.attachments.attachment_guid
                ? this.entity.attachments.attachment_guid
                : this.entity.entity_guid || this.entity.guid,
            );

            if (videoObj && videoObj.entity.transcoding_status) {
              this.transcoding =
                videoObj.entity.transcoding_status !== 'completed';
              if (this.transcoding) {
                return;
              }
            }

            this.setSources(
              videoObj.sources.filter(
                v =>
                  [
                    'video/mp4',
                    'video/hls',
                    'application/vnd.apple.mpegURL',
                  ].indexOf(v.type) > -1,
              ),
            );
          } catch (error) {
            if (error instanceof Error) {
              logService.exception('[MindsVideo]', error);
            }
            reject(error);
          }
        }
        resolve();
      });
    },
  };
  return store;
};

export default createMindsVideoStore;

export type MindsVideoStoreType = ReturnType<typeof createMindsVideoStore>;
