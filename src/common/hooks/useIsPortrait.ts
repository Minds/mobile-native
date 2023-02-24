import React from 'react';
import { Dimensions } from 'react-native';

/**
 * Returns true if device is on portrait or false otherwise
 */
export default function useIsPortrait() {
  const [orientation, setOrientation] = React.useState(
    Dimensions.get('window').height > Dimensions.get('window').width,
  );

  React.useEffect(() => {
    const subscription = ({ window }) => {
      setOrientation(window.height > window.width);
    };
    const dimensionsListener = Dimensions.addEventListener(
      'change',
      subscription,
    );
    return () => dimensionsListener.remove();
  });

  return orientation;
}
