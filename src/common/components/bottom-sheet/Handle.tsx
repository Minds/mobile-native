import { View } from 'react-native';
import React, { FC, PropsWithChildren } from 'react';
import sp from '~/services/serviceProvider';
import { useMemoStyle } from '~/styles/hooks';

interface HandleProps {
  showHandleBar?: boolean;
  style?: any;
}

const Handle: FC<PropsWithChildren<HandleProps>> = ({
  children,
  showHandleBar = true,
  style,
}) => (
  <View
    renderToHardwareTextureAndroid={true}
    style={useMemoStyle(
      [children ? styles.containerWithChildren : styles.container, style],
      [style],
    )}>
    {showHandleBar && (
      <View style={sp.styles.style.alignCenter}>
        <View style={styles.handleBar} />
      </View>
    )}

    {children}
  </View>
);

export default Handle;

const styles = sp.styles.create({
  container: [
    {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
    },
    'paddingVertical3x',
    'bgPrimaryBackgroundHighlight',
  ],
  containerWithChildren: [
    {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
    },
    'paddingVertical3x',
    'borderBottomHair',
    'bcolorPrimaryBorder',
    'bgPrimaryBackgroundHighlight',
  ],
  handleBar: [
    {
      width: '20%',
      height: 5,
      borderRadius: 10,
    },
    'bgPrimaryBackgroundHighlight',
  ],
});
