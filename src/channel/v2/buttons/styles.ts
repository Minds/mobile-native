import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    padding: Platform.select({ ios: 8, android: 6 }),
    marginLeft: 5,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
  },
});
