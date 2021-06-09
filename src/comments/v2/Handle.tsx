import React from 'react';
import { StyleProp, StyleSheet, ViewStyle, View } from 'react-native';
import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import ThemedStyles from '../../styles/ThemedStyles';

interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
}

const Handle: React.FC<HandleProps> = ({ style }) => {
  const theme = ThemedStyles.style;
  // render
  return <View style={[styles.header, style, theme.backgroundPrimary]} />;
};

export default Handle;

const styles = StyleSheet.create({
  header: {
    alignContent: 'center',
    justifyContent: 'center',
    height: 17,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
