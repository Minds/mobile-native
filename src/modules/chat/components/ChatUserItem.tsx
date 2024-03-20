import React from 'react';
import { Avatar, B2, B3, IconCircled, Row } from '~/common/ui';
import MPressable from '~/common/components/MPressable';
import { StyleSheet, View } from 'react-native';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import type UserModel from '~/channel/UserModel';
import ThemedStyles from '~/styles/ThemedStyles';

type Props = {
  user: UserModel;
  selected?: boolean;
  privateChat?: boolean;
  onPress: () => void;
};

function ChatUserItem({ user, onPress, selected }: Props) {
  return (
    <MPressable onPress={onPress} testID="chatUserItem">
      <Row horizontal="XL" vertical="M" align="centerStart">
        {selected ? (
          <IconCircled
            testID="checkIcon"
            name="check"
            color="PrimaryBackground"
            size={20}
            backgroundColor={ThemedStyles.getColor('IconActive')}
          />
        ) : (
          <Avatar
            size="small"
            source={user.getAvatarSource()}
            testID="UserAvatar"
          />
        )}
        <View style={styles.column}>
          <B2 font="medium">{user.name}</B2>
          <B3
            color="secondary"
            top="S"
            numberOfLines={1}
            style={styles.message}>
            @{user.username}
          </B3>
        </View>
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
