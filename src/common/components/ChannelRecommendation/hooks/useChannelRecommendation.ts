import UserModel from '~/channel/UserModel';
import useApiFetch from '~/common/hooks/useApiFetch';

/**
 * channel recommendation resource
 * @param { string } location the location in which this recommendation is shown
 * @returns { FetchStore }
 */
export const useChannelRecommendation = (location: string) => {
  const res = useApiFetch<{
    suggestions: {
      confidence_score: number;
      entity: UserModel;
      entity_guid: string;
      entity_type: string;
    }[];
  }>('api/v3/recommendations', {
    params: {
      location,
    },
    map: entities => UserModel.createMany(entities),
  });

  return res;
};
