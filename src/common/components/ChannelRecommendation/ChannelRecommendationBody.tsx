import { useNavigation } from '@react-navigation/core';
import { observer } from 'mobx-react';
import React, { FC, useCallback, useState } from 'react';
import { View } from 'react-native';
import UserModel from '~/channel/UserModel';
import Subscribe from '~/channel/v2/buttons/Subscribe';
import { useLegacyStores } from '~/common/hooks/use-stores';

import { Avatar, B1, B2, Column, Row, Spacer } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import MPressable from '../MPressable';
import { ChannelRecommendationStore } from './hooks/useChannelRecommendation';
import useChannelRecommendationContext from './hooks/useChannelRecommendationContext';

interface ChannelRecommendationItemProps {
  channel: UserModel;
  onSubscribed?: (user: UserModel) => void;
}

export const ChannelRecommendationItem: FC<ChannelRecommendationItemProps> = ({
  channel,
  onSubscribed,
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

  const description =
    channel.briefdescription && channel.briefdescription.trim
      ? channel.briefdescription.trim()
      : '';

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

export interface ChannelRecommendationProps {
  location: string;
  /**
   * use this prop to allow the component to prefetch the data but not render the component
   */
  visible?: boolean;
  /**
   * the channel for which we should get recommendations
   */
  channel?: UserModel;

  recommendationStore?: ChannelRecommendationStore;
}

const ChannelRecommendationBody: FC<ChannelRecommendationProps> = ({
  location,
  visible = true,
  recommendationStore,
}) => {
  const [listSize, setListSize] = useState(3);
  const recommendation =
    useChannelRecommendationContext() || recommendationStore;

  const { dismissal } = useLegacyStores();
  const isDismissed = dismissal.isDismissed('channel-recommendation:feed');
  const dismissible = location !== 'channel';

  const shouldRender =
    Boolean(recommendation?.result?.entities.length) &&
    visible &&
    (dismissible ? !isDismissed : true);

  /**
   * When a channel was subscribed, remove it from the list——unless the list is small
   */
  const onSubscribed = useCallback(
    subscribedChannel => {
      if (!recommendation?.result?.entities) {
        return;
      }

      if (recommendation.result.entities.length <= 3) {
        return null;
      }

      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      recommendation?.setResult({
        ...recommendation?.result,
        entities: recommendation?.result?.entities.filter(
          suggestion => suggestion.entity_guid !== subscribedChannel.guid,
        ),
      });
      if (listSize === 3) {
        setListSize(5);
      }
    },
    [recommendation, listSize],
  );

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <Spacer bottom="XL">
        {recommendation?.result?.entities.slice(0, listSize).map(suggestion => (
          <ChannelRecommendationItem
            key={suggestion.entity_guid}
            channel={suggestion.entity}
            onSubscribed={onSubscribed}
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

export default observer(ChannelRecommendationBody);
