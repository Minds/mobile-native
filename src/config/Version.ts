import DeviceInfo from 'react-native-device-info';

export const Version = {
  VERSION: process.env.APP_VERSION || DeviceInfo.getVersion(),
  BUILD: DeviceInfo.getBuildNumber(),
};
