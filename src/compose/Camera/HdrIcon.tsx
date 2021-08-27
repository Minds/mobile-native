import React, { FC } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { CameraStore } from './createCameraStore';
import { observer } from 'mobx-react';

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
    <Icon
      name={store.hdr ? 'hdr' : 'hdr-off'}
      size={30}
      style={style}
      onPress={onPress}
    />
  );
};

export default observer(HdrIcon);
