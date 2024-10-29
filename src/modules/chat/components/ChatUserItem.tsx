import React from 'react';
import { Avatar, B2, B3, IconCircled, Row } from '~/common/ui';
import MPressable from '~/common/components/MPressable';
import { StyleSheet, View } from 'react-native';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import UserModel from '~/channel/UserModel';

import { ChatMember } from '../types';
import sp from '~/services/serviceProvider';

type Props = {
  user: UserModel | ChatMember;
  selected?: boolean;
  privateChat?: boolean;
  onPress: () => void;
  extra?: React.ReactNode;
};

export function ChatUserItem({ user, onPress, selected, extra }: Props) {
  const userData =
    user instanceof UserModel
      ? {
          name: user.name,
          username: user.username,
          iconUrl: user.getAvatarSource().uri,
          id: user.guid,
        }
      : {
          name: user.node.name,
          username: user.node.username,
          iconUrl: user.node.iconUrl,
          id: user.node.guid,
        };

  return (
    <MPressable onPress={onPress} testID="chatUserItem">
      <Row horizontal="XL" vertical="M" align="centerStart">
        {selected ? (
          <IconCircled
            testID="checkIcon"
            name="check"
            color="PrimaryBackground"
            size={20}
            backgroundColor={sp.styles.getColor('IconActive')}
          />
        ) : (
          <Avatar size="small" source={userData.iconUrl} testID="UserAvatar" />
        )}
        <View style={styles.column}>
          <B2 font="medium">{userData.name || userData.username}</B2>
          <B3
            color="secondary"
            top="S"
            numberOfLines={1}
            style={styles.message}>
            @{userData.username}
          </B3>
        </View>
        {extra}
      </Row>
    </MPressable>
  );
}

export default withErrorBoundary(ChatUserItem, 'ChatUserItem');

const styles = StyleSheet.create({
  message: {
    flex: 1,
  },
  column: {
    paddingLeft: 20,
    flex: 1,
    flexDirection: 'column',
  },
  avatar1: {
    zIndex: 1000,
    position: 'absolute',
    top: -10,
    left: 0,
  },
});
