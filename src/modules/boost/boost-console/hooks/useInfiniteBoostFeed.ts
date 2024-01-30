import { useCallback, useMemo } from 'react';
import { useInfiniteGetBoostFeedQuery } from '~/graphql/api';

import ActivityModel from '~/newsfeed/ActivityModel';

/**
 * Map models from the legacy string
 */
const mapModels = (edge: any) => {
  if (
    !edge.node.activity ||
    (!edge.node.activity.legacy && !edge.node.activity.__mapped)
  ) {
    console.log('There is no activity on this edge!', edge.node.id);
    return null;
  }
  if (edge.node.activity.__mapped) {
    return edge.node.activity;
  }

  if (
    edge.node.activity.__typename === 'ActivityNode' ||
    edge.node.activity.__typename === 'BoostNode'
  ) {
    try {
      /**
       * Ugly hack for now, we replace the data of react query with the mapped object to optimize the mapping and the memory usage
       * Removing the legacy string and converting it to a model
       */
      edge.node.activity = ActivityModel.create(
        JSON.parse(edge.node.activity.legacy),
      );
      edge.node.activity.__mapped = true;
    } catch (error) {
      console.log('Error parsing activity', edge.node.id);
    }
  } else {
    console.log('Unknown entity type', edge.node.id);
  }
  return edge.node.activity;
};

export function useInfiniteBoostFeed(targetLocation: 1 | 2) {
  const query = useInfiniteGetBoostFeedQuery(
    'after',
    {
      targetLocation,
      after: 0,
      first: 12,
      source: 'feed/boosts',
    },
    {
      keepPreviousData: false,
      staleTime: 60000,
      retry: 2,
      getNextPageParam: useCallback(lastPage => {
        const { endCursor, hasNextPage } = lastPage.boosts.pageInfo ?? {};
        return hasNextPage
          ? {
              after: parseInt(endCursor, 10),
            }
          : undefined;
      }, []),
    },
  );

  const entities = useMemo(() => {
    return query.data?.pages.flatMap(page =>
      page.boosts.edges.map(d => mapModels(d)),
    );
  }, [query.data]);

  return {
    query,
    refresh: useCallback(() => {
      query.remove();
      query.refetch();
    }, [query]),
    entities,
  };
}
