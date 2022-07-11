import { observer } from 'mobx-react';
import React, { useCallback, useLayoutEffect } from 'react';
import { LayoutAnimation, View } from 'react-native';
import channelAvatarUrl from '~/common/helpers/channel-avatar-url';
import i18n from '~/common/services/i18n.service';
import { Avatar, B2 } from '~/common/ui';
import NavigationService from '~/navigation/NavigationService';
import ThemedStyles from '~/styles/ThemedStyles';
import { useMutualSubscribers } from './useMutualSubscribers';

interface MutualSubscribersProps {
  userGuid: string;
  navigation: any;
}

function MutualSubscribers({ userGuid }: MutualSubscribersProps) {
  const { result } = useMutualSubscribers(userGuid);
  const count = result?.count;
  const users = result?.users || [];
  const shouldRender = Boolean(count);

  // layout animations
  useLayoutEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    return () =>
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [shouldRender]);

  if (!count) {
    return <NobodyInCommon />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {users.map(user => {
          return <ChannelAvatar user={user} />;
        })}
      </View>

      <View style={styles.usernameContainer}>
        <Description users={users} total={count} />
      </View>
    </View>
  );
}

const NobodyInCommon = () => {
  // TODO
  return null;
};

const Description = ({ users, total }) => {
  const text =
    total > 3
      ? i18n.t('channel.mutualSubscribers.descriptionMany', {
          count: total - 3,
        })
      : i18n.t('channel.mutualSubscribers.description', {
          count: users.length,
        });

  return (
    <B2>
      {users
        .slice(0, 3)
        .map((user, index) => [
          index === 0 ? '' : ', ',
          <ChannelUsername user={user} />,
        ])}{' '}
      <B2 color="secondary">{text}</B2>
    </B2>
  );
};

const ChannelUsername = ({ user }) => {
  const onPress = useCallback(
    () =>
      NavigationService.push('App', {
        screen: 'Channel',
        params: {
          guid: user.guid,
          entity: user,
        },
      }),
    [user],
  );
  return <B2 onPress={onPress}>@{user.username}</B2>;
};

const ChannelAvatar = ({ user }) => {
  const onAvatarPress = useCallback(
    () =>
      NavigationService.push('App', {
        screen: 'Channel',
        params: {
          guid: user.guid,
          entity: user,
        },
      }),
    [user],
  );

  return (
    <View style={styles.avatar}>
      <Avatar
        onPress={onAvatarPress}
        source={{ uri: channelAvatarUrl(user) }}
        size="tiny"
      />
    </View>
  );
};

const styles = ThemedStyles.create({
  container: [
    'flexContainer',
    'rowJustifyStart',
    'alignCenter',
    'fullWidth',
    'marginTop4x', // TODO: move this out
  ],
  usernameContainer: ['flexContainer', 'rowJustifyStart', 'flexWrap'],
  avatarContainer: ['rowJustifyStart', 'paddingRight5x'],
  avatar: [
    'border4x',
    'bcolorPrimaryBorder',
    {
      marginRight: -15,
      borderRadius: 100,
      borderColor: ThemedStyles.getColor('PrimaryBackground'), // TODO: find a better solution
    },
  ],
});

export default observer(MutualSubscribers);
