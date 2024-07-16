import React from 'react';
import { View } from 'react-native';
import PressableScale from '~/common/components/PressableScale';

import { AVATAR_SIZE, UNIT } from '~styles/Tokens';
import { Avatar } from './Avatar';
import sp from '~/services/serviceProvider';

export const AvatarCircled = ({ active, onPress, ...more }: any) => {
  const avatar = (
    <View style={active ? styles.active : styles.container}>
      <Avatar {...more} />
    </View>
  );

  if (onPress) {
    return <PressableScale onPress={onPress}>{avatar}</PressableScale>;
  }

  return avatar;
};

const styles = sp.styles.create({
  container: {
    borderRadius: AVATAR_SIZE.large,
    borderWidth: UNIT.XXS,
    borderColor: 'transparent',
  },
  wrapper: {
    borderRadius: AVATAR_SIZE.large,
    borderWidth: UNIT.XXS,
    borderColor: 'transparent',
  },
  active: [
    { borderRadius: AVATAR_SIZE.large, borderWidth: UNIT.XXS },
    'bcolorAvatarActive',
  ],
  circled: ['bcolorAvatarCircled'],
});
