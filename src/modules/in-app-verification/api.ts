import apiService from '~/common/services/api.service';
import { IS_IOS } from '~/config/Config';

export const api = {
  requestCode(deviceId: string, deviceToken: string) {
    return apiService.post(`/api/v3/verification/${deviceId}`, {
      device_type: IS_IOS ? 'ios' : 'android',
      device_token: deviceToken,
    });
  },
  submitVerification(
    deviceId: string,
    image: any,
    video: any,
    sensorData: string,
    location: string,
  ) {
    return apiService.upload(
      `api/v3/verification/${deviceId}/verify`,
      { image, video },
      {
        sensor_data: sensorData,
        device_type: IS_IOS ? 'ios' : 'android',
        geo: location,
      },
    );
  },
};
