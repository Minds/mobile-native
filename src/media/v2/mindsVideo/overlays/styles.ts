import { StyleSheet } from 'react-native';
import Colors from '../../../../styles/Colors';

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
  overlayContainerTransparent: {
    backgroundColor: 'transparent',
  },
  errorText: {
    color: Colors.darkGreyed,
  },
  videoIcon: {
    position: 'relative',
    alignSelf: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  controlSettingsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 8,
    paddingRight: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(48,48,48,0.7)',
  },
  controlBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'stretch',
    margin: 8,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 3,
    backgroundColor: 'rgba(48,48,48,0.7)',
  },
});
