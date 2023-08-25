import { observer } from 'mobx-react';
import React, { FC, useCallback, useState } from 'react';
import { View } from 'react-native';

import UserModel from '~/channel/UserModel';
import { useLegacyStores } from '~/common/hooks/use-stores';
import { Spacer } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { ChannelRecommendationStore } from './hooks/useChannelRecommendation';
import useChannelRecommendationContext from './hooks/useChannelRecommendationContext';
import GroupsListItem from '~/groups/GroupsListItem';
import { ChannelRecommendationItem } from '~/modules/recommendation';
import GroupModel from '~/groups/GroupModel';

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
  const RECOMMANDATIONS_SIZE = 4;
  const [listSize, setListSize] = useState(RECOMMANDATIONS_SIZE);
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

      if (recommendation.result.entities.length <= RECOMMANDATIONS_SIZE) {
        return null;
      }

      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      recommendation?.setResult({
        ...recommendation?.result,
        entities: recommendation?.result?.entities.filter(
          suggestion => suggestion.entity_guid !== subscribedChannel.guid,
        ),
      });
      if (listSize === RECOMMANDATIONS_SIZE) {
        setListSize(RECOMMANDATIONS_SIZE + 2);
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
        {recommendation?.result?.entities
          .slice(0, listSize)
          .map((suggestion, index) => {
            switch (suggestion.entity_type) {
              case 'user':
                return (
                  <ChannelRecommendationItem
                    key={`${suggestion.entity.guid}_${index}`}
                    channel={suggestion.entity as UserModel}
                    onSubscribed={onSubscribed}
                  />
                );
              case 'group':
                return (
                  <GroupsListItem
                    group={suggestion.entity as GroupModel}
                    key={suggestion.entity.guid}
                  />
                );
            }
            console.error('Unknown entity type', suggestion.entity_type);
            return null;
          })}
      </Spacer>
      <View style={styles.borderBottom} />
    </>
  );
};

const styles = ThemedStyles.create({
  borderBottom: ['borderBottom6x', 'bcolorBaseBackground'],
});

export default observer(ChannelRecommendationBody);
