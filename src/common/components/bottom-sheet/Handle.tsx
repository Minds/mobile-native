import React from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import ThemedStyles from '../../../styles/ThemedStyles';

interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
}

const Handle: React.FC<HandleProps> = () => {
  // render
  return <View style={style} />;
};

export default Handle;

const style = ThemedStyles.combine('bgPrimaryBackgroundHighlight', {
  alignContent: 'center',
  justifyContent: 'center',
  height: 24,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
});
