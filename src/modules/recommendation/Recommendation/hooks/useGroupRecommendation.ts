import { useEffect } from 'react';
import useApiFetch, { FetchStore } from '~/common/hooks/useApiFetch';
import GroupModel from '~/groups/GroupModel';

type GroupRecommendationType = {
  suggestions: {
    confidence_score: number;
    entity: GroupModel;
    entity_guid: string;
    entity_type: string;
  }[];
};

export type GroupRecommendationStore = FetchStore<GroupRecommendationType>;

/**
 * group recommendation resource
 * @param { string } location the location in which this recommendation is shown
 * @param { UserModel } group
 * @returns { FetchStore }
 */
const useGroupRecommendation = (
  enabled?: boolean,
): GroupRecommendationStore => {
  const res = useApiFetch<GroupRecommendationType>('api/v2/suggestions/group', {
    params: {
      limit: 12,
      period: '1y',
      nsfw: [],
    },
    map: recommendations =>
      recommendations
        .filter(rec => Boolean(rec.entity))
        .map(recommendation => ({
          ...recommendation,
          entity: GroupModel.create(recommendation.entity),
        })),
    dataField: 'suggestions',
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

export default useGroupRecommendation;
