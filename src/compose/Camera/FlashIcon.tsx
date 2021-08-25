import React, { FC } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles } from './styles';
import type { CameraStore } from './createCameraStore';
import { observer } from 'mobx-react';
import { View } from 'react-native';

type PropsType = {
  store: CameraStore;
};

const autoStyle = [styles.icon, styles.autoIcon];

const icons = {
  on: 'md-flash-outline',
  off: 'md-flash-off-outline',
  auto: 'md-flash-outline',
};

/**
 * Flash Icon
 */
const FlashIcon: FC<PropsType> = ({ store }: PropsType) => {
  // Toggle callback
  const onPress = React.useCallback(() => store.toggleFlash(), [store]);

  let flashIconName = icons[store.flashMode] || '';

  return (
    <View>
      <Icon
        name={flashIconName}
        size={30}
        style={styles.icon}
        onPress={onPress}
      />
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
