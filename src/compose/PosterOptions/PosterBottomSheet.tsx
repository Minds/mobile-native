import { useNavigation } from '@react-navigation/core';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { BottomSheet } from '~/common/components/bottom-sheet';

import PosterStackNavigator from './PosterStackNavigator';
import sp from '~/services/serviceProvider';
const SNAP_POINTS = ['90%'];

/**
 * Options
 * @param {Object} props
 */
export default forwardRef((props: any, ref) => {
  const sheetRef = useRef<any>();
  const navigation = useNavigation();

  useImperativeHandle(ref, () => ({
    show: () => {
      sheetRef.current.expand();
    },
    navigateTo: screen => {
      sheetRef.current.expand();
      navigation.navigate(screen);
    },
  }));

  /**
   * Handle bottom sheet change
   * Attention: We were using onVisibilityChange but it was not working as expected (it was triggered with false when the keyboard was open)
   */
  const handleChange = useCallback(
    state => {
      if (state === -1) {
        navigation.navigate('PosterOptions');
      }
    },
    [navigation],
  );

  return (
    <BottomSheet
      // @ts-ignore
      ref={sheetRef}
      keyboardBlurBehavior="none"
      handleStyle={sp.styles.style.bgPrimaryBackground}
      onChange={handleChange}
      enableContentPanningGesture
      keyboardBehavior="interactive"
      snapPoints={SNAP_POINTS}>
      <PosterStackNavigator />
    </BottomSheet>
  );
});
