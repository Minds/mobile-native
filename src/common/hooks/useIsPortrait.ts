import { useDimensions } from '@react-native-community/hooks';

/**
 * Returns true if device is on portrait or false otherwise
 */
export default function useIsPortrait() {
  const { width, height } = useDimensions().window;
  return height > width;
}
