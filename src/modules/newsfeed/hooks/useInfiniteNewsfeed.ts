import React, { useCallback, useMemo } from 'react';
import {
  FetchNewsfeedDocument,
  FetchNewsfeedQuery,
  FetchNewsfeedQueryVariables,
} from '~/graphql/api';
import {
  InfiniteData,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';

import ActivityModel from '~/newsfeed/ActivityModel';
import UserModel from '~/channel/UserModel';
import GroupModel from '~/groups/GroupModel';
import { storages } from '~/common/services/storage/storages.service';
import { gqlFetcher } from '~/common/services/api.service';
import { NewsfeedType } from '~/newsfeed/NewsfeedStore';
import useDismissible from '~/services/hooks/useDismissable';

export const mapModels = (
  edge: any,
  inFeedNoticesDelivered?,
  highlightsDimissed?,
) => {
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
        if (!highlightsDimissed && edge.node.edges.length) {
          // we put the highlights inline with the rest of the feed
          edge.node = edge.node.edges.map(hEdge => {
            const hNode = ActivityModel.create(JSON.parse(hEdge.node.legacy));
            hNode.isHighlighted = true;
            return hNode;
          });
          edge.node.unshift({ __typename: 'FeedHighlightsTitle' });
          edge.node.push({ __typename: 'FeedHighlightsFooter' });
        }
        // edge.node = FeedHighlightsModel.create(edge.node);
        edge.node.__mapped = true;
        break;
      case 'FeedNoticeNode':
        // add to the list of delivered notices
        inFeedNoticesDelivered?.current.push(edge.node.key);
        edge.node.__mapped = true;
        break;
    }
  }
  return edge.node;
};

export function useInfiniteNewsfeed(algorithm: NewsfeedType) {
  const inFeedNoticesDelivered = React.useRef(emptyArray);
  const { isDismissed: highlightsDimissed } = useDismissible('top-highlights');

  const local = React.useRef<{
    lastFetchAt: number;
    cachedData: undefined | null | InfiniteData<FetchNewsfeedQuery>;
  }>({
    lastFetchAt: Date.now(),
    cachedData: null,
  }).current;

  const queryClient = useQueryClient();

  // only on the first run
  if (local.cachedData === null) {
    // storages.userCache?.removeItem('NewsfeedCache');
    local.cachedData = storages.userCache?.getMap(`NewsfeedCache-${algorithm}`);
  }

  const query = useInfiniteFetchNewsfeedQuery(
    'cursor',
    {
      limit: 12,
      algorithm,
      inFeedNoticesDelivered: [],
    },
    {
      initialData: local.cachedData || undefined,
      keepPreviousData: false,
      staleTime: 0,
      retry: 0,
      getNextPageParam: useCallback(lastPage => {
        const { endCursor, hasNextPage } = lastPage.newsfeed.pageInfo ?? {};
        return hasNextPage
          ? {
              cursor: endCursor,
              inFeedNoticesDelivered: inFeedNoticesDelivered.current,
            }
          : undefined;
      }, []),
    },
  );

  const entities = useMemo(
    () =>
      query.data?.pages.flatMap(page =>
        page.newsfeed.edges.flatMap(d =>
          mapModels(d, inFeedNoticesDelivered, highlightsDimissed),
        ),
      ),
    [query.data, highlightsDimissed],
  );

  return {
    prepend: useCallback(
      post => {
        // do not prepend posts on the for-you tab
        if (algorithm === 'for-you') {
          return;
        }
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
    lastFetchAt: local.lastFetchAt,
    query,
    refresh: useCallback(() => {
      inFeedNoticesDelivered.current = emptyArray;
      storages.userCache?.removeItem(`NewsfeedCache-${algorithm}`);
      local.cachedData = undefined;
      local.lastFetchAt = Date.now();
      query.remove();
      query.refetch();
    }, [query, local]),
    entities,
  };
}

const emptyArray = [];

/**
 * Custom implementation of the query to be able to cache directly from the query
 * @param pageParamKey
 * @param variables
 * @param options
 * @returns
 */
const useInfiniteFetchNewsfeedQuery = <
  TData = FetchNewsfeedQuery,
  TError = unknown,
>(
  pageParamKey: keyof FetchNewsfeedQueryVariables,
  variables: FetchNewsfeedQueryVariables,
  options?: UseInfiniteQueryOptions<FetchNewsfeedQuery, TError, TData>,
) => {
  return useInfiniteQuery<FetchNewsfeedQuery, TError, TData>(
    ['FetchNewsfeed.infinite', variables],
    async metaData => {
      const data = await gqlFetcher<
        FetchNewsfeedQuery,
        FetchNewsfeedQueryVariables
      >(FetchNewsfeedDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })();

      // save to cache when fetching the first page
      if (!metaData.pageParam && data?.newsfeed?.edges?.length) {
        storages.userCache?.setMap(`NewsfeedCache-${variables['algorithm']}`, {
          pages: [data],
          pageParams: [undefined],
        });
      }

      return data;
    },
    options,
  );
};
