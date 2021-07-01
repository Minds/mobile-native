import { Platform, StyleSheet } from 'react-native';

export const iconSize = Platform.select({ ios: 30, android: 26 });
export const iconResSize = Platform.select({ ios: 28, android: 24 });
export const playSize = Platform.select({ ios: 58, android: 48 })!;

export const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingVolume: {
    opacity: 0.8,
  },
  overlayContainerTransparent: {
    backgroundColor: 'transparent',
  },
  videoIcon: {
    paddingLeft: 3,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  controlSettingsContainer: {
    position: 'absolute',
    top: 10,
    right: 0,
    margin: 8,
    paddingRight: 5,
  },
  controlBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: 'rgba(48,48,48,0.7)',
  },
  playContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: playSize,
    height: playSize,
    borderRadius: playSize / 2,
  },
});
