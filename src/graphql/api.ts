import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { gqlFetcher } from '~/common/services/api.service';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type ActivityEdge = EdgeInterface & {
  __typename?: 'ActivityEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: ActivityNode;
  type: Scalars['String']['output'];
};

export type ActivityNode = NodeInterface & {
  __typename?: 'ActivityNode';
  /** Relevant for images/video posts. A blurhash to be used for preloading the image. */
  blurhash?: Maybe<Scalars['String']['output']>;
  commentsCount: Scalars['Int']['output'];
  guid: Scalars['String']['output'];
  hasVotedDown: Scalars['Boolean']['output'];
  hasVotedUp: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  impressionsCount: Scalars['Int']['output'];
  /** The activity has comments enabled */
  isCommentingEnabled: Scalars['Boolean']['output'];
  legacy: Scalars['String']['output'];
  message: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  owner: UserNode;
  ownerGuid: Scalars['String']['output'];
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  /** Relevant for images/video posts */
  title?: Maybe<Scalars['String']['output']>;
  urn: Scalars['String']['output'];
  votesDownCount: Scalars['Int']['output'];
  votesUpCount: Scalars['Int']['output'];
};

export type BoostEdge = EdgeInterface & {
  __typename?: 'BoostEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: BoostNode;
  type: Scalars['String']['output'];
};

export type BoostNode = NodeInterface & {
  __typename?: 'BoostNode';
  activity: ActivityNode;
  goalButtonText?: Maybe<Scalars['Int']['output']>;
  goalButtonUrl?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legacy: Scalars['String']['output'];
};

