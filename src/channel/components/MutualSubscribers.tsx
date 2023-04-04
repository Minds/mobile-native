import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import AnimatedHeight from '~/common/components/animations/AnimatedHeight';
import channelAvatarUrl from '~/common/helpers/channel-avatar-url';
import i18n from '~/common/services/i18n.service';
import { Avatar, B2, Spacer } from '~/common/ui';
import type { SpacerPropType } from '~/common/ui/layout';
import NavigationService from '~/navigation/NavigationService';
import ThemedStyles from '~/styles/ThemedStyles';
import { useMutualSubscribers } from './useMutualSubscribers';

type MutualSubscribersProps = {
  userGuid: string;
  // the number of users to show separately
  limit?: number;
  navigation: any;
  onPress?: () => void;
} & SpacerPropType;

function MutualSubscribers({
  userGuid,
  limit = 3,
  onPress,
  ...props
}: MutualSubscribersProps) {
  const { result } = useMutualSubscribers(userGuid);
  const count = result?.count;
  const users = result?.users || [];

  if (!count) {
    return <NobodyInCommon />;
  }

  return (
    <AnimatedHeight>
      <Spacer {...props} containerStyle={styles.container}>
        <View style={styles.avatarContainer}>
          {users.slice(0, limit).map((user, index) => {
            return <ChannelAvatar key={index} user={user} />;
          })}
        </View>

        <View style={styles.usernameContainer}>
          <Description
            onPress={onPress}
            limit={limit}
            users={users}
            total={count}
          />
        </View>
      </Spacer>
    </AnimatedHeight>
  );
}

const NobodyInCommon = () => {
  // TODO
  return null;
};

const Description = ({ users, total, limit, onPress }) => {
  const text =
    total > limit
      ? i18n.t('channel.mutualSubscribers.descriptionMany', {
          count: total - limit,
        })
      : i18n.t('channel.mutualSubscribers.description', {
          count: total,
        });

  return (
    <B2 onPress={onPress}>
      {users.map((user, index) => {
        let prefix = ', ';
        if (index === 0) {
          prefix = '';
        } else if (index === users.length - 1) {
          if (total < limit) {
            prefix = ` ${i18n.t('and')} `;
          } else if (total === limit) {
            prefix = `, ${i18n.t('and')} `;
          }
        }

        return (
          <React.Fragment key={index}>
            {prefix}
            <ChannelUsername user={user} />
          </React.Fragment>
        );
      })}{' '}
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
        border="primary"
      />
    </View>
  );
};

const styles = ThemedStyles.create({
  container: ['flexContainer', 'rowJustifyStart', 'alignCenter', 'fullWidth'],
  usernameContainer: ['flexContainer', 'rowJustifyStart', 'flexWrap'],
  avatarContainer: ['rowJustifyStart', 'paddingRight5x'],
  avatar: [
    {
      marginRight: -15,
      borderRadius: 100,
      borderColor: ThemedStyles.getColor('PrimaryBackground'), // TODO: find a better solution
    },
  ],
});

export default observer(MutualSubscribers);
