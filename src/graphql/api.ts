import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UseMutationOptions,
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

export type ActivityNode = EntityNodeInterface &
  NodeInterface & {
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

export type EntityNode = EntityNodeInterface &
  NodeInterface & {
    __typename?: 'EntityNode';
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

export type EntityNodeInterface = {
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
  /** Returns the earliest expiring gift that contributes to this balance. */
  earliestExpiringGiftCard?: Maybe<GiftCardNode>;
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

export enum GiftCardStatusFilterEnum {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
}

export type GiftCardTargetInput = {
  targetEmail?: InputMaybe<Scalars['String']['input']>;
  targetUserGuid?: InputMaybe<Scalars['String']['input']>;
};

export type GiftCardTransaction = NodeInterface & {
  __typename?: 'GiftCardTransaction';
  amount: Scalars['Float']['output'];
  boostGuid?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Int']['output'];
  giftCardGuid?: Maybe<Scalars['String']['output']>;
  giftCardIssuerGuid?: Maybe<Scalars['String']['output']>;
  giftCardIssuerName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  paymentGuid?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['Int']['output']>;
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

export type GroupNode = EntityNodeInterface &
  NodeInterface & {
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

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  claimGiftCard: GiftCardNode;
  /** Mark an onboarding step for a user as completed. */
  completeOnboardingStep: OnboardingStepProgressState;
  createGiftCard: GiftCardNode;
  /** Sets onboarding state for the currently logged in user. */
  setOnboardingState: OnboardingState;
};

export type MutationClaimGiftCardArgs = {
  claimCode: Scalars['String']['input'];
};

export type MutationCompleteOnboardingStepArgs = {
  additionalData?: InputMaybe<Array<KeyValuePairInput>>;
  stepKey: Scalars['String']['input'];
  stepType: Scalars['String']['input'];
};

export type MutationCreateGiftCardArgs = {
  amount: Scalars['Float']['input'];
  expiresAt?: InputMaybe<Scalars['Int']['input']>;
  productIdEnum: Scalars['Int']['input'];
  stripePaymentMethodId: Scalars['String']['input'];
  targetInput: GiftCardTargetInput;
};

export type MutationSetOnboardingStateArgs = {
  completed: Scalars['Boolean']['input'];
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

export type OnboardingState = {
  __typename?: 'OnboardingState';
  completedAt?: Maybe<Scalars['Int']['output']>;
  startedAt: Scalars['Int']['output'];
  userGuid?: Maybe<Scalars['String']['output']>;
};

export type OnboardingStepProgressState = {
  __typename?: 'OnboardingStepProgressState';
  completedAt?: Maybe<Scalars['Int']['output']>;
  stepKey: Scalars['String']['output'];
  stepType: Scalars['String']['output'];
  userGuid?: Maybe<Scalars['String']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  balance?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
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
  /** Returns an individual gift card by its claim code. */
  giftCardByClaimCode: GiftCardNode;
  /**
   * Returns a list of gift card transactions for a ledger,
   * containing more information than just getting transactions,
   * including linked boost_guid's for Boost payments and injects
   * a transaction for the initial deposit.
   */
  giftCardTransactionLedger: GiftCardTransactionsConnection;
  /** Returns a list of gift card transactions */
  giftCardTransactions: GiftCardTransactionsConnection;
  /** Returns a list of gift cards belonging to a user */
  giftCards: GiftCardsConnection;
  /** The available balance a user has */
  giftCardsBalance: Scalars['Float']['output'];
  /** The available balances of each gift card types */
  giftCardsBalances: Array<GiftCardBalanceByProductId>;
  newsfeed: NewsfeedConnection;
  /** Gets onboarding state for the currently logged in user. */
  onboardingState?: Maybe<OnboardingState>;
  /** Get the currently logged in users onboarding step progress. */
  onboardingStepProgress: Array<OnboardingStepProgressState>;
  /** Get a list of payment methods for the logged in user */
  paymentMethods: Array<PaymentMethod>;
};

export type QueryActivityArgs = {
  guid: Scalars['String']['input'];
};

export type QueryGiftCardArgs = {
  guid: Scalars['String']['input'];
};

export type QueryGiftCardByClaimCodeArgs = {
  claimCode: Scalars['String']['input'];
};

export type QueryGiftCardTransactionLedgerArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  giftCardGuid: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
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
  statusFilter?: InputMaybe<GiftCardStatusFilterEnum>;
};

export type QueryNewsfeedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  algorithm: Scalars['String']['input'];
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  inFeedNoticesDelivered?: InputMaybe<Array<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryPaymentMethodsArgs = {
  productId?: InputMaybe<GiftCardProductIdEnum>;
};

export type UserEdge = EdgeInterface & {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: UserNode;
  type: Scalars['String']['output'];
};

export type UserNode = EntityNodeInterface &
  NodeInterface & {
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

export type FetchPaymentMethodsQueryVariables = Exact<{
  giftCardProductId?: InputMaybe<GiftCardProductIdEnum>;
}>;

export type FetchPaymentMethodsQuery = {
  __typename?: 'Query';
  paymentMethods: Array<{
    __typename?: 'PaymentMethod';
    id: string;
    name: string;
    balance?: number | null;
  }>;
};

export type ClaimGiftCardMutationVariables = Exact<{
  claimCode: Scalars['String']['input'];
}>;

export type ClaimGiftCardMutation = {
  __typename?: 'Mutation';
  claimGiftCard: {
    __typename?: 'GiftCardNode';
    guid?: string | null;
    productId: GiftCardProductIdEnum;
    amount: number;
    balance: number;
    expiresAt: number;
    claimedAt?: number | null;
    claimedByGuid?: string | null;
  };
};

export type GetGiftCardBalancesQueryVariables = Exact<{ [key: string]: never }>;

export type GetGiftCardBalancesQuery = {
  __typename?: 'Query';
  giftCardsBalances: Array<{
    __typename?: 'GiftCardBalanceByProductId';
    productId: GiftCardProductIdEnum;
    balance: number;
    earliestExpiringGiftCard?: {
      __typename?: 'GiftCardNode';
      guid?: string | null;
      balance: number;
      expiresAt: number;
    } | null;
  }>;
};

export type GetGiftCardByCodeQueryVariables = Exact<{
  claimCode: Scalars['String']['input'];
}>;

export type GetGiftCardByCodeQuery = {
  __typename?: 'Query';
  giftCardByClaimCode: {
    __typename?: 'GiftCardNode';
    guid?: string | null;
    productId: GiftCardProductIdEnum;
    amount: number;
    balance: number;
    expiresAt: number;
    claimedAt?: number | null;
  };
};

export type GetGiftCardTransactionsLedgerQueryVariables = Exact<{
  giftCardGuid: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetGiftCardTransactionsLedgerQuery = {
  __typename?: 'Query';
  giftCardTransactionLedger: {
    __typename?: 'GiftCardTransactionsConnection';
    edges: Array<{
      __typename?: 'GiftCardTransactionEdge';
      node: {
        __typename?: 'GiftCardTransaction';
        paymentGuid?: string | null;
        giftCardGuid?: string | null;
        amount: number;
        createdAt: number;
        refundedAt?: number | null;
        boostGuid?: string | null;
        id: string;
        giftCardIssuerGuid?: string | null;
        giftCardIssuerName?: string | null;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
      startCursor?: string | null;
    };
  };
};

export type GetGiftCardsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<GiftCardOrderingEnum>;
  productId?: InputMaybe<GiftCardProductIdEnum>;
  statusFilter?: InputMaybe<GiftCardStatusFilterEnum>;
}>;

export type GetGiftCardsQuery = {
  __typename?: 'Query';
  giftCards: {
    __typename?: 'GiftCardsConnection';
    edges: Array<{
      __typename?: 'GiftCardEdge';
      node: {
        __typename?: 'GiftCardNode';
        guid?: string | null;
        productId: GiftCardProductIdEnum;
        balance: number;
        amount: number;
        claimedByGuid?: string | null;
        expiresAt: number;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
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
            | { __typename?: 'EntityNode'; id: string }
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
                        | { __typename?: 'EntityNode'; id: string }
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
                    | { __typename?: 'EntityNode'; id: string }
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
export const FetchPaymentMethodsDocument = `
    query FetchPaymentMethods($giftCardProductId: GiftCardProductIdEnum) {
  paymentMethods(productId: $giftCardProductId) {
    id
    name
    balance
  }
}
    `;
export const useFetchPaymentMethodsQuery = <
  TData = FetchPaymentMethodsQuery,
  TError = unknown,
>(
  variables?: FetchPaymentMethodsQueryVariables,
  options?: UseQueryOptions<FetchPaymentMethodsQuery, TError, TData>,
) =>
  useQuery<FetchPaymentMethodsQuery, TError, TData>(
    variables === undefined
      ? ['FetchPaymentMethods']
      : ['FetchPaymentMethods', variables],
    gqlFetcher<FetchPaymentMethodsQuery, FetchPaymentMethodsQueryVariables>(
      FetchPaymentMethodsDocument,
      variables,
    ),
    options,
  );
export const useInfiniteFetchPaymentMethodsQuery = <
  TData = FetchPaymentMethodsQuery,
  TError = unknown,
>(
  pageParamKey: keyof FetchPaymentMethodsQueryVariables,
  variables?: FetchPaymentMethodsQueryVariables,
  options?: UseInfiniteQueryOptions<FetchPaymentMethodsQuery, TError, TData>,
) => {
  return useInfiniteQuery<FetchPaymentMethodsQuery, TError, TData>(
    variables === undefined
      ? ['FetchPaymentMethods.infinite']
      : ['FetchPaymentMethods.infinite', variables],
    metaData =>
      gqlFetcher<FetchPaymentMethodsQuery, FetchPaymentMethodsQueryVariables>(
        FetchPaymentMethodsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useFetchPaymentMethodsQuery.fetcher = (
  variables?: FetchPaymentMethodsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<FetchPaymentMethodsQuery, FetchPaymentMethodsQueryVariables>(
    FetchPaymentMethodsDocument,
    variables,
    options,
  );
export const ClaimGiftCardDocument = `
    mutation ClaimGiftCard($claimCode: String!) {
  claimGiftCard(claimCode: $claimCode) {
    guid
    productId
    amount
    balance
    expiresAt
    claimedAt
    claimedByGuid
  }
}
    `;
export const useClaimGiftCardMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    ClaimGiftCardMutation,
    TError,
    ClaimGiftCardMutationVariables,
    TContext
  >,
) =>
  useMutation<
    ClaimGiftCardMutation,
    TError,
    ClaimGiftCardMutationVariables,
    TContext
  >(
    ['ClaimGiftCard'],
    (variables?: ClaimGiftCardMutationVariables) =>
      gqlFetcher<ClaimGiftCardMutation, ClaimGiftCardMutationVariables>(
        ClaimGiftCardDocument,
        variables,
      )(),
    options,
  );
useClaimGiftCardMutation.fetcher = (
  variables: ClaimGiftCardMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<ClaimGiftCardMutation, ClaimGiftCardMutationVariables>(
    ClaimGiftCardDocument,
    variables,
    options,
  );
export const GetGiftCardBalancesDocument = `
    query GetGiftCardBalances {
  giftCardsBalances {
    productId
    balance
    earliestExpiringGiftCard {
      guid
      balance
      expiresAt
    }
  }
}
    `;
export const useGetGiftCardBalancesQuery = <
  TData = GetGiftCardBalancesQuery,
  TError = unknown,
>(
  variables?: GetGiftCardBalancesQueryVariables,
  options?: UseQueryOptions<GetGiftCardBalancesQuery, TError, TData>,
) =>
  useQuery<GetGiftCardBalancesQuery, TError, TData>(
    variables === undefined
      ? ['GetGiftCardBalances']
      : ['GetGiftCardBalances', variables],
    gqlFetcher<GetGiftCardBalancesQuery, GetGiftCardBalancesQueryVariables>(
      GetGiftCardBalancesDocument,
      variables,
    ),
    options,
  );
export const useInfiniteGetGiftCardBalancesQuery = <
  TData = GetGiftCardBalancesQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetGiftCardBalancesQueryVariables,
  variables?: GetGiftCardBalancesQueryVariables,
  options?: UseInfiniteQueryOptions<GetGiftCardBalancesQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetGiftCardBalancesQuery, TError, TData>(
    variables === undefined
      ? ['GetGiftCardBalances.infinite']
      : ['GetGiftCardBalances.infinite', variables],
    metaData =>
      gqlFetcher<GetGiftCardBalancesQuery, GetGiftCardBalancesQueryVariables>(
        GetGiftCardBalancesDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useGetGiftCardBalancesQuery.fetcher = (
  variables?: GetGiftCardBalancesQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetGiftCardBalancesQuery, GetGiftCardBalancesQueryVariables>(
    GetGiftCardBalancesDocument,
    variables,
    options,
  );
export const GetGiftCardByCodeDocument = `
    query GetGiftCardByCode($claimCode: String!) {
  giftCardByClaimCode(claimCode: $claimCode) {
    guid
    productId
    amount
    balance
    expiresAt
    claimedAt
  }
}
    `;
export const useGetGiftCardByCodeQuery = <
  TData = GetGiftCardByCodeQuery,
  TError = unknown,
>(
  variables: GetGiftCardByCodeQueryVariables,
  options?: UseQueryOptions<GetGiftCardByCodeQuery, TError, TData>,
) =>
  useQuery<GetGiftCardByCodeQuery, TError, TData>(
    ['GetGiftCardByCode', variables],
    gqlFetcher<GetGiftCardByCodeQuery, GetGiftCardByCodeQueryVariables>(
      GetGiftCardByCodeDocument,
      variables,
    ),
    options,
  );
export const useInfiniteGetGiftCardByCodeQuery = <
  TData = GetGiftCardByCodeQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetGiftCardByCodeQueryVariables,
  variables: GetGiftCardByCodeQueryVariables,
  options?: UseInfiniteQueryOptions<GetGiftCardByCodeQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetGiftCardByCodeQuery, TError, TData>(
    ['GetGiftCardByCode.infinite', variables],
    metaData =>
      gqlFetcher<GetGiftCardByCodeQuery, GetGiftCardByCodeQueryVariables>(
        GetGiftCardByCodeDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useGetGiftCardByCodeQuery.fetcher = (
  variables: GetGiftCardByCodeQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetGiftCardByCodeQuery, GetGiftCardByCodeQueryVariables>(
    GetGiftCardByCodeDocument,
    variables,
    options,
  );
export const GetGiftCardTransactionsLedgerDocument = `
    query GetGiftCardTransactionsLedger($giftCardGuid: String!, $first: Int, $after: String) {
  giftCardTransactionLedger(
    giftCardGuid: $giftCardGuid
    first: $first
    after: $after
  ) {
    edges {
      node {
        paymentGuid
        giftCardGuid
        amount
        createdAt
        refundedAt
        boostGuid
        id
        giftCardIssuerGuid
        giftCardIssuerName
      }
    }
    pageInfo {
      hasNextPage
      endCursor
      startCursor
    }
  }
}
    `;
export const useGetGiftCardTransactionsLedgerQuery = <
  TData = GetGiftCardTransactionsLedgerQuery,
  TError = unknown,
>(
  variables: GetGiftCardTransactionsLedgerQueryVariables,
  options?: UseQueryOptions<GetGiftCardTransactionsLedgerQuery, TError, TData>,
) =>
  useQuery<GetGiftCardTransactionsLedgerQuery, TError, TData>(
    ['GetGiftCardTransactionsLedger', variables],
    gqlFetcher<
      GetGiftCardTransactionsLedgerQuery,
      GetGiftCardTransactionsLedgerQueryVariables
    >(GetGiftCardTransactionsLedgerDocument, variables),
    options,
  );
export const useInfiniteGetGiftCardTransactionsLedgerQuery = <
  TData = GetGiftCardTransactionsLedgerQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetGiftCardTransactionsLedgerQueryVariables,
  variables: GetGiftCardTransactionsLedgerQueryVariables,
  options?: UseInfiniteQueryOptions<
    GetGiftCardTransactionsLedgerQuery,
    TError,
    TData
  >,
) => {
  return useInfiniteQuery<GetGiftCardTransactionsLedgerQuery, TError, TData>(
    ['GetGiftCardTransactionsLedger.infinite', variables],
    metaData =>
      gqlFetcher<
        GetGiftCardTransactionsLedgerQuery,
        GetGiftCardTransactionsLedgerQueryVariables
      >(GetGiftCardTransactionsLedgerDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options,
  );
};

useGetGiftCardTransactionsLedgerQuery.fetcher = (
  variables: GetGiftCardTransactionsLedgerQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    GetGiftCardTransactionsLedgerQuery,
    GetGiftCardTransactionsLedgerQueryVariables
  >(GetGiftCardTransactionsLedgerDocument, variables, options);
export const GetGiftCardsDocument = `
    query GetGiftCards($first: Int, $after: String, $ordering: GiftCardOrderingEnum, $productId: GiftCardProductIdEnum, $statusFilter: GiftCardStatusFilterEnum) {
  giftCards(
    first: $first
    after: $after
    ordering: $ordering
    productId: $productId
    statusFilter: $statusFilter
  ) {
    edges {
      node {
        guid
        productId
        balance
        amount
        claimedByGuid
        expiresAt
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
    `;
export const useGetGiftCardsQuery = <
  TData = GetGiftCardsQuery,
  TError = unknown,
>(
  variables?: GetGiftCardsQueryVariables,
  options?: UseQueryOptions<GetGiftCardsQuery, TError, TData>,
) =>
  useQuery<GetGiftCardsQuery, TError, TData>(
    variables === undefined ? ['GetGiftCards'] : ['GetGiftCards', variables],
    gqlFetcher<GetGiftCardsQuery, GetGiftCardsQueryVariables>(
      GetGiftCardsDocument,
      variables,
    ),
    options,
  );
export const useInfiniteGetGiftCardsQuery = <
  TData = GetGiftCardsQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetGiftCardsQueryVariables,
  variables?: GetGiftCardsQueryVariables,
  options?: UseInfiniteQueryOptions<GetGiftCardsQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetGiftCardsQuery, TError, TData>(
    variables === undefined
      ? ['GetGiftCards.infinite']
      : ['GetGiftCards.infinite', variables],
    metaData =>
      gqlFetcher<GetGiftCardsQuery, GetGiftCardsQueryVariables>(
        GetGiftCardsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useGetGiftCardsQuery.fetcher = (
  variables?: GetGiftCardsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetGiftCardsQuery, GetGiftCardsQueryVariables>(
    GetGiftCardsDocument,
    variables,
    options,
  );
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
