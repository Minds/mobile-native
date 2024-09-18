import { Dimensions } from 'react-native';

export default function (percentage) {
  const { width: viewportWidth, height: viewportHeight } =
    Dimensions.get('window');
  const value = (percentage * viewportWidth) / 100;
  return { value: value, viewportWidth, viewportHeight };
}
