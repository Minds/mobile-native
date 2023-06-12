import { useCallback } from 'react';

import { useLegacyStores } from '~/common/hooks/use-stores';
import { RecommendationType } from '../types';
import useRecommendationContext from '../Recommendation.context';

// TODO: move logic out and use dismissible from props
const useDismissibility = (
  type: RecommendationType,
  location: 'feed' | 'channel',
  /** overrides the visibility */
  visible: boolean = true,
) => {
  const { dismissal } = useLegacyStores();
  const dismissible = location !== 'channel';
  const recommendation = useRecommendationContext();

  const entitiesCount =
    type === 'channel'
      ? recommendation.channelRecommendation.result?.entities.length
      : recommendation.groupRecommendation.result?.suggestions.length;

  const shouldRender =
    Boolean(entitiesCount) &&
    visible &&
    (dismissible
      ? !dismissal.isDismissed(`recommendation:${type}:${location}`)
      : true);

  return {
    shouldRender,
    dismissible,
    dismiss: useCallback(
      () => dismissal.dismiss(`recommendation:${type}:${location}`),
      [dismissal, location, type],
    ),
  };
};

export default useDismissibility;
