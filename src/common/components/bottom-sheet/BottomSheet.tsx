import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { Dimensions, StatusBar } from 'react-native';
import Handle from './Handle';
import useBackHandler from './useBackHandler';

const { height: windowHeight } = Dimensions.get('window');
const DEFAULT_SNAP_POINTS = [Math.floor(windowHeight * 0.8)];

interface PropsType extends Omit<BottomSheetProps, 'snapPoints'> {
  snapPoints?: Array<number | string>;
}

/**
 * @description The bottom sheet component with a default behavior (snapPoints, backHandler, handle, etc.)
 */
const MBottomSheet = forwardRef<BottomSheet, PropsType>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const { onAnimateHandler } = useBackHandler(
    useCallback(() => bottomSheetRef.current?.close(), [bottomSheetRef]),
    props,
  );

  /**
   * we proxy these methods so we can use the bottom sheet ref internally and externally
   */
  useImperativeHandle(
    ref,
    () => ({
      close: (config?: any) => bottomSheetRef.current?.close(config),
      expand: (config?: any) => bottomSheetRef.current?.expand(config),
      snapToIndex: (index: number, config?: any) =>
        bottomSheetRef.current?.snapToIndex(index, config),
      collapse: (config?: any) => bottomSheetRef.current?.collapse(config),
      forceClose: (config?: any) => bottomSheetRef.current?.forceClose(config),
      snapToPosition: (position: any, config: any) =>
        bottomSheetRef.current?.snapToPosition(position, config),
    }),
    [bottomSheetRef],
  );

  const renderHandle = useCallback(() => <Handle />, []);

  const renderBackdrop = useCallback(
    backdropProps => (
      <BottomSheetBackdrop
        {...backdropProps}
        pressBehavior="close"
        opacity={0.5}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      containerHeight={windowHeight}
      snapPoints={DEFAULT_SNAP_POINTS}
      topInset={StatusBar.currentHeight || 0}
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      backgroundComponent={null}
      {...props}
      onAnimate={onAnimateHandler}
    />
  );
});

export default MBottomSheet;
