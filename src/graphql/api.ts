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
  Void: { input: any; output: any };
};

export type ActivityEdge = EdgeInterface & {
  __typename?: 'ActivityEdge';
  cursor: Scalars['String']['output'];
  explicitVotes: Scalars['Boolean']['output'];
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

export type BoostsConnection = ConnectionInterface & {
  __typename?: 'BoostsConnection';
  /** Gets Boost edges in connection. */
  edges: Array<BoostEdge>;
  pageInfo: PageInfo;
};

export type CommentEdge = EdgeInterface & {
  __typename?: 'CommentEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: CommentNode;
  type: Scalars['String']['output'];
};

export type CommentNode = NodeInterface & {
  __typename?: 'CommentNode';
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

export type Connection = ConnectionInterface & {
  __typename?: 'Connection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type ConnectionInterface = {
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export enum CustomHostnameStatusEnum {
  Active = 'ACTIVE',
  ActiveRedeploying = 'ACTIVE_REDEPLOYING',
  Blocked = 'BLOCKED',
  Deleted = 'DELETED',
  Moved = 'MOVED',
  Pending = 'PENDING',
  PendingBlocked = 'PENDING_BLOCKED',
  PendingDeletion = 'PENDING_DELETION',
  PendingMigration = 'PENDING_MIGRATION',
  PendingProvisioned = 'PENDING_PROVISIONED',
  Provisioned = 'PROVISIONED',
  TestActive = 'TEST_ACTIVE',
  TestActiveApex = 'TEST_ACTIVE_APEX',
  TestBlocked = 'TEST_BLOCKED',
  TestFailed = 'TEST_FAILED',
  TestPending = 'TEST_PENDING',
}

export type Dismissal = {
  __typename?: 'Dismissal';
  dismissalTimestamp: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  userGuid: Scalars['String']['output'];
};

export enum DnsRecordEnum {
  A = 'A',
  Cname = 'CNAME',
  Txt = 'TXT',
}

export type EdgeImpl = EdgeInterface & {
  __typename?: 'EdgeImpl';
  cursor: Scalars['String']['output'];
  node?: Maybe<NodeInterface>;
};

export type EdgeInterface = {
  cursor: Scalars['String']['output'];
  node?: Maybe<NodeInterface>;
};

export type FeaturedEntity = FeaturedEntityInterface &
  NodeInterface & {
    __typename?: 'FeaturedEntity';
    autoSubscribe: Scalars['Boolean']['output'];
    entityGuid: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    /** Gets entity name. */
    name: Scalars['String']['output'];
    recommended: Scalars['Boolean']['output'];
    tenantId: Scalars['String']['output'];
  };

export type FeaturedEntityConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'FeaturedEntityConnection';
    /** Gets connections edges. */
    edges: Array<EdgeInterface>;
    /** ID for GraphQL. */
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type FeaturedEntityEdge = EdgeInterface & {
  __typename?: 'FeaturedEntityEdge';
  /** Gets cursor for GraphQL. */
  cursor: Scalars['String']['output'];
  /** Gets ID for GraphQL. */
  id: Scalars['ID']['output'];
  /** Gets node - can be either a FeaturedUser or FeaturedGroup. */
  node?: Maybe<NodeInterface>;
  /** Gets type for GraphQL. */
  type: Scalars['String']['output'];
};

export type FeaturedEntityInput = {
  autoSubscribe?: InputMaybe<Scalars['Boolean']['input']>;
  entityGuid: Scalars['String']['input'];
  recommended?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FeaturedEntityInterface = {
  autoSubscribe: Scalars['Boolean']['output'];
  entityGuid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Gets entity name. */
  name: Scalars['String']['output'];
  recommended: Scalars['Boolean']['output'];
  tenantId: Scalars['String']['output'];
};

export enum FeaturedEntityTypeEnum {
  Group = 'GROUP',
  User = 'USER',
}

export type FeaturedGroup = FeaturedEntityInterface &
  NodeInterface & {
    __typename?: 'FeaturedGroup';
    autoSubscribe: Scalars['Boolean']['output'];
    entityGuid: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    /** Gets count of members. */
    membersCount: Scalars['Int']['output'];
    /** Gets group name. */
    name: Scalars['String']['output'];
    recommended: Scalars['Boolean']['output'];
    tenantId: Scalars['String']['output'];
  };

export type FeaturedUser = FeaturedEntityInterface &
  NodeInterface & {
    __typename?: 'FeaturedUser';
    autoSubscribe: Scalars['Boolean']['output'];
    entityGuid: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    /** Gets user's display name, or username. */
    name: Scalars['String']['output'];
    recommended: Scalars['Boolean']['output'];
    tenantId: Scalars['String']['output'];
    username?: Maybe<Scalars['String']['output']>;
  };

export type FeedExploreTagEdge = EdgeInterface & {
  __typename?: 'FeedExploreTagEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: FeedExploreTagNode;
  type: Scalars['String']['output'];
};

export type FeedExploreTagNode = NodeInterface & {
  __typename?: 'FeedExploreTagNode';
  id: Scalars['ID']['output'];
  tag: Scalars['String']['output'];
};

export type FeedHeaderEdge = EdgeInterface & {
  __typename?: 'FeedHeaderEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: FeedHeaderNode;
  type: Scalars['String']['output'];
};

export type FeedHeaderNode = NodeInterface & {
  __typename?: 'FeedHeaderNode';
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
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
  /** Whether the notice is dismissible */
  dismissible: Scalars['Boolean']['output'];
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
  /** Username of the gift card issuer */
  issuedByUsername?: Maybe<Scalars['String']['output']>;
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
  targetUsername?: InputMaybe<Scalars['String']['input']>;
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

export enum IllegalSubReasonEnum {
  AnimalAbuse = 'ANIMAL_ABUSE',
  Extortion = 'EXTORTION',
  Fraud = 'FRAUD',
  MinorsSexualization = 'MINORS_SEXUALIZATION',
  RevengePorn = 'REVENGE_PORN',
  Terrorism = 'TERRORISM',
  Trafficking = 'TRAFFICKING',
}

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export enum MultiTenantColorScheme {
  Dark = 'DARK',
  Light = 'LIGHT',
}

export type MultiTenantConfig = {
  __typename?: 'MultiTenantConfig';
  colorScheme?: Maybe<MultiTenantColorScheme>;
  communityGuidelines?: Maybe<Scalars['String']['output']>;
  lastCacheTimestamp?: Maybe<Scalars['Int']['output']>;
  primaryColor?: Maybe<Scalars['String']['output']>;
  siteEmail?: Maybe<Scalars['String']['output']>;
  siteName?: Maybe<Scalars['String']['output']>;
  updatedTimestamp?: Maybe<Scalars['Int']['output']>;
};

export type MultiTenantConfigInput = {
  colorScheme?: InputMaybe<MultiTenantColorScheme>;
  communityGuidelines?: InputMaybe<Scalars['String']['input']>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  siteEmail?: InputMaybe<Scalars['String']['input']>;
  siteName?: InputMaybe<Scalars['String']['input']>;
};

export type MultiTenantDomain = {
  __typename?: 'MultiTenantDomain';
  dnsRecord?: Maybe<MultiTenantDomainDnsRecord>;
  domain: Scalars['String']['output'];
  ownershipVerificationDnsRecord?: Maybe<MultiTenantDomainDnsRecord>;
  status: CustomHostnameStatusEnum;
  tenantId: Scalars['Int']['output'];
};

export type MultiTenantDomainDnsRecord = {
  __typename?: 'MultiTenantDomainDnsRecord';
  name: Scalars['String']['output'];
  type: DnsRecordEnum;
  value: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  claimGiftCard: GiftCardNode;
  /** Mark an onboarding step for a user as completed. */
  completeOnboardingStep: OnboardingStepProgressState;
  createGiftCard: GiftCardNode;
  createMultiTenantDomain: MultiTenantDomain;
  createNetworkRootUser: TenantUser;
  /** Create a new report. */
  createNewReport: Scalars['Boolean']['output'];
  createRssFeed: RssFeed;
  createTenant: Tenant;
  /** Deletes featured entity. */
  deleteFeaturedEntity: Scalars['Boolean']['output'];
  /** Dismiss a notice by its key. */
  dismiss: Dismissal;
  /** Sets multi-tenant config for the calling tenant. */
  multiTenantConfig: Scalars['Boolean']['output'];
  /** Provide a verdict for a report. */
  provideVerdict: Scalars['Boolean']['output'];
  refreshRssFeed: RssFeed;
  removeRssFeed?: Maybe<Scalars['Void']['output']>;
  /** Sets onboarding state for the currently logged in user. */
  setOnboardingState: OnboardingState;
  /** Stores featured entity. */
  storeFeaturedEntity: FeaturedEntityInterface;
  updateAccount: Array<Scalars['String']['output']>;
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

export type MutationCreateMultiTenantDomainArgs = {
  hostname: Scalars['String']['input'];
};

export type MutationCreateNetworkRootUserArgs = {
  networkUser?: InputMaybe<TenantUserInput>;
};

export type MutationCreateNewReportArgs = {
  reportInput: ReportInput;
};

export type MutationCreateRssFeedArgs = {
  rssFeed: RssFeedInput;
};

export type MutationCreateTenantArgs = {
  tenant?: InputMaybe<TenantInput>;
};

export type MutationDeleteFeaturedEntityArgs = {
  entityGuid: Scalars['String']['input'];
};

export type MutationDismissArgs = {
  key: Scalars['String']['input'];
};

export type MutationMultiTenantConfigArgs = {
  multiTenantConfigInput: MultiTenantConfigInput;
};

export type MutationProvideVerdictArgs = {
  verdictInput: VerdictInput;
};

export type MutationRefreshRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type MutationRemoveRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type MutationSetOnboardingStateArgs = {
  completed: Scalars['Boolean']['input'];
};

export type MutationStoreFeaturedEntityArgs = {
  featuredEntity: FeaturedEntityInput;
};

export type MutationUpdateAccountArgs = {
  currentUsername: Scalars['String']['input'];
  newEmail?: InputMaybe<Scalars['String']['input']>;
  newUsername?: InputMaybe<Scalars['String']['input']>;
  resetMFA?: InputMaybe<Scalars['Boolean']['input']>;
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

export enum NsfwSubReasonEnum {
  Nudity = 'NUDITY',
  Pornography = 'PORNOGRAPHY',
  Profanity = 'PROFANITY',
  RaceReligionGender = 'RACE_RELIGION_GENDER',
  ViolenceGore = 'VIOLENCE_GORE',
}

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
    dismissible: Scalars['Boolean']['output'];
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
  /** Gets Boosts. */
  boosts: BoostsConnection;
  /** Get dismissal by key. */
  dismissalByKey?: Maybe<Dismissal>;
  /** Get all of a users dismissals. */
  dismissals: Array<Dismissal>;
  /** Gets featured entities. */
  featuredEntities: FeaturedEntityConnection;
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
  /** Gets multi-tenant config for the calling tenant. */
  multiTenantConfig?: Maybe<MultiTenantConfig>;
  multiTenantDomain: MultiTenantDomain;
  newsfeed: NewsfeedConnection;
  /** Gets onboarding state for the currently logged in user. */
  onboardingState?: Maybe<OnboardingState>;
  /** Get the currently logged in users onboarding step progress. */
  onboardingStepProgress: Array<OnboardingStepProgressState>;
  /** Get a list of payment methods for the logged in user */
  paymentMethods: Array<PaymentMethod>;
  /** Gets reports. */
  reports: ReportsConnection;
  rssFeed: RssFeed;
  rssFeeds: Array<RssFeed>;
  search: SearchResultsConnection;
  tenants: Array<Tenant>;
};

export type QueryActivityArgs = {
  guid: Scalars['String']['input'];
};

export type QueryBoostsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  servedByGuid?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  targetAudience?: InputMaybe<Scalars['Int']['input']>;
  targetLocation?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryDismissalByKeyArgs = {
  key: Scalars['String']['input'];
};

export type QueryFeaturedEntitiesArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  type: FeaturedEntityTypeEnum;
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

export type QueryReportsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ReportStatusEnum>;
};

export type QueryRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type QuerySearchArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter: SearchFilterEnum;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  mediaType: SearchMediaTypeEnum;
  nsfw?: InputMaybe<Array<SearchNsfwEnum>>;
  query: Scalars['String']['input'];
};

export type QueryTenantsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type Report = NodeInterface & {
  __typename?: 'Report';
  action?: Maybe<ReportActionEnum>;
  createdTimestamp: Scalars['Int']['output'];
  cursor?: Maybe<Scalars['String']['output']>;
  /** Gets entity edge from entityUrn. */
  entityEdge?: Maybe<UnionActivityEdgeUserEdgeGroupEdgeCommentEdge>;
  entityGuid?: Maybe<Scalars['String']['output']>;
  entityUrn: Scalars['String']['output'];
  /** Gets ID for GraphQL. */
  id: Scalars['ID']['output'];
  illegalSubReason?: Maybe<IllegalSubReasonEnum>;
  moderatedByGuid?: Maybe<Scalars['String']['output']>;
  nsfwSubReason?: Maybe<NsfwSubReasonEnum>;
  reason: ReportReasonEnum;
  reportGuid?: Maybe<Scalars['String']['output']>;
  reportedByGuid?: Maybe<Scalars['String']['output']>;
  /** Gets reported user edge from reportedByGuid. */
  reportedByUserEdge?: Maybe<UserEdge>;
  securitySubReason?: Maybe<SecuritySubReasonEnum>;
  status: ReportStatusEnum;
  tenantId?: Maybe<Scalars['String']['output']>;
  updatedTimestamp?: Maybe<Scalars['Int']['output']>;
};

export enum ReportActionEnum {
  Ban = 'BAN',
  Delete = 'DELETE',
  Ignore = 'IGNORE',
}

export type ReportEdge = EdgeInterface & {
  __typename?: 'ReportEdge';
  /** Gets cursor for GraphQL. */
  cursor: Scalars['String']['output'];
  /** Gets ID for GraphQL. */
  id: Scalars['ID']['output'];
  /** Gets node. */
  node?: Maybe<Report>;
  /** Gets type for GraphQL. */
  type: Scalars['String']['output'];
};

export type ReportInput = {
  entityUrn: Scalars['String']['input'];
  illegalSubReason?: InputMaybe<IllegalSubReasonEnum>;
  nsfwSubReason?: InputMaybe<NsfwSubReasonEnum>;
  reason: ReportReasonEnum;
  securitySubReason?: InputMaybe<SecuritySubReasonEnum>;
};

export enum ReportReasonEnum {
  ActivityPubReport = 'ACTIVITY_PUB_REPORT',
  AnotherReason = 'ANOTHER_REASON',
  Harassment = 'HARASSMENT',
  Illegal = 'ILLEGAL',
  Impersonation = 'IMPERSONATION',
  InauthenticEngagement = 'INAUTHENTIC_ENGAGEMENT',
  IncitementToViolence = 'INCITEMENT_TO_VIOLENCE',
  IntellectualPropertyViolation = 'INTELLECTUAL_PROPERTY_VIOLATION',
  Malware = 'MALWARE',
  Nsfw = 'NSFW',
  PersonalConfidentialInformation = 'PERSONAL_CONFIDENTIAL_INFORMATION',
  Security = 'SECURITY',
  Spam = 'SPAM',
  ViolatesPremiumContentPolicy = 'VIOLATES_PREMIUM_CONTENT_POLICY',
}

export enum ReportStatusEnum {
  Actioned = 'ACTIONED',
  Pending = 'PENDING',
}

export type ReportsConnection = ConnectionInterface & {
  __typename?: 'ReportsConnection';
  /** Gets connections edges. */
  edges: Array<EdgeInterface>;
  /** ID for GraphQL. */
  id: Scalars['ID']['output'];
  pageInfo: PageInfo;
};

export type RssFeed = {
  __typename?: 'RssFeed';
  createdAtTimestamp?: Maybe<Scalars['Int']['output']>;
  feedId: Scalars['String']['output'];
  lastFetchAtTimestamp?: Maybe<Scalars['Int']['output']>;
  lastFetchStatus?: Maybe<RssFeedLastFetchStatusEnum>;
  tenantId?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
  userGuid: Scalars['String']['output'];
};

export type RssFeedInput = {
  url: Scalars['String']['input'];
};

export enum RssFeedLastFetchStatusEnum {
  FailedToConnect = 'FAILED_TO_CONNECT',
  FailedToParse = 'FAILED_TO_PARSE',
  Success = 'SUCCESS',
}

export enum SearchFilterEnum {
  Group = 'GROUP',
  Latest = 'LATEST',
  Top = 'TOP',
  User = 'USER',
}

export enum SearchMediaTypeEnum {
  All = 'ALL',
  Blog = 'BLOG',
  Image = 'IMAGE',
  Video = 'VIDEO',
}

export enum SearchNsfwEnum {
  Nudity = 'NUDITY',
  Other = 'OTHER',
  Pornography = 'PORNOGRAPHY',
  Profanity = 'PROFANITY',
  RaceReligion = 'RACE_RELIGION',
  Violence = 'VIOLENCE',
}

export type SearchResultsConnection = ConnectionInterface & {
  __typename?: 'SearchResultsConnection';
  /** The number of search records matching the query */
  count: Scalars['Int']['output'];
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type SearchResultsCount = {
  __typename?: 'SearchResultsCount';
  count: Scalars['Int']['output'];
};

export enum SecuritySubReasonEnum {
  HackedAccount = 'HACKED_ACCOUNT',
}

export type Tenant = {
  __typename?: 'Tenant';
  config?: Maybe<MultiTenantConfig>;
  domain?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  ownerGuid?: Maybe<Scalars['String']['output']>;
  rootUserGuid?: Maybe<Scalars['String']['output']>;
};

export type TenantInput = {
  config?: InputMaybe<MultiTenantConfigInput>;
  domain?: InputMaybe<Scalars['String']['input']>;
  ownerGuid?: InputMaybe<Scalars['Int']['input']>;
};

export type TenantUser = {
  __typename?: 'TenantUser';
  guid: Scalars['String']['output'];
  role: TenantUserRoleEnum;
  tenantId: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type TenantUserInput = {
  tenantId?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export enum TenantUserRoleEnum {
  Admin = 'ADMIN',
  Owner = 'OWNER',
  User = 'USER',
}

export type UnionActivityEdgeUserEdgeGroupEdgeCommentEdge =
  | ActivityEdge
  | CommentEdge
  | GroupEdge
  | UserEdge;

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

export type VerdictInput = {
  action: ReportActionEnum;
  reportGuid?: InputMaybe<Scalars['String']['input']>;
};

export type GetDismissalsQueryVariables = Exact<{ [key: string]: never }>;

export type GetDismissalsQuery = {
  __typename?: 'Query';
  dismissals: Array<{
    __typename?: 'Dismissal';
    userGuid: string;
    key: string;
    dismissalTimestamp: number;
  }>;
};

export type GetDismissalQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;

export type GetDismissalQuery = {
  __typename?: 'Query';
  dismissalByKey?: {
    __typename?: 'Dismissal';
    userGuid: string;
    key: string;
    dismissalTimestamp: number;
  } | null;
};

export type DismissMutationVariables = Exact<{
  key: Scalars['String']['input'];
}>;

export type DismissMutation = {
  __typename?: 'Mutation';
  dismiss: {
    __typename?: 'Dismissal';
    userGuid: string;
    key: string;
    dismissalTimestamp: number;
  };
};

export type GetOnboardingStateQueryVariables = Exact<{ [key: string]: never }>;

export type GetOnboardingStateQuery = {
  __typename?: 'Query';
  onboardingState?: {
    __typename?: 'OnboardingState';
    userGuid?: string | null;
    startedAt: number;
    completedAt?: number | null;
  } | null;
};

export type GetOnboardingStepProgressQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetOnboardingStepProgressQuery = {
  __typename?: 'Query';
  onboardingStepProgress: Array<{
    __typename?: 'OnboardingStepProgressState';
    userGuid?: string | null;
    stepKey: string;
    stepType: string;
    completedAt?: number | null;
  }>;
};

export type SetOnboardingStateMutationVariables = Exact<{
  completed: Scalars['Boolean']['input'];
}>;

export type SetOnboardingStateMutation = {
  __typename?: 'Mutation';
  setOnboardingState: {
    __typename?: 'OnboardingState';
    userGuid?: string | null;
    startedAt: number;
    completedAt?: number | null;
  };
};

export type PageInfoFragment = {
  __typename?: 'PageInfo';
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

export type FetchSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  filter: SearchFilterEnum;
  mediaType: SearchMediaTypeEnum;
  nsfw?: InputMaybe<Array<SearchNsfwEnum> | SearchNsfwEnum>;
  limit: Scalars['Int']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;

export type FetchSearchQuery = {
  __typename?: 'Query';
  search: {
    __typename?: 'SearchResultsConnection';
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
          __typename?: 'CommentEdge';
          cursor: string;
          node: { __typename?: 'CommentNode'; id: string };
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
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; id: string }
            | { __typename?: 'FeedHeaderNode'; id: string }
            | { __typename?: 'FeedHighlightsConnection'; id: string }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; legacy: string; id: string }
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
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename?: 'CommentNode'; id: string };
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
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
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
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename?: 'Report';
                        id: string;
                      } | null;
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
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; legacy: string; id: string }
            | null;
        }
      | {
          __typename?: 'FeaturedEntityEdge';
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
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; id: string }
            | { __typename?: 'FeedHeaderNode'; id: string }
            | { __typename?: 'FeedHighlightsConnection'; id: string }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; legacy: string; id: string }
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
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename?: 'CommentNode'; id: string };
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
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
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
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename?: 'Report';
                        id: string;
                      } | null;
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
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; legacy: string; id: string }
            | null;
        }
      | {
          __typename?: 'FeedExploreTagEdge';
          cursor: string;
          node: { __typename?: 'FeedExploreTagNode'; id: string };
        }
      | {
          __typename?: 'FeedHeaderEdge';
          cursor: string;
          node: { __typename?: 'FeedHeaderNode'; id: string };
        }
      | {
          __typename?: 'FeedHighlightsEdge';
          cursor: string;
          node: { __typename?: 'FeedHighlightsConnection'; id: string };
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
          node: { __typename?: 'GroupNode'; legacy: string; id: string };
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
                  __typename?: 'CommentEdge';
                  publisherNode: { __typename?: 'CommentNode'; id: string };
                }
              | {
                  __typename?: 'EdgeImpl';
                  publisherNode?:
                    | { __typename?: 'ActivityNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'CommentNode'; id: string }
                    | { __typename?: 'FeaturedEntity'; id: string }
                    | { __typename?: 'FeaturedEntityConnection'; id: string }
                    | { __typename?: 'FeaturedGroup'; id: string }
                    | { __typename?: 'FeaturedUser'; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeaturedEntityEdge';
                  publisherNode?:
                    | { __typename?: 'ActivityNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'CommentNode'; id: string }
                    | { __typename?: 'FeaturedEntity'; id: string }
                    | { __typename?: 'FeaturedEntityConnection'; id: string }
                    | { __typename?: 'FeaturedGroup'; id: string }
                    | { __typename?: 'FeaturedUser'; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeedExploreTagEdge';
                  publisherNode: {
                    __typename?: 'FeedExploreTagNode';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedHeaderEdge';
                  publisherNode: { __typename?: 'FeedHeaderNode'; id: string };
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
                  publisherNode: {
                    __typename?: 'GroupNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'PublisherRecsEdge';
                  publisherNode: {
                    __typename?: 'PublisherRecsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'ReportEdge';
                  publisherNode?: { __typename?: 'Report'; id: string } | null;
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
          __typename?: 'ReportEdge';
          cursor: string;
          node?: { __typename?: 'Report'; id: string } | null;
        }
      | {
          __typename?: 'UserEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; legacy: string; id: string };
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

export type CountSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  filter: SearchFilterEnum;
  mediaType: SearchMediaTypeEnum;
  nsfw?: InputMaybe<Array<SearchNsfwEnum> | SearchNsfwEnum>;
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;

export type CountSearchQuery = {
  __typename?: 'Query';
  search: {
    __typename?: 'SearchResultsConnection';
    count: number;
    pageInfo: {
      __typename?: 'PageInfo';
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
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

export type FetchNewsfeedQueryVariables = Exact<{
  algorithm: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  inFeedNoticesDelivered?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
}>;

export type FetchNewsfeedQuery = {
  __typename?: 'Query';
  newsfeed: {
    __typename?: 'NewsfeedConnection';
    edges: Array<
      | {
          __typename?: 'ActivityEdge';
          explicitVotes: boolean;
          cursor: string;
          node: { __typename: 'ActivityNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'BoostEdge';
          cursor: string;
          node: {
            __typename: 'BoostNode';
            goalButtonUrl?: string | null;
            goalButtonText?: number | null;
            legacy: string;
            id: string;
          };
        }
      | {
          __typename?: 'CommentEdge';
          cursor: string;
          node: { __typename: 'CommentNode'; id: string };
        }
      | {
          __typename?: 'EdgeImpl';
          cursor: string;
          node?:
            | { __typename: 'ActivityNode'; legacy: string; id: string }
            | {
                __typename: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename: 'CommentNode'; id: string }
            | { __typename: 'FeaturedEntity'; id: string }
            | { __typename: 'FeaturedEntityConnection'; id: string }
            | { __typename: 'FeaturedGroup'; id: string }
            | { __typename: 'FeaturedUser'; id: string }
            | { __typename: 'FeedExploreTagNode'; id: string }
            | { __typename: 'FeedHeaderNode'; id: string }
            | {
                __typename: 'FeedHighlightsConnection';
                id: string;
                edges: Array<{
                  __typename?: 'ActivityEdge';
                  node: {
                    __typename: 'ActivityNode';
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
                __typename: 'FeedNoticeNode';
                location: string;
                key: string;
                dismissible: boolean;
                id: string;
              }
            | { __typename: 'GiftCardNode'; id: string }
            | { __typename: 'GiftCardTransaction'; id: string }
            | { __typename: 'GroupNode'; id: string }
            | { __typename: 'NodeImpl'; id: string }
            | {
                __typename: 'PublisherRecsConnection';
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: { __typename: 'ActivityNode'; id: string };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename: 'CommentNode'; id: string };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'FeaturedEntity'; id: string }
                        | { __typename: 'FeaturedEntityConnection'; id: string }
                        | { __typename: 'FeaturedGroup'; id: string }
                        | { __typename: 'FeaturedUser'; id: string }
                        | { __typename: 'FeedExploreTagNode'; id: string }
                        | { __typename: 'FeedHeaderNode'; id: string }
                        | { __typename: 'FeedHighlightsConnection'; id: string }
                        | { __typename: 'FeedNoticeNode'; id: string }
                        | { __typename: 'GiftCardNode'; id: string }
                        | { __typename: 'GiftCardTransaction'; id: string }
                        | {
                            __typename: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode?:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'FeaturedEntity'; id: string }
                        | { __typename: 'FeaturedEntityConnection'; id: string }
                        | { __typename: 'FeaturedGroup'; id: string }
                        | { __typename: 'FeaturedUser'; id: string }
                        | { __typename: 'FeedExploreTagNode'; id: string }
                        | { __typename: 'FeedHeaderNode'; id: string }
                        | { __typename: 'FeedHighlightsConnection'; id: string }
                        | { __typename: 'FeedNoticeNode'; id: string }
                        | { __typename: 'GiftCardNode'; id: string }
                        | { __typename: 'GiftCardTransaction'; id: string }
                        | {
                            __typename: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: { __typename: 'GiftCardNode'; id: string };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename: 'Report';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename: 'UserNode';
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
            | { __typename: 'Report'; id: string }
            | { __typename: 'UserNode'; id: string }
            | null;
        }
      | {
          __typename?: 'FeaturedEntityEdge';
          cursor: string;
          node?:
            | { __typename: 'ActivityNode'; legacy: string; id: string }
            | {
                __typename: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename: 'CommentNode'; id: string }
            | { __typename: 'FeaturedEntity'; id: string }
            | { __typename: 'FeaturedEntityConnection'; id: string }
            | { __typename: 'FeaturedGroup'; id: string }
            | { __typename: 'FeaturedUser'; id: string }
            | { __typename: 'FeedExploreTagNode'; id: string }
            | { __typename: 'FeedHeaderNode'; id: string }
            | {
                __typename: 'FeedHighlightsConnection';
                id: string;
                edges: Array<{
                  __typename?: 'ActivityEdge';
                  node: {
                    __typename: 'ActivityNode';
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
                __typename: 'FeedNoticeNode';
                location: string;
                key: string;
                dismissible: boolean;
                id: string;
              }
            | { __typename: 'GiftCardNode'; id: string }
            | { __typename: 'GiftCardTransaction'; id: string }
            | { __typename: 'GroupNode'; id: string }
            | { __typename: 'NodeImpl'; id: string }
            | {
                __typename: 'PublisherRecsConnection';
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: { __typename: 'ActivityNode'; id: string };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename: 'CommentNode'; id: string };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'FeaturedEntity'; id: string }
                        | { __typename: 'FeaturedEntityConnection'; id: string }
                        | { __typename: 'FeaturedGroup'; id: string }
                        | { __typename: 'FeaturedUser'; id: string }
                        | { __typename: 'FeedExploreTagNode'; id: string }
                        | { __typename: 'FeedHeaderNode'; id: string }
                        | { __typename: 'FeedHighlightsConnection'; id: string }
                        | { __typename: 'FeedNoticeNode'; id: string }
                        | { __typename: 'GiftCardNode'; id: string }
                        | { __typename: 'GiftCardTransaction'; id: string }
                        | {
                            __typename: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode?:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'FeaturedEntity'; id: string }
                        | { __typename: 'FeaturedEntityConnection'; id: string }
                        | { __typename: 'FeaturedGroup'; id: string }
                        | { __typename: 'FeaturedUser'; id: string }
                        | { __typename: 'FeedExploreTagNode'; id: string }
                        | { __typename: 'FeedHeaderNode'; id: string }
                        | { __typename: 'FeedHighlightsConnection'; id: string }
                        | { __typename: 'FeedNoticeNode'; id: string }
                        | { __typename: 'GiftCardNode'; id: string }
                        | { __typename: 'GiftCardTransaction'; id: string }
                        | {
                            __typename: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: { __typename: 'GiftCardNode'; id: string };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename: 'Report';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename: 'UserNode';
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
            | { __typename: 'Report'; id: string }
            | { __typename: 'UserNode'; id: string }
            | null;
        }
      | {
          __typename?: 'FeedExploreTagEdge';
          cursor: string;
          node: { __typename: 'FeedExploreTagNode'; id: string };
        }
      | {
          __typename?: 'FeedHeaderEdge';
          cursor: string;
          node: { __typename: 'FeedHeaderNode'; id: string };
        }
      | {
          __typename?: 'FeedHighlightsEdge';
          cursor: string;
          node: {
            __typename: 'FeedHighlightsConnection';
            id: string;
            edges: Array<{
              __typename?: 'ActivityEdge';
              node: { __typename: 'ActivityNode'; id: string; legacy: string };
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
            __typename: 'FeedNoticeNode';
            location: string;
            key: string;
            dismissible: boolean;
            id: string;
          };
        }
      | {
          __typename?: 'GiftCardEdge';
          cursor: string;
          node: { __typename: 'GiftCardNode'; id: string };
        }
      | {
          __typename?: 'GiftCardTransactionEdge';
          cursor: string;
          node: { __typename: 'GiftCardTransaction'; id: string };
        }
      | {
          __typename?: 'GroupEdge';
          cursor: string;
          node: { __typename: 'GroupNode'; id: string };
        }
      | {
          __typename?: 'PublisherRecsEdge';
          cursor: string;
          node: {
            __typename: 'PublisherRecsConnection';
            id: string;
            edges: Array<
              | {
                  __typename?: 'ActivityEdge';
                  publisherNode: { __typename: 'ActivityNode'; id: string };
                }
              | {
                  __typename?: 'BoostEdge';
                  publisherNode: {
                    __typename: 'BoostNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'CommentEdge';
                  publisherNode: { __typename: 'CommentNode'; id: string };
                }
              | {
                  __typename?: 'EdgeImpl';
                  publisherNode?:
                    | { __typename: 'ActivityNode'; id: string }
                    | { __typename: 'BoostNode'; legacy: string; id: string }
                    | { __typename: 'CommentNode'; id: string }
                    | { __typename: 'FeaturedEntity'; id: string }
                    | { __typename: 'FeaturedEntityConnection'; id: string }
                    | { __typename: 'FeaturedGroup'; id: string }
                    | { __typename: 'FeaturedUser'; id: string }
                    | { __typename: 'FeedExploreTagNode'; id: string }
                    | { __typename: 'FeedHeaderNode'; id: string }
                    | { __typename: 'FeedHighlightsConnection'; id: string }
                    | { __typename: 'FeedNoticeNode'; id: string }
                    | { __typename: 'GiftCardNode'; id: string }
                    | { __typename: 'GiftCardTransaction'; id: string }
                    | { __typename: 'GroupNode'; legacy: string; id: string }
                    | { __typename: 'NodeImpl'; id: string }
                    | { __typename: 'PublisherRecsConnection'; id: string }
                    | { __typename: 'Report'; id: string }
                    | { __typename: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeaturedEntityEdge';
                  publisherNode?:
                    | { __typename: 'ActivityNode'; id: string }
                    | { __typename: 'BoostNode'; legacy: string; id: string }
                    | { __typename: 'CommentNode'; id: string }
                    | { __typename: 'FeaturedEntity'; id: string }
                    | { __typename: 'FeaturedEntityConnection'; id: string }
                    | { __typename: 'FeaturedGroup'; id: string }
                    | { __typename: 'FeaturedUser'; id: string }
                    | { __typename: 'FeedExploreTagNode'; id: string }
                    | { __typename: 'FeedHeaderNode'; id: string }
                    | { __typename: 'FeedHighlightsConnection'; id: string }
                    | { __typename: 'FeedNoticeNode'; id: string }
                    | { __typename: 'GiftCardNode'; id: string }
                    | { __typename: 'GiftCardTransaction'; id: string }
                    | { __typename: 'GroupNode'; legacy: string; id: string }
                    | { __typename: 'NodeImpl'; id: string }
                    | { __typename: 'PublisherRecsConnection'; id: string }
                    | { __typename: 'Report'; id: string }
                    | { __typename: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeedExploreTagEdge';
                  publisherNode: {
                    __typename: 'FeedExploreTagNode';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedHeaderEdge';
                  publisherNode: { __typename: 'FeedHeaderNode'; id: string };
                }
              | {
                  __typename?: 'FeedHighlightsEdge';
                  publisherNode: {
                    __typename: 'FeedHighlightsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedNoticeEdge';
                  publisherNode: { __typename: 'FeedNoticeNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardEdge';
                  publisherNode: { __typename: 'GiftCardNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardTransactionEdge';
                  publisherNode: {
                    __typename: 'GiftCardTransaction';
                    id: string;
                  };
                }
              | {
                  __typename?: 'GroupEdge';
                  publisherNode: {
                    __typename: 'GroupNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'PublisherRecsEdge';
                  publisherNode: {
                    __typename: 'PublisherRecsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'ReportEdge';
                  publisherNode?: { __typename: 'Report'; id: string } | null;
                }
              | {
                  __typename?: 'UserEdge';
                  publisherNode: {
                    __typename: 'UserNode';
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
          __typename?: 'ReportEdge';
          cursor: string;
          node?: { __typename: 'Report'; id: string } | null;
        }
      | {
          __typename?: 'UserEdge';
          cursor: string;
          node: { __typename: 'UserNode'; id: string };
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

export type CreateRssFeedMutationVariables = Exact<{
  url: Scalars['String']['input'];
}>;

export type CreateRssFeedMutation = {
  __typename?: 'Mutation';
  createRssFeed: {
    __typename?: 'RssFeed';
    feedId: string;
    userGuid: string;
    title: string;
    url: string;
    tenantId?: number | null;
    createdAtTimestamp?: number | null;
    lastFetchAtTimestamp?: number | null;
    lastFetchStatus?: RssFeedLastFetchStatusEnum | null;
  };
};

export type RemoveRssFeedMutationVariables = Exact<{
  feedId: Scalars['String']['input'];
}>;

export type RemoveRssFeedMutation = {
  __typename?: 'Mutation';
  removeRssFeed?: any | null;
};

export type GetRssFeedsQueryVariables = Exact<{ [key: string]: never }>;

export type GetRssFeedsQuery = {
  __typename?: 'Query';
  rssFeeds: Array<{
    __typename?: 'RssFeed';
    feedId: string;
    userGuid: string;
    tenantId?: number | null;
    title: string;
    url: string;
    createdAtTimestamp?: number | null;
    lastFetchAtTimestamp?: number | null;
    lastFetchStatus?: RssFeedLastFetchStatusEnum | null;
  }>;
};

export type RefreshRssFeedMutationVariables = Exact<{
  feedId: Scalars['String']['input'];
}>;

export type RefreshRssFeedMutation = {
  __typename?: 'Mutation';
  refreshRssFeed: {
    __typename?: 'RssFeed';
    feedId: string;
    userGuid: string;
    title: string;
    url: string;
    tenantId?: number | null;
    createdAtTimestamp?: number | null;
    lastFetchAtTimestamp?: number | null;
    lastFetchStatus?: RssFeedLastFetchStatusEnum | null;
  };
};

export const PageInfoFragmentDoc = `
    fragment PageInfo on PageInfo {
  hasPreviousPage
  hasNextPage
  startCursor
  endCursor
}
    `;
export const GetDismissalsDocument = `
    query GetDismissals {
  dismissals {
    userGuid
    key
    dismissalTimestamp
  }
}
    `;
export const useGetDismissalsQuery = <
  TData = GetDismissalsQuery,
  TError = unknown,
>(
  variables?: GetDismissalsQueryVariables,
  options?: UseQueryOptions<GetDismissalsQuery, TError, TData>,
) =>
  useQuery<GetDismissalsQuery, TError, TData>(
    variables === undefined ? ['GetDismissals'] : ['GetDismissals', variables],
    gqlFetcher<GetDismissalsQuery, GetDismissalsQueryVariables>(
      GetDismissalsDocument,
      variables,
    ),
    options,
  );
export const useInfiniteGetDismissalsQuery = <
  TData = GetDismissalsQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetDismissalsQueryVariables,
  variables?: GetDismissalsQueryVariables,
  options?: UseInfiniteQueryOptions<GetDismissalsQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetDismissalsQuery, TError, TData>(
    variables === undefined
      ? ['GetDismissals.infinite']
      : ['GetDismissals.infinite', variables],
    metaData =>
      gqlFetcher<GetDismissalsQuery, GetDismissalsQueryVariables>(
        GetDismissalsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useGetDismissalsQuery.fetcher = (
  variables?: GetDismissalsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetDismissalsQuery, GetDismissalsQueryVariables>(
    GetDismissalsDocument,
    variables,
    options,
  );
export const GetDismissalDocument = `
    query GetDismissal($key: String!) {
  dismissalByKey(key: $key) {
    userGuid
    key
    dismissalTimestamp
  }
}
    `;
export const useGetDismissalQuery = <
  TData = GetDismissalQuery,
  TError = unknown,
>(
  variables: GetDismissalQueryVariables,
  options?: UseQueryOptions<GetDismissalQuery, TError, TData>,
) =>
  useQuery<GetDismissalQuery, TError, TData>(
    ['GetDismissal', variables],
    gqlFetcher<GetDismissalQuery, GetDismissalQueryVariables>(
      GetDismissalDocument,
      variables,
    ),
    options,
  );
export const useInfiniteGetDismissalQuery = <
  TData = GetDismissalQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetDismissalQueryVariables,
  variables: GetDismissalQueryVariables,
  options?: UseInfiniteQueryOptions<GetDismissalQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetDismissalQuery, TError, TData>(
    ['GetDismissal.infinite', variables],
    metaData =>
      gqlFetcher<GetDismissalQuery, GetDismissalQueryVariables>(
        GetDismissalDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useGetDismissalQuery.fetcher = (
  variables: GetDismissalQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetDismissalQuery, GetDismissalQueryVariables>(
    GetDismissalDocument,
    variables,
    options,
  );
export const DismissDocument = `
    mutation Dismiss($key: String!) {
  dismiss(key: $key) {
    userGuid
    key
    dismissalTimestamp
  }
}
    `;
export const useDismissMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DismissMutation,
    TError,
    DismissMutationVariables,
    TContext
  >,
) =>
  useMutation<DismissMutation, TError, DismissMutationVariables, TContext>(
    ['Dismiss'],
    (variables?: DismissMutationVariables) =>
      gqlFetcher<DismissMutation, DismissMutationVariables>(
        DismissDocument,
        variables,
      )(),
    options,
  );
useDismissMutation.fetcher = (
  variables: DismissMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<DismissMutation, DismissMutationVariables>(
    DismissDocument,
    variables,
    options,
  );
export const GetOnboardingStateDocument = `
    query GetOnboardingState {
  onboardingState {
    userGuid
    startedAt
    completedAt
  }
}
    `;
export const useGetOnboardingStateQuery = <
  TData = GetOnboardingStateQuery,
  TError = unknown,
>(
  variables?: GetOnboardingStateQueryVariables,
  options?: UseQueryOptions<GetOnboardingStateQuery, TError, TData>,
) =>
  useQuery<GetOnboardingStateQuery, TError, TData>(
    variables === undefined
      ? ['GetOnboardingState']
      : ['GetOnboardingState', variables],
    gqlFetcher<GetOnboardingStateQuery, GetOnboardingStateQueryVariables>(
      GetOnboardingStateDocument,
      variables,
    ),
    options,
  );
export const useInfiniteGetOnboardingStateQuery = <
  TData = GetOnboardingStateQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetOnboardingStateQueryVariables,
  variables?: GetOnboardingStateQueryVariables,
  options?: UseInfiniteQueryOptions<GetOnboardingStateQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetOnboardingStateQuery, TError, TData>(
    variables === undefined
      ? ['GetOnboardingState.infinite']
      : ['GetOnboardingState.infinite', variables],
    metaData =>
      gqlFetcher<GetOnboardingStateQuery, GetOnboardingStateQueryVariables>(
        GetOnboardingStateDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useGetOnboardingStateQuery.fetcher = (
  variables?: GetOnboardingStateQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetOnboardingStateQuery, GetOnboardingStateQueryVariables>(
    GetOnboardingStateDocument,
    variables,
    options,
  );
export const GetOnboardingStepProgressDocument = `
    query GetOnboardingStepProgress {
  onboardingStepProgress {
    userGuid
    stepKey
    stepType
    completedAt
  }
}
    `;
export const useGetOnboardingStepProgressQuery = <
  TData = GetOnboardingStepProgressQuery,
  TError = unknown,
>(
  variables?: GetOnboardingStepProgressQueryVariables,
  options?: UseQueryOptions<GetOnboardingStepProgressQuery, TError, TData>,
) =>
  useQuery<GetOnboardingStepProgressQuery, TError, TData>(
    variables === undefined
      ? ['GetOnboardingStepProgress']
      : ['GetOnboardingStepProgress', variables],
    gqlFetcher<
      GetOnboardingStepProgressQuery,
      GetOnboardingStepProgressQueryVariables
    >(GetOnboardingStepProgressDocument, variables),
    options,
  );
export const useInfiniteGetOnboardingStepProgressQuery = <
  TData = GetOnboardingStepProgressQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetOnboardingStepProgressQueryVariables,
  variables?: GetOnboardingStepProgressQueryVariables,
  options?: UseInfiniteQueryOptions<
    GetOnboardingStepProgressQuery,
    TError,
    TData
  >,
) => {
  return useInfiniteQuery<GetOnboardingStepProgressQuery, TError, TData>(
    variables === undefined
      ? ['GetOnboardingStepProgress.infinite']
      : ['GetOnboardingStepProgress.infinite', variables],
    metaData =>
      gqlFetcher<
        GetOnboardingStepProgressQuery,
        GetOnboardingStepProgressQueryVariables
      >(GetOnboardingStepProgressDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options,
  );
};

useGetOnboardingStepProgressQuery.fetcher = (
  variables?: GetOnboardingStepProgressQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    GetOnboardingStepProgressQuery,
    GetOnboardingStepProgressQueryVariables
  >(GetOnboardingStepProgressDocument, variables, options);
export const SetOnboardingStateDocument = `
    mutation SetOnboardingState($completed: Boolean!) {
  setOnboardingState(completed: $completed) {
    userGuid
    startedAt
    completedAt
  }
}
    `;
export const useSetOnboardingStateMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    SetOnboardingStateMutation,
    TError,
    SetOnboardingStateMutationVariables,
    TContext
  >,
) =>
  useMutation<
    SetOnboardingStateMutation,
    TError,
    SetOnboardingStateMutationVariables,
    TContext
  >(
    ['SetOnboardingState'],
    (variables?: SetOnboardingStateMutationVariables) =>
      gqlFetcher<
        SetOnboardingStateMutation,
        SetOnboardingStateMutationVariables
      >(SetOnboardingStateDocument, variables)(),
    options,
  );
useSetOnboardingStateMutation.fetcher = (
  variables: SetOnboardingStateMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<SetOnboardingStateMutation, SetOnboardingStateMutationVariables>(
    SetOnboardingStateDocument,
    variables,
    options,
  );
export const FetchSearchDocument = `
    query FetchSearch($query: String!, $filter: SearchFilterEnum!, $mediaType: SearchMediaTypeEnum!, $nsfw: [SearchNsfwEnum!], $limit: Int!, $cursor: String) {
  search(
    query: $query
    filter: $filter
    mediaType: $mediaType
    nsfw: $nsfw
    first: $limit
    after: $cursor
  ) {
    edges {
      cursor
      node {
        id
        ... on ActivityNode {
          legacy
        }
        ... on UserNode {
          legacy
        }
        ... on GroupNode {
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
              ... on GroupNode {
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
export const useFetchSearchQuery = <TData = FetchSearchQuery, TError = unknown>(
  variables: FetchSearchQueryVariables,
  options?: UseQueryOptions<FetchSearchQuery, TError, TData>,
) =>
  useQuery<FetchSearchQuery, TError, TData>(
    ['FetchSearch', variables],
    gqlFetcher<FetchSearchQuery, FetchSearchQueryVariables>(
      FetchSearchDocument,
      variables,
    ),
    options,
  );
export const useInfiniteFetchSearchQuery = <
  TData = FetchSearchQuery,
  TError = unknown,
>(
  pageParamKey: keyof FetchSearchQueryVariables,
  variables: FetchSearchQueryVariables,
  options?: UseInfiniteQueryOptions<FetchSearchQuery, TError, TData>,
) => {
  return useInfiniteQuery<FetchSearchQuery, TError, TData>(
    ['FetchSearch.infinite', variables],
    metaData =>
      gqlFetcher<FetchSearchQuery, FetchSearchQueryVariables>(
        FetchSearchDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useFetchSearchQuery.fetcher = (
  variables: FetchSearchQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<FetchSearchQuery, FetchSearchQueryVariables>(
    FetchSearchDocument,
    variables,
    options,
  );
export const CountSearchDocument = `
    query CountSearch($query: String!, $filter: SearchFilterEnum!, $mediaType: SearchMediaTypeEnum!, $nsfw: [SearchNsfwEnum!], $cursor: String) {
  search(
    query: $query
    filter: $filter
    mediaType: $mediaType
    nsfw: $nsfw
    before: $cursor
  ) {
    count
    pageInfo {
      ...PageInfo
    }
  }
}
    ${PageInfoFragmentDoc}`;
export const useCountSearchQuery = <TData = CountSearchQuery, TError = unknown>(
  variables: CountSearchQueryVariables,
  options?: UseQueryOptions<CountSearchQuery, TError, TData>,
) =>
  useQuery<CountSearchQuery, TError, TData>(
    ['CountSearch', variables],
    gqlFetcher<CountSearchQuery, CountSearchQueryVariables>(
      CountSearchDocument,
      variables,
    ),
    options,
  );
export const useInfiniteCountSearchQuery = <
  TData = CountSearchQuery,
  TError = unknown,
>(
  pageParamKey: keyof CountSearchQueryVariables,
  variables: CountSearchQueryVariables,
  options?: UseInfiniteQueryOptions<CountSearchQuery, TError, TData>,
) => {
  return useInfiniteQuery<CountSearchQuery, TError, TData>(
    ['CountSearch.infinite', variables],
    metaData =>
      gqlFetcher<CountSearchQuery, CountSearchQueryVariables>(
        CountSearchDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useCountSearchQuery.fetcher = (
  variables: CountSearchQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<CountSearchQuery, CountSearchQueryVariables>(
    CountSearchDocument,
    variables,
    options,
  );
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
export const FetchNewsfeedDocument = `
    query FetchNewsfeed($algorithm: String!, $limit: Int!, $cursor: String, $inFeedNoticesDelivered: [String!]) {
  newsfeed(
    algorithm: $algorithm
    first: $limit
    after: $cursor
    inFeedNoticesDelivered: $inFeedNoticesDelivered
  ) {
    edges {
      cursor
      ... on ActivityEdge {
        explicitVotes
      }
      node {
        id
        __typename
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
          dismissible
        }
        ... on FeedHighlightsConnection {
          edges {
            node {
              __typename
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
              __typename
              id
              ... on UserNode {
                legacy
              }
              ... on BoostNode {
                legacy
              }
              ... on GroupNode {
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
export const useFetchNewsfeedQuery = <
  TData = FetchNewsfeedQuery,
  TError = unknown,
>(
  variables: FetchNewsfeedQueryVariables,
  options?: UseQueryOptions<FetchNewsfeedQuery, TError, TData>,
) =>
  useQuery<FetchNewsfeedQuery, TError, TData>(
    ['FetchNewsfeed', variables],
    gqlFetcher<FetchNewsfeedQuery, FetchNewsfeedQueryVariables>(
      FetchNewsfeedDocument,
      variables,
    ),
    options,
  );
export const useInfiniteFetchNewsfeedQuery = <
  TData = FetchNewsfeedQuery,
  TError = unknown,
>(
  pageParamKey: keyof FetchNewsfeedQueryVariables,
  variables: FetchNewsfeedQueryVariables,
  options?: UseInfiniteQueryOptions<FetchNewsfeedQuery, TError, TData>,
) => {
  return useInfiniteQuery<FetchNewsfeedQuery, TError, TData>(
    ['FetchNewsfeed.infinite', variables],
    metaData =>
      gqlFetcher<FetchNewsfeedQuery, FetchNewsfeedQueryVariables>(
        FetchNewsfeedDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useFetchNewsfeedQuery.fetcher = (
  variables: FetchNewsfeedQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<FetchNewsfeedQuery, FetchNewsfeedQueryVariables>(
    FetchNewsfeedDocument,
    variables,
    options,
  );
export const CreateRssFeedDocument = `
    mutation CreateRssFeed($url: String!) {
  createRssFeed(rssFeed: {url: $url}) {
    feedId
    userGuid
    title
    url
    tenantId
    createdAtTimestamp
    lastFetchAtTimestamp
    lastFetchStatus
  }
}
    `;
export const useCreateRssFeedMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateRssFeedMutation,
    TError,
    CreateRssFeedMutationVariables,
    TContext
  >,
) =>
  useMutation<
    CreateRssFeedMutation,
    TError,
    CreateRssFeedMutationVariables,
    TContext
  >(
    ['CreateRssFeed'],
    (variables?: CreateRssFeedMutationVariables) =>
      gqlFetcher<CreateRssFeedMutation, CreateRssFeedMutationVariables>(
        CreateRssFeedDocument,
        variables,
      )(),
    options,
  );
useCreateRssFeedMutation.fetcher = (
  variables: CreateRssFeedMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<CreateRssFeedMutation, CreateRssFeedMutationVariables>(
    CreateRssFeedDocument,
    variables,
    options,
  );
export const RemoveRssFeedDocument = `
    mutation RemoveRssFeed($feedId: String!) {
  removeRssFeed(feedId: $feedId)
}
    `;
export const useRemoveRssFeedMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    RemoveRssFeedMutation,
    TError,
    RemoveRssFeedMutationVariables,
    TContext
  >,
) =>
  useMutation<
    RemoveRssFeedMutation,
    TError,
    RemoveRssFeedMutationVariables,
    TContext
  >(
    ['RemoveRssFeed'],
    (variables?: RemoveRssFeedMutationVariables) =>
      gqlFetcher<RemoveRssFeedMutation, RemoveRssFeedMutationVariables>(
        RemoveRssFeedDocument,
        variables,
      )(),
    options,
  );
useRemoveRssFeedMutation.fetcher = (
  variables: RemoveRssFeedMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<RemoveRssFeedMutation, RemoveRssFeedMutationVariables>(
    RemoveRssFeedDocument,
    variables,
    options,
  );
export const GetRssFeedsDocument = `
    query GetRssFeeds {
  rssFeeds {
    feedId
    userGuid
    tenantId
    title
    url
    createdAtTimestamp
    lastFetchAtTimestamp
    lastFetchStatus
  }
}
    `;
export const useGetRssFeedsQuery = <TData = GetRssFeedsQuery, TError = unknown>(
  variables?: GetRssFeedsQueryVariables,
  options?: UseQueryOptions<GetRssFeedsQuery, TError, TData>,
) =>
  useQuery<GetRssFeedsQuery, TError, TData>(
    variables === undefined ? ['GetRssFeeds'] : ['GetRssFeeds', variables],
    gqlFetcher<GetRssFeedsQuery, GetRssFeedsQueryVariables>(
      GetRssFeedsDocument,
      variables,
    ),
    options,
  );
export const useInfiniteGetRssFeedsQuery = <
  TData = GetRssFeedsQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetRssFeedsQueryVariables,
  variables?: GetRssFeedsQueryVariables,
  options?: UseInfiniteQueryOptions<GetRssFeedsQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetRssFeedsQuery, TError, TData>(
    variables === undefined
      ? ['GetRssFeeds.infinite']
      : ['GetRssFeeds.infinite', variables],
    metaData =>
      gqlFetcher<GetRssFeedsQuery, GetRssFeedsQueryVariables>(
        GetRssFeedsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useGetRssFeedsQuery.fetcher = (
  variables?: GetRssFeedsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetRssFeedsQuery, GetRssFeedsQueryVariables>(
    GetRssFeedsDocument,
    variables,
    options,
  );
export const RefreshRssFeedDocument = `
    mutation RefreshRssFeed($feedId: String!) {
  refreshRssFeed(feedId: $feedId) {
    feedId
    userGuid
    title
    url
    tenantId
    createdAtTimestamp
    lastFetchAtTimestamp
    lastFetchStatus
  }
}
    `;
export const useRefreshRssFeedMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    RefreshRssFeedMutation,
    TError,
    RefreshRssFeedMutationVariables,
    TContext
  >,
) =>
  useMutation<
    RefreshRssFeedMutation,
    TError,
    RefreshRssFeedMutationVariables,
    TContext
  >(
    ['RefreshRssFeed'],
    (variables?: RefreshRssFeedMutationVariables) =>
      gqlFetcher<RefreshRssFeedMutation, RefreshRssFeedMutationVariables>(
        RefreshRssFeedDocument,
        variables,
      )(),
    options,
  );
useRefreshRssFeedMutation.fetcher = (
  variables: RefreshRssFeedMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<RefreshRssFeedMutation, RefreshRssFeedMutationVariables>(
    RefreshRssFeedDocument,
    variables,
    options,
  );
