import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import React, {
  forwardRef,
  useCallback,
  useRef,
  useImperativeHandle,
  useState,
} from 'react';
import { BackHandler, Dimensions, StatusBar } from 'react-native';
import Handle from './Handle';

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
  const [opened, setOpened] = useState(false);

  const backHandler = useCallback(() => {
    if (opened) {
      bottomSheetRef?.current?.close?.();
      return true;
    }
    return false;
  }, [opened]);

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backHandler);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backHandler);
    }, [backHandler]),
  );

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

  /**
   * Monitor bottom sheet changes
   */
  const onAnimateHandler = useCallback(
    (fromIndex: number, toIndex: number) => {
      // bottom sheet opened
      if (fromIndex < 0) {
        setOpened(true);
        BackHandler.addEventListener('hardwareBackPress', backHandler);
      }
      // bottom sheet cosed
      if (toIndex < 0) {
        setOpened(false);
        BackHandler.removeEventListener('hardwareBackPress', backHandler);
      }
    },
    [backHandler],
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
      backgroundComponent={null}
      onAnimate={onAnimateHandler}
      {...props}
    />
  );
});

export default MBottomSheet;
