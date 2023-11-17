import React, { FC } from 'react';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import type { CameraStore } from './createCameraStore';
import { observer } from 'mobx-react';
import PressableScale from '~/common/components/PressableScale';

type PropsType = {
  store: CameraStore;
  style: any;
};

/**
 * Camera switch Icon
 */
const HdrIcon: FC<PropsType> = ({ store, style }: PropsType) => {
  // Toggle callback
  const onPress = React.useCallback(() => store.toggleHdr(), [store]);

  return (
    <PressableScale onPress={onPress}>
      <Icon
        name={store.hdr ? 'hdr' : 'hdr-off'}
        size={30}
        style={style}
        onPress={onPress}
      />
    </PressableScale>
  );
};

export default observer(HdrIcon);
