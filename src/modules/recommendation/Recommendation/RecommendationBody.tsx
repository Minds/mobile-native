import { observer } from 'mobx-react';
import React, { FC, useCallback, useState } from 'react';
import { View } from 'react-native';
import UserModel from '~/channel/UserModel';
import { Spacer } from '~/common/ui';
import GroupsListItem from '~/groups/GroupsListItem';

import useRecommendationContext from './Recommendation.context';
import ChannelRecommendationItem from './components/ChannelRecommendationItem';
import { ChannelRecommendationStore } from './hooks/useChannelRecommendation';
import useDismissibility from './hooks/useDismissibility';
import { RecommendationLocation, RecommendationType } from './types';
import sp from '~/services/serviceProvider';

export interface RecommendationBodyProps {
  type: RecommendationType;
  location: RecommendationLocation;
  /**
   * use this prop to allow the component to prefetch the data but not render the component
   */
  visible?: boolean;
  /**
   * the channel for which we should get recommendations
   */
  channel?: UserModel;

  recommendationStore?: ChannelRecommendationStore;

  size?: number;
}

const RecommendationBody: FC<RecommendationBodyProps> = ({
  type,
  location,
  visible = true,
  size = 4,
}) => {
  const [listSize, setListSize] = useState(size);
  const recommendation = useRecommendationContext();
  const { shouldRender } = useDismissibility(type, location, visible);

  /**
   * When a channel was subscribed, remove it from the list——unless the list is small
   */
  const onSubscribed = useCallback(
    subscribedChannel => {
      if (
        recommendation.channelRecommendation.result!.entities.length <= size
      ) {
        return null;
      }

      recommendation.channelRecommendation?.setResult({
        ...recommendation.channelRecommendation?.result,
        entities: recommendation.channelRecommendation?.result?.entities.filter(
          suggestion => suggestion.entity_guid !== subscribedChannel.guid,
        ),
      });
      if (listSize === size) {
        setListSize(size + 2);
      }
    },
    [recommendation.channelRecommendation, size, listSize],
  );

  /**
   * When a channel was subscribed, remove it from the list——unless the list is small
   */
  const onJoined = useCallback(
    subscribedChannel => {
      if (
        recommendation.groupRecommendation.result!.suggestions.length <= size
      ) {
        return null;
      }

      recommendation.groupRecommendation?.setResult({
        ...recommendation.groupRecommendation?.result,
        suggestions:
          recommendation.groupRecommendation?.result?.suggestions.filter(
            suggestion => suggestion.entity.guid !== subscribedChannel.guid,
          ),
      });
      if (listSize === size) {
        setListSize(size + 2);
      }
    },
    [size, listSize, recommendation.groupRecommendation],
  );

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <Spacer bottom="XL">
        {type === 'channel'
          ? recommendation.channelRecommendation.result?.entities
              .slice(0, listSize)
              .map(suggestion => (
                <ChannelRecommendationItem
                  key={suggestion.entity.guid}
                  channel={suggestion.entity as UserModel}
                  onSubscribed={onSubscribed}
                />
              ))
          : recommendation.groupRecommendation.result?.suggestions
              .slice(0, listSize)
              .map((suggestion, index) => (
                <GroupsListItem
                  key={suggestion.entity_guid}
                  group={suggestion.entity}
                  index={index}
                  onPress={() => onJoined(suggestion.entity)}
                />
              ))}
      </Spacer>
      <View style={styles.borderBottom} />
    </>
  );
};

const styles = sp.styles.create({
  borderBottom: ['borderBottom6x', 'bcolorBaseBackground'],
});

export default observer(RecommendationBody);
