import mindsConfigService from '../../common/services/minds-config.service';

type FocusPoint = {
  x: number;
  y: number;
};

let focusTimer: null | number = null;

type FlashType = 'off' | 'on' | 'auto';
type CameraType = 'front' | 'back';

const createCameraStore = p => {
  const store = {
    videoLimit: mindsConfigService.getSettings().max_video_length ?? 5700,
    cameraType: <CameraType>'back',
    flashMode: <FlashType>'off',
    hdr: <boolean>false,
    lowLightBoost: <boolean>false,
    recording: false,
    show: false,
    pulse: false,
    ready: false,
    focusPoint: false as false | FocusPoint,
    showCam() {
      this.show = true;
    },
    isReady() {
      this.ready = true;
    },
    setFocus(focus: false | FocusPoint) {
      this.focusPoint = focus;
      if (focusTimer) {
        clearTimeout(focusTimer);
        focusTimer = null;
      }
      focusTimer = setTimeout(
        () => this && this.hideFocus && this.hideFocus(),
        1300,
      );
    },
    toggleLowLightBoost() {
      this.lowLightBoost = !this.lowLightBoost;
    },
    toggleHdr() {
      this.hdr = !this.hdr;
    },
    toggleFlash() {
      if (this.flashMode === 'on') {
        this.flashMode = 'off';
      } else if (this.flashMode === 'off') {
        this.flashMode = 'auto';
      } else {
        this.flashMode = 'on';
      }
    },
    toggleCamera() {
      this.cameraType = this.cameraType === 'back' ? 'front' : 'back';
    },
    hideFocus() {
      this.focusPoint = false;
    },
    setRecording(value, pulse = false) {
      this.recording = value;
      this.pulse = pulse;
    },
    async recordVideo(pulse = false, format, camera) {
      if (this.recording) {
        this.setRecording(false);
        return camera.current?.stopRecording();
      }

      this.setRecording(true, pulse);

      //TODO: LIMIT DURATION AND PORTRAIT?

      camera.current?.startRecording({
        fileType: 'mp4',
        onRecordingFinished: video => {
          console.log(video);
          if (video && p.onMedia) {
            p.onMedia({
              type: 'video/mp4',
              ...video,
              width: format.videoWidth,
              height: format.videoHeight,
              uri: video.path,
            });
          }
        },
        onRecordingError: error => console.error(error),
      });
    },
    async takePicture(camera) {
      const options = {
        qualityPrioritization: 'speed',
      };

      // TODO: how to limit portrait mode?
      // if (p.portraitMode) {
      //   options.orientation = 'portrait';
      // }

      const result = await camera.current.takePhoto(options);
      if (result && p.onMedia) {
        p.onMedia({
          type: 'image/jpeg',
          ...result,
          uri: `file://${result.path}`,
          pictureOrientation: result.metadata.Orientation,
        });
      }
    },
  };
  return store;
};

export default createCameraStore;

export type CameraStore = ReturnType<typeof createCameraStore>;
