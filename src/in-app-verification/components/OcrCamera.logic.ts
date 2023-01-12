import { useLocalStore } from 'mobx-react';
import React from 'react';
import { LayoutRectangle } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import {
  Camera,
  CameraDeviceFormat,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { OCRFrame, scanOCR } from 'vision-camera-ocr';

import logService from '~/common/services/log.service';
import { IS_IOS } from '~/config/Config';
import { Timeout } from '~/types/Common';

export const TARGET_WIDTH_RATIO = 0.65;
const TIMEOUT = 6000;

type StatusType = 'valid' | 'success' | 'error' | 'timeout' | 'running';

/**
 * Local store
 */
export const createOcrStore = ({ code }: { code: string }) => ({
  hasPermission: false,
  pixelRatioX: 0,
  pixelRatioY: 0,
  targetCenterX: 0,
  targetCenterY: 0,
  targetWidth: 0,
  layout: null as null | LayoutRectangle,
  status: 'running' as StatusType,
  camera: <Camera | null>null,
  timeout: <null | Timeout>null,
  /**
   * execute action based on the status
   */
  action() {
    switch (this.status) {
      case 'running':
        console.log('Resend code here');
        break;
      case 'error':
      case 'timeout':
        this.startRecording();
        this.status = 'running';
        break;
      case 'valid':
        console.log('continue');
    }
  },
  async requestPermission() {
    const status = await Camera.requestCameraPermission();
    this.hasPermission = status === 'authorized';
    return this.hasPermission;
  },
  clearTimeout() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
  },
  setCamera(camera: Camera | null) {
    this.camera = camera;
  },
  startRecording() {
    this.status = 'running';
    this.clearTimeout();
    this.timeout = setTimeout(() => {
      this.status = 'timeout';
      this.camera?.stopRecording();
    }, TIMEOUT);
    this.camera?.startRecording({
      onRecordingError: error => {
        this.status = 'error';
        this.clearTimeout();
        console.log('Camera Error', error);
      },
      onRecordingFinished: async video => {
        this.clearTimeout();
        if (this.status === 'running') {
          try {
            const image = await (IS_IOS
              ? this.camera?.takePhoto({ flash: 'off' })
              : // The camera is slower on android so we use a snapshot
                this.camera?.takeSnapshot({
                  quality: 85,
                  skipMetadata: true,
                  flash: 'off',
                }));
            console.log('Validated', code);
            console.log('Video', video);
            console.log('Image', image);
            this.status = 'valid';
          } catch (error) {
            logService.exception(error);
            this.status = 'error';
          }
        }
      },
    });
  },
  setLayout(layout: LayoutRectangle, format: CameraDeviceFormat) {
    this.layout = layout;

    // on iOS we can use the format size, on android we need to fallback to the real frame size returned by the OCR processor
    if (IS_IOS) {
      this.pixelRatioX = layout.width / format.photoHeight;
      this.pixelRatioY = layout.height / format.photoWidth;
      this.targetCenterX = format.photoHeight / 2;
      this.targetCenterY = format.photoWidth / 2;
      this.targetWidth = format.photoHeight * TARGET_WIDTH_RATIO;
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

    if (data.result.blocks.length) {
      return data.result.blocks.some(block => {
        // allow an error margin of a 10% of the width of the target area
        const threshold = this.targetWidth / 10;

        if (
          Math.abs(block.frame.x - this.targetCenterX) < threshold &&
          Math.abs(block.frame.y - this.targetCenterY) < threshold &&
          Math.abs(block.frame.width - this.targetWidth) < threshold * 2 &&
          code === block.text
        ) {
          // if code is valid stop the video recording
          this.camera?.stopRecording();
          return true;
        }
      });
    }
    return false;
  },
});

export type OcrStoreType = ReturnType<typeof createOcrStore>;

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

export function useOcrCamera(code: string) {
  const store: OcrStoreType = useLocalStore(createOcrStore, { code });
  const { camera, device, format } = useCamera();

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (store.status === 'running') {
        const data = scanOCR(frame);
        runOnJS(store.validate)(data);
      }
    },
    [store.status],
  );

  React.useEffect(() => {
    store.requestPermission();
  }, [store]);

  React.useEffect(() => {
    if (store.hasPermission && camera.current) {
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
