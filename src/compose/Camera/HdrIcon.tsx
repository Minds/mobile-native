import React, { FC } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles } from './styles';
import type { CameraStore } from './createCameraStore';
import { observer } from 'mobx-react';

type PropsType = {
  store: CameraStore;
};

/**
 * Camera switch Icon
 */
const HdrIcon: FC<PropsType> = ({ store }: PropsType) => {
  // Toggle callback
  const onPress = React.useCallback(() => store.toggleHdr(), [store]);

  return (
    <Icon
      name={store.hdr ? 'hdr' : 'hdr-off'}
      size={30}
      style={styles.icon}
      onPress={onPress}
    />
  );
};

export default observer(HdrIcon);
