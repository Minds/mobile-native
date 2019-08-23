import DeviceInfo from 'react-native-device-info';

export const Version = {
  VERSION: DeviceInfo.getVersion(),
  BUILD: DeviceInfo.getBuildNumber()
};
