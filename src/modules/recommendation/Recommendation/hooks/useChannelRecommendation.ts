import { useEffect } from 'react';
import UserModel from '~/channel/UserModel';
import { useLegacyStores } from '~/common/hooks/use-stores';
import useApiFetch, { FetchStore } from '~/common/hooks/useApiFetch';
import { ParamsArray } from '~/common/services/api.service';

type ChannelRecommendationType = {
  entities: {
    confidence_score: number;
    entity: UserModel;
    entity_guid: string;
    entity_type: string;
  }[];
};

export type ChannelRecommendationStore = FetchStore<ChannelRecommendationType>;

/**
 * channel recommendation resource
 * @param { string } location the location in which this recommendation is shown
 * @param { UserModel } channel
 * @returns { FetchStore }
 */
const useChannelRecommendation = (
  location: string,
  channel?: UserModel,
  enabled?: boolean,
): ChannelRecommendationStore => {
  const { recentSubscriptions } = useLegacyStores();
  const res = useApiFetch<ChannelRecommendationType>('api/v3/recommendations', {
    params: {
      location,
      mostRecentSubscriptions: new ParamsArray(...recentSubscriptions.list()),
      currentChannelUserGuid: channel?.guid,
      limit: 12,
    },
    map: recommendations =>
      recommendations
        .filter(rec => Boolean(rec.entity))
        .map(recommendation => ({
          ...recommendation,
          entity: UserModel.create(recommendation.entity),
        })),
    skip: true,
  });

  useEffect(() => {
    if (enabled) {
      res.fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return res;
};

export default useChannelRecommendation;
