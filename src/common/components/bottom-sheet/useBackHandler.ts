import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export default function useBackHandler(onBack, props) {
  const [opened, setOpened] = useState(false);

  /**
   * The back handler function
   */
  const backHandler = useCallback(() => {
    onBack();
    return true;
  }, [onBack]);

  /**
   * add and remove backhandler on focus and blur
   */
  useFocusEffect(
    useCallback(() => {
      // this is for when we're returning to a screen that already has the bottom sheet opened
      if (opened) {
        BackHandler.addEventListener('hardwareBackPress', backHandler);
      }

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backHandler);
    }, [backHandler, opened]),
  );

  /**
   * Monitor bottom sheet changes. We use this instead of onChange because onChange doesn't seem to work
   * When the bottomsheet opens add backhandler listener, and when it closes, remove them
   */
  const onAnimateHandler = useCallback(
    (fromIndex: number, toIndex: number) => {
      // bottom sheet opened
      if (toIndex >= 0) {
        setOpened(true);
        BackHandler.addEventListener('hardwareBackPress', backHandler);
      }
      // bottom sheet cosed
      if (toIndex < 0) {
        setOpened(false);
        BackHandler.removeEventListener('hardwareBackPress', backHandler);
      }

      props.onAnimate?.(fromIndex, toIndex);
    },
    [backHandler, props],
  );

  return {
    onAnimateHandler,
  };
}
