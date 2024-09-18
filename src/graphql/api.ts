import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { gqlFetcher } from '~/common/services/gqlFetcher';
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
  DateTime: { input: any; output: any };
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

export type AddOn = {
  __typename?: 'AddOn';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inBasket: Scalars['Boolean']['output'];
  monthlyFeeCents?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  oneTimeFeeCents?: Maybe<Scalars['Int']['output']>;
  perks?: Maybe<Array<Scalars['String']['output']>>;
  perksTitle: Scalars['String']['output'];
};

export type AddOnSummary = {
  __typename?: 'AddOnSummary';
  id: Scalars['String']['output'];
  monthlyFeeCents?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  oneTimeFeeCents?: Maybe<Scalars['Int']['output']>;
};

export type AnalyticsChartBucketType = {
  __typename?: 'AnalyticsChartBucketType';
  date: Scalars['String']['output'];
  key: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type AnalyticsChartSegmentType = {
  __typename?: 'AnalyticsChartSegmentType';
  buckets: Array<AnalyticsChartBucketType>;
  label: Scalars['String']['output'];
};

export type AnalyticsChartType = {
  __typename?: 'AnalyticsChartType';
  metric: AnalyticsMetricEnum;
  segments: Array<AnalyticsChartSegmentType>;
};

export type AnalyticsKpiType = {
  __typename?: 'AnalyticsKpiType';
  metric: AnalyticsMetricEnum;
  previousPeriodValue: Scalars['Int']['output'];
  value: Scalars['Int']['output'];
};

export enum AnalyticsMetricEnum {
  DailyActiveUsers = 'DAILY_ACTIVE_USERS',
  MeanSessionSecs = 'MEAN_SESSION_SECS',
  NewUsers = 'NEW_USERS',
  TotalSiteMembershipSubscriptions = 'TOTAL_SITE_MEMBERSHIP_SUBSCRIPTIONS',
  TotalUsers = 'TOTAL_USERS',
  Visitors = 'VISITORS',
}

export type AnalyticsTableConnection = ConnectionInterface & {
  __typename?: 'AnalyticsTableConnection';
  edges: Array<AnalyticsTableRowEdge>;
  pageInfo: PageInfo;
  table: AnalyticsTableEnum;
};

export enum AnalyticsTableEnum {
  PopularActivities = 'POPULAR_ACTIVITIES',
  PopularGroups = 'POPULAR_GROUPS',
  PopularUsers = 'POPULAR_USERS',
}

export type AnalyticsTableRowActivityNode = AnalyticsTableRowNodeInterface &
  NodeInterface & {
    __typename?: 'AnalyticsTableRowActivityNode';
    activity: ActivityNode;
    engagements: Scalars['Int']['output'];
    id: Scalars['ID']['output'];
    views: Scalars['Int']['output'];
  };

export type AnalyticsTableRowEdge = EdgeInterface & {
  __typename?: 'AnalyticsTableRowEdge';
  cursor: Scalars['String']['output'];
  node: NodeInterface;
};

export type AnalyticsTableRowGroupNode = AnalyticsTableRowNodeInterface &
  NodeInterface & {
    __typename?: 'AnalyticsTableRowGroupNode';
    group: GroupNode;
    id: Scalars['ID']['output'];
    newMembers: Scalars['Int']['output'];
  };

export type AnalyticsTableRowNodeImpl = AnalyticsTableRowNodeInterface & {
  __typename?: 'AnalyticsTableRowNodeImpl';
  id: Scalars['ID']['output'];
};

export type AnalyticsTableRowNodeInterface = {
  id: Scalars['ID']['output'];
};

export type AnalyticsTableRowUserNode = AnalyticsTableRowNodeInterface &
  NodeInterface & {
    __typename?: 'AnalyticsTableRowUserNode';
    id: Scalars['ID']['output'];
    newSubscribers: Scalars['Int']['output'];
    totalSubscribers: Scalars['Int']['output'];
    user: UserNode;
  };

export enum ApiScopeEnum {
  All = 'ALL',
  SiteMembershipWrite = 'SITE_MEMBERSHIP_WRITE',
  TenantCreateTrial = 'TENANT_CREATE_TRIAL',
}

export type AppReadyMobileConfig = {
  __typename?: 'AppReadyMobileConfig';
  ACCENT_COLOR_DARK: Scalars['String']['output'];
  ACCENT_COLOR_LIGHT: Scalars['String']['output'];
  API_URL: Scalars['String']['output'];
  APP_ANDROID_PACKAGE?: Maybe<Scalars['String']['output']>;
  APP_HOST: Scalars['String']['output'];
  APP_IOS_BUNDLE?: Maybe<Scalars['String']['output']>;
  APP_NAME: Scalars['String']['output'];
  APP_SCHEME?: Maybe<Scalars['String']['output']>;
  APP_SLUG?: Maybe<Scalars['String']['output']>;
  APP_SPLASH_RESIZE: Scalars['String']['output'];
  APP_TRACKING_MESSAGE?: Maybe<Scalars['String']['output']>;
  APP_TRACKING_MESSAGE_ENABLED?: Maybe<Scalars['Boolean']['output']>;
  EAS_PROJECT_ID?: Maybe<Scalars['String']['output']>;
  IS_NON_PROFIT?: Maybe<Scalars['Boolean']['output']>;
  TENANT_ID: Scalars['Int']['output'];
  THEME: Scalars['String']['output'];
  WELCOME_LOGO: Scalars['String']['output'];
  assets: Array<KeyValueType>;
};

export type AssetConnection = ConnectionInterface & {
  __typename?: 'AssetConnection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type AttachmentNode = {
  __typename?: 'AttachmentNode';
  containerGuid: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  href?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mature?: Maybe<Scalars['Boolean']['output']>;
  src?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
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

export type ChatMessageEdge = EdgeInterface & {
  __typename?: 'ChatMessageEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: ChatMessageNode;
};

export type ChatMessageNode = NodeInterface & {
  __typename?: 'ChatMessageNode';
  /** The unique guid of the message */
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The type of message. */
  messageType: ChatMessageTypeEnum;
  /** The plaintext (non-encrypted) message */
  plainText: Scalars['String']['output'];
  /** Rich embed node belonging to the message. */
  richEmbed?: Maybe<ChatRichEmbedNode>;
  /** The guid of the room the message belongs to */
  roomGuid: Scalars['String']['output'];
  sender: UserEdge;
  /** The timestamp the message was sent at */
  timeCreatedISO8601: Scalars['String']['output'];
  /** The timestamp the message was sent at */
  timeCreatedUnix: Scalars['String']['output'];
};

export enum ChatMessageTypeEnum {
  Audio = 'AUDIO',
  Image = 'IMAGE',
  RichEmbed = 'RICH_EMBED',
  Text = 'TEXT',
  Video = 'VIDEO',
}

export type ChatMessagesConnection = ConnectionInterface & {
  __typename?: 'ChatMessagesConnection';
  edges: Array<ChatMessageEdge>;
  pageInfo: PageInfo;
};

export type ChatRichEmbedNode = NodeInterface & {
  __typename?: 'ChatRichEmbedNode';
  /** The author of the rich embed. */
  author?: Maybe<Scalars['String']['output']>;
  /** The canonical URL of the rich embed. */
  canonicalUrl: Scalars['String']['output'];
  /** The created timestamp of the rich embed in ISO 8601 format. */
  createdTimestampISO8601?: Maybe<Scalars['String']['output']>;
  /** The created timestamp of the rich embed in Unix format. */
  createdTimestampUnix?: Maybe<Scalars['String']['output']>;
  /** The description of the rich embed. */
  description?: Maybe<Scalars['String']['output']>;
  /** The unique ID of the rich embed for GraphQL. */
  id: Scalars['ID']['output'];
  /** The thumbnail src of the rich embed. */
  thumbnailSrc?: Maybe<Scalars['String']['output']>;
  /** The title of the rich embed. */
  title?: Maybe<Scalars['String']['output']>;
  /** The updated timestamp of the rich embed in ISO 8601 format. */
  updatedTimestampISO8601?: Maybe<Scalars['String']['output']>;
  /** The updated timestamp of the rich embed in Unix format. */
  updatedTimestampUnix?: Maybe<Scalars['String']['output']>;
  /** The URL of the rich embed. */
  url: Scalars['String']['output'];
};

export type ChatRoomEdge = EdgeInterface & {
  __typename?: 'ChatRoomEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastMessageCreatedTimestamp?: Maybe<Scalars['Int']['output']>;
  lastMessagePlainText?: Maybe<Scalars['String']['output']>;
  members: ChatRoomMembersConnection;
  messages: ChatMessagesConnection;
  node: ChatRoomNode;
  totalMembers: Scalars['Int']['output'];
  unreadMessagesCount: Scalars['Int']['output'];
};

export type ChatRoomEdgeMembersArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type ChatRoomEdgeMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export enum ChatRoomInviteRequestActionEnum {
  Accept = 'ACCEPT',
  Reject = 'REJECT',
  RejectAndBlock = 'REJECT_AND_BLOCK',
}

export type ChatRoomMemberEdge = EdgeInterface & {
  __typename?: 'ChatRoomMemberEdge';
  cursor: Scalars['String']['output'];
  node: UserNode;
  role: ChatRoomRoleEnum;
  /** The timestamp the message was sent at */
  timeJoinedISO8601: Scalars['String']['output'];
  /** The timestamp the message was sent at */
  timeJoinedUnix: Scalars['String']['output'];
};

export type ChatRoomMembersConnection = ConnectionInterface & {
  __typename?: 'ChatRoomMembersConnection';
  edges: Array<ChatRoomMemberEdge>;
  pageInfo: PageInfo;
};

export type ChatRoomNode = NodeInterface & {
  __typename?: 'ChatRoomNode';
  chatRoomNotificationStatus?: Maybe<ChatRoomNotificationStatusEnum>;
  /** Gets group GUID for a chat room node. */
  groupGuid?: Maybe<Scalars['String']['output']>;
  /** The unique guid of the room */
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isChatRequest: Scalars['Boolean']['output'];
  isUserRoomOwner?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  /** The type of room. i.e. one-to-one, multi-user, or group-owned */
  roomType: ChatRoomTypeEnum;
  /** The timestamp the room was created at */
  timeCreatedISO8601: Scalars['String']['output'];
  /** The timestamp the roomt was created at */
  timeCreatedUnix: Scalars['String']['output'];
};

export enum ChatRoomNotificationStatusEnum {
  All = 'ALL',
  Mentions = 'MENTIONS',
  Muted = 'MUTED',
}

export enum ChatRoomRoleEnum {
  Member = 'MEMBER',
  Owner = 'OWNER',
}

export enum ChatRoomTypeEnum {
  GroupOwned = 'GROUP_OWNED',
  MultiUser = 'MULTI_USER',
  OneToOne = 'ONE_TO_ONE',
}

export type ChatRoomsConnection = ConnectionInterface & {
  __typename?: 'ChatRoomsConnection';
  edges: Array<ChatRoomEdge>;
  pageInfo: PageInfo;
};

export type CheckoutPage = {
  __typename?: 'CheckoutPage';
  addOns: Array<AddOn>;
  description?: Maybe<Scalars['String']['output']>;
  id: CheckoutPageKeyEnum;
  plan: Plan;
  summary: Summary;
  termsMarkdown?: Maybe<Scalars['String']['output']>;
  timePeriod: CheckoutTimePeriodEnum;
  title: Scalars['String']['output'];
  totalAnnualSavingsCents: Scalars['Int']['output'];
};

export enum CheckoutPageKeyEnum {
  Addons = 'ADDONS',
  Confirmation = 'CONFIRMATION',
}

export enum CheckoutTimePeriodEnum {
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY',
}

export type CommentEdge = EdgeInterface & {
  __typename?: 'CommentEdge';
  cursor: Scalars['String']['output'];
  hasVotedDown: Scalars['Boolean']['output'];
  hasVotedUp: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  node: CommentNode;
  repliesCount: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  votesUpCount: Scalars['Int']['output'];
};

export type CommentNode = NodeInterface & {
  __typename?: 'CommentNode';
  /** Gets a comments linked AttachmentNode. */
  attachment?: Maybe<AttachmentNode>;
  body: Scalars['String']['output'];
  childPath: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legacy: Scalars['String']['output'];
  /** Still used for votes, to be removed soon */
  luid: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  owner: UserNode;
  parentPath: Scalars['String']['output'];
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  url: Scalars['String']['output'];
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

export type CustomPage = NodeInterface & {
  __typename?: 'CustomPage';
  content?: Maybe<Scalars['String']['output']>;
  defaultContent?: Maybe<Scalars['String']['output']>;
  externalLink?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  pageType: CustomPageTypesEnum;
};

export enum CustomPageTypesEnum {
  CommunityGuidelines = 'COMMUNITY_GUIDELINES',
  PrivacyPolicy = 'PRIVACY_POLICY',
  TermsOfService = 'TERMS_OF_SERVICE',
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

export type EmbeddedCommentsConnection = ConnectionInterface & {
  __typename?: 'EmbeddedCommentsConnection';
  /** The url of the activity post */
  activityUrl: Scalars['String']['output'];
  edges: Array<CommentEdge>;
  pageInfo: PageInfo;
  /** The number of comments found */
  totalCount: Scalars['Int']['output'];
};

export type EmbeddedCommentsSettings = {
  __typename?: 'EmbeddedCommentsSettings';
  autoImportsEnabled: Scalars['Boolean']['output'];
  domain: Scalars['String']['output'];
  pathRegex: Scalars['String']['output'];
  userGuid: Scalars['Int']['output'];
};

export type FeaturedEntity = FeaturedEntityInterface &
  NodeInterface & {
    __typename?: 'FeaturedEntity';
    autoPostSubscription: Scalars['Boolean']['output'];
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
    edges: Array<FeaturedEntityEdge>;
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
  node: NodeInterface;
  /** Gets type for GraphQL. */
  type: Scalars['String']['output'];
};

export type FeaturedEntityInput = {
  autoPostSubscription?: InputMaybe<Scalars['Boolean']['input']>;
  autoSubscribe?: InputMaybe<Scalars['Boolean']['input']>;
  entityGuid: Scalars['String']['input'];
  recommended?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FeaturedEntityInterface = {
  autoPostSubscription: Scalars['Boolean']['output'];
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
    autoPostSubscription: Scalars['Boolean']['output'];
    autoSubscribe: Scalars['Boolean']['output'];
    briefDescription?: Maybe<Scalars['String']['output']>;
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
    autoPostSubscription: Scalars['Boolean']['output'];
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
  membersCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
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

export type Invite = NodeInterface & {
  __typename?: 'Invite';
  bespokeMessage: Scalars['String']['output'];
  createdTimestamp: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  groups?: Maybe<Array<GroupNode>>;
  id: Scalars['ID']['output'];
  inviteId: Scalars['Int']['output'];
  roles?: Maybe<Array<Role>>;
  sendTimestamp?: Maybe<Scalars['Int']['output']>;
  status: InviteEmailStatusEnum;
};

export type InviteConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'InviteConnection';
    edges: Array<InviteEdge>;
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type InviteEdge = EdgeInterface & {
  __typename?: 'InviteEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Invite>;
};

export enum InviteEmailStatusEnum {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Sending = 'SENDING',
  Sent = 'SENT',
}

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type KeyValueType = {
  __typename?: 'KeyValueType';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type MobileConfig = {
  __typename?: 'MobileConfig';
  appTrackingMessage?: Maybe<Scalars['String']['output']>;
  appTrackingMessageEnabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  previewQRCode: Scalars['String']['output'];
  previewStatus: MobilePreviewStatusEnum;
  splashScreenType: MobileSplashScreenTypeEnum;
  updateTimestamp: Scalars['Int']['output'];
  welcomeScreenLogoType: MobileWelcomeScreenLogoTypeEnum;
};

export enum MobilePreviewStatusEnum {
  Error = 'ERROR',
  NoPreview = 'NO_PREVIEW',
  Pending = 'PENDING',
  Ready = 'READY',
}

export enum MobileSplashScreenTypeEnum {
  Contain = 'CONTAIN',
  Cover = 'COVER',
}

export enum MobileWelcomeScreenLogoTypeEnum {
  Horizontal = 'HORIZONTAL',
  Square = 'SQUARE',
}

export enum MultiTenantColorScheme {
  Dark = 'DARK',
  Light = 'LIGHT',
}

export type MultiTenantConfig = {
  __typename?: 'MultiTenantConfig';
  boostEnabled?: Maybe<Scalars['Boolean']['output']>;
  /** Whether federation can be enabled. */
  canEnableFederation?: Maybe<Scalars['Boolean']['output']>;
  colorScheme?: Maybe<MultiTenantColorScheme>;
  customHomePageDescription?: Maybe<Scalars['String']['output']>;
  customHomePageEnabled?: Maybe<Scalars['Boolean']['output']>;
  digestEmailEnabled?: Maybe<Scalars['Boolean']['output']>;
  federationDisabled?: Maybe<Scalars['Boolean']['output']>;
  isNonProfit?: Maybe<Scalars['Boolean']['output']>;
  lastCacheTimestamp?: Maybe<Scalars['Int']['output']>;
  loggedInLandingPageIdMobile?: Maybe<Scalars['String']['output']>;
  loggedInLandingPageIdWeb?: Maybe<Scalars['String']['output']>;
  nsfwEnabled?: Maybe<Scalars['Boolean']['output']>;
  primaryColor?: Maybe<Scalars['String']['output']>;
  replyEmail?: Maybe<Scalars['String']['output']>;
  siteEmail?: Maybe<Scalars['String']['output']>;
  siteName?: Maybe<Scalars['String']['output']>;
  updatedTimestamp?: Maybe<Scalars['Int']['output']>;
  walledGardenEnabled?: Maybe<Scalars['Boolean']['output']>;
  welcomeEmailEnabled?: Maybe<Scalars['Boolean']['output']>;
};

export type MultiTenantConfigInput = {
  boostEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  colorScheme?: InputMaybe<MultiTenantColorScheme>;
  customHomePageDescription?: InputMaybe<Scalars['String']['input']>;
  customHomePageEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  digestEmailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  federationDisabled?: InputMaybe<Scalars['Boolean']['input']>;
  isNonProfit?: InputMaybe<Scalars['Boolean']['input']>;
  loggedInLandingPageIdMobile?: InputMaybe<Scalars['String']['input']>;
  loggedInLandingPageIdWeb?: InputMaybe<Scalars['String']['input']>;
  nsfwEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  replyEmail?: InputMaybe<Scalars['String']['input']>;
  siteEmail?: InputMaybe<Scalars['String']['input']>;
  siteName?: InputMaybe<Scalars['String']['input']>;
  walledGardenEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  welcomeEmailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
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
  /** Add members to a chat room. */
  addMembersToChatRoom: Scalars['Boolean']['output'];
  /** Cancel all Boosts on a given entity. */
  adminCancelBoosts: Scalars['Boolean']['output'];
  archiveSiteMembership: Scalars['Boolean']['output'];
  /** Assigns a user to a role */
  assignUserToRole: Role;
  cancelInvite?: Maybe<Scalars['Void']['output']>;
  claimGiftCard: GiftCardNode;
  /** Mark an onboarding step for a user as completed. */
  completeOnboardingStep: OnboardingStepProgressState;
  /** Creates a new message in a chat room */
  createChatMessage: ChatMessageEdge;
  /** Creates a new chat room */
  createChatRoom: ChatRoomEdge;
  /** Creates a comment on a remote url */
  createEmbeddedComment: CommentEdge;
  createGiftCard: GiftCardNode;
  /** Creates a new group chat room. */
  createGroupChatRoom: ChatRoomEdge;
  createMultiTenantDomain: MultiTenantDomain;
  createNetworkRootUser: TenantUser;
  /** Create a new report. */
  createNewReport: Scalars['Boolean']['output'];
  createPersonalApiKey: PersonalApiKey;
  createRssFeed: RssFeed;
  createTenant: Tenant;
  deleteChatMessage: Scalars['Boolean']['output'];
  deleteChatRoom: Scalars['Boolean']['output'];
  deleteChatRoomAndBlockUser: Scalars['Boolean']['output'];
  /** Deletes a navigation item */
  deleteCustomNavigationItem: Scalars['Boolean']['output'];
  /** Delete an entity. */
  deleteEntity: Scalars['Boolean']['output'];
  /** Deletes featured entity. */
  deleteFeaturedEntity: Scalars['Boolean']['output'];
  /** Deletes group chat rooms. */
  deleteGroupChatRooms: Scalars['Boolean']['output'];
  deletePersonalApiKey: Scalars['Boolean']['output'];
  deletePostHogPerson: Scalars['Boolean']['output'];
  /** Dismiss a notice by its key. */
  dismiss: Dismissal;
  invite?: Maybe<Scalars['Void']['output']>;
  leaveChatRoom: Scalars['Boolean']['output'];
  mobileConfig: MobileConfig;
  /** Sets multi-tenant config for the calling tenant. */
  multiTenantConfig: Scalars['Boolean']['output'];
  /** Provide a verdict for a report. */
  provideVerdict: Scalars['Boolean']['output'];
  /** Updates the read receipt of a room */
  readReceipt: ChatRoomEdge;
  refreshRssFeed: RssFeed;
  removeMemberFromChatRoom: Scalars['Boolean']['output'];
  removeRssFeed?: Maybe<Scalars['Void']['output']>;
  replyToRoomInviteRequest: Scalars['Boolean']['output'];
  resendInvite?: Maybe<Scalars['Void']['output']>;
  setCustomPage: Scalars['Boolean']['output'];
  /** Creates a comment on a remote url */
  setEmbeddedCommentsSettings: EmbeddedCommentsSettings;
  /** Sets onboarding state for the currently logged in user. */
  setOnboardingState: OnboardingState;
  /** Set a permission intent. */
  setPermissionIntent?: Maybe<PermissionIntent>;
  /** Sets a permission for that a role has */
  setRolePermission: Role;
  /** Set the stripe keys for the network */
  setStripeKeys: Scalars['Boolean']['output'];
  /** Ban or unban a given user. */
  setUserBanState: Scalars['Boolean']['output'];
  siteMembership: SiteMembership;
  /** Stores featured entity. */
  storeFeaturedEntity: FeaturedEntityInterface;
  /** Create a trial tenant network. */
  tenantTrial: TenantLoginRedirectDetails;
  /** Un-ssigns a user to a role */
  unassignUserFromRole: Scalars['Boolean']['output'];
  updateAccount: Array<Scalars['String']['output']>;
  /** Update chat room name. */
  updateChatRoomName: Scalars['Boolean']['output'];
  /** Updates the order of the navigation items */
  updateCustomNavigationItemsOrder: Array<NavigationItem>;
  updateNotificationSettings: Scalars['Boolean']['output'];
  updatePostSubscription: PostSubscription;
  updateSiteMembership: SiteMembership;
  /** Add or update a navigation item */
  upsertCustomNavigationItem: NavigationItem;
};

export type MutationAddMembersToChatRoomArgs = {
  memberGuids: Array<Scalars['String']['input']>;
  roomGuid: Scalars['String']['input'];
};

export type MutationAdminCancelBoostsArgs = {
  entityGuid: Scalars['String']['input'];
};

export type MutationArchiveSiteMembershipArgs = {
  siteMembershipGuid: Scalars['String']['input'];
};

export type MutationAssignUserToRoleArgs = {
  roleId: Scalars['Int']['input'];
  userGuid: Scalars['String']['input'];
};

export type MutationCancelInviteArgs = {
  inviteId: Scalars['Int']['input'];
};

export type MutationClaimGiftCardArgs = {
  claimCode: Scalars['String']['input'];
};

export type MutationCompleteOnboardingStepArgs = {
  additionalData?: InputMaybe<Array<KeyValuePairInput>>;
  stepKey: Scalars['String']['input'];
  stepType: Scalars['String']['input'];
};

export type MutationCreateChatMessageArgs = {
  plainText: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
};

export type MutationCreateChatRoomArgs = {
  groupGuid?: InputMaybe<Scalars['String']['input']>;
  otherMemberGuids?: Array<Scalars['String']['input']>;
  roomType?: InputMaybe<ChatRoomTypeEnum>;
};

export type MutationCreateEmbeddedCommentArgs = {
  body: Scalars['String']['input'];
  ownerGuid: Scalars['String']['input'];
  parentPath: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type MutationCreateGiftCardArgs = {
  amount: Scalars['Float']['input'];
  expiresAt?: InputMaybe<Scalars['Int']['input']>;
  productIdEnum: Scalars['Int']['input'];
  stripePaymentMethodId: Scalars['String']['input'];
  targetInput: GiftCardTargetInput;
};

export type MutationCreateGroupChatRoomArgs = {
  groupGuid: Scalars['String']['input'];
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

export type MutationCreatePersonalApiKeyArgs = {
  expireInDays?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  scopes: Array<ApiScopeEnum>;
};

export type MutationCreateRssFeedArgs = {
  rssFeed: RssFeedInput;
};

export type MutationCreateTenantArgs = {
  tenant?: InputMaybe<TenantInput>;
};

export type MutationDeleteChatMessageArgs = {
  messageGuid: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
};

export type MutationDeleteChatRoomArgs = {
  roomGuid: Scalars['String']['input'];
};

export type MutationDeleteChatRoomAndBlockUserArgs = {
  roomGuid: Scalars['String']['input'];
};

export type MutationDeleteCustomNavigationItemArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteEntityArgs = {
  subjectUrn: Scalars['String']['input'];
};

export type MutationDeleteFeaturedEntityArgs = {
  entityGuid: Scalars['String']['input'];
};

export type MutationDeleteGroupChatRoomsArgs = {
  groupGuid: Scalars['String']['input'];
};

export type MutationDeletePersonalApiKeyArgs = {
  id: Scalars['String']['input'];
};

export type MutationDismissArgs = {
  key: Scalars['String']['input'];
};

export type MutationInviteArgs = {
  bespokeMessage: Scalars['String']['input'];
  emails: Scalars['String']['input'];
  groups?: InputMaybe<Array<Scalars['String']['input']>>;
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type MutationLeaveChatRoomArgs = {
  roomGuid: Scalars['String']['input'];
};

export type MutationMobileConfigArgs = {
  appTrackingMessage?: InputMaybe<Scalars['String']['input']>;
  appTrackingMessageEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  mobilePreviewStatus?: InputMaybe<MobilePreviewStatusEnum>;
  mobileSplashScreenType?: InputMaybe<MobileSplashScreenTypeEnum>;
  mobileWelcomeScreenLogoType?: InputMaybe<MobileWelcomeScreenLogoTypeEnum>;
};

export type MutationMultiTenantConfigArgs = {
  multiTenantConfigInput: MultiTenantConfigInput;
};

export type MutationProvideVerdictArgs = {
  verdictInput: VerdictInput;
};

export type MutationReadReceiptArgs = {
  messageGuid: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
};

export type MutationRefreshRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type MutationRemoveMemberFromChatRoomArgs = {
  memberGuid: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
};

export type MutationRemoveRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type MutationReplyToRoomInviteRequestArgs = {
  chatRoomInviteRequestActionEnum: ChatRoomInviteRequestActionEnum;
  roomGuid: Scalars['String']['input'];
};

export type MutationResendInviteArgs = {
  inviteId: Scalars['Int']['input'];
};

export type MutationSetCustomPageArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  externalLink?: InputMaybe<Scalars['String']['input']>;
  pageType: Scalars['String']['input'];
};

export type MutationSetEmbeddedCommentsSettingsArgs = {
  autoImportsEnabled: Scalars['Boolean']['input'];
  domain: Scalars['String']['input'];
  pathRegex: Scalars['String']['input'];
};

export type MutationSetOnboardingStateArgs = {
  completed: Scalars['Boolean']['input'];
};

export type MutationSetPermissionIntentArgs = {
  intentType: PermissionIntentTypeEnum;
  membershipGuid?: InputMaybe<Scalars['String']['input']>;
  permissionId: PermissionsEnum;
};

export type MutationSetRolePermissionArgs = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  permission: PermissionsEnum;
  roleId: Scalars['Int']['input'];
};

export type MutationSetStripeKeysArgs = {
  pubKey: Scalars['String']['input'];
  secKey: Scalars['String']['input'];
};

export type MutationSetUserBanStateArgs = {
  banState: Scalars['Boolean']['input'];
  subjectGuid: Scalars['String']['input'];
};

export type MutationSiteMembershipArgs = {
  siteMembershipInput: SiteMembershipInput;
};

export type MutationStoreFeaturedEntityArgs = {
  featuredEntity: FeaturedEntityInput;
};

export type MutationTenantTrialArgs = {
  tenant?: InputMaybe<TenantInput>;
};

export type MutationUnassignUserFromRoleArgs = {
  roleId: Scalars['Int']['input'];
  userGuid: Scalars['String']['input'];
};

export type MutationUpdateAccountArgs = {
  currentUsername: Scalars['String']['input'];
  newEmail?: InputMaybe<Scalars['String']['input']>;
  newUsername?: InputMaybe<Scalars['String']['input']>;
  resetMFA?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MutationUpdateChatRoomNameArgs = {
  roomGuid: Scalars['String']['input'];
  roomName: Scalars['String']['input'];
};

export type MutationUpdateCustomNavigationItemsOrderArgs = {
  orderedIds: Array<Scalars['String']['input']>;
};

export type MutationUpdateNotificationSettingsArgs = {
  notificationStatus: ChatRoomNotificationStatusEnum;
  roomGuid: Scalars['String']['input'];
};

export type MutationUpdatePostSubscriptionArgs = {
  entityGuid: Scalars['String']['input'];
  frequency: PostSubscriptionFrequencyEnum;
};

export type MutationUpdateSiteMembershipArgs = {
  siteMembershipInput: SiteMembershipUpdateInput;
};

export type MutationUpsertCustomNavigationItemArgs = {
  action?: InputMaybe<NavigationItemActionEnum>;
  iconId: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  type: NavigationItemTypeEnum;
  url?: InputMaybe<Scalars['String']['input']>;
  visible: Scalars['Boolean']['input'];
  visibleMobile: Scalars['Boolean']['input'];
};

export type NavigationItem = {
  __typename?: 'NavigationItem';
  action?: Maybe<NavigationItemActionEnum>;
  iconId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  path?: Maybe<Scalars['String']['output']>;
  type: NavigationItemTypeEnum;
  url?: Maybe<Scalars['String']['output']>;
  visible: Scalars['Boolean']['output'];
  visibleMobile: Scalars['Boolean']['output'];
};

export enum NavigationItemActionEnum {
  ShowSidebarMore = 'SHOW_SIDEBAR_MORE',
}

export enum NavigationItemTypeEnum {
  Core = 'CORE',
  CustomLink = 'CUSTOM_LINK',
}

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

export type OidcProviderPublic = {
  __typename?: 'OidcProviderPublic';
  clientId: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  issuer: Scalars['String']['output'];
  loginUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
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

export type PermissionIntent = {
  __typename?: 'PermissionIntent';
  intentType: PermissionIntentTypeEnum;
  membershipGuid?: Maybe<Scalars['String']['output']>;
  permissionId: PermissionsEnum;
};

export enum PermissionIntentTypeEnum {
  Hide = 'HIDE',
  Upgrade = 'UPGRADE',
  WarningMessage = 'WARNING_MESSAGE',
}

export enum PermissionsEnum {
  CanAssignPermissions = 'CAN_ASSIGN_PERMISSIONS',
  CanBoost = 'CAN_BOOST',
  CanComment = 'CAN_COMMENT',
  CanCreateChatRoom = 'CAN_CREATE_CHAT_ROOM',
  CanCreateGroup = 'CAN_CREATE_GROUP',
  CanCreatePaywall = 'CAN_CREATE_PAYWALL',
  CanCreatePost = 'CAN_CREATE_POST',
  CanInteract = 'CAN_INTERACT',
  CanModerateContent = 'CAN_MODERATE_CONTENT',
  CanUploadChatMedia = 'CAN_UPLOAD_CHAT_MEDIA',
  CanUploadVideo = 'CAN_UPLOAD_VIDEO',
  CanUseRssSync = 'CAN_USE_RSS_SYNC',
}

export type PersonalApiKey = {
  __typename?: 'PersonalApiKey';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  scopes: Array<ApiScopeEnum>;
  /** The 'secret' key that a user will use to authenticate with. Only returned once. */
  secret: Scalars['String']['output'];
  timeCreated: Scalars['DateTime']['output'];
  timeExpires?: Maybe<Scalars['DateTime']['output']>;
};

export type Plan = {
  __typename?: 'Plan';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  monthlyFeeCents: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  oneTimeFeeCents?: Maybe<Scalars['Int']['output']>;
  perks: Array<Scalars['String']['output']>;
  perksTitle: Scalars['String']['output'];
};

export type PlanSummary = {
  __typename?: 'PlanSummary';
  id: Scalars['String']['output'];
  monthlyFeeCents: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  oneTimeFeeCents?: Maybe<Scalars['Int']['output']>;
};

export type PostHogPerson = {
  __typename?: 'PostHogPerson';
  id: Scalars['String']['output'];
};

export type PostSubscription = {
  __typename?: 'PostSubscription';
  entityGuid: Scalars['String']['output'];
  frequency: PostSubscriptionFrequencyEnum;
  userGuid: Scalars['String']['output'];
};

export enum PostSubscriptionFrequencyEnum {
  Always = 'ALWAYS',
  Highlights = 'HIGHLIGHTS',
  Never = 'NEVER',
}

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
  /** Returns all permissions that exist on the site */
  allPermissions: Array<PermissionsEnum>;
  /** Returns all roles that exist on the site and their permission assignments */
  allRoles: Array<Role>;
  appReadyMobileConfig: AppReadyMobileConfig;
  /** Returns the permissions that the current session holds */
  assignedPermissions: Array<PermissionsEnum>;
  /** Returns the roles the session holds */
  assignedRoles: Array<Role>;
  /** Gets Boosts. */
  boosts: BoostsConnection;
  /** Returns a list of messages for a given chat room */
  chatMessages: ChatMessagesConnection;
  /** Returns a chat room */
  chatRoom: ChatRoomEdge;
  chatRoomGuids: Array<Scalars['String']['output']>;
  chatRoomInviteRequests: ChatRoomsConnection;
  /** Returns a list of chat rooms available to a user */
  chatRoomList: ChatRoomsConnection;
  /** Returns the members of a chat room */
  chatRoomMembers: ChatRoomMembersConnection;
  /** Returns the total count of unread messages a user has */
  chatUnreadMessagesCount: Scalars['Int']['output'];
  checkoutLink: Scalars['String']['output'];
  checkoutPage: CheckoutPage;
  /** Returns key value configs */
  config?: Maybe<Scalars['String']['output']>;
  /** Returns the navigation items that are configured for a site */
  customNavigationItems: Array<NavigationItem>;
  customPage: CustomPage;
  /** Get dismissal by key. */
  dismissalByKey?: Maybe<Dismissal>;
  /** Get all of a users dismissals. */
  dismissals: Array<Dismissal>;
  /**
   * Returns comments to be shown in the embedded comments app.
   * The comments will be associated with an activity post. If the activity post
   * does not exist, we will attempt to create it
   */
  embeddedComments: EmbeddedCommentsConnection;
  /** Returns the configured embedded-comments plugin settings for a user */
  embeddedCommentsSettings?: Maybe<EmbeddedCommentsSettings>;
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
  invite: Invite;
  invites: InviteConnection;
  listPersonalApiKeys: Array<PersonalApiKey>;
  /** Gets the lowest price site membership for an activity. */
  lowestPriceSiteMembershipForActivity?: Maybe<SiteMembership>;
  mobileConfig: MobileConfig;
  /** Gets multi-tenant config for the calling tenant. */
  multiTenantConfig?: Maybe<MultiTenantConfig>;
  multiTenantDomain: MultiTenantDomain;
  newsfeed: NewsfeedConnection;
  oidcProviders: Array<OidcProviderPublic>;
  /** Gets onboarding state for the currently logged in user. */
  onboardingState?: Maybe<OnboardingState>;
  /** Get the currently logged in users onboarding step progress. */
  onboardingStepProgress: Array<OnboardingStepProgressState>;
  /** Get a list of payment methods for the logged in user */
  paymentMethods: Array<PaymentMethod>;
  /** Get permission intents. */
  permissionIntents: Array<PermissionIntent>;
  personalApiKey?: Maybe<PersonalApiKey>;
  postHogPerson: PostHogPerson;
  postSubscription: PostSubscription;
  /** Gets reports. */
  reports: ReportsConnection;
  rssFeed: RssFeed;
  rssFeeds: Array<RssFeed>;
  search: SearchResultsConnection;
  siteMembership: SiteMembership;
  siteMembershipSubscriptions: Array<SiteMembershipSubscription>;
  siteMemberships: Array<SiteMembership>;
  /** Returns the stripe keys */
  stripeKeys: StripeKeysType;
  /** Returns data to be displayed in a chart. All metrics are supported. */
  tenantAdminAnalyticsChart: AnalyticsChartType;
  /** Returns multiple 'kpis' from a list of provided metrics. */
  tenantAdminAnalyticsKpis: Array<AnalyticsKpiType>;
  /** Returns a paginated list of popular content */
  tenantAdminAnalyticsTable: AnalyticsTableConnection;
  tenantAssets: AssetConnection;
  tenantBilling: TenantBillingType;
  tenantQuotaUsage: QuotaDetails;
  tenants: Array<Tenant>;
  totalRoomInviteRequests: Scalars['Int']['output'];
  userAssets: AssetConnection;
  userQuotaUsage: QuotaDetails;
  /** Returns users and their roles */
  usersByRole: UserRoleConnection;
};

export type QueryActivityArgs = {
  guid: Scalars['String']['input'];
};

export type QueryAppReadyMobileConfigArgs = {
  tenantId: Scalars['Int']['input'];
};

export type QueryAssignedRolesArgs = {
  userGuid?: InputMaybe<Scalars['String']['input']>;
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

export type QueryChatMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  roomGuid: Scalars['String']['input'];
};

export type QueryChatRoomArgs = {
  roomGuid: Scalars['String']['input'];
};

export type QueryChatRoomInviteRequestsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryChatRoomListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryChatRoomMembersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['Int']['input']>;
  excludeSelf?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  roomGuid?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCheckoutLinkArgs = {
  addOnIds?: InputMaybe<Array<Scalars['String']['input']>>;
  isTrialUpgrade?: InputMaybe<Scalars['Boolean']['input']>;
  planId: Scalars['String']['input'];
  timePeriod: CheckoutTimePeriodEnum;
};

export type QueryCheckoutPageArgs = {
  addOnIds?: InputMaybe<Array<Scalars['String']['input']>>;
  page: CheckoutPageKeyEnum;
  planId: Scalars['String']['input'];
  timePeriod: CheckoutTimePeriodEnum;
};

export type QueryConfigArgs = {
  key: Scalars['String']['input'];
};

export type QueryCustomPageArgs = {
  pageType: Scalars['String']['input'];
};

export type QueryDismissalByKeyArgs = {
  key: Scalars['String']['input'];
};

export type QueryEmbeddedCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  ownerGuid: Scalars['String']['input'];
  parentPath?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
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

export type QueryInviteArgs = {
  inviteId: Scalars['Int']['input'];
};

export type QueryInvitesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type QueryLowestPriceSiteMembershipForActivityArgs = {
  activityGuid: Scalars['String']['input'];
  externalOnly?: InputMaybe<Scalars['Boolean']['input']>;
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

export type QueryPersonalApiKeyArgs = {
  id: Scalars['String']['input'];
};

export type QueryPostSubscriptionArgs = {
  entityGuid: Scalars['String']['input'];
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

export type QuerySiteMembershipArgs = {
  membershipGuid: Scalars['String']['input'];
};

export type QueryTenantAdminAnalyticsChartArgs = {
  fromUnixTs?: InputMaybe<Scalars['Int']['input']>;
  metric: AnalyticsMetricEnum;
  toUnixTs?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTenantAdminAnalyticsKpisArgs = {
  fromUnixTs?: InputMaybe<Scalars['Int']['input']>;
  metrics: Array<AnalyticsMetricEnum>;
  toUnixTs?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTenantAdminAnalyticsTableArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  fromUnixTs?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  table: AnalyticsTableEnum;
  toUnixTs?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTenantAssetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTenantsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryUserAssetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryUsersByRoleArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  roleId?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type QuotaDetails = {
  __typename?: 'QuotaDetails';
  sizeInBytes: Scalars['Int']['output'];
};

export type Report = NodeInterface & {
  __typename?: 'Report';
  action?: Maybe<ReportActionEnum>;
  createdTimestamp: Scalars['Int']['output'];
  cursor?: Maybe<Scalars['String']['output']>;
  /** Gets entity edge from entityUrn. */
  entityEdge?: Maybe<UnionActivityEdgeUserEdgeGroupEdgeCommentEdgeChatMessageEdge>;
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

export type Role = {
  __typename?: 'Role';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  permissions: Array<PermissionsEnum>;
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
  FetchInProgress = 'FETCH_IN_PROGRESS',
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

export type SiteMembership = {
  __typename?: 'SiteMembership';
  archived: Scalars['Boolean']['output'];
  groups?: Maybe<Array<GroupNode>>;
  id: Scalars['ID']['output'];
  isExternal: Scalars['Boolean']['output'];
  manageUrl?: Maybe<Scalars['String']['output']>;
  membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
  membershipDescription?: Maybe<Scalars['String']['output']>;
  membershipGuid: Scalars['String']['output'];
  membershipName: Scalars['String']['output'];
  membershipPriceInCents: Scalars['Int']['output'];
  membershipPricingModel: SiteMembershipPricingModelEnum;
  priceCurrency: Scalars['String']['output'];
  purchaseUrl?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Role>>;
};

export enum SiteMembershipBillingPeriodEnum {
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY',
}

export type SiteMembershipInput = {
  groups?: InputMaybe<Array<Scalars['String']['input']>>;
  isExternal?: InputMaybe<Scalars['Boolean']['input']>;
  manageUrl?: InputMaybe<Scalars['String']['input']>;
  membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
  membershipDescription?: InputMaybe<Scalars['String']['input']>;
  membershipName: Scalars['String']['input'];
  membershipPriceInCents: Scalars['Int']['input'];
  membershipPricingModel: SiteMembershipPricingModelEnum;
  purchaseUrl?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum SiteMembershipPricingModelEnum {
  OneTime = 'ONE_TIME',
  Recurring = 'RECURRING',
}

export type SiteMembershipSubscription = {
  __typename?: 'SiteMembershipSubscription';
  autoRenew: Scalars['Boolean']['output'];
  isManual: Scalars['Boolean']['output'];
  membershipGuid: Scalars['String']['output'];
  membershipSubscriptionId: Scalars['Int']['output'];
  validFromTimestamp?: Maybe<Scalars['Int']['output']>;
  validToTimestamp?: Maybe<Scalars['Int']['output']>;
};

export type SiteMembershipUpdateInput = {
  groups?: InputMaybe<Array<Scalars['String']['input']>>;
  manageUrl?: InputMaybe<Scalars['String']['input']>;
  membershipDescription?: InputMaybe<Scalars['String']['input']>;
  membershipGuid: Scalars['String']['input'];
  membershipName: Scalars['String']['input'];
  purchaseUrl?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type StripeKeysType = {
  __typename?: 'StripeKeysType';
  pubKey: Scalars['String']['output'];
  secKey: Scalars['String']['output'];
};

export type Summary = {
  __typename?: 'Summary';
  addonsSummary: Array<AddOn>;
  planSummary: PlanSummary;
  totalInitialFeeCents: Scalars['Int']['output'];
  totalMonthlyFeeCents: Scalars['Int']['output'];
};

export type Tenant = {
  __typename?: 'Tenant';
  config?: Maybe<MultiTenantConfig>;
  domain?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  ownerGuid?: Maybe<Scalars['String']['output']>;
  plan: TenantPlanEnum;
  rootUserGuid?: Maybe<Scalars['String']['output']>;
  suspendedTimestamp?: Maybe<Scalars['Int']['output']>;
  trialStartTimestamp?: Maybe<Scalars['Int']['output']>;
};

export type TenantBillingType = {
  __typename?: 'TenantBillingType';
  isActive: Scalars['Boolean']['output'];
  manageBillingUrl?: Maybe<Scalars['String']['output']>;
  nextBillingAmountCents: Scalars['Int']['output'];
  nextBillingDate?: Maybe<Scalars['DateTime']['output']>;
  period: CheckoutTimePeriodEnum;
  plan: TenantPlanEnum;
  previousBillingAmountCents: Scalars['Int']['output'];
  previousBillingDate?: Maybe<Scalars['DateTime']['output']>;
};

export type TenantInput = {
  config?: InputMaybe<MultiTenantConfigInput>;
  domain?: InputMaybe<Scalars['String']['input']>;
  ownerGuid?: InputMaybe<Scalars['Int']['input']>;
};

export type TenantLoginRedirectDetails = {
  __typename?: 'TenantLoginRedirectDetails';
  jwtToken?: Maybe<Scalars['String']['output']>;
  loginUrl?: Maybe<Scalars['String']['output']>;
  tenant: Tenant;
};

export enum TenantPlanEnum {
  Community = 'COMMUNITY',
  Enterprise = 'ENTERPRISE',
  Team = 'TEAM',
}

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

export type UnionActivityEdgeUserEdgeGroupEdgeCommentEdgeChatMessageEdge =
  | ActivityEdge
  | ChatMessageEdge
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
  iconUrl: Scalars['String']['output'];
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

export type UserRoleConnection = ConnectionInterface & {
  __typename?: 'UserRoleConnection';
  edges: Array<UserRoleEdge>;
  pageInfo: PageInfo;
};

export type UserRoleEdge = EdgeInterface & {
  __typename?: 'UserRoleEdge';
  cursor: Scalars['String']['output'];
  node: UserNode;
  roles: Array<Role>;
};

export type VerdictInput = {
  action: ReportActionEnum;
  reportGuid?: InputMaybe<Scalars['String']['input']>;
};

export type FetchOidcProvidersQueryVariables = Exact<{ [key: string]: never }>;

export type FetchOidcProvidersQuery = {
  __typename?: 'Query';
  oidcProviders: Array<{
    __typename?: 'OidcProviderPublic';
    id: number;
    name: string;
    loginUrl: string;
  }>;
};

export type GetPostSubscriptionQueryVariables = Exact<{
  entityGuid: Scalars['String']['input'];
}>;

export type GetPostSubscriptionQuery = {
  __typename?: 'Query';
  postSubscription: {
    __typename?: 'PostSubscription';
    userGuid: string;
    entityGuid: string;
    frequency: PostSubscriptionFrequencyEnum;
  };
};

export type UpdatePostSubscriptionsMutationVariables = Exact<{
  entityGuid: Scalars['String']['input'];
  frequency: PostSubscriptionFrequencyEnum;
}>;

export type UpdatePostSubscriptionsMutation = {
  __typename?: 'Mutation';
  updatePostSubscription: {
    __typename?: 'PostSubscription';
    userGuid: string;
    entityGuid: string;
    frequency: PostSubscriptionFrequencyEnum;
  };
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
          node: { __typename: 'ActivityNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'AnalyticsTableRowEdge';
          cursor: string;
          node:
            | { __typename: 'ActivityNode'; legacy: string; id: string }
            | { __typename: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename: 'ChatMessageNode'; id: string }
            | { __typename: 'ChatRichEmbedNode'; id: string }
            | { __typename: 'ChatRoomNode'; id: string }
            | { __typename: 'CommentNode'; id: string }
            | { __typename: 'CustomPage'; id: string }
            | { __typename: 'FeaturedEntity'; id: string }
            | { __typename: 'FeaturedEntityConnection'; id: string }
            | { __typename: 'FeaturedGroup'; id: string }
            | { __typename: 'FeaturedUser'; id: string }
            | { __typename: 'FeedExploreTagNode'; id: string }
            | { __typename: 'FeedHeaderNode'; id: string }
            | { __typename: 'FeedHighlightsConnection'; id: string }
            | {
                __typename: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename: 'GiftCardNode'; id: string }
            | { __typename: 'GiftCardTransaction'; id: string }
            | { __typename: 'GroupNode'; legacy: string; id: string }
            | { __typename: 'Invite'; id: string }
            | { __typename: 'InviteConnection'; id: string }
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
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: { __typename: 'ChatRoomNode'; id: string };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename: 'UserNode';
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
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename: 'Invite';
                        id: string;
                      } | null;
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
                  | {
                      __typename?: 'UserRoleEdge';
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
            | { __typename: 'UserNode'; legacy: string; id: string };
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
          __typename?: 'ChatMessageEdge';
          cursor: string;
          node: { __typename: 'ChatMessageNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomEdge';
          cursor: string;
          node: { __typename: 'ChatRoomNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomMemberEdge';
          cursor: string;
          node: { __typename: 'UserNode'; legacy: string; id: string };
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
            | { __typename: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename: 'ChatMessageNode'; id: string }
            | { __typename: 'ChatRichEmbedNode'; id: string }
            | { __typename: 'ChatRoomNode'; id: string }
            | { __typename: 'CommentNode'; id: string }
            | { __typename: 'CustomPage'; id: string }
            | { __typename: 'FeaturedEntity'; id: string }
            | { __typename: 'FeaturedEntityConnection'; id: string }
            | { __typename: 'FeaturedGroup'; id: string }
            | { __typename: 'FeaturedUser'; id: string }
            | { __typename: 'FeedExploreTagNode'; id: string }
            | { __typename: 'FeedHeaderNode'; id: string }
            | { __typename: 'FeedHighlightsConnection'; id: string }
            | {
                __typename: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename: 'GiftCardNode'; id: string }
            | { __typename: 'GiftCardTransaction'; id: string }
            | { __typename: 'GroupNode'; legacy: string; id: string }
            | { __typename: 'Invite'; id: string }
            | { __typename: 'InviteConnection'; id: string }
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
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: { __typename: 'ChatRoomNode'; id: string };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename: 'UserNode';
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
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename: 'Invite';
                        id: string;
                      } | null;
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
                  | {
                      __typename?: 'UserRoleEdge';
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
            | { __typename: 'UserNode'; legacy: string; id: string }
            | null;
        }
      | {
          __typename?: 'FeaturedEntityEdge';
          cursor: string;
          node:
            | { __typename: 'ActivityNode'; legacy: string; id: string }
            | { __typename: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename: 'ChatMessageNode'; id: string }
            | { __typename: 'ChatRichEmbedNode'; id: string }
            | { __typename: 'ChatRoomNode'; id: string }
            | { __typename: 'CommentNode'; id: string }
            | { __typename: 'CustomPage'; id: string }
            | { __typename: 'FeaturedEntity'; id: string }
            | { __typename: 'FeaturedEntityConnection'; id: string }
            | { __typename: 'FeaturedGroup'; id: string }
            | { __typename: 'FeaturedUser'; id: string }
            | { __typename: 'FeedExploreTagNode'; id: string }
            | { __typename: 'FeedHeaderNode'; id: string }
            | { __typename: 'FeedHighlightsConnection'; id: string }
            | {
                __typename: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename: 'GiftCardNode'; id: string }
            | { __typename: 'GiftCardTransaction'; id: string }
            | { __typename: 'GroupNode'; legacy: string; id: string }
            | { __typename: 'Invite'; id: string }
            | { __typename: 'InviteConnection'; id: string }
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
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: { __typename: 'ChatRoomNode'; id: string };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename: 'UserNode';
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
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename: 'Invite';
                        id: string;
                      } | null;
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
                  | {
                      __typename?: 'UserRoleEdge';
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
            | { __typename: 'UserNode'; legacy: string; id: string };
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
          node: { __typename: 'FeedHighlightsConnection'; id: string };
        }
      | {
          __typename?: 'FeedNoticeEdge';
          cursor: string;
          node: {
            __typename: 'FeedNoticeNode';
            location: string;
            key: string;
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
          node: { __typename: 'GroupNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'InviteEdge';
          cursor: string;
          node?: { __typename: 'Invite'; id: string } | null;
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
                  __typename?: 'AnalyticsTableRowEdge';
                  publisherNode:
                    | { __typename: 'ActivityNode'; id: string }
                    | {
                        __typename: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename: 'BoostNode'; legacy: string; id: string }
                    | { __typename: 'ChatMessageNode'; id: string }
                    | { __typename: 'ChatRichEmbedNode'; id: string }
                    | { __typename: 'ChatRoomNode'; id: string }
                    | { __typename: 'CommentNode'; id: string }
                    | { __typename: 'CustomPage'; id: string }
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
                    | { __typename: 'Invite'; id: string }
                    | { __typename: 'InviteConnection'; id: string }
                    | { __typename: 'NodeImpl'; id: string }
                    | { __typename: 'PublisherRecsConnection'; id: string }
                    | { __typename: 'Report'; id: string }
                    | { __typename: 'UserNode'; legacy: string; id: string };
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
                  __typename?: 'ChatMessageEdge';
                  publisherNode: { __typename: 'ChatMessageNode'; id: string };
                }
              | {
                  __typename?: 'ChatRoomEdge';
                  publisherNode: { __typename: 'ChatRoomNode'; id: string };
                }
              | {
                  __typename?: 'ChatRoomMemberEdge';
                  publisherNode: {
                    __typename: 'UserNode';
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
                        __typename: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename: 'BoostNode'; legacy: string; id: string }
                    | { __typename: 'ChatMessageNode'; id: string }
                    | { __typename: 'ChatRichEmbedNode'; id: string }
                    | { __typename: 'ChatRoomNode'; id: string }
                    | { __typename: 'CommentNode'; id: string }
                    | { __typename: 'CustomPage'; id: string }
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
                    | { __typename: 'Invite'; id: string }
                    | { __typename: 'InviteConnection'; id: string }
                    | { __typename: 'NodeImpl'; id: string }
                    | { __typename: 'PublisherRecsConnection'; id: string }
                    | { __typename: 'Report'; id: string }
                    | { __typename: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeaturedEntityEdge';
                  publisherNode:
                    | { __typename: 'ActivityNode'; id: string }
                    | {
                        __typename: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename: 'BoostNode'; legacy: string; id: string }
                    | { __typename: 'ChatMessageNode'; id: string }
                    | { __typename: 'ChatRichEmbedNode'; id: string }
                    | { __typename: 'ChatRoomNode'; id: string }
                    | { __typename: 'CommentNode'; id: string }
                    | { __typename: 'CustomPage'; id: string }
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
                    | { __typename: 'Invite'; id: string }
                    | { __typename: 'InviteConnection'; id: string }
                    | { __typename: 'NodeImpl'; id: string }
                    | { __typename: 'PublisherRecsConnection'; id: string }
                    | { __typename: 'Report'; id: string }
                    | { __typename: 'UserNode'; legacy: string; id: string };
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
                  __typename?: 'InviteEdge';
                  publisherNode?: { __typename: 'Invite'; id: string } | null;
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
              | {
                  __typename?: 'UserRoleEdge';
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
          node: { __typename: 'UserNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'UserRoleEdge';
          cursor: string;
          node: { __typename: 'UserNode'; legacy: string; id: string };
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

export type GetBoostFeedQueryVariables = Exact<{
  targetLocation?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['Int']['input'];
  source: Scalars['String']['input'];
}>;

export type GetBoostFeedQuery = {
  __typename?: 'Query';
  boosts: {
    __typename?: 'BoostsConnection';
    edges: Array<{
      __typename?: 'BoostEdge';
      node: {
        __typename?: 'BoostNode';
        guid: string;
        activity: { __typename: 'ActivityNode'; legacy: string };
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

export type AddMembersToChatRoomMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  memberGuids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type AddMembersToChatRoomMutation = {
  __typename?: 'Mutation';
  addMembersToChatRoom: boolean;
};

export type CreateChatMessageMutationVariables = Exact<{
  plainText: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
}>;

export type CreateChatMessageMutation = {
  __typename?: 'Mutation';
  createChatMessage: {
    __typename?: 'ChatMessageEdge';
    cursor: string;
    node: {
      __typename?: 'ChatMessageNode';
      id: string;
      guid: string;
      roomGuid: string;
      plainText: string;
      timeCreatedISO8601: string;
      timeCreatedUnix: string;
      richEmbed?: {
        __typename?: 'ChatRichEmbedNode';
        id: string;
        url: string;
        canonicalUrl: string;
        title?: string | null;
        thumbnailSrc?: string | null;
      } | null;
      sender: {
        __typename?: 'UserEdge';
        id: string;
        type: string;
        cursor: string;
        node: {
          __typename?: 'UserNode';
          name: string;
          username: string;
          iconUrl: string;
          guid: string;
          id: string;
        };
      };
    };
  };
};

export type CreateChatRoomMutationVariables = Exact<{
  otherMemberGuids:
    | Array<Scalars['String']['input']>
    | Scalars['String']['input'];
  roomType?: InputMaybe<ChatRoomTypeEnum>;
  groupGuid?: InputMaybe<Scalars['String']['input']>;
}>;

export type CreateChatRoomMutation = {
  __typename?: 'Mutation';
  createChatRoom: {
    __typename?: 'ChatRoomEdge';
    cursor: string;
    node: {
      __typename?: 'ChatRoomNode';
      id: string;
      guid: string;
      roomType: ChatRoomTypeEnum;
      groupGuid?: string | null;
      timeCreatedISO8601: string;
      timeCreatedUnix: string;
    };
  };
};

export type CreateGroupChatRoomMutationVariables = Exact<{
  groupGuid: Scalars['String']['input'];
}>;

export type CreateGroupChatRoomMutation = {
  __typename?: 'Mutation';
  createGroupChatRoom: {
    __typename?: 'ChatRoomEdge';
    cursor: string;
    node: {
      __typename?: 'ChatRoomNode';
      id: string;
      guid: string;
      roomType: ChatRoomTypeEnum;
      groupGuid?: string | null;
      timeCreatedISO8601: string;
      timeCreatedUnix: string;
    };
  };
};

export type DeleteChatMessageMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  messageGuid: Scalars['String']['input'];
}>;

export type DeleteChatMessageMutation = {
  __typename?: 'Mutation';
  deleteChatMessage: boolean;
};

export type DeleteChatRoomAndBlockUserMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
}>;

export type DeleteChatRoomAndBlockUserMutation = {
  __typename?: 'Mutation';
  deleteChatRoomAndBlockUser: boolean;
};

export type DeleteChatRoomMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
}>;

export type DeleteChatRoomMutation = {
  __typename?: 'Mutation';
  deleteChatRoom: boolean;
};

export type DeleteGroupChatRoomsMutationVariables = Exact<{
  groupGuid: Scalars['String']['input'];
}>;

export type DeleteGroupChatRoomsMutation = {
  __typename?: 'Mutation';
  deleteGroupChatRooms: boolean;
};

export type GetChatRoomsListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetChatRoomsListQuery = {
  __typename?: 'Query';
  chatRoomList: {
    __typename?: 'ChatRoomsConnection';
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges: Array<{
      __typename?: 'ChatRoomEdge';
      cursor: string;
      unreadMessagesCount: number;
      lastMessagePlainText?: string | null;
      lastMessageCreatedTimestamp?: number | null;
      node: {
        __typename?: 'ChatRoomNode';
        id: string;
        guid: string;
        name: string;
        roomType: ChatRoomTypeEnum;
        groupGuid?: string | null;
        timeCreatedISO8601: string;
        timeCreatedUnix: string;
      };
      members: {
        __typename?: 'ChatRoomMembersConnection';
        edges: Array<{
          __typename?: 'ChatRoomMemberEdge';
          cursor: string;
          node: {
            __typename?: 'UserNode';
            id: string;
            guid: string;
            iconUrl: string;
            username: string;
            name: string;
          };
        }>;
      };
    }>;
  };
};

export type GetChatMessagesQueryVariables = Exact<{
  pageSize: Scalars['Int']['input'];
  roomGuid: Scalars['String']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetChatMessagesQuery = {
  __typename?: 'Query';
  chatMessages: {
    __typename?: 'ChatMessagesConnection';
    edges: Array<{
      __typename?: 'ChatMessageEdge';
      cursor: string;
      node: {
        __typename?: 'ChatMessageNode';
        guid: string;
        id: string;
        plainText: string;
        timeCreatedISO8601: string;
        timeCreatedUnix: string;
        sender: {
          __typename?: 'UserEdge';
          id: string;
          node: {
            __typename?: 'UserNode';
            id: string;
            guid: string;
            iconUrl: string;
            name: string;
            username: string;
          };
        };
        richEmbed?: {
          __typename?: 'ChatRichEmbedNode';
          id: string;
          url: string;
          canonicalUrl: string;
          title?: string | null;
          thumbnailSrc?: string | null;
        } | null;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type GetChatRoomMembersQueryVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  excludeSelf?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type GetChatRoomMembersQuery = {
  __typename?: 'Query';
  chatRoomMembers: {
    __typename?: 'ChatRoomMembersConnection';
    edges: Array<{
      __typename?: 'ChatRoomMemberEdge';
      cursor: string;
      role: ChatRoomRoleEnum;
      node: {
        __typename?: 'UserNode';
        id: string;
        guid: string;
        name: string;
        iconUrl: string;
        username: string;
        urn: string;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type GetChatRoomQueryVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  firstMembers: Scalars['Int']['input'];
  afterMembers: Scalars['Int']['input'];
}>;

export type GetChatRoomQuery = {
  __typename?: 'Query';
  chatRoom: {
    __typename?: 'ChatRoomEdge';
    cursor: string;
    totalMembers: number;
    unreadMessagesCount: number;
    lastMessagePlainText?: string | null;
    lastMessageCreatedTimestamp?: number | null;
    node: {
      __typename?: 'ChatRoomNode';
      guid: string;
      roomType: ChatRoomTypeEnum;
      id: string;
      name: string;
      groupGuid?: string | null;
      isChatRequest: boolean;
      isUserRoomOwner?: boolean | null;
      chatRoomNotificationStatus?: ChatRoomNotificationStatusEnum | null;
    };
    members: {
      __typename?: 'ChatRoomMembersConnection';
      edges: Array<{
        __typename?: 'ChatRoomMemberEdge';
        cursor: string;
        role: ChatRoomRoleEnum;
        node: {
          __typename?: 'UserNode';
          name: string;
          username: string;
          iconUrl: string;
          id: string;
          guid: string;
        };
      }>;
      pageInfo: {
        __typename?: 'PageInfo';
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: string | null;
        endCursor?: string | null;
      };
    };
  };
};

export type GetChatRoomInviteRequestsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetChatRoomInviteRequestsQuery = {
  __typename?: 'Query';
  chatRoomInviteRequests: {
    __typename?: 'ChatRoomsConnection';
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges: Array<{
      __typename?: 'ChatRoomEdge';
      cursor: string;
      lastMessagePlainText?: string | null;
      lastMessageCreatedTimestamp?: number | null;
      node: {
        __typename?: 'ChatRoomNode';
        id: string;
        guid: string;
        name: string;
        roomType: ChatRoomTypeEnum;
        isChatRequest: boolean;
        timeCreatedISO8601: string;
        timeCreatedUnix: string;
      };
      members: {
        __typename?: 'ChatRoomMembersConnection';
        edges: Array<{
          __typename?: 'ChatRoomMemberEdge';
          cursor: string;
          node: {
            __typename?: 'UserNode';
            id: string;
            guid: string;
            iconUrl: string;
            username: string;
            name: string;
          };
        }>;
      };
      messages: {
        __typename?: 'ChatMessagesConnection';
        edges: Array<{
          __typename?: 'ChatMessageEdge';
          cursor: string;
          node: {
            __typename?: 'ChatMessageNode';
            id: string;
            guid: string;
            roomGuid: string;
            plainText: string;
            timeCreatedISO8601: string;
            timeCreatedUnix: string;
          };
        }>;
      };
    }>;
  };
};

export type GetTotalRoomInviteRequestsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetTotalRoomInviteRequestsQuery = {
  __typename?: 'Query';
  totalRoomInviteRequests: number;
};

export type InitChatQueryVariables = Exact<{ [key: string]: never }>;

export type InitChatQuery = {
  __typename?: 'Query';
  chatUnreadMessagesCount: number;
};

export type LeaveChatRoomMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
}>;

export type LeaveChatRoomMutation = {
  __typename?: 'Mutation';
  leaveChatRoom: boolean;
};

export type RemoveMemberFromChatRoomMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  memberGuid: Scalars['String']['input'];
}>;

export type RemoveMemberFromChatRoomMutation = {
  __typename?: 'Mutation';
  removeMemberFromChatRoom: boolean;
};

export type ReplyToRoomInviteRequestMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  action: ChatRoomInviteRequestActionEnum;
}>;

export type ReplyToRoomInviteRequestMutation = {
  __typename?: 'Mutation';
  replyToRoomInviteRequest: boolean;
};

export type SetReadReceiptMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  messageGuid: Scalars['String']['input'];
}>;

export type SetReadReceiptMutation = {
  __typename?: 'Mutation';
  readReceipt: {
    __typename?: 'ChatRoomEdge';
    id: string;
    unreadMessagesCount: number;
  };
};

export type UpdateChatRoomNameMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  roomName: Scalars['String']['input'];
}>;

export type UpdateChatRoomNameMutation = {
  __typename?: 'Mutation';
  updateChatRoomName: boolean;
};

export type UpdateChatRoomNotificationSettingsMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  notificationStatus: ChatRoomNotificationStatusEnum;
}>;

export type UpdateChatRoomNotificationSettingsMutation = {
  __typename?: 'Mutation';
  updateNotificationSettings: boolean;
};

export type GetCustomPageQueryVariables = Exact<{
  pageType: Scalars['String']['input'];
}>;

export type GetCustomPageQuery = {
  __typename?: 'Query';
  customPage: {
    __typename?: 'CustomPage';
    pageType: CustomPageTypesEnum;
    content?: string | null;
    externalLink?: string | null;
    defaultContent?: string | null;
  };
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

export type GetNavigationItemsQueryVariables = Exact<{ [key: string]: never }>;

export type GetNavigationItemsQuery = {
  __typename?: 'Query';
  customNavigationItems: Array<{
    __typename?: 'NavigationItem';
    id: string;
    name: string;
    type: NavigationItemTypeEnum;
    action?: NavigationItemActionEnum | null;
    iconId: string;
    order: number;
    url?: string | null;
    visible: boolean;
    visibleMobile: boolean;
    path?: string | null;
  }>;
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
          __typename?: 'AnalyticsTableRowEdge';
          cursor: string;
          node:
            | { __typename: 'ActivityNode'; legacy: string; id: string }
            | { __typename: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename: 'ChatMessageNode'; id: string }
            | { __typename: 'ChatRichEmbedNode'; id: string }
            | { __typename: 'ChatRoomNode'; id: string }
            | { __typename: 'CommentNode'; id: string }
            | { __typename: 'CustomPage'; id: string }
            | { __typename: 'FeaturedEntity'; id: string }
            | { __typename: 'FeaturedEntityConnection'; id: string }
            | { __typename: 'FeaturedGroup'; id: string }
            | { __typename: 'FeaturedUser'; id: string }
            | { __typename: 'FeedExploreTagNode'; tag: string; id: string }
            | { __typename: 'FeedHeaderNode'; text: string; id: string }
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
            | { __typename: 'Invite'; id: string }
            | { __typename: 'InviteConnection'; id: string }
            | { __typename: 'NodeImpl'; id: string }
            | {
                __typename: 'PublisherRecsConnection';
                dismissible: boolean;
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: { __typename: 'ActivityNode'; id: string };
                    }
                  | {
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: { __typename: 'ChatRoomNode'; id: string };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename: 'UserNode';
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
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename: 'Invite';
                        id: string;
                      } | null;
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
                  | {
                      __typename?: 'UserRoleEdge';
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
            | { __typename: 'UserNode'; id: string };
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
          __typename?: 'ChatMessageEdge';
          cursor: string;
          node: { __typename: 'ChatMessageNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomEdge';
          cursor: string;
          node: { __typename: 'ChatRoomNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomMemberEdge';
          cursor: string;
          node: { __typename: 'UserNode'; id: string };
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
            | { __typename: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename: 'ChatMessageNode'; id: string }
            | { __typename: 'ChatRichEmbedNode'; id: string }
            | { __typename: 'ChatRoomNode'; id: string }
            | { __typename: 'CommentNode'; id: string }
            | { __typename: 'CustomPage'; id: string }
            | { __typename: 'FeaturedEntity'; id: string }
            | { __typename: 'FeaturedEntityConnection'; id: string }
            | { __typename: 'FeaturedGroup'; id: string }
            | { __typename: 'FeaturedUser'; id: string }
            | { __typename: 'FeedExploreTagNode'; tag: string; id: string }
            | { __typename: 'FeedHeaderNode'; text: string; id: string }
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
            | { __typename: 'Invite'; id: string }
            | { __typename: 'InviteConnection'; id: string }
            | { __typename: 'NodeImpl'; id: string }
            | {
                __typename: 'PublisherRecsConnection';
                dismissible: boolean;
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: { __typename: 'ActivityNode'; id: string };
                    }
                  | {
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: { __typename: 'ChatRoomNode'; id: string };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename: 'UserNode';
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
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename: 'Invite';
                        id: string;
                      } | null;
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
                  | {
                      __typename?: 'UserRoleEdge';
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
          node:
            | { __typename: 'ActivityNode'; legacy: string; id: string }
            | { __typename: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename: 'ChatMessageNode'; id: string }
            | { __typename: 'ChatRichEmbedNode'; id: string }
            | { __typename: 'ChatRoomNode'; id: string }
            | { __typename: 'CommentNode'; id: string }
            | { __typename: 'CustomPage'; id: string }
            | { __typename: 'FeaturedEntity'; id: string }
            | { __typename: 'FeaturedEntityConnection'; id: string }
            | { __typename: 'FeaturedGroup'; id: string }
            | { __typename: 'FeaturedUser'; id: string }
            | { __typename: 'FeedExploreTagNode'; tag: string; id: string }
            | { __typename: 'FeedHeaderNode'; text: string; id: string }
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
            | { __typename: 'Invite'; id: string }
            | { __typename: 'InviteConnection'; id: string }
            | { __typename: 'NodeImpl'; id: string }
            | {
                __typename: 'PublisherRecsConnection';
                dismissible: boolean;
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: { __typename: 'ActivityNode'; id: string };
                    }
                  | {
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: { __typename: 'ChatRoomNode'; id: string };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename: 'UserNode';
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
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | { __typename: 'UserNode'; legacy: string; id: string }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename: 'ActivityNode'; id: string }
                        | {
                            __typename: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename: 'ChatMessageNode'; id: string }
                        | { __typename: 'ChatRichEmbedNode'; id: string }
                        | { __typename: 'ChatRoomNode'; id: string }
                        | { __typename: 'CommentNode'; id: string }
                        | { __typename: 'CustomPage'; id: string }
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
                        | { __typename: 'Invite'; id: string }
                        | { __typename: 'InviteConnection'; id: string }
                        | { __typename: 'NodeImpl'; id: string }
                        | { __typename: 'PublisherRecsConnection'; id: string }
                        | { __typename: 'Report'; id: string }
                        | {
                            __typename: 'UserNode';
                            legacy: string;
                            id: string;
                          };
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
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename: 'Invite';
                        id: string;
                      } | null;
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
                  | {
                      __typename?: 'UserRoleEdge';
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
            | { __typename: 'UserNode'; id: string };
        }
      | {
          __typename?: 'FeedExploreTagEdge';
          cursor: string;
          node: { __typename: 'FeedExploreTagNode'; tag: string; id: string };
        }
      | {
          __typename?: 'FeedHeaderEdge';
          cursor: string;
          node: { __typename: 'FeedHeaderNode'; text: string; id: string };
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
          __typename?: 'InviteEdge';
          cursor: string;
          node?: { __typename: 'Invite'; id: string } | null;
        }
      | {
          __typename?: 'PublisherRecsEdge';
          cursor: string;
          node: {
            __typename: 'PublisherRecsConnection';
            dismissible: boolean;
            id: string;
            edges: Array<
              | {
                  __typename?: 'ActivityEdge';
                  publisherNode: { __typename: 'ActivityNode'; id: string };
                }
              | {
                  __typename?: 'AnalyticsTableRowEdge';
                  publisherNode:
                    | { __typename: 'ActivityNode'; id: string }
                    | {
                        __typename: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename: 'BoostNode'; legacy: string; id: string }
                    | { __typename: 'ChatMessageNode'; id: string }
                    | { __typename: 'ChatRichEmbedNode'; id: string }
                    | { __typename: 'ChatRoomNode'; id: string }
                    | { __typename: 'CommentNode'; id: string }
                    | { __typename: 'CustomPage'; id: string }
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
                    | { __typename: 'Invite'; id: string }
                    | { __typename: 'InviteConnection'; id: string }
                    | { __typename: 'NodeImpl'; id: string }
                    | { __typename: 'PublisherRecsConnection'; id: string }
                    | { __typename: 'Report'; id: string }
                    | { __typename: 'UserNode'; legacy: string; id: string };
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
                  __typename?: 'ChatMessageEdge';
                  publisherNode: { __typename: 'ChatMessageNode'; id: string };
                }
              | {
                  __typename?: 'ChatRoomEdge';
                  publisherNode: { __typename: 'ChatRoomNode'; id: string };
                }
              | {
                  __typename?: 'ChatRoomMemberEdge';
                  publisherNode: {
                    __typename: 'UserNode';
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
                        __typename: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename: 'BoostNode'; legacy: string; id: string }
                    | { __typename: 'ChatMessageNode'; id: string }
                    | { __typename: 'ChatRichEmbedNode'; id: string }
                    | { __typename: 'ChatRoomNode'; id: string }
                    | { __typename: 'CommentNode'; id: string }
                    | { __typename: 'CustomPage'; id: string }
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
                    | { __typename: 'Invite'; id: string }
                    | { __typename: 'InviteConnection'; id: string }
                    | { __typename: 'NodeImpl'; id: string }
                    | { __typename: 'PublisherRecsConnection'; id: string }
                    | { __typename: 'Report'; id: string }
                    | { __typename: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeaturedEntityEdge';
                  publisherNode:
                    | { __typename: 'ActivityNode'; id: string }
                    | {
                        __typename: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename: 'BoostNode'; legacy: string; id: string }
                    | { __typename: 'ChatMessageNode'; id: string }
                    | { __typename: 'ChatRichEmbedNode'; id: string }
                    | { __typename: 'ChatRoomNode'; id: string }
                    | { __typename: 'CommentNode'; id: string }
                    | { __typename: 'CustomPage'; id: string }
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
                    | { __typename: 'Invite'; id: string }
                    | { __typename: 'InviteConnection'; id: string }
                    | { __typename: 'NodeImpl'; id: string }
                    | { __typename: 'PublisherRecsConnection'; id: string }
                    | { __typename: 'Report'; id: string }
                    | { __typename: 'UserNode'; legacy: string; id: string };
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
                  __typename?: 'InviteEdge';
                  publisherNode?: { __typename: 'Invite'; id: string } | null;
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
              | {
                  __typename?: 'UserRoleEdge';
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
      | {
          __typename?: 'UserRoleEdge';
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

export type GetSiteMembershipForActivityQueryVariables = Exact<{
  activityGuid: Scalars['String']['input'];
  externalOnly: Scalars['Boolean']['input'];
}>;

export type GetSiteMembershipForActivityQuery = {
  __typename?: 'Query';
  lowestPriceSiteMembershipForActivity?: {
    __typename?: 'SiteMembership';
    membershipGuid: string;
    isExternal: boolean;
    purchaseUrl?: string | null;
    membershipName: string;
    membershipDescription?: string | null;
    membershipPriceInCents: number;
    priceCurrency: string;
    membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
    membershipPricingModel: SiteMembershipPricingModelEnum;
  } | null;
};

export type GetSiteMembershipQueryVariables = Exact<{
  membershipGuid: Scalars['String']['input'];
}>;

export type GetSiteMembershipQuery = {
  __typename?: 'Query';
  siteMembership: {
    __typename?: 'SiteMembership';
    id: string;
    membershipGuid: string;
    membershipName: string;
    membershipDescription?: string | null;
    membershipPriceInCents: number;
    priceCurrency: string;
    membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
    membershipPricingModel: SiteMembershipPricingModelEnum;
    archived: boolean;
    isExternal: boolean;
    purchaseUrl?: string | null;
    manageUrl?: string | null;
    roles?: Array<{ __typename?: 'Role'; id: number; name: string }> | null;
    groups?: Array<{
      __typename?: 'GroupNode';
      guid: string;
      name: string;
      membersCount: number;
      legacy: string;
    }> | null;
  };
};

export type GetSiteMembershipsAndSubscriptionsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetSiteMembershipsAndSubscriptionsQuery = {
  __typename?: 'Query';
  siteMemberships: Array<{
    __typename?: 'SiteMembership';
    id: string;
    membershipGuid: string;
    membershipName: string;
    membershipDescription?: string | null;
    membershipPriceInCents: number;
    priceCurrency: string;
    membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
    membershipPricingModel: SiteMembershipPricingModelEnum;
    isExternal: boolean;
    purchaseUrl?: string | null;
    manageUrl?: string | null;
    roles?: Array<{ __typename?: 'Role'; id: number; name: string }> | null;
    groups?: Array<{
      __typename?: 'GroupNode';
      guid: string;
      name: string;
      membersCount: number;
      legacy: string;
    }> | null;
  }>;
  siteMembershipSubscriptions: Array<{
    __typename?: 'SiteMembershipSubscription';
    membershipGuid: string;
    membershipSubscriptionId: number;
    autoRenew: boolean;
    isManual: boolean;
    validFromTimestamp?: number | null;
    validToTimestamp?: number | null;
  }>;
};

export type CreateNewReportMutationVariables = Exact<{
  entityUrn: Scalars['String']['input'];
  reason: ReportReasonEnum;
  illegalSubReason?: InputMaybe<IllegalSubReasonEnum>;
  nsfwSubReason?: InputMaybe<NsfwSubReasonEnum>;
  securitySubReason?: InputMaybe<SecuritySubReasonEnum>;
}>;

export type CreateNewReportMutation = {
  __typename?: 'Mutation';
  createNewReport: boolean;
};

export type DeletePostHogPersonMutationVariables = Exact<{
  [key: string]: never;
}>;

export type DeletePostHogPersonMutation = {
  __typename?: 'Mutation';
  deletePostHogPerson: boolean;
};

export const PageInfoFragmentDoc = `
    fragment PageInfo on PageInfo {
  hasPreviousPage
  hasNextPage
  startCursor
  endCursor
}
    `;
export const FetchOidcProvidersDocument = `
    query FetchOidcProviders {
  oidcProviders {
    id
    name
    loginUrl
  }
}
    `;
export const useFetchOidcProvidersQuery = <
  TData = FetchOidcProvidersQuery,
  TError = unknown,
>(
  variables?: FetchOidcProvidersQueryVariables,
  options?: UseQueryOptions<FetchOidcProvidersQuery, TError, TData>,
) =>
  useQuery<FetchOidcProvidersQuery, TError, TData>(
    variables === undefined
      ? ['FetchOidcProviders']
      : ['FetchOidcProviders', variables],
    gqlFetcher<FetchOidcProvidersQuery, FetchOidcProvidersQueryVariables>(
      FetchOidcProvidersDocument,
      variables,
    ),
    options,
  );

useFetchOidcProvidersQuery.getKey = (
  variables?: FetchOidcProvidersQueryVariables,
) =>
  variables === undefined
    ? ['FetchOidcProviders']
    : ['FetchOidcProviders', variables];
export const useInfiniteFetchOidcProvidersQuery = <
  TData = FetchOidcProvidersQuery,
  TError = unknown,
>(
  pageParamKey: keyof FetchOidcProvidersQueryVariables,
  variables?: FetchOidcProvidersQueryVariables,
  options?: UseInfiniteQueryOptions<FetchOidcProvidersQuery, TError, TData>,
) => {
  return useInfiniteQuery<FetchOidcProvidersQuery, TError, TData>(
    variables === undefined
      ? ['FetchOidcProviders.infinite']
      : ['FetchOidcProviders.infinite', variables],
    metaData =>
      gqlFetcher<FetchOidcProvidersQuery, FetchOidcProvidersQueryVariables>(
        FetchOidcProvidersDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteFetchOidcProvidersQuery.getKey = (
  variables?: FetchOidcProvidersQueryVariables,
) =>
  variables === undefined
    ? ['FetchOidcProviders.infinite']
    : ['FetchOidcProviders.infinite', variables];
useFetchOidcProvidersQuery.fetcher = (
  variables?: FetchOidcProvidersQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<FetchOidcProvidersQuery, FetchOidcProvidersQueryVariables>(
    FetchOidcProvidersDocument,
    variables,
    options,
  );
export const GetPostSubscriptionDocument = `
    query GetPostSubscription($entityGuid: String!) {
  postSubscription(entityGuid: $entityGuid) {
    userGuid
    entityGuid
    frequency
  }
}
    `;
export const useGetPostSubscriptionQuery = <
  TData = GetPostSubscriptionQuery,
  TError = unknown,
>(
  variables: GetPostSubscriptionQueryVariables,
  options?: UseQueryOptions<GetPostSubscriptionQuery, TError, TData>,
) =>
  useQuery<GetPostSubscriptionQuery, TError, TData>(
    ['GetPostSubscription', variables],
    gqlFetcher<GetPostSubscriptionQuery, GetPostSubscriptionQueryVariables>(
      GetPostSubscriptionDocument,
      variables,
    ),
    options,
  );

useGetPostSubscriptionQuery.getKey = (
  variables: GetPostSubscriptionQueryVariables,
) => ['GetPostSubscription', variables];
export const useInfiniteGetPostSubscriptionQuery = <
  TData = GetPostSubscriptionQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetPostSubscriptionQueryVariables,
  variables: GetPostSubscriptionQueryVariables,
  options?: UseInfiniteQueryOptions<GetPostSubscriptionQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetPostSubscriptionQuery, TError, TData>(
    ['GetPostSubscription.infinite', variables],
    metaData =>
      gqlFetcher<GetPostSubscriptionQuery, GetPostSubscriptionQueryVariables>(
        GetPostSubscriptionDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteGetPostSubscriptionQuery.getKey = (
  variables: GetPostSubscriptionQueryVariables,
) => ['GetPostSubscription.infinite', variables];
useGetPostSubscriptionQuery.fetcher = (
  variables: GetPostSubscriptionQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetPostSubscriptionQuery, GetPostSubscriptionQueryVariables>(
    GetPostSubscriptionDocument,
    variables,
    options,
  );
export const UpdatePostSubscriptionsDocument = `
    mutation UpdatePostSubscriptions($entityGuid: String!, $frequency: PostSubscriptionFrequencyEnum!) {
  updatePostSubscription(entityGuid: $entityGuid, frequency: $frequency) {
    userGuid
    entityGuid
    frequency
  }
}
    `;
export const useUpdatePostSubscriptionsMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdatePostSubscriptionsMutation,
    TError,
    UpdatePostSubscriptionsMutationVariables,
    TContext
  >,
) =>
  useMutation<
    UpdatePostSubscriptionsMutation,
    TError,
    UpdatePostSubscriptionsMutationVariables,
    TContext
  >(
    ['UpdatePostSubscriptions'],
    (variables?: UpdatePostSubscriptionsMutationVariables) =>
      gqlFetcher<
        UpdatePostSubscriptionsMutation,
        UpdatePostSubscriptionsMutationVariables
      >(UpdatePostSubscriptionsDocument, variables)(),
    options,
  );
useUpdatePostSubscriptionsMutation.fetcher = (
  variables: UpdatePostSubscriptionsMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    UpdatePostSubscriptionsMutation,
    UpdatePostSubscriptionsMutationVariables
  >(UpdatePostSubscriptionsDocument, variables, options);
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

useGetDismissalsQuery.getKey = (variables?: GetDismissalsQueryVariables) =>
  variables === undefined ? ['GetDismissals'] : ['GetDismissals', variables];
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

useInfiniteGetDismissalsQuery.getKey = (
  variables?: GetDismissalsQueryVariables,
) =>
  variables === undefined
    ? ['GetDismissals.infinite']
    : ['GetDismissals.infinite', variables];
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

useGetDismissalQuery.getKey = (variables: GetDismissalQueryVariables) => [
  'GetDismissal',
  variables,
];
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

useInfiniteGetDismissalQuery.getKey = (
  variables: GetDismissalQueryVariables,
) => ['GetDismissal.infinite', variables];
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

useGetOnboardingStateQuery.getKey = (
  variables?: GetOnboardingStateQueryVariables,
) =>
  variables === undefined
    ? ['GetOnboardingState']
    : ['GetOnboardingState', variables];
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

useInfiniteGetOnboardingStateQuery.getKey = (
  variables?: GetOnboardingStateQueryVariables,
) =>
  variables === undefined
    ? ['GetOnboardingState.infinite']
    : ['GetOnboardingState.infinite', variables];
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

useGetOnboardingStepProgressQuery.getKey = (
  variables?: GetOnboardingStepProgressQueryVariables,
) =>
  variables === undefined
    ? ['GetOnboardingStepProgress']
    : ['GetOnboardingStepProgress', variables];
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

useInfiniteGetOnboardingStepProgressQuery.getKey = (
  variables?: GetOnboardingStepProgressQueryVariables,
) =>
  variables === undefined
    ? ['GetOnboardingStepProgress.infinite']
    : ['GetOnboardingStepProgress.infinite', variables];
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
        __typename
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
              __typename
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

useFetchSearchQuery.getKey = (variables: FetchSearchQueryVariables) => [
  'FetchSearch',
  variables,
];
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

useInfiniteFetchSearchQuery.getKey = (variables: FetchSearchQueryVariables) => [
  'FetchSearch.infinite',
  variables,
];
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

useCountSearchQuery.getKey = (variables: CountSearchQueryVariables) => [
  'CountSearch',
  variables,
];
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

useInfiniteCountSearchQuery.getKey = (variables: CountSearchQueryVariables) => [
  'CountSearch.infinite',
  variables,
];
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

useFetchPaymentMethodsQuery.getKey = (
  variables?: FetchPaymentMethodsQueryVariables,
) =>
  variables === undefined
    ? ['FetchPaymentMethods']
    : ['FetchPaymentMethods', variables];
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

useInfiniteFetchPaymentMethodsQuery.getKey = (
  variables?: FetchPaymentMethodsQueryVariables,
) =>
  variables === undefined
    ? ['FetchPaymentMethods.infinite']
    : ['FetchPaymentMethods.infinite', variables];
useFetchPaymentMethodsQuery.fetcher = (
  variables?: FetchPaymentMethodsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<FetchPaymentMethodsQuery, FetchPaymentMethodsQueryVariables>(
    FetchPaymentMethodsDocument,
    variables,
    options,
  );
export const GetBoostFeedDocument = `
    query GetBoostFeed($targetLocation: Int, $first: Int, $after: Int!, $source: String!) {
  boosts(
    targetLocation: $targetLocation
    first: $first
    after: $after
    source: $source
  ) {
    edges {
      node {
        guid
        activity {
          __typename
          legacy
        }
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
export const useGetBoostFeedQuery = <
  TData = GetBoostFeedQuery,
  TError = unknown,
>(
  variables: GetBoostFeedQueryVariables,
  options?: UseQueryOptions<GetBoostFeedQuery, TError, TData>,
) =>
  useQuery<GetBoostFeedQuery, TError, TData>(
    ['GetBoostFeed', variables],
    gqlFetcher<GetBoostFeedQuery, GetBoostFeedQueryVariables>(
      GetBoostFeedDocument,
      variables,
    ),
    options,
  );

useGetBoostFeedQuery.getKey = (variables: GetBoostFeedQueryVariables) => [
  'GetBoostFeed',
  variables,
];
export const useInfiniteGetBoostFeedQuery = <
  TData = GetBoostFeedQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetBoostFeedQueryVariables,
  variables: GetBoostFeedQueryVariables,
  options?: UseInfiniteQueryOptions<GetBoostFeedQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetBoostFeedQuery, TError, TData>(
    ['GetBoostFeed.infinite', variables],
    metaData =>
      gqlFetcher<GetBoostFeedQuery, GetBoostFeedQueryVariables>(
        GetBoostFeedDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteGetBoostFeedQuery.getKey = (
  variables: GetBoostFeedQueryVariables,
) => ['GetBoostFeed.infinite', variables];
useGetBoostFeedQuery.fetcher = (
  variables: GetBoostFeedQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetBoostFeedQuery, GetBoostFeedQueryVariables>(
    GetBoostFeedDocument,
    variables,
    options,
  );
export const AddMembersToChatRoomDocument = `
    mutation AddMembersToChatRoom($roomGuid: String!, $memberGuids: [String!]!) {
  addMembersToChatRoom(roomGuid: $roomGuid, memberGuids: $memberGuids)
}
    `;
export const useAddMembersToChatRoomMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    AddMembersToChatRoomMutation,
    TError,
    AddMembersToChatRoomMutationVariables,
    TContext
  >,
) =>
  useMutation<
    AddMembersToChatRoomMutation,
    TError,
    AddMembersToChatRoomMutationVariables,
    TContext
  >(
    ['AddMembersToChatRoom'],
    (variables?: AddMembersToChatRoomMutationVariables) =>
      gqlFetcher<
        AddMembersToChatRoomMutation,
        AddMembersToChatRoomMutationVariables
      >(AddMembersToChatRoomDocument, variables)(),
    options,
  );
useAddMembersToChatRoomMutation.fetcher = (
  variables: AddMembersToChatRoomMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    AddMembersToChatRoomMutation,
    AddMembersToChatRoomMutationVariables
  >(AddMembersToChatRoomDocument, variables, options);
export const CreateChatMessageDocument = `
    mutation CreateChatMessage($plainText: String!, $roomGuid: String!) {
  createChatMessage(plainText: $plainText, roomGuid: $roomGuid) {
    cursor
    node {
      id
      guid
      roomGuid
      plainText
      timeCreatedISO8601
      timeCreatedUnix
      richEmbed {
        id
        url
        canonicalUrl
        title
        thumbnailSrc
      }
      sender {
        id
        type
        cursor
        node {
          name
          username
          iconUrl
          guid
          id
        }
      }
    }
  }
}
    `;
export const useCreateChatMessageMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateChatMessageMutation,
    TError,
    CreateChatMessageMutationVariables,
    TContext
  >,
) =>
  useMutation<
    CreateChatMessageMutation,
    TError,
    CreateChatMessageMutationVariables,
    TContext
  >(
    ['CreateChatMessage'],
    (variables?: CreateChatMessageMutationVariables) =>
      gqlFetcher<CreateChatMessageMutation, CreateChatMessageMutationVariables>(
        CreateChatMessageDocument,
        variables,
      )(),
    options,
  );
useCreateChatMessageMutation.fetcher = (
  variables: CreateChatMessageMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<CreateChatMessageMutation, CreateChatMessageMutationVariables>(
    CreateChatMessageDocument,
    variables,
    options,
  );
export const CreateChatRoomDocument = `
    mutation CreateChatRoom($otherMemberGuids: [String!]!, $roomType: ChatRoomTypeEnum, $groupGuid: String) {
  createChatRoom(
    otherMemberGuids: $otherMemberGuids
    roomType: $roomType
    groupGuid: $groupGuid
  ) {
    cursor
    node {
      id
      guid
      roomType
      groupGuid
      timeCreatedISO8601
      timeCreatedUnix
    }
  }
}
    `;
export const useCreateChatRoomMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateChatRoomMutation,
    TError,
    CreateChatRoomMutationVariables,
    TContext
  >,
) =>
  useMutation<
    CreateChatRoomMutation,
    TError,
    CreateChatRoomMutationVariables,
    TContext
  >(
    ['CreateChatRoom'],
    (variables?: CreateChatRoomMutationVariables) =>
      gqlFetcher<CreateChatRoomMutation, CreateChatRoomMutationVariables>(
        CreateChatRoomDocument,
        variables,
      )(),
    options,
  );
useCreateChatRoomMutation.fetcher = (
  variables: CreateChatRoomMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<CreateChatRoomMutation, CreateChatRoomMutationVariables>(
    CreateChatRoomDocument,
    variables,
    options,
  );
export const CreateGroupChatRoomDocument = `
    mutation CreateGroupChatRoom($groupGuid: String!) {
  createGroupChatRoom(groupGuid: $groupGuid) {
    cursor
    node {
      id
      guid
      roomType
      groupGuid
      timeCreatedISO8601
      timeCreatedUnix
    }
  }
}
    `;
export const useCreateGroupChatRoomMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateGroupChatRoomMutation,
    TError,
    CreateGroupChatRoomMutationVariables,
    TContext
  >,
) =>
  useMutation<
    CreateGroupChatRoomMutation,
    TError,
    CreateGroupChatRoomMutationVariables,
    TContext
  >(
    ['CreateGroupChatRoom'],
    (variables?: CreateGroupChatRoomMutationVariables) =>
      gqlFetcher<
        CreateGroupChatRoomMutation,
        CreateGroupChatRoomMutationVariables
      >(CreateGroupChatRoomDocument, variables)(),
    options,
  );
useCreateGroupChatRoomMutation.fetcher = (
  variables: CreateGroupChatRoomMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<CreateGroupChatRoomMutation, CreateGroupChatRoomMutationVariables>(
    CreateGroupChatRoomDocument,
    variables,
    options,
  );
export const DeleteChatMessageDocument = `
    mutation DeleteChatMessage($roomGuid: String!, $messageGuid: String!) {
  deleteChatMessage(roomGuid: $roomGuid, messageGuid: $messageGuid)
}
    `;
export const useDeleteChatMessageMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeleteChatMessageMutation,
    TError,
    DeleteChatMessageMutationVariables,
    TContext
  >,
) =>
  useMutation<
    DeleteChatMessageMutation,
    TError,
    DeleteChatMessageMutationVariables,
    TContext
  >(
    ['DeleteChatMessage'],
    (variables?: DeleteChatMessageMutationVariables) =>
      gqlFetcher<DeleteChatMessageMutation, DeleteChatMessageMutationVariables>(
        DeleteChatMessageDocument,
        variables,
      )(),
    options,
  );
useDeleteChatMessageMutation.fetcher = (
  variables: DeleteChatMessageMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<DeleteChatMessageMutation, DeleteChatMessageMutationVariables>(
    DeleteChatMessageDocument,
    variables,
    options,
  );
export const DeleteChatRoomAndBlockUserDocument = `
    mutation DeleteChatRoomAndBlockUser($roomGuid: String!) {
  deleteChatRoomAndBlockUser(roomGuid: $roomGuid)
}
    `;
export const useDeleteChatRoomAndBlockUserMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeleteChatRoomAndBlockUserMutation,
    TError,
    DeleteChatRoomAndBlockUserMutationVariables,
    TContext
  >,
) =>
  useMutation<
    DeleteChatRoomAndBlockUserMutation,
    TError,
    DeleteChatRoomAndBlockUserMutationVariables,
    TContext
  >(
    ['DeleteChatRoomAndBlockUser'],
    (variables?: DeleteChatRoomAndBlockUserMutationVariables) =>
      gqlFetcher<
        DeleteChatRoomAndBlockUserMutation,
        DeleteChatRoomAndBlockUserMutationVariables
      >(DeleteChatRoomAndBlockUserDocument, variables)(),
    options,
  );
useDeleteChatRoomAndBlockUserMutation.fetcher = (
  variables: DeleteChatRoomAndBlockUserMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    DeleteChatRoomAndBlockUserMutation,
    DeleteChatRoomAndBlockUserMutationVariables
  >(DeleteChatRoomAndBlockUserDocument, variables, options);
export const DeleteChatRoomDocument = `
    mutation DeleteChatRoom($roomGuid: String!) {
  deleteChatRoom(roomGuid: $roomGuid)
}
    `;
export const useDeleteChatRoomMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteChatRoomMutation,
    TError,
    DeleteChatRoomMutationVariables,
    TContext
  >,
) =>
  useMutation<
    DeleteChatRoomMutation,
    TError,
    DeleteChatRoomMutationVariables,
    TContext
  >(
    ['DeleteChatRoom'],
    (variables?: DeleteChatRoomMutationVariables) =>
      gqlFetcher<DeleteChatRoomMutation, DeleteChatRoomMutationVariables>(
        DeleteChatRoomDocument,
        variables,
      )(),
    options,
  );
useDeleteChatRoomMutation.fetcher = (
  variables: DeleteChatRoomMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<DeleteChatRoomMutation, DeleteChatRoomMutationVariables>(
    DeleteChatRoomDocument,
    variables,
    options,
  );
export const DeleteGroupChatRoomsDocument = `
    mutation DeleteGroupChatRooms($groupGuid: String!) {
  deleteGroupChatRooms(groupGuid: $groupGuid)
}
    `;
export const useDeleteGroupChatRoomsMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeleteGroupChatRoomsMutation,
    TError,
    DeleteGroupChatRoomsMutationVariables,
    TContext
  >,
) =>
  useMutation<
    DeleteGroupChatRoomsMutation,
    TError,
    DeleteGroupChatRoomsMutationVariables,
    TContext
  >(
    ['DeleteGroupChatRooms'],
    (variables?: DeleteGroupChatRoomsMutationVariables) =>
      gqlFetcher<
        DeleteGroupChatRoomsMutation,
        DeleteGroupChatRoomsMutationVariables
      >(DeleteGroupChatRoomsDocument, variables)(),
    options,
  );
useDeleteGroupChatRoomsMutation.fetcher = (
  variables: DeleteGroupChatRoomsMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    DeleteGroupChatRoomsMutation,
    DeleteGroupChatRoomsMutationVariables
  >(DeleteGroupChatRoomsDocument, variables, options);
export const GetChatRoomsListDocument = `
    query GetChatRoomsList($first: Int, $after: String) {
  chatRoomList(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        guid
        name
        roomType
        groupGuid
        timeCreatedISO8601
        timeCreatedUnix
      }
      members(first: 3) {
        edges {
          cursor
          node {
            id
            guid
            iconUrl
            username
            name
          }
        }
      }
      unreadMessagesCount
      lastMessagePlainText
      lastMessageCreatedTimestamp
    }
  }
}
    `;
export const useGetChatRoomsListQuery = <
  TData = GetChatRoomsListQuery,
  TError = unknown,
>(
  variables?: GetChatRoomsListQueryVariables,
  options?: UseQueryOptions<GetChatRoomsListQuery, TError, TData>,
) =>
  useQuery<GetChatRoomsListQuery, TError, TData>(
    variables === undefined
      ? ['GetChatRoomsList']
      : ['GetChatRoomsList', variables],
    gqlFetcher<GetChatRoomsListQuery, GetChatRoomsListQueryVariables>(
      GetChatRoomsListDocument,
      variables,
    ),
    options,
  );

useGetChatRoomsListQuery.getKey = (
  variables?: GetChatRoomsListQueryVariables,
) =>
  variables === undefined
    ? ['GetChatRoomsList']
    : ['GetChatRoomsList', variables];
export const useInfiniteGetChatRoomsListQuery = <
  TData = GetChatRoomsListQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetChatRoomsListQueryVariables,
  variables?: GetChatRoomsListQueryVariables,
  options?: UseInfiniteQueryOptions<GetChatRoomsListQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetChatRoomsListQuery, TError, TData>(
    variables === undefined
      ? ['GetChatRoomsList.infinite']
      : ['GetChatRoomsList.infinite', variables],
    metaData =>
      gqlFetcher<GetChatRoomsListQuery, GetChatRoomsListQueryVariables>(
        GetChatRoomsListDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteGetChatRoomsListQuery.getKey = (
  variables?: GetChatRoomsListQueryVariables,
) =>
  variables === undefined
    ? ['GetChatRoomsList.infinite']
    : ['GetChatRoomsList.infinite', variables];
useGetChatRoomsListQuery.fetcher = (
  variables?: GetChatRoomsListQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetChatRoomsListQuery, GetChatRoomsListQueryVariables>(
    GetChatRoomsListDocument,
    variables,
    options,
  );
export const GetChatMessagesDocument = `
    query GetChatMessages($pageSize: Int!, $roomGuid: String!, $after: String, $before: String) {
  chatMessages(
    roomGuid: $roomGuid
    first: $pageSize
    after: $after
    before: $before
  ) {
    edges {
      cursor
      node {
        guid
        id
        plainText
        sender {
          id
          node {
            id
            guid
            iconUrl
            name
            username
          }
        }
        richEmbed {
          id
          url
          canonicalUrl
          title
          thumbnailSrc
        }
        timeCreatedISO8601
        timeCreatedUnix
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;
export const useGetChatMessagesQuery = <
  TData = GetChatMessagesQuery,
  TError = unknown,
>(
  variables: GetChatMessagesQueryVariables,
  options?: UseQueryOptions<GetChatMessagesQuery, TError, TData>,
) =>
  useQuery<GetChatMessagesQuery, TError, TData>(
    ['GetChatMessages', variables],
    gqlFetcher<GetChatMessagesQuery, GetChatMessagesQueryVariables>(
      GetChatMessagesDocument,
      variables,
    ),
    options,
  );

useGetChatMessagesQuery.getKey = (variables: GetChatMessagesQueryVariables) => [
  'GetChatMessages',
  variables,
];
export const useInfiniteGetChatMessagesQuery = <
  TData = GetChatMessagesQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetChatMessagesQueryVariables,
  variables: GetChatMessagesQueryVariables,
  options?: UseInfiniteQueryOptions<GetChatMessagesQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetChatMessagesQuery, TError, TData>(
    ['GetChatMessages.infinite', variables],
    metaData =>
      gqlFetcher<GetChatMessagesQuery, GetChatMessagesQueryVariables>(
        GetChatMessagesDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteGetChatMessagesQuery.getKey = (
  variables: GetChatMessagesQueryVariables,
) => ['GetChatMessages.infinite', variables];
useGetChatMessagesQuery.fetcher = (
  variables: GetChatMessagesQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetChatMessagesQuery, GetChatMessagesQueryVariables>(
    GetChatMessagesDocument,
    variables,
    options,
  );
export const GetChatRoomMembersDocument = `
    query GetChatRoomMembers($roomGuid: String!, $first: Int!, $after: String, $excludeSelf: Boolean) {
  chatRoomMembers(
    roomGuid: $roomGuid
    first: $first
    after: $after
    excludeSelf: $excludeSelf
  ) {
    edges {
      cursor
      role
      node {
        id
        guid
        name
        iconUrl
        username
        urn
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;
export const useGetChatRoomMembersQuery = <
  TData = GetChatRoomMembersQuery,
  TError = unknown,
>(
  variables: GetChatRoomMembersQueryVariables,
  options?: UseQueryOptions<GetChatRoomMembersQuery, TError, TData>,
) =>
  useQuery<GetChatRoomMembersQuery, TError, TData>(
    ['GetChatRoomMembers', variables],
    gqlFetcher<GetChatRoomMembersQuery, GetChatRoomMembersQueryVariables>(
      GetChatRoomMembersDocument,
      variables,
    ),
    options,
  );

useGetChatRoomMembersQuery.getKey = (
  variables: GetChatRoomMembersQueryVariables,
) => ['GetChatRoomMembers', variables];
export const useInfiniteGetChatRoomMembersQuery = <
  TData = GetChatRoomMembersQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetChatRoomMembersQueryVariables,
  variables: GetChatRoomMembersQueryVariables,
  options?: UseInfiniteQueryOptions<GetChatRoomMembersQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetChatRoomMembersQuery, TError, TData>(
    ['GetChatRoomMembers.infinite', variables],
    metaData =>
      gqlFetcher<GetChatRoomMembersQuery, GetChatRoomMembersQueryVariables>(
        GetChatRoomMembersDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteGetChatRoomMembersQuery.getKey = (
  variables: GetChatRoomMembersQueryVariables,
) => ['GetChatRoomMembers.infinite', variables];
useGetChatRoomMembersQuery.fetcher = (
  variables: GetChatRoomMembersQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetChatRoomMembersQuery, GetChatRoomMembersQueryVariables>(
    GetChatRoomMembersDocument,
    variables,
    options,
  );
export const GetChatRoomDocument = `
    query GetChatRoom($roomGuid: String!, $firstMembers: Int!, $afterMembers: Int!) {
  chatRoom(roomGuid: $roomGuid) {
    cursor
    totalMembers
    unreadMessagesCount
    lastMessagePlainText
    lastMessageCreatedTimestamp
    node {
      guid
      roomType
      id
      name
      groupGuid
      isChatRequest
      isUserRoomOwner
      chatRoomNotificationStatus
    }
    members(first: $firstMembers, after: $afterMembers) {
      edges {
        cursor
        role
        node {
          name
          username
          iconUrl
          id
          guid
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
    `;
export const useGetChatRoomQuery = <TData = GetChatRoomQuery, TError = unknown>(
  variables: GetChatRoomQueryVariables,
  options?: UseQueryOptions<GetChatRoomQuery, TError, TData>,
) =>
  useQuery<GetChatRoomQuery, TError, TData>(
    ['GetChatRoom', variables],
    gqlFetcher<GetChatRoomQuery, GetChatRoomQueryVariables>(
      GetChatRoomDocument,
      variables,
    ),
    options,
  );

useGetChatRoomQuery.getKey = (variables: GetChatRoomQueryVariables) => [
  'GetChatRoom',
  variables,
];
export const useInfiniteGetChatRoomQuery = <
  TData = GetChatRoomQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetChatRoomQueryVariables,
  variables: GetChatRoomQueryVariables,
  options?: UseInfiniteQueryOptions<GetChatRoomQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetChatRoomQuery, TError, TData>(
    ['GetChatRoom.infinite', variables],
    metaData =>
      gqlFetcher<GetChatRoomQuery, GetChatRoomQueryVariables>(
        GetChatRoomDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteGetChatRoomQuery.getKey = (variables: GetChatRoomQueryVariables) => [
  'GetChatRoom.infinite',
  variables,
];
useGetChatRoomQuery.fetcher = (
  variables: GetChatRoomQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetChatRoomQuery, GetChatRoomQueryVariables>(
    GetChatRoomDocument,
    variables,
    options,
  );
export const GetChatRoomInviteRequestsDocument = `
    query GetChatRoomInviteRequests($first: Int, $after: String) {
  chatRoomInviteRequests(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        guid
        name
        roomType
        isChatRequest
        timeCreatedISO8601
        timeCreatedUnix
      }
      members(first: 3) {
        edges {
          cursor
          node {
            id
            guid
            iconUrl
            username
            name
          }
        }
      }
      messages(first: 1) {
        edges {
          cursor
          node {
            id
            guid
            roomGuid
            plainText
            timeCreatedISO8601
            timeCreatedUnix
          }
        }
      }
      lastMessagePlainText
      lastMessageCreatedTimestamp
    }
  }
}
    `;
export const useGetChatRoomInviteRequestsQuery = <
  TData = GetChatRoomInviteRequestsQuery,
  TError = unknown,
>(
  variables?: GetChatRoomInviteRequestsQueryVariables,
  options?: UseQueryOptions<GetChatRoomInviteRequestsQuery, TError, TData>,
) =>
  useQuery<GetChatRoomInviteRequestsQuery, TError, TData>(
    variables === undefined
      ? ['GetChatRoomInviteRequests']
      : ['GetChatRoomInviteRequests', variables],
    gqlFetcher<
      GetChatRoomInviteRequestsQuery,
      GetChatRoomInviteRequestsQueryVariables
    >(GetChatRoomInviteRequestsDocument, variables),
    options,
  );

useGetChatRoomInviteRequestsQuery.getKey = (
  variables?: GetChatRoomInviteRequestsQueryVariables,
) =>
  variables === undefined
    ? ['GetChatRoomInviteRequests']
    : ['GetChatRoomInviteRequests', variables];
export const useInfiniteGetChatRoomInviteRequestsQuery = <
  TData = GetChatRoomInviteRequestsQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetChatRoomInviteRequestsQueryVariables,
  variables?: GetChatRoomInviteRequestsQueryVariables,
  options?: UseInfiniteQueryOptions<
    GetChatRoomInviteRequestsQuery,
    TError,
    TData
  >,
) => {
  return useInfiniteQuery<GetChatRoomInviteRequestsQuery, TError, TData>(
    variables === undefined
      ? ['GetChatRoomInviteRequests.infinite']
      : ['GetChatRoomInviteRequests.infinite', variables],
    metaData =>
      gqlFetcher<
        GetChatRoomInviteRequestsQuery,
        GetChatRoomInviteRequestsQueryVariables
      >(GetChatRoomInviteRequestsDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options,
  );
};

useInfiniteGetChatRoomInviteRequestsQuery.getKey = (
  variables?: GetChatRoomInviteRequestsQueryVariables,
) =>
  variables === undefined
    ? ['GetChatRoomInviteRequests.infinite']
    : ['GetChatRoomInviteRequests.infinite', variables];
useGetChatRoomInviteRequestsQuery.fetcher = (
  variables?: GetChatRoomInviteRequestsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    GetChatRoomInviteRequestsQuery,
    GetChatRoomInviteRequestsQueryVariables
  >(GetChatRoomInviteRequestsDocument, variables, options);
export const GetTotalRoomInviteRequestsDocument = `
    query GetTotalRoomInviteRequests {
  totalRoomInviteRequests
}
    `;
export const useGetTotalRoomInviteRequestsQuery = <
  TData = GetTotalRoomInviteRequestsQuery,
  TError = unknown,
>(
  variables?: GetTotalRoomInviteRequestsQueryVariables,
  options?: UseQueryOptions<GetTotalRoomInviteRequestsQuery, TError, TData>,
) =>
  useQuery<GetTotalRoomInviteRequestsQuery, TError, TData>(
    variables === undefined
      ? ['GetTotalRoomInviteRequests']
      : ['GetTotalRoomInviteRequests', variables],
    gqlFetcher<
      GetTotalRoomInviteRequestsQuery,
      GetTotalRoomInviteRequestsQueryVariables
    >(GetTotalRoomInviteRequestsDocument, variables),
    options,
  );

useGetTotalRoomInviteRequestsQuery.getKey = (
  variables?: GetTotalRoomInviteRequestsQueryVariables,
) =>
  variables === undefined
    ? ['GetTotalRoomInviteRequests']
    : ['GetTotalRoomInviteRequests', variables];
export const useInfiniteGetTotalRoomInviteRequestsQuery = <
  TData = GetTotalRoomInviteRequestsQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetTotalRoomInviteRequestsQueryVariables,
  variables?: GetTotalRoomInviteRequestsQueryVariables,
  options?: UseInfiniteQueryOptions<
    GetTotalRoomInviteRequestsQuery,
    TError,
    TData
  >,
) => {
  return useInfiniteQuery<GetTotalRoomInviteRequestsQuery, TError, TData>(
    variables === undefined
      ? ['GetTotalRoomInviteRequests.infinite']
      : ['GetTotalRoomInviteRequests.infinite', variables],
    metaData =>
      gqlFetcher<
        GetTotalRoomInviteRequestsQuery,
        GetTotalRoomInviteRequestsQueryVariables
      >(GetTotalRoomInviteRequestsDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options,
  );
};

useInfiniteGetTotalRoomInviteRequestsQuery.getKey = (
  variables?: GetTotalRoomInviteRequestsQueryVariables,
) =>
  variables === undefined
    ? ['GetTotalRoomInviteRequests.infinite']
    : ['GetTotalRoomInviteRequests.infinite', variables];
useGetTotalRoomInviteRequestsQuery.fetcher = (
  variables?: GetTotalRoomInviteRequestsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    GetTotalRoomInviteRequestsQuery,
    GetTotalRoomInviteRequestsQueryVariables
  >(GetTotalRoomInviteRequestsDocument, variables, options);
export const InitChatDocument = `
    query InitChat {
  chatUnreadMessagesCount
}
    `;
export const useInitChatQuery = <TData = InitChatQuery, TError = unknown>(
  variables?: InitChatQueryVariables,
  options?: UseQueryOptions<InitChatQuery, TError, TData>,
) =>
  useQuery<InitChatQuery, TError, TData>(
    variables === undefined ? ['InitChat'] : ['InitChat', variables],
    gqlFetcher<InitChatQuery, InitChatQueryVariables>(
      InitChatDocument,
      variables,
    ),
    options,
  );

useInitChatQuery.getKey = (variables?: InitChatQueryVariables) =>
  variables === undefined ? ['InitChat'] : ['InitChat', variables];
export const useInfiniteInitChatQuery = <
  TData = InitChatQuery,
  TError = unknown,
>(
  pageParamKey: keyof InitChatQueryVariables,
  variables?: InitChatQueryVariables,
  options?: UseInfiniteQueryOptions<InitChatQuery, TError, TData>,
) => {
  return useInfiniteQuery<InitChatQuery, TError, TData>(
    variables === undefined
      ? ['InitChat.infinite']
      : ['InitChat.infinite', variables],
    metaData =>
      gqlFetcher<InitChatQuery, InitChatQueryVariables>(InitChatDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options,
  );
};

useInfiniteInitChatQuery.getKey = (variables?: InitChatQueryVariables) =>
  variables === undefined
    ? ['InitChat.infinite']
    : ['InitChat.infinite', variables];
useInitChatQuery.fetcher = (
  variables?: InitChatQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<InitChatQuery, InitChatQueryVariables>(
    InitChatDocument,
    variables,
    options,
  );
export const LeaveChatRoomDocument = `
    mutation LeaveChatRoom($roomGuid: String!) {
  leaveChatRoom(roomGuid: $roomGuid)
}
    `;
export const useLeaveChatRoomMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    LeaveChatRoomMutation,
    TError,
    LeaveChatRoomMutationVariables,
    TContext
  >,
) =>
  useMutation<
    LeaveChatRoomMutation,
    TError,
    LeaveChatRoomMutationVariables,
    TContext
  >(
    ['LeaveChatRoom'],
    (variables?: LeaveChatRoomMutationVariables) =>
      gqlFetcher<LeaveChatRoomMutation, LeaveChatRoomMutationVariables>(
        LeaveChatRoomDocument,
        variables,
      )(),
    options,
  );
useLeaveChatRoomMutation.fetcher = (
  variables: LeaveChatRoomMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<LeaveChatRoomMutation, LeaveChatRoomMutationVariables>(
    LeaveChatRoomDocument,
    variables,
    options,
  );
export const RemoveMemberFromChatRoomDocument = `
    mutation RemoveMemberFromChatRoom($roomGuid: String!, $memberGuid: String!) {
  removeMemberFromChatRoom(roomGuid: $roomGuid, memberGuid: $memberGuid)
}
    `;
export const useRemoveMemberFromChatRoomMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    RemoveMemberFromChatRoomMutation,
    TError,
    RemoveMemberFromChatRoomMutationVariables,
    TContext
  >,
) =>
  useMutation<
    RemoveMemberFromChatRoomMutation,
    TError,
    RemoveMemberFromChatRoomMutationVariables,
    TContext
  >(
    ['RemoveMemberFromChatRoom'],
    (variables?: RemoveMemberFromChatRoomMutationVariables) =>
      gqlFetcher<
        RemoveMemberFromChatRoomMutation,
        RemoveMemberFromChatRoomMutationVariables
      >(RemoveMemberFromChatRoomDocument, variables)(),
    options,
  );
useRemoveMemberFromChatRoomMutation.fetcher = (
  variables: RemoveMemberFromChatRoomMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    RemoveMemberFromChatRoomMutation,
    RemoveMemberFromChatRoomMutationVariables
  >(RemoveMemberFromChatRoomDocument, variables, options);
export const ReplyToRoomInviteRequestDocument = `
    mutation ReplyToRoomInviteRequest($roomGuid: String!, $action: ChatRoomInviteRequestActionEnum!) {
  replyToRoomInviteRequest(
    roomGuid: $roomGuid
    chatRoomInviteRequestActionEnum: $action
  )
}
    `;
export const useReplyToRoomInviteRequestMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    ReplyToRoomInviteRequestMutation,
    TError,
    ReplyToRoomInviteRequestMutationVariables,
    TContext
  >,
) =>
  useMutation<
    ReplyToRoomInviteRequestMutation,
    TError,
    ReplyToRoomInviteRequestMutationVariables,
    TContext
  >(
    ['ReplyToRoomInviteRequest'],
    (variables?: ReplyToRoomInviteRequestMutationVariables) =>
      gqlFetcher<
        ReplyToRoomInviteRequestMutation,
        ReplyToRoomInviteRequestMutationVariables
      >(ReplyToRoomInviteRequestDocument, variables)(),
    options,
  );
useReplyToRoomInviteRequestMutation.fetcher = (
  variables: ReplyToRoomInviteRequestMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    ReplyToRoomInviteRequestMutation,
    ReplyToRoomInviteRequestMutationVariables
  >(ReplyToRoomInviteRequestDocument, variables, options);
export const SetReadReceiptDocument = `
    mutation SetReadReceipt($roomGuid: String!, $messageGuid: String!) {
  readReceipt(roomGuid: $roomGuid, messageGuid: $messageGuid) {
    id
    unreadMessagesCount
  }
}
    `;
export const useSetReadReceiptMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    SetReadReceiptMutation,
    TError,
    SetReadReceiptMutationVariables,
    TContext
  >,
) =>
  useMutation<
    SetReadReceiptMutation,
    TError,
    SetReadReceiptMutationVariables,
    TContext
  >(
    ['SetReadReceipt'],
    (variables?: SetReadReceiptMutationVariables) =>
      gqlFetcher<SetReadReceiptMutation, SetReadReceiptMutationVariables>(
        SetReadReceiptDocument,
        variables,
      )(),
    options,
  );
useSetReadReceiptMutation.fetcher = (
  variables: SetReadReceiptMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<SetReadReceiptMutation, SetReadReceiptMutationVariables>(
    SetReadReceiptDocument,
    variables,
    options,
  );
export const UpdateChatRoomNameDocument = `
    mutation UpdateChatRoomName($roomGuid: String!, $roomName: String!) {
  updateChatRoomName(roomGuid: $roomGuid, roomName: $roomName)
}
    `;
export const useUpdateChatRoomNameMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdateChatRoomNameMutation,
    TError,
    UpdateChatRoomNameMutationVariables,
    TContext
  >,
) =>
  useMutation<
    UpdateChatRoomNameMutation,
    TError,
    UpdateChatRoomNameMutationVariables,
    TContext
  >(
    ['UpdateChatRoomName'],
    (variables?: UpdateChatRoomNameMutationVariables) =>
      gqlFetcher<
        UpdateChatRoomNameMutation,
        UpdateChatRoomNameMutationVariables
      >(UpdateChatRoomNameDocument, variables)(),
    options,
  );
useUpdateChatRoomNameMutation.fetcher = (
  variables: UpdateChatRoomNameMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<UpdateChatRoomNameMutation, UpdateChatRoomNameMutationVariables>(
    UpdateChatRoomNameDocument,
    variables,
    options,
  );
export const UpdateChatRoomNotificationSettingsDocument = `
    mutation UpdateChatRoomNotificationSettings($roomGuid: String!, $notificationStatus: ChatRoomNotificationStatusEnum!) {
  updateNotificationSettings(
    roomGuid: $roomGuid
    notificationStatus: $notificationStatus
  )
}
    `;
export const useUpdateChatRoomNotificationSettingsMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdateChatRoomNotificationSettingsMutation,
    TError,
    UpdateChatRoomNotificationSettingsMutationVariables,
    TContext
  >,
) =>
  useMutation<
    UpdateChatRoomNotificationSettingsMutation,
    TError,
    UpdateChatRoomNotificationSettingsMutationVariables,
    TContext
  >(
    ['UpdateChatRoomNotificationSettings'],
    (variables?: UpdateChatRoomNotificationSettingsMutationVariables) =>
      gqlFetcher<
        UpdateChatRoomNotificationSettingsMutation,
        UpdateChatRoomNotificationSettingsMutationVariables
      >(UpdateChatRoomNotificationSettingsDocument, variables)(),
    options,
  );
useUpdateChatRoomNotificationSettingsMutation.fetcher = (
  variables: UpdateChatRoomNotificationSettingsMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    UpdateChatRoomNotificationSettingsMutation,
    UpdateChatRoomNotificationSettingsMutationVariables
  >(UpdateChatRoomNotificationSettingsDocument, variables, options);
export const GetCustomPageDocument = `
    query GetCustomPage($pageType: String!) {
  customPage(pageType: $pageType) {
    pageType
    content
    externalLink
    defaultContent
  }
}
    `;
export const useGetCustomPageQuery = <
  TData = GetCustomPageQuery,
  TError = unknown,
>(
  variables: GetCustomPageQueryVariables,
  options?: UseQueryOptions<GetCustomPageQuery, TError, TData>,
) =>
  useQuery<GetCustomPageQuery, TError, TData>(
    ['GetCustomPage', variables],
    gqlFetcher<GetCustomPageQuery, GetCustomPageQueryVariables>(
      GetCustomPageDocument,
      variables,
    ),
    options,
  );

useGetCustomPageQuery.getKey = (variables: GetCustomPageQueryVariables) => [
  'GetCustomPage',
  variables,
];
export const useInfiniteGetCustomPageQuery = <
  TData = GetCustomPageQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetCustomPageQueryVariables,
  variables: GetCustomPageQueryVariables,
  options?: UseInfiniteQueryOptions<GetCustomPageQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetCustomPageQuery, TError, TData>(
    ['GetCustomPage.infinite', variables],
    metaData =>
      gqlFetcher<GetCustomPageQuery, GetCustomPageQueryVariables>(
        GetCustomPageDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteGetCustomPageQuery.getKey = (
  variables: GetCustomPageQueryVariables,
) => ['GetCustomPage.infinite', variables];
useGetCustomPageQuery.fetcher = (
  variables: GetCustomPageQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetCustomPageQuery, GetCustomPageQueryVariables>(
    GetCustomPageDocument,
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

useGetGiftCardBalancesQuery.getKey = (
  variables?: GetGiftCardBalancesQueryVariables,
) =>
  variables === undefined
    ? ['GetGiftCardBalances']
    : ['GetGiftCardBalances', variables];
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

useInfiniteGetGiftCardBalancesQuery.getKey = (
  variables?: GetGiftCardBalancesQueryVariables,
) =>
  variables === undefined
    ? ['GetGiftCardBalances.infinite']
    : ['GetGiftCardBalances.infinite', variables];
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

useGetGiftCardByCodeQuery.getKey = (
  variables: GetGiftCardByCodeQueryVariables,
) => ['GetGiftCardByCode', variables];
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

useInfiniteGetGiftCardByCodeQuery.getKey = (
  variables: GetGiftCardByCodeQueryVariables,
) => ['GetGiftCardByCode.infinite', variables];
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

useGetGiftCardTransactionsLedgerQuery.getKey = (
  variables: GetGiftCardTransactionsLedgerQueryVariables,
) => ['GetGiftCardTransactionsLedger', variables];
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

useInfiniteGetGiftCardTransactionsLedgerQuery.getKey = (
  variables: GetGiftCardTransactionsLedgerQueryVariables,
) => ['GetGiftCardTransactionsLedger.infinite', variables];
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

useGetGiftCardsQuery.getKey = (variables?: GetGiftCardsQueryVariables) =>
  variables === undefined ? ['GetGiftCards'] : ['GetGiftCards', variables];
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

useInfiniteGetGiftCardsQuery.getKey = (
  variables?: GetGiftCardsQueryVariables,
) =>
  variables === undefined
    ? ['GetGiftCards.infinite']
    : ['GetGiftCards.infinite', variables];
useGetGiftCardsQuery.fetcher = (
  variables?: GetGiftCardsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetGiftCardsQuery, GetGiftCardsQueryVariables>(
    GetGiftCardsDocument,
    variables,
    options,
  );
export const GetNavigationItemsDocument = `
    query getNavigationItems {
  customNavigationItems {
    id
    name
    type
    action
    iconId
    order
    url
    visible
    visibleMobile
    path
  }
}
    `;
export const useGetNavigationItemsQuery = <
  TData = GetNavigationItemsQuery,
  TError = unknown,
>(
  variables?: GetNavigationItemsQueryVariables,
  options?: UseQueryOptions<GetNavigationItemsQuery, TError, TData>,
) =>
  useQuery<GetNavigationItemsQuery, TError, TData>(
    variables === undefined
      ? ['getNavigationItems']
      : ['getNavigationItems', variables],
    gqlFetcher<GetNavigationItemsQuery, GetNavigationItemsQueryVariables>(
      GetNavigationItemsDocument,
      variables,
    ),
    options,
  );

useGetNavigationItemsQuery.getKey = (
  variables?: GetNavigationItemsQueryVariables,
) =>
  variables === undefined
    ? ['getNavigationItems']
    : ['getNavigationItems', variables];
export const useInfiniteGetNavigationItemsQuery = <
  TData = GetNavigationItemsQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetNavigationItemsQueryVariables,
  variables?: GetNavigationItemsQueryVariables,
  options?: UseInfiniteQueryOptions<GetNavigationItemsQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetNavigationItemsQuery, TError, TData>(
    variables === undefined
      ? ['getNavigationItems.infinite']
      : ['getNavigationItems.infinite', variables],
    metaData =>
      gqlFetcher<GetNavigationItemsQuery, GetNavigationItemsQueryVariables>(
        GetNavigationItemsDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteGetNavigationItemsQuery.getKey = (
  variables?: GetNavigationItemsQueryVariables,
) =>
  variables === undefined
    ? ['getNavigationItems.infinite']
    : ['getNavigationItems.infinite', variables];
useGetNavigationItemsQuery.fetcher = (
  variables?: GetNavigationItemsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetNavigationItemsQuery, GetNavigationItemsQueryVariables>(
    GetNavigationItemsDocument,
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
          dismissible
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
        ... on FeedHeaderNode {
          __typename
          text
        }
        ... on FeedExploreTagNode {
          __typename
          tag
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

useFetchNewsfeedQuery.getKey = (variables: FetchNewsfeedQueryVariables) => [
  'FetchNewsfeed',
  variables,
];
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

useInfiniteFetchNewsfeedQuery.getKey = (
  variables: FetchNewsfeedQueryVariables,
) => ['FetchNewsfeed.infinite', variables];
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

useGetRssFeedsQuery.getKey = (variables?: GetRssFeedsQueryVariables) =>
  variables === undefined ? ['GetRssFeeds'] : ['GetRssFeeds', variables];
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

useInfiniteGetRssFeedsQuery.getKey = (variables?: GetRssFeedsQueryVariables) =>
  variables === undefined
    ? ['GetRssFeeds.infinite']
    : ['GetRssFeeds.infinite', variables];
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
export const GetSiteMembershipForActivityDocument = `
    query GetSiteMembershipForActivity($activityGuid: String!, $externalOnly: Boolean!) {
  lowestPriceSiteMembershipForActivity(
    activityGuid: $activityGuid
    externalOnly: $externalOnly
  ) {
    membershipGuid
    isExternal
    purchaseUrl
    membershipName
    membershipDescription
    membershipPriceInCents
    priceCurrency
    membershipBillingPeriod
    membershipPricingModel
  }
}
    `;
export const useGetSiteMembershipForActivityQuery = <
  TData = GetSiteMembershipForActivityQuery,
  TError = unknown,
>(
  variables: GetSiteMembershipForActivityQueryVariables,
  options?: UseQueryOptions<GetSiteMembershipForActivityQuery, TError, TData>,
) =>
  useQuery<GetSiteMembershipForActivityQuery, TError, TData>(
    ['GetSiteMembershipForActivity', variables],
    gqlFetcher<
      GetSiteMembershipForActivityQuery,
      GetSiteMembershipForActivityQueryVariables
    >(GetSiteMembershipForActivityDocument, variables),
    options,
  );

useGetSiteMembershipForActivityQuery.getKey = (
  variables: GetSiteMembershipForActivityQueryVariables,
) => ['GetSiteMembershipForActivity', variables];
export const useInfiniteGetSiteMembershipForActivityQuery = <
  TData = GetSiteMembershipForActivityQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetSiteMembershipForActivityQueryVariables,
  variables: GetSiteMembershipForActivityQueryVariables,
  options?: UseInfiniteQueryOptions<
    GetSiteMembershipForActivityQuery,
    TError,
    TData
  >,
) => {
  return useInfiniteQuery<GetSiteMembershipForActivityQuery, TError, TData>(
    ['GetSiteMembershipForActivity.infinite', variables],
    metaData =>
      gqlFetcher<
        GetSiteMembershipForActivityQuery,
        GetSiteMembershipForActivityQueryVariables
      >(GetSiteMembershipForActivityDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options,
  );
};

useInfiniteGetSiteMembershipForActivityQuery.getKey = (
  variables: GetSiteMembershipForActivityQueryVariables,
) => ['GetSiteMembershipForActivity.infinite', variables];
useGetSiteMembershipForActivityQuery.fetcher = (
  variables: GetSiteMembershipForActivityQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    GetSiteMembershipForActivityQuery,
    GetSiteMembershipForActivityQueryVariables
  >(GetSiteMembershipForActivityDocument, variables, options);
export const GetSiteMembershipDocument = `
    query GetSiteMembership($membershipGuid: String!) {
  siteMembership(membershipGuid: $membershipGuid) {
    id
    membershipGuid
    membershipName
    membershipDescription
    membershipPriceInCents
    priceCurrency
    membershipBillingPeriod
    membershipPricingModel
    archived
    roles {
      id
      name
    }
    groups {
      guid
      name
      membersCount
      legacy
    }
    isExternal
    purchaseUrl
    manageUrl
  }
}
    `;
export const useGetSiteMembershipQuery = <
  TData = GetSiteMembershipQuery,
  TError = unknown,
>(
  variables: GetSiteMembershipQueryVariables,
  options?: UseQueryOptions<GetSiteMembershipQuery, TError, TData>,
) =>
  useQuery<GetSiteMembershipQuery, TError, TData>(
    ['GetSiteMembership', variables],
    gqlFetcher<GetSiteMembershipQuery, GetSiteMembershipQueryVariables>(
      GetSiteMembershipDocument,
      variables,
    ),
    options,
  );

useGetSiteMembershipQuery.getKey = (
  variables: GetSiteMembershipQueryVariables,
) => ['GetSiteMembership', variables];
export const useInfiniteGetSiteMembershipQuery = <
  TData = GetSiteMembershipQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetSiteMembershipQueryVariables,
  variables: GetSiteMembershipQueryVariables,
  options?: UseInfiniteQueryOptions<GetSiteMembershipQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetSiteMembershipQuery, TError, TData>(
    ['GetSiteMembership.infinite', variables],
    metaData =>
      gqlFetcher<GetSiteMembershipQuery, GetSiteMembershipQueryVariables>(
        GetSiteMembershipDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
      )(),
    options,
  );
};

useInfiniteGetSiteMembershipQuery.getKey = (
  variables: GetSiteMembershipQueryVariables,
) => ['GetSiteMembership.infinite', variables];
useGetSiteMembershipQuery.fetcher = (
  variables: GetSiteMembershipQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<GetSiteMembershipQuery, GetSiteMembershipQueryVariables>(
    GetSiteMembershipDocument,
    variables,
    options,
  );
export const GetSiteMembershipsAndSubscriptionsDocument = `
    query GetSiteMembershipsAndSubscriptions {
  siteMemberships {
    id
    membershipGuid
    membershipName
    membershipDescription
    membershipPriceInCents
    priceCurrency
    membershipBillingPeriod
    membershipPricingModel
    roles {
      id
      name
    }
    groups {
      guid
      name
      membersCount
      legacy
    }
    isExternal
    purchaseUrl
    manageUrl
  }
  siteMembershipSubscriptions {
    membershipGuid
    membershipSubscriptionId
    autoRenew
    isManual
    validFromTimestamp
    validToTimestamp
  }
}
    `;
export const useGetSiteMembershipsAndSubscriptionsQuery = <
  TData = GetSiteMembershipsAndSubscriptionsQuery,
  TError = unknown,
>(
  variables?: GetSiteMembershipsAndSubscriptionsQueryVariables,
  options?: UseQueryOptions<
    GetSiteMembershipsAndSubscriptionsQuery,
    TError,
    TData
  >,
) =>
  useQuery<GetSiteMembershipsAndSubscriptionsQuery, TError, TData>(
    variables === undefined
      ? ['GetSiteMembershipsAndSubscriptions']
      : ['GetSiteMembershipsAndSubscriptions', variables],
    gqlFetcher<
      GetSiteMembershipsAndSubscriptionsQuery,
      GetSiteMembershipsAndSubscriptionsQueryVariables
    >(GetSiteMembershipsAndSubscriptionsDocument, variables),
    options,
  );

useGetSiteMembershipsAndSubscriptionsQuery.getKey = (
  variables?: GetSiteMembershipsAndSubscriptionsQueryVariables,
) =>
  variables === undefined
    ? ['GetSiteMembershipsAndSubscriptions']
    : ['GetSiteMembershipsAndSubscriptions', variables];
export const useInfiniteGetSiteMembershipsAndSubscriptionsQuery = <
  TData = GetSiteMembershipsAndSubscriptionsQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetSiteMembershipsAndSubscriptionsQueryVariables,
  variables?: GetSiteMembershipsAndSubscriptionsQueryVariables,
  options?: UseInfiniteQueryOptions<
    GetSiteMembershipsAndSubscriptionsQuery,
    TError,
    TData
  >,
) => {
  return useInfiniteQuery<
    GetSiteMembershipsAndSubscriptionsQuery,
    TError,
    TData
  >(
    variables === undefined
      ? ['GetSiteMembershipsAndSubscriptions.infinite']
      : ['GetSiteMembershipsAndSubscriptions.infinite', variables],
    metaData =>
      gqlFetcher<
        GetSiteMembershipsAndSubscriptionsQuery,
        GetSiteMembershipsAndSubscriptionsQueryVariables
      >(GetSiteMembershipsAndSubscriptionsDocument, {
        ...variables,
        ...(metaData.pageParam ?? {}),
      })(),
    options,
  );
};

useInfiniteGetSiteMembershipsAndSubscriptionsQuery.getKey = (
  variables?: GetSiteMembershipsAndSubscriptionsQueryVariables,
) =>
  variables === undefined
    ? ['GetSiteMembershipsAndSubscriptions.infinite']
    : ['GetSiteMembershipsAndSubscriptions.infinite', variables];
useGetSiteMembershipsAndSubscriptionsQuery.fetcher = (
  variables?: GetSiteMembershipsAndSubscriptionsQueryVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<
    GetSiteMembershipsAndSubscriptionsQuery,
    GetSiteMembershipsAndSubscriptionsQueryVariables
  >(GetSiteMembershipsAndSubscriptionsDocument, variables, options);
export const CreateNewReportDocument = `
    mutation CreateNewReport($entityUrn: String!, $reason: ReportReasonEnum!, $illegalSubReason: IllegalSubReasonEnum, $nsfwSubReason: NsfwSubReasonEnum, $securitySubReason: SecuritySubReasonEnum) {
  createNewReport(
    reportInput: {entityUrn: $entityUrn, reason: $reason, securitySubReason: $securitySubReason, illegalSubReason: $illegalSubReason, nsfwSubReason: $nsfwSubReason}
  )
}
    `;
export const useCreateNewReportMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateNewReportMutation,
    TError,
    CreateNewReportMutationVariables,
    TContext
  >,
) =>
  useMutation<
    CreateNewReportMutation,
    TError,
    CreateNewReportMutationVariables,
    TContext
  >(
    ['CreateNewReport'],
    (variables?: CreateNewReportMutationVariables) =>
      gqlFetcher<CreateNewReportMutation, CreateNewReportMutationVariables>(
        CreateNewReportDocument,
        variables,
      )(),
    options,
  );
useCreateNewReportMutation.fetcher = (
  variables: CreateNewReportMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<CreateNewReportMutation, CreateNewReportMutationVariables>(
    CreateNewReportDocument,
    variables,
    options,
  );
export const DeletePostHogPersonDocument = `
    mutation DeletePostHogPerson {
  deletePostHogPerson
}
    `;
export const useDeletePostHogPersonMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeletePostHogPersonMutation,
    TError,
    DeletePostHogPersonMutationVariables,
    TContext
  >,
) =>
  useMutation<
    DeletePostHogPersonMutation,
    TError,
    DeletePostHogPersonMutationVariables,
    TContext
  >(
    ['DeletePostHogPerson'],
    (variables?: DeletePostHogPersonMutationVariables) =>
      gqlFetcher<
        DeletePostHogPersonMutation,
        DeletePostHogPersonMutationVariables
      >(DeletePostHogPersonDocument, variables)(),
    options,
  );
useDeletePostHogPersonMutation.fetcher = (
  variables?: DeletePostHogPersonMutationVariables,
  options?: RequestInit['headers'],
) =>
  gqlFetcher<DeletePostHogPersonMutation, DeletePostHogPersonMutationVariables>(
    DeletePostHogPersonDocument,
    variables,
    options,
  );
