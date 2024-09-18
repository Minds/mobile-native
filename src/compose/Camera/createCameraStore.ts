import { RefObject } from 'react';
import { Platform } from 'react-native';
import { Timeout } from '~/types/Common';
import { Camera } from 'react-native-vision-camera';
import sp from '~/services/serviceProvider';

type FocusPoint = {
  x: number;
  y: number;
};

let focusTimer: null | Timeout = null;

type FlashType = 'off' | 'on' | 'auto';
type CameraType = 'front' | 'back';

const createCameraStore = p => {
  const store = {
    videoLimit: sp.config.getSettings().max_video_length ?? 5700,
    cameraType: <CameraType>'back',
    flashMode: <FlashType>'off',
    hdr: <boolean>false,
    lowLightBoost: <boolean>false,
    recording: false,
    recordingPaused: false,
    show: false,
    pulse: false,
    ready: false,
    focusPoint: false as false | FocusPoint,
    toggleRecording(camera) {
      if (!this.recordingPaused) {
        this.recordingPaused = true;
        camera.current?.pauseRecording();
      } else {
        this.recordingPaused = false;
        camera.current?.resumeRecording();
      }
    },
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
      this.recordingPaused = false;
    },
    async recordVideo(pulse = false, format, camera) {
      if (this.recording) {
        this.setRecording(false);
        return camera.current?.stopRecording();
      }

      this.setRecording(true, pulse);

      camera.current?.startRecording({
        fileType: 'mp4',
        flash: this.flashMode,
        onRecordingFinished: video => {
          console.log('video recorded', video);
          if (video && p.onMedia) {
            if (Platform.OS === 'android' && video.path.startsWith('/')) {
              video.path = `file://${video.path}`;
            }
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
    async takePicture(camera: RefObject<Camera>) {
      const options = {
        qualityPrioritization: 'speed',
        flash: this.flashMode,
      };

      // TODO: how to limit portrait mode?
      // if (p.portraitMode) {
      //   options.orientation = 'portrait';
      // }

      const result = await camera.current?.takePhoto(options);

      if (result && p.onMedia) {
        if (
          result.orientation &&
          ['portrait', 'portrait-upside-down'].includes(result.orientation)
        ) {
          const { width, height } = result;
          result.width = height;
          result.height = width;
        }

        p.onMedia({
          type: 'image/jpeg',
          ...result,
          uri: `file://${result.path}`,
        });
      }
    },
  };
  return store;
};

export default createCameraStore;

export type CameraStore = ReturnType<typeof createCameraStore>;
