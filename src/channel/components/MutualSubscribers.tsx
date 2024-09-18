import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import AnimatedHeight from '~/common/components/animations/AnimatedHeight';
import channelAvatarUrl from '~/common/helpers/channel-avatar-url';
import { Avatar, IconNext, Spacer } from '~/common/ui';
import type { SpacerPropType } from '~/common/ui/layout';

import { useMutualSubscribers } from './useMutualSubscribers';
import UserModel from '../UserModel';
import {
  Typography,
  TypographyType,
} from '../../common/ui/typography/Typography';
import sp from '~/services/serviceProvider';

type MutualSubscribersProps = {
  channel: UserModel;
  // the number of users to show separately
  limit?: number;
  navigation: any;
  onPress?: () => void;
  // whether avatars should render
  avatars?: boolean;
  language?: 'subscribe' | 'follow';
  font?: TypographyType;
} & SpacerPropType;

function MutualSubscribers({
  channel,
  limit = 3,
  onPress,
  avatars = true,
  language = 'subscribe',
  font = 'B2',
  ...props
}: MutualSubscribersProps) {
  const { result } = useMutualSubscribers(channel.guid);
  const count = result?.count;
  const users = result?.users.slice(0, limit) || [];
  if (!count) {
    return <NobodyInCommon />;
  }

  return (
    <AnimatedHeight>
      <Spacer {...props} containerStyle={styles.container}>
        {avatars ? (
          <View style={styles.avatarContainer}>
            {users.map(user => {
              return <ChannelAvatar key={user.guid} user={user} />;
            })}
          </View>
        ) : (
          <IconNext
            name="group"
            color="Link"
            left="XL"
            right="XS"
            size="tiny"
          />
        )}

        <View style={styles.usernameContainer}>
          <Description
            onPress={onPress}
            limit={limit}
            users={users}
            total={count}
            user={language === 'follow' ? channel.name : undefined}
            fontType={font}
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

const Description = ({ fontType, users, total, limit, onPress, user }) => {
  const i18n = sp.i18n;
  const text =
    total > limit
      ? i18n.t(
          user
            ? 'channel.mutualSubscribers.followMany'
            : 'channel.mutualSubscribers.descriptionMany',
          {
            count: total - limit,
            user,
          },
        )
      : i18n.t(
          user
            ? 'channel.mutualSubscribers.follow'
            : 'channel.mutualSubscribers.description',
          {
            count: total,
            user,
          },
        );

  return (
    <Typography type={fontType} onPress={onPress}>
      {users.map((_user, index) => {
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
            <ChannelUsername fontType={fontType} user={_user} />
          </React.Fragment>
        );
      })}{' '}
      <Typography type={fontType} color="secondary">
        {text}
      </Typography>
    </Typography>
  );
};

const ChannelUsername = ({ user, fontType }) => {
  const onPress = useCallback(
    () =>
      sp.navigation.push('App', {
        screen: 'Channel',
        params: {
          guid: user.guid,
          entity: user,
        },
      }),
    [user],
  );
  return (
    <Typography type={fontType} onPress={onPress}>
      @{user.username}
    </Typography>
  );
};

const ChannelAvatar = ({ user }) => {
  const onAvatarPress = useCallback(
    () =>
      sp.navigation.push('App', {
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

const styles = sp.styles.create({
  container: [
    'flexContainer',
    'rowJustifyStart',
    'alignCenter',
    'fullWidth',
    'borderBottomHair',
    'bcolorSeparator',
  ],
  usernameContainer: ['flexContainer', 'rowJustifyStart', 'flexWrap'],
  avatarContainer: ['rowJustifyStart', 'paddingRight5x'],
  avatar: [
    {
      marginRight: -15,
      borderRadius: 100,
      borderColor: sp.styles.getColor('PrimaryBackground'), // TODO: find a better solution
    },
  ],
});

export default observer(MutualSubscribers);
