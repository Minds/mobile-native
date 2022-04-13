import { useMemo } from 'react';
import UserModel from '~/channel/UserModel';
import { useLegacyStores } from '~/common/hooks/use-stores';
import useApiFetch from '~/common/hooks/useApiFetch';

/**
 * channel recommendation resource
 * @param { string } location the location in which this recommendation is shown
 * @param { UserModel } channel
 * @returns { FetchStore }
 */
export const useChannelRecommendation = (
  location: string,
  channel?: UserModel,
) => {
  const { recentSubscriptions } = useLegacyStores();
  const channelGuid = channel?.guid;
  const recentSubscriptionsGuids = recentSubscriptions.list().join(',');
  const params = useMemo(
    () => ({
      location,
      mostRecentSubscriptions: recentSubscriptions.list(),
      currentChannelUserGuid: channelGuid,
      limit: 3,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channelGuid, location, recentSubscriptionsGuids],
  );
  const res = useApiFetch<{
    entities: {
      confidence_score: number;
      entity: UserModel;
      entity_guid: string;
      entity_type: string;
    }[];
  }>('api/v3/recommendations', {
    params,
    map: recommendations =>
      recommendations.map(recommendation => ({
        ...recommendation,
        entity: UserModel.create(recommendation.entity),
      })),
  });

  return res;
};
