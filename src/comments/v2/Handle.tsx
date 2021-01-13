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
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
