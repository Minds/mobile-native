import React, { forwardRef, useCallback, useMemo } from 'react';
import { BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import { StatusBar, Text, View } from 'react-native';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Backdrop from './Backdrop';
import Handle from './Handle';

interface PropsType extends Omit<BottomSheetModalProps, 'snapPoints'> {
  title?: string;
  subtitle?: string;
  detail?: string;
  autoShow?: boolean;
  snapPoints?: Array<number | string>;
}

export default forwardRef<BottomSheetModal, PropsType>((props, ref) => {
  const { title, detail, snapPoints, autoShow, children, ...other } = props;

  const [contentHeight, setContentHeight] = React.useState(0);

  const insets = useSafeAreaInsets();

  const contStyle = useStyle(styles.contentContainer, {
    paddingBottom: insets.bottom || 24,
  });

  React.useEffect(() => {
    //@ts-ignore
    if (ref && ref.current && autoShow) {
      //@ts-ignore
      ref.current.present();
    }
  }, [autoShow, ref]);

  const snapPointsMemo = React.useMemo(() => snapPoints || [contentHeight], [
    contentHeight,
    snapPoints,
  ]);

  const handleOnLayout = React.useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }) => {
      height && setContentHeight(height);
    },
    [],
  );

  // renders
  const renderBackdrop = React.useCallback(
    props => <Backdrop {...props} pressBehavior="close" />,
    [],
  );

  const renderHandle = useCallback(() => <Handle />, []);

  return (
    <BottomSheetModal
      ref={ref}
      topInset={StatusBar.currentHeight || 0}
      handleComponent={renderHandle}
      snapPoints={snapPointsMemo}
      backgroundComponent={null}
      backdropComponent={renderBackdrop}
      style={styles.sheetContainer as any}
      {...other}>
      <View style={contStyle} onLayout={handleOnLayout}>
        {Boolean(title) && <Text style={styles.title}>{title}</Text>}
        {Boolean(detail) && <Text style={styles.detail}>{detail}</Text>}
        {children}
      </View>
    </BottomSheetModal>
  );
});

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
