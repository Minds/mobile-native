import { action, observable } from 'mobx';
import SystemSetting from 'react-native-system-setting';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import SilentSwitch from 'react-native-silent-switch';
//@ts-ignore
import { MindsVideoStoreType } from '../../media/v2/mindsVideo/createMindsVideoStore';
import { IS_IOS } from '~/config/Config';

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

  @observable isSilent = false;

  currentSystemVolume = 0;

  volumeListener: any = null;

  volumeListenerFn = data => {
    // if available enable current video audio
    if (this.current && !this.current.paused && data.value > 0) {
      if (IS_IOS) {
        if (data.value !== this.currentSystemVolume) {
          this.current.setVolume(1);
        }
      } else {
        this.current.setVolume(1);
      }
    }
    this.currentSystemVolume = data.value;
  };

  constructor() {
    SystemSetting.getVolume().then(value => (this.currentSystemVolume = value));
    SilentSwitch.addEventListener(silent => {
      this.setIsSilent(silent);
      const v = silent ? 0 : 1;
      if (this.current) {
        // we set the volume to v on the current video (this also calls the setVolume of this service)
        this.current.setVolume(v);
      }
    });
  }

  /**
   * Set is silent
   * @param {boolean} value
   */
  @action
  setIsSilent(value: boolean) {
    this.isSilent = value;
  }

  /**
   * Set current player reference
   * @param {MindsVideo} videoPlayerRef
   */
  setCurrent(videoPlayerRef) {
    if (this.volumeListener) {
      SystemSetting.removeVolumeListener(this.volumeListener);
      this.volumeListener = null;
    }
    if (this.current && this.current !== videoPlayerRef) {
      this.current.pause(false);
    }
    if (!this.current) {
      activateKeepAwake();
    }
    this.current = videoPlayerRef;
  }

  /**
   * Enable volume listener
   */
  enableVolumeListener() {
    if (this.current && !this.volumeListener) {
      this.volumeListener = SystemSetting.addVolumeListener(
        this.volumeListenerFn,
      );
    }
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
    if (this.volumeListener) {
      SystemSetting.removeVolumeListener(this.volumeListener);
      this.volumeListener = null;
    }
    deactivateKeepAwake();
  }
}

export default new VideoPlayerService();
