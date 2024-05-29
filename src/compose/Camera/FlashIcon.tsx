import React, { FC } from 'react';
import Icon from '@expo/vector-icons/Ionicons';
import MIcon from '@expo/vector-icons/MaterialCommunityIcons';

import type { CameraStore } from './createCameraStore';
import { observer } from 'mobx-react';
import PressableScale from '~/common/components/PressableScale';
type IconName = React.ComponentProps<typeof Icon>['name'];

type PropsType = {
  store: CameraStore;
  style: any;
};

const icons: { [key: string]: IconName } = {
  on: 'flash-outline',
  off: 'flash-off-outline',
  auto: 'flash-outline',
};

/**
 * Flash Icon
 */
const FlashIcon: FC<PropsType> = ({ store, style }: PropsType) => {
  // Toggle callback
  const onPress = React.useCallback(() => store.toggleFlash(), [store]);

  let flashIconName = icons[store.flashMode];

  const autoStyle = [style, { position: 'absolute', top: -3, left: 0 }];

  return (
    <PressableScale onPress={onPress}>
      <Icon name={flashIconName} size={30} style={style} />
      {store.flashMode === 'auto' && (
        <MIcon name="format-text-variant" size={12} style={autoStyle} />
      )}
    </PressableScale>
  );
};

export default observer(FlashIcon);
