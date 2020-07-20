import type ActivityModel from '../../../newsfeed/ActivityModel';
import attachmentService from '../../../common/services/attachment.service';
import logService from '../../../common/services/log.service';
import type { AVPlaybackStatus, Video } from 'expo-av';
import _ from 'lodash';
import featuresService from '../../../common/services/features.service';
import apiService from '../../../common/services/api.service';

export type Source = {
  src: string;
  size: number;
};

const createMindsVideoStore = (entity: ActivityModel) => {
  const store = {
    shouldPlay: true as boolean,
    volume: 1 as number,
    inited: false,
    active: false,
    sources: [] as Array<Source> | null,
    source: 0,
    currentTime: 0,
    duration: 0,
    transcoding: false,
    error: false,
    inProgress: false,
    loaded: false,
    video: { uri: '' },
    showOverlay: false,
    fullScreen: false,
    player: null as Video | null,
    setSource(source: number) {
      this.source = source;
    },
    setPlayer(player: Video | null) {
      this.player = player;
    },
    setFullScreen(fullSCreen: boolean) {
      this.fullScreen = fullSCreen;
    },
    toggleFullScreen() {
      this.fullScreen = !this.fullScreen;
    },
    setInProgress(inProgress: boolean) {
      this.inProgress = inProgress;
    },
    setShowOverlay(showOverlay: boolean) {
      this.showOverlay = showOverlay;
    },
    setVideo(video: { uri: string }) {
      this.video = video;
    },
    setActive(active: boolean) {
      this.active = active;
    },
    setShouldPlay(shouldPlay) {
      this.shouldPlay = shouldPlay;
    },
    setVolume(volume: number) {
      this.volume = volume;
    },
    toggleVolume() {
      this.volume = this.volume ? 0 : 1;
    },
    toggleInited() {
      this.inited = !this.inited;
    },
    /**
     * Set the currentTime of video
     * @param currentTime in millis
     */
    onProgress(currentTime: number) {
      this.currentTime = currentTime / 1000;
    },
    /**
     * Set the total duration of video
     * @param duration in millis
     */
    setDuration(duration: number) {
      this.duration = duration / 1000;
    },
    async onError(err: string) {
      // entity is null only on video previews.
      if (!entity) {
        return;
      }
      try {
        const response: any = await attachmentService.isTranscoding(
          entity.entity_guid,
        );
        if (response.transcoding) {
          this.transcoding = true;
        } else {
          logService.exception('[MindsVideo]', new Error(err));
          this.error = true;
          this.inProgress = false;
        }
      } catch (error) {
        logService.exception('[MindsVideo]', new Error(error));
        this.error = true;
        this.inProgress = false;
      }
    },
    onVideoEnd() {
      this.currentTime = 0;
      this.shouldPlay = false;
    },
    onLoadStart() {
      this.error = false;
      this.inProgress = true;
    },
    onLoadEnd() {
      this.error = false;
      this.inProgress = false;
    },
    onVideoLoad(status: AVPlaybackStatus) {
      console.log(status);
      this.loaded = false;
      this.onLoadEnd();
    },
    formatSeconds(seconds: number) {
      var minutes = Math.floor(seconds / 60);
      var remainingSeconds = seconds % 60;
      return (
        _.padStart(minutes.toFixed(0), 2, 0) +
        ':' +
        _.padStart(remainingSeconds.toFixed(0), 2, 0)
      );
    },
    get currentTimeSeconds() {
      return this.formatSeconds(this.currentTime);
    },
    get durationSeconds() {
      return this.formatSeconds(this.duration);
    },
    get percent() {
      const currentTimePercent =
        this.currentTime > 0 ? this.currentTime / this.duration : 0;
      return currentTimePercent * 100;
    },
    /**
     * used for when progress bar changes
     * @param newPercent
     * @param shouldPlay
     */
    onProgressChanged(newPercent, shouldPlay) {
      this.currentTime = (newPercent * this.duration) / 100;
      this.shouldPlay = shouldPlay;
    },
    openControlOverlay() {
      if (!this.showOverlay) {
        this.setShowOverlay(true);
      }
      const hideOverlay = _.debounce(() => {
        if (this.showOverlay) {
          this.setShowOverlay(false);
        }
      }, 4000);
      hideOverlay();
    },
    setStates(state: any) {
      this.active = state.active;
      this.volume = this.volume;
      this.showOverlay = this.showOverlay;
      this.shouldPlay = state.shouldPlay;
      this.sources = state.sources;
      if (state.video) {
        this.video = state.video;
      }
    },
    /**
     * Play the current video and activate the player
     */
    async play(sound: boolean = true) {
      const state: any = {
        active: true,
        volume: sound ? 1 : 0,
        showOverlay: false,
        shouldPlay: true,
        sources: [] as Array<Source>,
      };

      if (!this.sources && entity) {
        if (entity.paywall && featuresService.has('plus-2020')) {
          await entity.unlockOrPay();
          if (entity.paywall) {
            return;
          }
        }

        const response: any = await attachmentService.getVideoSources(
          entity.attachments && entity.attachments.attachment_guid
            ? entity.attachments.attachment_guid
            : entity.entity_guid || entity.guid,
        );

        state.sources = response.sources.filter((v) => v.type === 'video/mp4');

        if (Array.isArray(state.sources)) {
          state.video = {
            uri: state.sources[0].src,
            headers: apiService.buildHeaders(),
          };
        }
      } else {
        console.log('NO SOURCES!');
      }

      this.setStates(state);
    },
    pause() {
      this.shouldPlay = false;
    },
  };
  return store;
};

export default createMindsVideoStore;

export type MindsVideoStoreType = ReturnType<typeof createMindsVideoStore>;
