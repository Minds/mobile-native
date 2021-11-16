import React, { FC } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { CameraStore } from './createCameraStore';
import { observer } from 'mobx-react';
import { View } from 'react-native';

type PropsType = {
  store: CameraStore;
  style: any;
};

const icons = {
  on: 'md-flash-outline',
  off: 'md-flash-off-outline',
  auto: 'md-flash-outline',
};

/**
 * Flash Icon
 */
const FlashIcon: FC<PropsType> = ({ store, style }: PropsType) => {
  // Toggle callback
  const onPress = React.useCallback(() => store.toggleFlash(), [store]);

  let flashIconName = icons[store.flashMode] || '';

  const autoStyle = [style, { position: 'absolute' }];

  return (
    <View>
      <Icon name={flashIconName} size={30} style={style} onPress={onPress} />
      {store.flashMode === 'auto' && (
        <MIcon
          name="format-text-variant"
          size={12}
          style={autoStyle}
          onPress={onPress}
        />
      )}
    </View>
  );
};

export default observer(FlashIcon);
