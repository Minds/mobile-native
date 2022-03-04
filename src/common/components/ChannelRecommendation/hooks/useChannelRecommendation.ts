import UserModel from '~/channel/UserModel';
import useApiFetch from '~/common/hooks/useApiFetch';

/**
 * channel recommendation resource
 * @param { string } location the location in which this recommendation is shown
 * @returns { FetchStore }
 */
export const useChannelRecommendation = (location: string) => {
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
    },
    map: recommendations =>
      recommendations.map(recommendation => ({
        ...recommendation,
        entity: UserModel.create(recommendation.entity),
      })),
  });

  return res;
};
