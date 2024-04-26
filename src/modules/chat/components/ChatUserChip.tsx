import { View } from 'react-native';
import React from 'react';
import type UserModel from '~/channel/UserModel';
import PressableScale from '~/common/components/PressableScale';
import { B3, Icon } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

type Props = {
  user: UserModel;
  onPress: () => void;
};

export default function ChatUserChip({ user, onPress }: Props) {
  return (
    <PressableScale onPress={onPress}>
      <View style={chipStyle}>
        <B3 right="XS" font="bold">
          {user.name || user.username}
        </B3>
        <Icon name="close" size={15} />
      </View>
    </PressableScale>
  );
}

const chipStyle = ThemedStyles.combine(
  'paddingHorizontal3x',
  'paddingVertical',
  'rowJustifySpaceBetween',
  'alignCenter',
  'borderRadius15x',
  'bgIconBackground',
);
