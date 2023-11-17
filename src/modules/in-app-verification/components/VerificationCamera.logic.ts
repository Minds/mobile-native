import { useLocalStore } from 'mobx-react';
import React from 'react';
import { LayoutRectangle } from 'react-native';
// import { runOnJS } from 'react-native-reanimated';
import {
  Accelerometer,
  Gyroscope,
  GyroscopeMeasurement,
  AccelerometerMeasurement,
} from 'expo-sensors';
import * as Location from 'expo-location';

import {
  Camera,
  CameraDeviceFormat,
  PhotoFile,
  useCameraDevices,
  useFrameProcessor,
  VideoFile,
} from 'react-native-vision-camera';
// import { OCRFrame, scanOCR } from 'vision-camera-ocr';
type OCRFrame = any;

import logService from '~/common/services/log.service';
import { IS_IOS } from '~/config/Config';
import { showNotification } from 'AppMessages';
import NavigationService from '~/navigation/NavigationService';
import { api } from '../api';
import { ApiError } from '~/common/services/ApiErrors';
import type { Timeout } from '~/types/Common';

export const TARGET_WIDTH_RATIO = 0.65;
const TIMEOUT = 6000;
const SAMPLING_INTERVAL = 200;

const VerificationRequestExpiredException =
  'Minds::Core::Verification::Exceptions::VerificationRequestExpiredException';

type StatusType =
  | 'uploading'
  | 'success'
  | 'expired'
  | 'error'
  | 'timeout'
  | 'running'
  | 'permissionError';

/**
 * Verification camera store
 *
 * OCR recognition, video/image capture, and sensors recording
 */
