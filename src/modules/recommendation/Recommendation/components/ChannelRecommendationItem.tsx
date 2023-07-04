import { useNavigation } from '@react-navigation/core';
import React, { FC, useCallback } from 'react';
import UserModel from '~/channel/UserModel';
import Subscribe from '~/channel/v2/buttons/Subscribe';
import MPressable from '~/common/components/MPressable';
import i18n from '~/common/services/i18n.service';
import { Avatar, B1, B2, Column, Icon, Row } from '~/common/ui';

interface ChannelRecommendationItemProps {
  channel: UserModel;
  onSubscribed?: (user: UserModel) => void;
  disableNavigation?: boolean;
}

const ChannelRecommendationItem: FC<ChannelRecommendationItemProps> = ({
  channel,
  onSubscribed,
  disableNavigation,
}) => {
  const avatar = channel.getAvatarSource?.('medium') ?? {};
  const navigation = useNavigation<any>();
  const onPress = useCallback(
    () =>
      !disableNavigation &&
      navigation.push('Channel', {
        guid: channel.guid,
        entity: channel,
      }),
    [navigation, channel, disableNavigation],
  );

  const description = channel.briefdescription?.trim?.() ?? '';

  return (
    <MPressable onPress={onPress}>
      <Row vertical="S" horizontal="L">
        <Avatar size="tiny" right="M" top="XS" source={avatar} />
        <Column flex align="centerStart" right="L">
          <B1 font="bold">{channel.name}</B1>
          {Boolean(description) && (
            <B2 numberOfLines={2} color="secondary">
              {description}
            </B2>
          )}
          {!!channel.boosted && <BoostedChannelLabel />}
        </Column>
        <Subscribe
          mini
          shouldUpdateFeed={false}
          channel={channel}
          onSubscribed={onSubscribed}
        />
      </Row>
    </MPressable>
  );
};

const BoostedChannelLabel = () => (
  <Row top="XS" align="centerStart">
    <Icon name="boost" size="tiny" right="XS" color="Link" />
    <B2 color="link">{i18n.t('boosts.boostedChannel')}</B2>
  </Row>
);

export default ChannelRecommendationItem;