export type Connection = ConnectionInterface & {
  __typename?: 'Connection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type ConnectionInterface = {
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type EdgeImpl = EdgeInterface & {
  __typename?: 'EdgeImpl';
  cursor: Scalars['String']['output'];
  node?: Maybe<NodeInterface>;
};

export type EdgeInterface = {
  cursor: Scalars['String']['output'];
  node?: Maybe<NodeInterface>;
};

export type FeedHighlightsConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'FeedHighlightsConnection';
    /** Explicitly will only return activity edges */
    edges: Array<ActivityEdge>;
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type FeedHighlightsEdge = EdgeInterface & {
  __typename?: 'FeedHighlightsEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: FeedHighlightsConnection;
  type: Scalars['String']['output'];
};

export type FeedNoticeEdge = EdgeInterface & {
  __typename?: 'FeedNoticeEdge';
  cursor: Scalars['String']['output'];
  node: FeedNoticeNode;
  type: Scalars['String']['output'];
};

export type FeedNoticeNode = NodeInterface & {
  __typename?: 'FeedNoticeNode';
  id: Scalars['ID']['output'];
  /** The key of the notice that the client should render */
  key: Scalars['String']['output'];
  /** The location in the feed this notice should be displayed. top or inline. */
  location: Scalars['String']['output'];
};

export type GiftCardBalanceByProductId = {
  __typename?: 'GiftCardBalanceByProductId';
  balance: Scalars['Float']['output'];
  productId: GiftCardProductIdEnum;
};

export type GiftCardEdge = EdgeInterface & {
  __typename?: 'GiftCardEdge';
  cursor: Scalars['String']['output'];
  node: GiftCardNode;
};

export type GiftCardNode = NodeInterface & {
  __typename?: 'GiftCardNode';
  amount: Scalars['Float']['output'];
  balance: Scalars['Float']['output'];
  claimedAt?: Maybe<Scalars['Int']['output']>;
  claimedByGuid?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['Int']['output'];
  guid?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  issuedAt: Scalars['Int']['output'];
  issuedByGuid?: Maybe<Scalars['String']['output']>;
  productId: GiftCardProductIdEnum;
  /**
   * Returns transactions relating to the gift card
   * TODO: Find a way to make this not part of the data model
   */
  transactions: GiftCardTransactionsConnection;
};

export type GiftCardNodeTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export enum GiftCardOrderingEnum {
  CreatedAsc = 'CREATED_ASC',
  CreatedDesc = 'CREATED_DESC',
  ExpiringAsc = 'EXPIRING_ASC',
  ExpiringDesc = 'EXPIRING_DESC',
}

export enum GiftCardProductIdEnum {
  Boost = 'BOOST',
  Plus = 'PLUS',
  Pro = 'PRO',
  Supermind = 'SUPERMIND',
}

export type GiftCardTargetInput = {
  targetEmail?: InputMaybe<Scalars['String']['input']>;
  targetUserGuid?: InputMaybe<Scalars['String']['input']>;
};

export type GiftCardTransaction = NodeInterface & {
  __typename?: 'GiftCardTransaction';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['Int']['output'];
  giftCardGuid?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  paymentGuid?: Maybe<Scalars['String']['output']>;
};

export type GiftCardTransactionEdge = EdgeInterface & {
  __typename?: 'GiftCardTransactionEdge';
  cursor: Scalars['String']['output'];
  node: GiftCardTransaction;
};

export type GiftCardTransactionsConnection = ConnectionInterface & {
  __typename?: 'GiftCardTransactionsConnection';
  edges: Array<GiftCardTransactionEdge>;
  pageInfo: PageInfo;
};

export type GiftCardsConnection = ConnectionInterface & {
  __typename?: 'GiftCardsConnection';
  edges: Array<GiftCardEdge>;
  pageInfo: PageInfo;
};

export type GroupEdge = EdgeInterface & {
  __typename?: 'GroupEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: GroupNode;
  type: Scalars['String']['output'];
};

export type GroupNode = NodeInterface & {
  __typename?: 'GroupNode';
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legacy: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  urn: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  claimGiftCard: GiftCardNode;
  createGiftCard: GiftCardNode;
};

export type MutationClaimGiftCardArgs = {
  claimCode: Scalars['String']['input'];
};

export type MutationCreateGiftCardArgs = {
  amount: Scalars['Float']['input'];
  expiresAt?: InputMaybe<Scalars['Int']['input']>;
  productIdEnum: Scalars['Int']['input'];
  stripePaymentMethodId: Scalars['String']['input'];
  targetInput: GiftCardTargetInput;
};

export type NewsfeedConnection = ConnectionInterface & {
  __typename?: 'NewsfeedConnection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type NodeImpl = NodeInterface & {
  __typename?: 'NodeImpl';
  id: Scalars['ID']['output'];
};

export type NodeInterface = {
  id: Scalars['ID']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PublisherRecsConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'PublisherRecsConnection';
    /**
     * TODO: clean this up to help with typing. Union types wont work due to the following error being outputted
     * `Error: ConnectionInterface.edges expects type "[EdgeInterface!]!" but PublisherRecsConnection.edges provides type "[UnionUserEdgeBoostEdge!]!".`
     */
    edges: Array<EdgeInterface>;
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type PublisherRecsEdge = EdgeInterface & {
  __typename?: 'PublisherRecsEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: PublisherRecsConnection;
  type: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  activity: ActivityNode;
  /** Returns an individual gift card */
  giftCard: GiftCardNode;
  /** Returns a list of gift card transactions */
  giftCardTransactions: GiftCardTransactionsConnection;
  /** Returns a list of gift cards belonging to a user */
  giftCards: GiftCardsConnection;
  /** The available balance a user has */
  giftCardsBalance: Scalars['Float']['output'];
  /** The available balances of each gift card types */
  giftCardsBalances: Array<GiftCardBalanceByProductId>;
  newsfeed: NewsfeedConnection;
};

export type QueryActivityArgs = {
  guid: Scalars['String']['input'];
};

export type QueryGiftCardArgs = {
  guid: Scalars['String']['input'];
};

export type QueryGiftCardTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGiftCardsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeIssued?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<GiftCardOrderingEnum>;
  productId?: InputMaybe<GiftCardProductIdEnum>;
};

export type QueryNewsfeedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  algorithm: Scalars['String']['input'];
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  inFeedNoticesDelivered?: InputMaybe<Array<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type UserEdge = EdgeInterface & {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: UserNode;
  type: Scalars['String']['output'];
};

export type UserNode = NodeInterface & {
  __typename?: 'UserNode';
  briefDescription: Scalars['String']['output'];
  /** The users public ETH address */
  ethAddress?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The number of views the users has received. Includes views from their posts */
  impressionsCount: Scalars['Int']['output'];
  /** The user is a founder (contributed to crowdfunding) */
  isFounder: Scalars['Boolean']['output'];
  /** The user is a member of Minds+ */
  isPlus: Scalars['Boolean']['output'];
  /** The user is a member of Minds Pro */
  isPro: Scalars['Boolean']['output'];
  /** You are subscribed to this user */
  isSubscribed: Scalars['Boolean']['output'];
  /** The user is subscribed to you */
  isSubscriber: Scalars['Boolean']['output'];
  /** The user is a verified */
  isVerified: Scalars['Boolean']['output'];
  legacy: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  /** The number of subscribers the user has */
  subscribersCount: Scalars['Int']['output'];
  /** The number of channels the user is subscribed to */
  subscriptionsCount: Scalars['Int']['output'];
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  urn: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type NewsfeedQueryVariables = Exact<{
  algorithm: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  inFeedNoticesDelivered?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
}>;

export type NewsfeedQuery = {
  __typename?: 'Query';
  newsfeed: {
    __typename?: 'NewsfeedConnection';
    edges: Array<
      | {
          __typename?: 'ActivityEdge';
          cursor: string;
          node: { __typename?: 'ActivityNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'BoostEdge';
          cursor: string;
          node: {
            __typename?: 'BoostNode';
            goalButtonUrl?: string | null;
            goalButtonText?: number | null;
            legacy: string;
            id: string;
          };
        }
      | {
          __typename?: 'EdgeImpl';
          cursor: string;
          node?:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | {
                __typename?: 'FeedHighlightsConnection';
                id: string;
                edges: Array<{
                  __typename?: 'ActivityEdge';
                  node: {
                    __typename?: 'ActivityNode';
                    id: string;
                    legacy: string;
                  };
                }>;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | {
                __typename?: 'PublisherRecsConnection';
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: {
                        __typename?: 'ActivityNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | { __typename?: 'GroupNode'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename?: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename?: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: {
                        __typename?: 'GiftCardNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename?: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: { __typename?: 'GroupNode'; id: string };
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                >;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | { __typename?: 'UserNode'; id: string }
            | null;
        }
      | {
          __typename?: 'FeedHighlightsEdge';
          cursor: string;
          node: {
            __typename?: 'FeedHighlightsConnection';
            id: string;
            edges: Array<{
              __typename?: 'ActivityEdge';
              node: { __typename?: 'ActivityNode'; id: string; legacy: string };
            }>;
            pageInfo: {
              __typename?: 'PageInfo';
              hasPreviousPage: boolean;
              hasNextPage: boolean;
              startCursor?: string | null;
              endCursor?: string | null;
            };
          };
        }
      | {
          __typename?: 'FeedNoticeEdge';
          cursor: string;
          node: {
            __typename?: 'FeedNoticeNode';
            location: string;
            key: string;
            id: string;
          };
        }
      | {
          __typename?: 'GiftCardEdge';
          cursor: string;
          node: { __typename?: 'GiftCardNode'; id: string };
        }
      | {
          __typename?: 'GiftCardTransactionEdge';
          cursor: string;
          node: { __typename?: 'GiftCardTransaction'; id: string };
        }
      | {
          __typename?: 'GroupEdge';
          cursor: string;
          node: { __typename?: 'GroupNode'; id: string };
        }
      | {
          __typename?: 'PublisherRecsEdge';
          cursor: string;
          node: {
            __typename?: 'PublisherRecsConnection';
            id: string;
            edges: Array<
              | {
                  __typename?: 'ActivityEdge';
                  publisherNode: { __typename?: 'ActivityNode'; id: string };
                }
              | {
                  __typename?: 'BoostEdge';
                  publisherNode: {
                    __typename?: 'BoostNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'EdgeImpl';
                  publisherNode?:
                    | { __typename?: 'ActivityNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeedHighlightsEdge';
                  publisherNode: {
                    __typename?: 'FeedHighlightsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedNoticeEdge';
                  publisherNode: { __typename?: 'FeedNoticeNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardEdge';
                  publisherNode: { __typename?: 'GiftCardNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardTransactionEdge';
                  publisherNode: {
                    __typename?: 'GiftCardTransaction';
                    id: string;
                  };
                }
              | {
                  __typename?: 'GroupEdge';
                  publisherNode: { __typename?: 'GroupNode'; id: string };
                }
              | {
                  __typename?: 'PublisherRecsEdge';
                  publisherNode: {
                    __typename?: 'PublisherRecsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'UserEdge';
                  publisherNode: {
                    __typename?: 'UserNode';
                    legacy: string;
                    id: string;
                  };
                }
            >;
            pageInfo: {
              __typename?: 'PageInfo';
              hasPreviousPage: boolean;
              hasNextPage: boolean;
              startCursor?: string | null;
              endCursor?: string | null;
            };
          };
        }
      | {
          __typename?: 'UserEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; id: string };
        }
    >;
    pageInfo: {
      __typename?: 'PageInfo';
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type PageInfoFragment = {
  __typename?: 'PageInfo';
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

export const PageInfoFragmentDoc = `
    fragment PageInfo on PageInfo {
  hasPreviousPage
  hasNextPage
  startCursor
  endCursor
}
    `;
export const NewsfeedDocument = `
    query Newsfeed($algorithm: String!, $limit: Int!, $cursor: String, $inFeedNoticesDelivered: [String!]) {
  newsfeed(
    algorithm: $algorithm
    first: $limit
    after: $cursor
    inFeedNoticesDelivered: $inFeedNoticesDelivered
  ) {
    edges {
      cursor
      node {
        id
        ... on ActivityNode {
          legacy
        }
        ... on BoostNode {
          goalButtonUrl
          goalButtonText
          legacy
        }
        ... on FeedNoticeNode {
          location
          key
        }
        ... on FeedHighlightsConnection {
          edges {
            node {
              id
              legacy
            }
          }
          pageInfo {
            ...PageInfo
          }
        }
        ... on PublisherRecsConnection {
          edges {
            publisherNode: node {
              id
              ... on UserNode {
                legacy
              }
              ... on BoostNode {
                legacy
              }
            }
          }
          pageInfo {
            ...PageInfo
          }
        }
      }
    }
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;
export const useNewsfeedQuery = <TData = NewsfeedQuery, TError = unknown>(
  variables: NewsfeedQueryVariables,
  options?: UseQueryOptions<NewsfeedQuery, TError, TData>,
) =>
  useQuery<NewsfeedQuery, TError, TData>(
    ['Newsfeed', variables],
    gqlFetcher<NewsfeedQuery, NewsfeedQueryVariables>(
      NewsfeedDocument,
      variables,
    ),
    options,
  );
export const useInfiniteNewsfeedQuery = <
  TData = NewsfeedQuery,
  TError = unknown,
>(
  pageParamKey: keyof NewsfeedQueryVariables,
  variables: NewsfeedQueryVariables,
  options?: UseInfiniteQueryOptions<NewsfeedQuery, TError, TData>,
) => {
  return useInfiniteQuery<NewsfeedQuery, TError, TData>(
    ['Newsfeed.infinite', variables],
    metaData =>
      gqlFetcher<NewsfeedQuery, NewsfeedQueryVariables>(NewsfeedDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options,
  );
};

useNewsfeedQuery.fetcher = (
  variables: NewsfeedQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<NewsfeedQuery, NewsfeedQueryVariables>(
    NewsfeedDocument,
    variables,
    options,
  );