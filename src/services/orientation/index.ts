import * as ScreenOrientation from 'expo-screen-orientation';

export const Orientation = {
  lockPortrait() {
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