export const createVerificationStore = ({
  code,
  deviceId,
}: {
  code: string;
  deviceId: string;
}) => ({
  hasPermission: false,
  enabledOCR: false,
  pixelRatioX: 0,
  pixelRatioY: 0,
  targetCenterX: 0,
  targetCenterY: 0,
  targetWidth: 0,
  layout: null as null | LayoutRectangle,
  status: 'running' as StatusType,
  camera: <Camera | null>null,
  timeout: <Timeout | null>null,
  accelerometer: <Array<AccelerometerMeasurement>>[],
  gyroscope: <Array<GyroscopeMeasurement>>[],
  location: <string | null>null,
  /**
   * execute action based on the status
   */
  action() {
    switch (this.status) {
      case 'expired':
      case 'running':
        this.resendCode();
        break;
      case 'error':
      case 'timeout':
        this.startRecording();
        break;
      case 'success':
        NavigationService.navigate({
          name: 'InAppVerificationConfirmation',
        });
        break;
      case 'permissionError':
        this.requestPermission();
        break;
    }
  },
  setLocation(lat: number, long: number) {
    this.location = `${lat},${long}`;
  },
  async requestPermission() {
    const cameraStatus = await Camera.requestCameraPermission();
    let { status: geoStatus } =
      await Location.requestForegroundPermissionsAsync();

    this.hasPermission =
      cameraStatus === 'authorized' && geoStatus === 'granted';

    if (!this.hasPermission) {
      this.status = 'permissionError';
    }

    return this.hasPermission;
  },
  clear() {
    this.enabledOCR = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.untrackSensors();
  },
  setCamera(camera: Camera | null) {
    this.camera = camera;
  },
  trackSensors() {
    this.accelerometer = [];
    this.gyroscope = [];
    Accelerometer.setUpdateInterval(SAMPLING_INTERVAL);
    Gyroscope.setUpdateInterval(SAMPLING_INTERVAL);
    Accelerometer.addListener(sensorData => {
      this.accelerometer.push(sensorData);
    });
    Gyroscope.addListener(sensorData => {
      this.gyroscope.push(sensorData);
    });
  },
  untrackSensors() {
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
  },
  async getLocation() {
    if (this.hasPermission) {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (location.mocked) {
        showNotification('Mocked location is not allowed for the verification');
        NavigationService.goBack();
        return;
      }
      this.setLocation(location.coords.latitude, location.coords.longitude);
    }
  },
  async submit(camImage: PhotoFile, camVideo: VideoFile) {
    this.status = 'uploading';

    const image = {
      uri: 'file://' + camImage.path,
      path: 'file://' + camImage.path,
      name: 'image.jpg',
      type: 'image/jpeg',
    };

    const video = {
      uri: camVideo.path,
      path: camVideo.path,
      name: 'video.mp4',
      type: 'video/mp4',
    };

    if (this.location) {
      return await api.submitVerification(
        deviceId,
        image,
        video,
        JSON.stringify({
          gyro: this.gyroscope,
          acel: this.accelerometer,
        }),
        this.location,
      );
    } else {
      showNotification('We failed to get your location', 'warning');
    }
  },
  resendCode() {
    NavigationService.navigate({
      name: 'InAppVerificationCodeRequest',
      params: { requestAgain: true },
    });
  },
  startRecording() {
    this.status = 'running';
    this.clear();
    this.trackSensors();

    // we delay the OCR to give time to record at least 1.5 seconds
    this.timeout = setTimeout(() => {
      this.enabledOCR = true;
      this.timeout = setTimeout(
        () => {
          this.status = 'timeout';
          this.camera?.stopRecording();
        },

        TIMEOUT,
      );
    }, 1700);

    setTimeout(() => {
      this.camera?.startRecording({
        onRecordingError: error => {
          this.status = 'error';
          this.clear();
          console.log('Camera Error', error);
        },
        onRecordingFinished: async video => {
          this.clear();
          if (this.status === 'running' && this.camera) {
            try {
              const image: PhotoFile = await (IS_IOS
                ? this.camera.takePhoto({ flash: 'off' })
                : // The camera is slower on android so we use a snapshot
                  this.camera.takeSnapshot({
                    quality: 85,
                    skipMetadata: true,
                    flash: 'off',
                  }));

              // 200 means it is valid
              await this.submit(image, video);
              this.status = 'success';
            } catch (error) {
              logService.exception('VerificationCamera[upload]', error);
              if (error instanceof ApiError) {
                if (error.errorId === VerificationRequestExpiredException) {
                  this.status = 'expired';
                  return;
                }
                showNotification(error.message, 'warning', 0);
              }

              this.status = 'error';
            }
          }
        },
      });
    }, 250);
  },
  setLayout(layout: LayoutRectangle, format: CameraDeviceFormat) {
    this.layout = layout;

    // on iOS we can use the format size, on android we need to fallback to the real frame size returned by the OCR processor
    if (IS_IOS) {
      this.pixelRatioX = layout.width / format.videoHeight;
      this.pixelRatioY = layout.height / format.videoWidth;
      this.targetCenterX = format.videoHeight / 2;
      this.targetCenterY = format.videoWidth / 2;
      this.targetWidth = format.videoHeight * TARGET_WIDTH_RATIO;
    }
  },
  validate(data: OCRFrame): boolean {
    // fallback for android, we get the real size of the frame from the modified OCR processor
    if (!IS_IOS && !this.pixelRatioX && data.result && this.layout) {
      this.pixelRatioX = this.layout.width / data.result.height;
      this.pixelRatioY = this.layout.height / data.result.width;
      this.targetCenterX = data.result.height / 2;
      this.targetCenterY = data.result.width / 2;
      this.targetWidth = data.result.height * TARGET_WIDTH_RATIO;
    }

    if (!this.enabledOCR) {
      return false;
    }

    if (data.result.blocks.length) {
      return data.result.blocks.some(block => {
        // allow an error margin of a 10% of the width of the target area
        const threshold = this.targetWidth / 10;

        const text = block.text.replace(' ', '');

        if (
          Math.abs(block.frame.boundingCenterX - this.targetCenterX) <
            threshold &&
          Math.abs(block.frame.boundingCenterY - this.targetCenterY) <
            threshold &&
          Math.abs(block.frame.width - this.targetWidth) < threshold * 2 &&
          this.similar(text)
        ) {
          // if code is valid stop the video recording
          this.camera?.stopRecording();
          return true;
        }
      });
    }
    return false;
  },
  similar(text: string): boolean {
    if (text.length === code.length) {
      let eq = 0;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === code[i]) {
          eq++;
        }
      }
      // allow two different characters in the code
      return eq >= code.length - 4;
    }
    return false;
  },
});

export type VerificationStoreType = ReturnType<typeof createVerificationStore>;

/**
 * Camera and format logic hook
 */
export const useCamera = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = React.useRef<Camera>(null);

  const format = React.useMemo(() => {
    if (device?.formats == null) {
      return undefined;
    }

    /**
     * Ignore pixel format x420 since it is not supported by MLKIT
     * and use a low resolution to improve the performance of the OCR
     */
    const formats = device.formats
      .sort((a, b) => a.videoWidth - b.videoWidth)
      .filter(f => f.pixelFormat !== 'x420' && f.videoWidth >= 640);

    if (formats.length) {
      return formats[0];
    }
  }, [device]);

  return { format, camera, device };
};

export function useVerificationCamera(code: string, deviceId: string) {
  const store: VerificationStoreType = useLocalStore(createVerificationStore, {
    code,
    deviceId,
  });
  const { camera, device, format } = useCamera();

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      // const data = scanOCR(frame);
      // runOnJS(store.validate)(data);
    },
    [store.status],
  );

  React.useEffect(() => {
    store.requestPermission();
    return () => store.clear();
  }, [store]);

  React.useEffect(() => {
    if (store.hasPermission && camera.current) {
      // get geolocation

      store.getLocation();
      // wait for the camera to be ready
      const timer = setTimeout(() => {
        store.setCamera(camera.current);
        store.startRecording();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [store.hasPermission, store, camera]);

  return { store, camera, device, format, frameProcessor };
}
