import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  inputBackground: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderColor: 'rgba(255,255,255,0.30)',
  },
  shadow: {
    backgroundColor: '#00000000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 6,
    overflow: 'visible',
    zIndex: 999,
  },
  lightButton: {
    borderColor: 'rgba(255,255,255,0.20)',
  },
});

export const shadowOpt = {
  width,
  height: 170,
  color: '#000',
  border: 20,
  opacity: 0.2,
  x: 0,
  y: 0,
};

export const icon = { top: Platform.OS === 'ios' ? 26 : 28 };
