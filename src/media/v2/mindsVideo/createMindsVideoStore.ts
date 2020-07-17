import type ActivityModel from "../../../newsfeed/ActivityModel";
import attachmentService from "../../../common/services/attachment.service";
import logService from "../../../common/services/log.service";

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
    setActive(active: boolean) {
      this.active = active;
    },
    setShouldPlay(shouldPlay) {
      this.shouldPlay = shouldPlay;
    },
    setVolume(volume: number) {
      this.volume = volume;
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
    onVideoLoad() {
      l
      this.setState({
        loaded: false,
      });
  
      this.onLoadEnd();
    };
  };
  return store;
};

export default createMindsVideoStore;

export type MindsVideoStoreType = ReturnType<typeof createMindsVideoStore>;
