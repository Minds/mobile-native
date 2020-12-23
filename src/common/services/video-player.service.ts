import { action, observable } from 'mobx';
import SystemSetting from 'react-native-system-setting';
import { MindsVideoStoreType } from '../../media/v2/mindsVideo/createMindsVideoStore';

/**
 * Video Player Service
 */
class VideoPlayerService {
  /**
   * current playing video player reference
   */
  current: MindsVideoStoreType | null = null;

  /**
   * current initial volume
   */
  @observable currentVolume = 0;

  constructor() {
    SystemSetting.addVolumeListener((data) => {
      // if available enable current video audio
      if (this.current && !this.current.paused && data.value > 0) {
        this.current.setVolume(1);
      }
    });
  }

  /**
   * Set current player reference
   * @param {MindsVideo} videoPlayerRef
   */
  setCurrent(videoPlayerRef) {
    if (this.current && this.current !== videoPlayerRef) {
      this.current.pause();
    }
    this.current = videoPlayerRef;
  }

  /**
   * Set the current volume to remember the option for the next video
   * @param value
   */
  @action
  setVolume(value: number) {
    this.currentVolume = value;
  }

  /**
   * Clear the current player ref
   */
  clear() {
    this.current = null;
  }
}

export default new VideoPlayerService();
