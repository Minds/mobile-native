import { useWindowDimensions } from 'react-native';

/**
 * Returns true if device is on portrait or false otherwise
 */
export default function useIsPortrait() {
  const { width, height } = useWindowDimensions();
  return height > width;
}
