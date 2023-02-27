import { Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export const Orientation = {
  lockPortrait() {
    if (Platform.OS === 'ios') return;
    return ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT,
    );
  },
  lockLandscape() {
    return ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    );
  },
  unlock() {
    return ScreenOrientation.unlockAsync();
  },
};
