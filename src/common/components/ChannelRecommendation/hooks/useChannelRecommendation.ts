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
  const res = useApiFetch<{
    entities: {
      confidence_score: number;
      entity: UserModel;
      entity_guid: string;
      entity_type: string;
    }[];
  }>('api/v3/recommendations', {
    params: {
      location,
      mostRecentSubscriptions: recentSubscriptions.list().join(','),
      currentChannelUserGuid: channel?.guid,
      limit: 20,
    },
    map: recommendations =>
      recommendations.map(recommendation => ({
        ...recommendation,
        entity: UserModel.create(recommendation.entity),
      })),
  });

  return res;
};
