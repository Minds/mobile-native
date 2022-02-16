import { useNavigation } from '@react-navigation/core';
import { observer } from 'mobx-react';
import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import UserModel from '~/channel/UserModel';
import Subscribe from '~/channel/v2/buttons/Subscribe';
// import useExperiment from '~/common/hooks/useExperiment';
import i18nService from '~/common/services/i18n.service';
import { Avatar, B1, B2, Column, H3, Row, Spacer } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import MPressable from '../MPressable';
import { useChannelRecommendation } from './hooks/useChannelRecommendation';

interface ChannelRecommendationItemProps {
  channel: UserModel;
}

export const ChannelRecommendationItem: FC<ChannelRecommendationItemProps> = ({
  channel,
}) => {
  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};
  const navigation = useNavigation<any>();
  const onPress = useCallback(
    () =>
      navigation.push('Channel', {
        guid: channel.guid,
        entity: channel,
      }),
    [navigation, channel],
  );
  return (
    <MPressable onPress={onPress}>
      <Row bottom="L">
        <Avatar size="tiny" right="M" top="XS" source={avatar} />
        <Column flex align="centerStart">
          <B1 font="bold">{channel.name}</B1>
          <B2 numberOfLines={2} color="secondary">
            {channel.briefdescription}
          </B2>
        </Column>
        <Subscribe mini channel={channel} />
      </Row>
    </MPressable>
  );
};

interface ChannelRecommendationProps {
  location: string;
}

const ChannelRecommendation: FC<ChannelRecommendationProps> = ({
  location,
}) => {
  // if (!useExperiment('channel-recommendation')) {
  //   return null;
  // }

  const { result } = useChannelRecommendation(location);

  if (!result?.suggestions.length) {
    return null;
  }

  return (
    <>
      <Spacer vertical="XL" horizontal="L">
        <Row align="centerBetween" bottom="XL">
          <H3>{i18nService.t('recommendedChannels')}</H3>
          <B2 color="link">{i18nService.t('seeMore')}</B2>
        </Row>

        {result?.suggestions.map(suggestion => (
          <ChannelRecommendationItem
            key={suggestion.entity_guid}
            channel={suggestion.entity}
          />
        ))}
      </Spacer>
      <View style={styles.borderBottom} />
    </>
  );
};

const styles = ThemedStyles.create({
  borderBottom: ['borderBottom6x', 'bcolorBaseBackground'],
});

export default observer(ChannelRecommendation);
