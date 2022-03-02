import { useNavigation } from '@react-navigation/core';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { BottomSheet } from '~/common/components/bottom-sheet';
import ThemedStyles from '~/styles/ThemedStyles';
import PosterStackNavigator from './PosterStackNavigator';

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

  const handleVisibilityChange = useCallback(
    visible => {
      if (!visible) {
        navigation.navigate('PosterOptions');
      }
    },
    [navigation],
  );

  return (
    <BottomSheet
      // @ts-ignore
      ref={sheetRef}
      handleStyle={ThemedStyles.style.bgPrimaryBackground}
      onVisibilityChange={handleVisibilityChange}
      enableContentPanningGesture
      snapPoints={SNAP_POINTS}>
      <PosterStackNavigator />
    </BottomSheet>
  );
});
