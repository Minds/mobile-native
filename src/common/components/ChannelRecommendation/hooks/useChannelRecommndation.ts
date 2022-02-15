import UserModel from '~/channel/UserModel';
import useApiFetch from '~/common/hooks/useApiFetch';

export const useChannelRecommendation = () => {
  return useApiFetch<{
    suggestions: {
      confidence_score: number;
      entity: UserModel;
      entity_guid: string;
      entity_type: string;
    }[];
  }>('api/v2/suggestions/user', {
    params: {
      type: 'all',
      limit: 3,
    },
    persist: true,
    dataField: 'suggestions',
    map: suggestions =>
      suggestions.map(suggestion => ({
        ...suggestion,
        entity: UserModel.create(suggestion.entity),
      })),
  });
};
