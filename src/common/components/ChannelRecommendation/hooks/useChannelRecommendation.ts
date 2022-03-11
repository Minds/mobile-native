import UserModel from '~/channel/UserModel';
import useApiFetch from '~/common/hooks/useApiFetch';
import sessionService from '~/common/services/session.service';

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
      targetUserGuid: channel?.guid,
      mostRecentSubscriptionUserGuid: sessionService.getUser()?.guid,
      limit: 3,
    },
    map: recommendations =>
      recommendations.map(recommendation => ({
        ...recommendation,
        entity: UserModel.create(recommendation.entity),
      })),
  });

  return res;
};
