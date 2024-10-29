import { useNavigation } from '@react-navigation/core';
import React, { FC, useCallback } from 'react';
import * as entities from 'entities';

import UserModel from '~/channel/UserModel';
import Subscribe from '~/channel/v2/buttons/Subscribe';
import MenuItem from '~/common/components/menus/MenuItem';
import { B2, Icon, Row } from '~/common/ui';
import sp from '~/services/serviceProvider';

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
  const avatar =
    channel && channel.getAvatarSource
      ? channel.getAvatarSource('medium')
      : undefined;
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
    <MenuItem
      alignTop
      avatar={avatar}
      title={channel.name}
      onPress={onPress}
      icon={
        <Subscribe
          mini
          shouldUpdateFeed={false}
          channel={channel}
          onSubscribed={onSubscribed}
        />
      }
      borderless>
      <>
        <B2 numberOfLines={2} color="secondary" top="XS" right="XL">
          {entities.decodeHTML(description)}
        </B2>
        {Boolean(channel.boosted) && <BoostedChannelLabel />}
      </>
    </MenuItem>
  );
};

const BoostedChannelLabel = () => (
  <Row top="XS" align="centerStart">
    <Icon name="boost" size="tiny" right="XS" color="Link" />
    <B2 color="link">{sp.i18n.t('boosts.boostedChannel')}</B2>
  </Row>
);

export default ChannelRecommendationItem;
