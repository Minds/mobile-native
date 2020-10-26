import attachmentService from '../../../common/services/attachment.service';
import logService from '../../../common/services/log.service';
import type { AVPlaybackStatus, Video } from 'expo-av';
import _ from 'lodash';
import featuresService from '../../../common/services/features.service';
import apiService from '../../../common/services/api.service';
import videoPlayerService from '../../../common/services/video-player.service';

export type Source = {
  src: string;
  size: number;
};

const createMindsVideoStore = ({ entity, autoplay }) => {
  const store = {
    initialVolume: <number | null>null,
    volume: 1,
    sources: null as Array<Source> | null,
    source: 0,
    currentTime: 0,
    currentSeek: <number | null>null,
    duration: 0,
    transcoding: false,
    error: false,
    inProgress: false,
    loaded: false,
    video: { uri: '', headers: undefined },
    showOverlay: false,
    fullScreen: false,
    player: null as Video | null,
    paused: !autoplay,
    forceHideOverlay: false,
    setForceHideOverlay(forceHideOverlay: boolean) {
      this.forceHideOverlay = forceHideOverlay;
    },
    setPaused(val: boolean) {
      this.paused = val;
    },
    setSource(source: number) {
      this.source = source;
    },
    setSources(sources: Array<Source>) {
      this.sources = sources;
    },
    setFullScreen(fullSCreen: boolean) {
      this.fullScreen = fullSCreen;
    },
    toggleFullScreen() {
      this.fullScreen = !this.fullScreen;
      if (this.fullScreen) {
        this.player?.presentFullscreenPlayerAsync();
      }
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
    setVolume(volume: number) {
      this.volume = volume;
      this.player?.setVolumeAsync(volume);
      videoPlayerService.setVolume(volume);
    },
    toggleVolume() {
      this.setVolume(this.volume ? 0 : 1);
    },
    /**
     * Set the currentTime of video
     * @param currentTime in millis
     */
    onProgress(currentTime: number) {
      this.currentTime = currentTime;
    },
    /**
     * Set the total duration of video
     * @param duration in millis
     */
    setDuration(duration: number) {
      this.duration = duration;
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
      this.player?.pauseAsync();
      this.currentTime = 0;
      this.paused = true;
    },
    onLoadStart() {
      this.error = false;
      this.inProgress = true;
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
        _.padStart(minutes.toFixed(0), 2, 0) +
        ':' +
        _.padStart(remainingSeconds.toFixed(0), 2, 0)
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
          }

          if (status.didJustFinish && !status.isLooping) {
            this.onVideoEnd();
          }
        }
      }
    },
    openControlOverlay() {
      if (!this.showOverlay) {
        this.setShowOverlay(true);
      }

      this.hideOverlay();
    },
    hideOverlay: () => null,
    /**
     * Play the current video and activate the player
     */
    async play(sound: boolean | undefined) {
      if (sound === undefined) {
        sound = Boolean(videoPlayerService.currentVolume);
      }

      if ((!this.sources || this.sources.length === 0) && entity) {
        if (entity.paywall && featuresService.has('paywall-2020')) {
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

        this.setSources(response.sources.filter((v) => v.type === 'video/mp4'));
      }

      this.setShowOverlay(false);

      if (Array.isArray(this.sources)) {
        this.video = {
          uri: this.sources[this.source].src,
          headers: apiService.buildHeaders(),
        };
      }

      this.setPaused(false);

      this.volume = sound ? 1 : 0;
      if (this.initialVolume === null) {
        this.initialVolume = this.volume;
      }

      // set as the current player in the service
      videoPlayerService.setCurrent(this);

      // this.player?.playAsync();
      this.player?.setStatusAsync({
        progressUpdateIntervalMillis: 500,
        shouldPlay: true,
        volume: this.volume,
      });
    },
    pause() {
      this.setPaused(true);
      if (videoPlayerService.current === this) {
        videoPlayerService.clear();
      }
      this.player?.pauseAsync();
    },
    setPlayer(player: Video) {
      this.player = player;

      // We define hide overlay here to avoid the weird scope issue on the arrow function
      this.hideOverlay = _.debounce(() => {
        if (this.showOverlay) {
          this.setShowOverlay(false);
        }
      }, 4000);

      if (!this.paused) {
        this.play(undefined);
      }
    },
  };
  return store;
};

export default createMindsVideoStore;

export type MindsVideoStoreType = ReturnType<typeof createMindsVideoStore>;
