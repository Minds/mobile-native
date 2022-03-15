import { View } from 'react-native';
import ThemedStyles, { useMemoStyle } from '../../../styles/ThemedStyles';
import React, { FC } from 'react';

interface HandleProps {
  showHandleBar?: boolean;
  style?: any;
}

const Handle: FC<HandleProps> = ({ children, showHandleBar = true, style }) => (
  <View
    renderToHardwareTextureAndroid={true}
    style={useMemoStyle(
      [children ? styles.containerWithChildren : styles.container, style],
      [style],
    )}>
    {showHandleBar && (
      <View style={ThemedStyles.style.alignCenter}>
        <View style={styles.handleBar} />
      </View>
    )}

    {children}
  </View>
);

export default Handle;

const styles = ThemedStyles.create({
  container: [
    {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
    },
    'paddingVertical3x',
    'bgPrimaryBackgroundHighlight',
  ],
  get containerWithChildren() {
    return [
      ...this.container,
      'borderBottomHair',
      'bcolorPrimaryBorder',
      'bgPrimaryBackground',
    ];
  },
  handleBar: [
    {
      width: '20%',
      height: 5,
      borderRadius: 10,
    },
    'bgTertiaryBackground',
  ],
});
