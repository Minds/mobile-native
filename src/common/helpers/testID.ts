import { Platform } from 'react-native';

export default function (name) {
  if (Platform.OS === 'ios') {
    return { testID: name };
  } else {
    return { accessibilityLabel: name };
  }
}
