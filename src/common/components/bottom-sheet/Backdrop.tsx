import React, { FunctionComponent } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const OPEN_ANIMATION_DURATION = 300;

// fixes flickering https://github.com/gorhom/react-native-bottom-sheet/issues/436
const Backdrop: FunctionComponent<BottomSheetBackdropProps> = ({
  animatedIndex,
  ...rest
}) => {
  const adjustedAnimatedIndex = useSharedValue(0);
  const hasOpened = useSharedValue(false);

  useAnimatedReaction(
    () => animatedIndex.value,
    (data, prev) => {
      if (prev == null) {
        adjustedAnimatedIndex.value = withTiming(
          1,
          { duration: OPEN_ANIMATION_DURATION },
          isFinished => {
            if (isFinished) hasOpened.value = true;
          },
        );
      }

      if (hasOpened.value) adjustedAnimatedIndex.value = data;
    },
  );

  return (
    <BottomSheetBackdrop animatedIndex={adjustedAnimatedIndex} {...rest} />
  );
};

export default Backdrop;
