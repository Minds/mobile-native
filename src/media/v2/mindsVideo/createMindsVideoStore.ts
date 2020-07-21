import attachmentService from '../../../common/services/attachment.service';
import logService from '../../../common/services/log.service';
import type { AVPlaybackStatus, Video } from 'expo-av';
import _ from 'lodash';
import featuresService from '../../../common/services/features.service';
import apiService from '../../../common/services/api.service';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import type CommentModel from '../../../comments/CommentModel';

export type Source = {
  src: string;
  size: number;
};

const createMindsVideoStore = ({ entity }) => {
  const store = {
    shouldPlay: false as boolean,
    volume: 1 as number,
    inited: false,
    active: false,
    sources: null as Array<Source> | null,
    source: 0,
    currentTime: 0,
    duration: 0,
    transcoding: false,
    error: false,
    inProgress: false,
    loaded: false,
    video: { uri: '', headers: undefined },
    showOverlay: false,
    fullScreen: false,
    player: null as Video | null,
    paused: false,
    setSource(source: number) {
      this.source = source;
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
    setVideo(video: any) {
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
      if (this.shouldPlay) {
        this.error = false;
        this.inProgress = true;
      }
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
      if (status.isLoaded && status.shouldPlay) {
        this.loaded = false;
        this.currentTime = status.positionMillis;
        this.duration = status.durationMillis
          ? status.durationMillis / 1000
          : 0;
      }
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
    get videoSource() {
      return { uri: this.video.uri, headers: this.video.headers };
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

      if ((!this.sources || this.sources.length === 0) && entity) {
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
      }

      this.setStates(state);
    },
    pause() {
      this.paused = true;
      this.player && this.player.pauseAsync();
    },
    resume() {
      this.paused = false;
      this.player && this.player.playFromPositionAsync(this.currentTime * 1000);
    },
    setPlayer(player: Video) {
      this.player = player;
    },
  };
  return store;
};

export default createMindsVideoStore;

export type MindsVideoStoreType = ReturnType<typeof createMindsVideoStore>;
