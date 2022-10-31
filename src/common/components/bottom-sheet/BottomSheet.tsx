import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
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

export interface PropsType extends Omit<BottomSheetProps, 'snapPoints'> {
  snapPoints?: Array<number | string>;
  onVisibilityChange?: (visible: boolean) => void;
}

export const renderBackdrop = backdropProps => (
  <BottomSheetBackdrop
    {...backdropProps}
    pressBehavior="close"
    opacity={0.5}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
  />
);

/**
 * The bottom sheet component with a default behavior (snapPoints, backHandler, handle, etc.)
 */
const MBottomSheet = forwardRef<BottomSheet, PropsType>((props, ref) => {
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const { onAnimateHandler } = useBackHandler(
    useCallback(() => bottomSheetRef.current?.close(), [bottomSheetRef]),
    props,
  );

  const renderHandle = useCallback(
    handleProps => <Handle {...handleProps} />,
    [],
  );

  useImperativeHandle(ref, () => bottomSheetRef.current!, [bottomSheetRef]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      containerHeight={windowHeight}
      topInset={StatusBar.currentHeight || 0}
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      backgroundComponent={null}
      {...props}
      snapPoints={props.snapPoints || DEFAULT_SNAP_POINTS}
      onAnimate={onAnimateHandler}
    />
  );
});

export default MBottomSheet;
