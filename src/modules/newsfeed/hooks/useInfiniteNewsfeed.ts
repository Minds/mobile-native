import React, { useCallback, useMemo } from 'react';
import { useInfiniteFetchNewsfeedQuery } from '~/graphql/api';
import ActivityModel from '../../../newsfeed/ActivityModel';
import UserModel from '~/channel/UserModel';
import GroupModel from '~/groups/GroupModel';
import { useQueryClient } from '@tanstack/react-query';

const mapModels = (edge: any, inFeedNoticesDelivered) => {
  if (edge.node.__mapped) {
    return edge.node;
  }
  const activityOrBoost =
    edge.node.__typename === 'ActivityNode' ||
    edge.node.__typename === 'BoostNode';
  if (activityOrBoost && edge.node.legacy) {
    try {
      /**
       * Ugly hack for now, we replace the data of react query with the mapped object to optimize the mapping and the memory usage
       * Removing the legacy string and converting it to a model
       */
      edge.node = ActivityModel.create(JSON.parse(edge.node.legacy));
      edge.node.__mapped = true;
    } catch (error) {
      console.log('Error parsing activity', edge.node.id);
    }
  } else {
    switch (edge.node.__typename) {
      case 'PublisherRecsConnection':
        if (edge.node.edges) {
          const entities = edge.node.edges.map(
            publisher => publisher.publisherNode,
          );
          edge.node.edges = entities
            .map(entity => {
              try {
                return entity.id.startsWith('user')
                  ? UserModel.create(JSON.parse(entity.legacy))
                  : GroupModel.create(JSON.parse(entity.legacy));
              } catch (error) {
                // to avoid errors in the case we add unsupported entities on the backend in the future
                console.log('Error parsing publisher', entity);
                return null;
              }
            })
            .filter(entity => entity);
          edge.node.__mapped = true;
        }
        break;
      case 'FeedHighlightsConnection':
        edge.node.edges = edge.node.edges.map(hEdge =>
          ActivityModel.create(JSON.parse(hEdge.node.legacy)),
        );
        edge.node.__mapped = true;
        break;
      case 'FeedNoticeNode':
        // add to the list of delivered notices
        inFeedNoticesDelivered.current.push(edge.node.key);
        edge.node.__mapped = true;
    }
  }
  return edge.node;
};

export function useInfiniteNewsfeed(algorithm) {
  const inFeedNoticesDelivered = React.useRef(emptyArray);
  const lastFetchAt = React.useRef(0);
  const queryClient = useQueryClient();

  const query = useInfiniteFetchNewsfeedQuery(
    'cursor',
    {
      limit: 12,
      algorithm,
      inFeedNoticesDelivered: [],
    },
    {
      networkMode: 'offlineFirst',
      getNextPageParam: lastPage => {
        const { endCursor, hasNextPage } = lastPage.newsfeed.pageInfo ?? {};
        return hasNextPage
          ? {
              cursor: endCursor,
              inFeedNoticesDelivered: inFeedNoticesDelivered.current,
            }
          : undefined;
      },
    },
  );

  const entities = useMemo(
    () =>
      query.data?.pages.flatMap(page =>
        page.newsfeed.edges.map(d => mapModels(d, inFeedNoticesDelivered)),
      ),
    [query.data],
  );

  /**
   * We return the last refetch time (used to fetch the count)
   */
  if (query.data?.pages.length === 1 && query.dataUpdatedAt) {
    lastFetchAt.current = query.dataUpdatedAt;
  }

  return {
    prepend: useCallback(
      post => {
        post.__mapped = true;
        queryClient.setQueryData<any>(
          [
            'FetchNewsfeed.infinite',
            {
              limit: 12,
              algorithm,
              inFeedNoticesDelivered: [],
            },
          ],
          oldData =>
            oldData
              ? {
                  pages: [
                    { newsfeed: { edges: [{ node: post }] } },
                    ...oldData.pages,
                  ],
                  pageParams: [...oldData.pageParams, { cursor: post.guid }],
                }
              : oldData,
        );
      },
      [algorithm, queryClient],
    ),
    lastFetchAt: lastFetchAt.current,
    query,
    refresh: useCallback(() => {
      query.remove();
      query.refetch();
    }, [query]),
    entities,
  };
}

const emptyArray = [];
