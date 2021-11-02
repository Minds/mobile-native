import React, { forwardRef, useCallback } from 'react';
import {
  BottomSheetModal,
  BottomSheetModalProps,
  useBottomSheetDynamicSnapPoints,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { StatusBar, View } from 'react-native';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Handle from './Handle';
import useBackHandler from './useBackHandler';
import { H3, B1 } from '~ui';

interface PropsType extends Omit<BottomSheetModalProps, 'snapPoints'> {
  title?: string;
  subtitle?: string;
  detail?: string;
  autoShow?: boolean;
  snapPoints?: Array<number | string>;
  forceHeight?: number;
}

const MBottomSheetModal = forwardRef<BottomSheetModal, PropsType>(
  (props, ref) => {
    const { title, detail, snapPoints, autoShow, children, ...other } = props;
    const { onAnimateHandler } = useBackHandler(
      // @ts-ignore
      useCallback(() => {
        console.log('CALLING CLOSE');

        ref?.current?.close();
      }, [ref]),
      props,
    );

    const insets = useSafeAreaInsets();

    const snapPointsMemo = React.useMemo(
      () => snapPoints || ['CONTENT_HEIGHT'],
      [snapPoints],
    );

    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(snapPointsMemo);

    const contStyle = useStyle(styles.contentContainer, {
      paddingBottom: insets.bottom || 24,
    });

    React.useEffect(() => {
      //@ts-ignore
      if (ref && ref.current && autoShow) {
        //@ts-ignore
        console.log('PRESENT');

        ref.current.present();
      }
    }, [autoShow, ref]);

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
      <BottomSheetModal
        ref={ref}
        topInset={StatusBar.currentHeight || 0}
        handleComponent={renderHandle}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        backgroundComponent={null}
        style={styles.sheetContainer as any}
        {...other}
        onAnimate={onAnimateHandler}>
        <View style={contStyle} onLayout={handleContentLayout}>
          {Boolean(title) && (
            <H3 vertical="M" align="center">
              {title}
            </H3>
          )}
          {Boolean(detail) && (
            <B1
              horizontal="L"
              bottom="M"
              align="center"
              color="secondary"
              font="medium">
              {detail}
            </B1>
          )}
          {children}
        </View>
      </BottomSheetModal>
    );
  },
);

const styles = ThemedStyles.create({
  contentContainer: ['bgPrimaryBackgroundHighlight'],
  title: ['fontXXL', 'bold', 'textCenter', 'marginVertical3x'],
  detail: [
    'fontL',
    'fontMedium',
    'textCenter',
    'marginTop3x',
    'marginBottom5x',
    'colorSecondaryText',
  ],
  sheetContainer: [
    'shadowBlack',
    {
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 0.58,
      shadowRadius: 4.0,
      elevation: 16,
    },
  ],
});

export default MBottomSheetModal;
