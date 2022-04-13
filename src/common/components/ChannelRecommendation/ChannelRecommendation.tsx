import { useNavigation } from '@react-navigation/core';
import { observer } from 'mobx-react';
import React, { FC, useCallback, useLayoutEffect } from 'react';
import { LayoutAnimation, View } from 'react-native';
import UserModel from '~/channel/UserModel';
import Subscribe from '~/channel/v2/buttons/Subscribe';
import i18nService from '~/common/services/i18n.service';
import { Avatar, B1, B2, Column, H3, Row, Spacer } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import MPressable from '../MPressable';
import { useChannelRecommendation } from './hooks/useChannelRecommendation';

interface ChannelRecommendationItemProps {
  channel: UserModel;
  onSubscribed: (user: UserModel) => void;
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

interface ChannelRecommendationProps {
  location: string;
  /**
   * use this prop to allow the component to prefetch the data but not render the component
   */
  visible?: boolean;
  /**
   * the channel for which we should get recommendations
   */
  channel?: UserModel;
}

const ChannelRecommendation: FC<ChannelRecommendationProps> = ({
  location,
  visible = true,
  channel,
}) => {
  const navigation = useNavigation();
  const { result, setResult } = useChannelRecommendation(location, channel);
  const shouldRender = Boolean(result?.entities.length) && visible;

  /**
   * When a channel was subscribed, remove it from the list——unless the list is small
   */
  const onSubscribed = useCallback(
    subscribedChannel => {
      if (!result?.entities) {
        return;
      }

      if (result.entities.length <= 3) {
        return null;
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setResult({
        ...result,
        entities: result?.entities.filter(
          suggestion => suggestion.entity_guid !== subscribedChannel.guid,
        ),
      });
    },
    [result, setResult],
  );

  // layout animations
  useLayoutEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    return () =>
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <Spacer vertical="XL">
        <Row align="centerBetween" bottom="XL" horizontal="L">
          <H3>{i18nService.t('recommendedChannels')}</H3>
          <B2
            color="link"
            onPress={() => navigation.navigate('SuggestedChannel')}>
            {i18nService.t('seeMore')}
          </B2>
        </Row>

        {result?.entities.slice(0, 3).map(suggestion => (
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

export default observer(ChannelRecommendation);
