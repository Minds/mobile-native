export interface Weather {
  status: string;
  dashboard: Dashboard;
}

export interface Dashboard {
  category: string;
  label: string;
  description?: null;
  timespan: string;
  timespans?: TimespansEntity[] | null;
  metric: string;
  metrics?: MetricsEntity[] | null;
  filter?: string[] | null;
  filters?: FiltersEntity[] | null;
}

export interface TimespansEntity {
  id: string;
  label: string;
  interval: string;
  selected: boolean;
  comparison_interval: number;
  from_ts_ms: number;
  from_ts_iso: string;
}

export interface MetricsEntity {
  id: string;
  label: string;
  description: string;
  unit: string;
  permissions?: string[] | null;
  summary: Summary;
  visualisation: Visualisation;
}

export interface Summary {
  current_value: number;
  comparison_value: number;
  comparison_interval: number;
  comparison_positive_inclination: boolean;
}

export interface Visualisation {
  type: string;
  buckets?: BucketsEntity[] | null;
  columns?: ColumnsEntity[] | null;
  segments?: SegmentsEntity[];
}

export interface SegmentsEntity {
  label?: null;
  comparison: boolean;
  buckets: SegmentBucketsEntity[];
}

export interface SegmentBucketsEntity {
  key: number;
  date: string;
  value: number;
}

export interface BucketsEntity {
  key: string;
  values: Values;
}

export interface Values {
  entity?: Entity | null;
  'views::total': number;
  'views::organic': number;
  'views::single': number;
}

export interface Entity {
  guid: string;
  type: string;
  time_created: string;
  time_updated: string | boolean;
  container_guid: string;
  owner_guid: string;
  access_id: string;
  nsfw?: null[] | null;
  nsfw_lock?: null[] | null;
  allow_comments: boolean;
  title?: boolean | string;
  blurb?: boolean | string;
  perma_url?: boolean | string;
  message?: string | null;
  ownerObj?: OwnerObj | null;
  containerObj?: boolean | null;
  thumbnail_src?: boolean | string;
  remind_object?: RemindObject | boolean;
  entity_guid?: boolean | string;
  featured?: boolean | null;
  featured_guid?: boolean | null;
  custom_type?: boolean | string;
  custom_data?: boolean | CustomDataEntityOrEntity[] | null | CustomData;
  'thumbs:up:count'?: number | null;
  'thumbs:up:user_guids'?: (string | null)[] | null;
  'thumbs:down:count'?: number | null;
  'thumbs:down:user_guids'?: boolean | null;
  p2p_boosted?: boolean | null;
  mature: boolean | number;
  monetized?: boolean | null;
  paywall?: string | boolean;
  edited?: string | null;
  comments_enabled?: boolean | null;
  wire_totals?: boolean | null;
  boost_rejection_reason?: number | null;
  pending?: string | null;
  rating: number;
  ephemeral?: boolean | null;
  hide_impressions?: boolean | null;
  pinned?: boolean | null;
  comments: [];
  count?: number | string;
  urn: string;
  impressions?: number | null;
  reminds?: number | null;
  wire_threshold?: string | null;
  time_sent?: number | null;
  license?: string | null;
  thumbnails?: null[] | null | Thumbnails;
  tags?: (string | null)[] | null;
  subtype?: boolean | string;
  site_guid?: boolean | null;
  name?: string | null;
  username?: string | null;
  language?: string | null;
  icontime?: string | null;
  legacy_guid?: boolean | null;
  featured_id?: boolean | null;
  banned?: string | null;
  ban_reason?: boolean | null;
  website?: boolean | null;
  briefdescription?: string | null;
  gender?: boolean | null;
  city?: string | null;
  merchant?: boolean | null;
  boostProPlus?: boolean | null;
  fb?: boolean | null;
  signup_method?: boolean | null;
  social_profiles?: null[] | null;
  feature_flags?: boolean | null;
  programs?: null[] | null;
  plus?: boolean | null;
  hashtags?: boolean | null;
  verified?: boolean | null;
  founder?: boolean | null;
  disabled_boost?: boolean | null;
  boost_autorotate?: boolean | null;
  categories?: null[] | null;
  wire_rewards?: null;
  pinned_posts?: null[] | null;
  is_mature?: boolean | null;
  mature_lock?: boolean | null;
  last_accepted_tos?: number | null;
  opted_in_hashtags?: number | null;
  last_avatar_upload?: string | null;
  canary?: boolean | null;
  theme?: string | null;
  toaster_notifications?: boolean | null;
  mode?: number | null;
  btc_address?: string | null;
  surge_token?: string | null;
  hide_share_buttons?: boolean | null;
  allow_unsubscribed_contact?: boolean | null;
  dismissed_widgets?: string[] | null;
  chat?: boolean | null;
  subscribed?: boolean | null;
  subscriber?: boolean | null;
  boost_rating?: number | null;
  pro?: boolean | null;
  pro_published?: boolean | null;
  rewards?: boolean | null;
  p2p_media_enabled?: boolean | null;
  is_admin?: boolean | null;
  onchain_booster?: number | null;
  email_confirmed?: boolean | null;
  eth_wallet?: string | null;
  disable_autoplay_videos?: boolean | null;
  yt_channels?: null[] | null;
  description?: string | null;
  category?: boolean | null;
  flags?: Flags | null;
  thumbnail?: string | null;
  cinemr_guid?: boolean | null;
  width?: number | null;
  height?: number | null;
  gif?: boolean | null;
  'play: count'?: number | null;
}

export interface OwnerObj {
  guid: string;
  type: string;
  subtype: boolean;
  time_created: string;
  time_updated: boolean;
  container_guid: string;
  owner_guid: string;
  site_guid: boolean;
  access_id: string;
  tags?: string[] | null;
  nsfw?: null[] | null;
  nsfw_lock?: null[] | null;
  allow_comments: boolean;
  name: string;
  username: string;
  language: string;
  icontime: string;
  legacy_guid: boolean;
  featured_id: boolean;
  banned: string;
  ban_reason: boolean;
  website: boolean;
  briefdescription: string;
  gender: boolean;
  city: string;
  merchant: boolean;
  boostProPlus: boolean;
  fb: boolean;
  mature: number | string;
  monetized: boolean;
  signup_method: boolean;
  social_profiles?: null[] | null;
  feature_flags: boolean;
  programs?: null[] | null;
  plus: boolean;
  hashtags: boolean;
  verified: boolean;
  founder: boolean;
  disabled_boost: boolean;
  boost_autorotate: boolean;
  categories?: null[] | null;
  wire_rewards?: null;
  pinned_posts?: null[] | null;
  is_mature: boolean;
  mature_lock: boolean;
  last_accepted_tos: number | string;
  opted_in_hashtags: number | string;
  last_avatar_upload: string;
  canary: boolean;
  theme: boolean | string;
  toaster_notifications: boolean;
  mode: number | string;
  btc_address: string;
  surge_token: string;
  hide_share_buttons: boolean;
  allow_unsubscribed_contact: boolean;
  dismissed_widgets?: (string | null)[] | null;
  chat: boolean;
  urn: string;
  subscribed?: boolean | null;
  subscriber?: boolean | null;
  boost_rating: number | string;
  pro: boolean;
  pro_published: boolean;
  rewards: boolean;
  p2p_media_enabled: boolean;
  is_admin: boolean;
  onchain_booster: number | string;
  email_confirmed: boolean;
  eth_wallet: string;
  rating: number | string;
  disable_autoplay_videos: boolean;
  yt_channels?: null[] | null;
}

export interface RemindObject {
  guid: string;
  type: string;
  time_created: string;
  time_updated: string;
  container_guid: string;
  owner_guid: string;
  access_id: string;
  tags?: string[] | null;
  nsfw?: null[] | null;
  nsfw_lock?: null[] | null;
  allow_comments: boolean;
  title: boolean;
  blurb: boolean;
  perma_url: boolean;
  message: string;
  ownerObj: OwnerObj1;
  containerObj: boolean;
  thumbnail_src: string;
  remind_object: boolean;
  entity_guid: string;
  featured: boolean;
  featured_guid: boolean;
  custom_type: string;
  custom_data?: CustomDataEntityOrEntity[] | null;
  'thumbs:up:count': string;
  'thumbs:up:user_guids'?: string[] | null;
  'thumbs:down:count': string;
  'thumbs:down:user_guids': boolean;
  p2p_boosted: boolean;
  mature: boolean;
  monetized: boolean;
  paywall: string;
  edited: string;
  comments_enabled: boolean;
  wire_totals: boolean;
  boost_rejection_reason: string;
  pending: string;
  rating: string;
  ephemeral: boolean;
  hide_impressions: boolean;
  pinned: boolean;
  time_sent: string;
  'comments:count': string;
  urn: string;
  impressions: string;
  reminds: string;
  wire_threshold?: null;
  license: string;
  thumbnails: Thumbnails;
}

export interface OwnerObj1 {
  guid: string;
  type: string;
  subtype: boolean;
  time_created: string;
  time_updated: string;
  container_guid: string;
  owner_guid: string;
  site_guid: string;
  access_id: string;
  tags?: string[] | null;
  nsfw?: null[] | null;
  nsfw_lock?: null[] | null;
  allow_comments: boolean;
  name: string;
  username: string;
  language: string;
  icontime: string;
  legacy_guid: string;
  featured_id: string;
  banned: string;
  ban_reason: boolean;
  website: string;
  briefdescription: string;
  gender: string;
  city: string;
  merchant: Merchant;
  boostProPlus: string;
  fb?: null[] | null;
  mature: string;
  monetized: string;
  signup_method: string;
  social_profiles?: null[] | null;
  feature_flags: boolean;
  programs?: string[] | null;
  plus: boolean;
  hashtags: boolean;
  verified: boolean;
  founder: boolean;
  disabled_boost: boolean;
  boost_autorotate: boolean;
  categories?: string[] | null;
  wire_rewards: WireRewards;
  pinned_posts?: string[] | null;
  is_mature: boolean;
  mature_lock: boolean;
  last_accepted_tos: string;
  opted_in_hashtags: string;
  last_avatar_upload: string;
  canary: boolean;
  theme: string;
  onchain_booster: string;
  toaster_notifications: boolean;
  mode: string;
  btc_address: string;
  surge_token: string;
  hide_share_buttons: boolean;
  allow_unsubscribed_contact: boolean;
  dismissed_widgets?: string[] | null;
  chat: boolean;
  urn: string;
  subscribed: boolean;
  subscriber: boolean;
  boost_rating: string;
  pro: boolean;
  pro_published: boolean;
  rewards: boolean;
  p2p_media_enabled: boolean;
  is_admin: boolean;
  spam: string;
  deleted: string;
  email_confirmed: boolean;
  eth_wallet: string;
  rating: string;
  disable_autoplay_videos: boolean;
  yt_channels?: YtChannelsEntity[] | null;
}

export interface Merchant {
  service: string;
  id: string;
  exclusive: Exclusive;
}

export interface Exclusive {
  background: string;
  intro: string;
}

export interface WireRewards {
  description: string;
  rewards: Rewards;
}

export interface Rewards {
  points?: null[] | null;
  money?: MoneyEntityOrTokensEntity[] | null;
  tokens?: MoneyEntityOrTokensEntity[] | null;
}

export interface MoneyEntityOrTokensEntity {
  amount: string;
  description: string;
}

export interface YtChannelsEntity {
  id: string;
  title: string;
  connected: string;
  auto_import: boolean;
}

export interface CustomDataEntityOrEntity {
  src: string;
  href: string;
  mature: boolean;
  width: string;
  height: string;
  gif: boolean;
}

export interface Thumbnails {
  xlarge: string;
  large: string;
}

export interface CustomData {
  thumbnail_src: string;
  guid: string;
  width: string;
  height: string;
  mature: boolean;
}

export interface Flags {
  mature: boolean;
}

export interface ColumnsEntity {
  id: string;
  label: string;
  order: number;
}

export interface FiltersEntity {
  id: string;
  label: string;
  description: string;
  options?: OptionsEntity[] | null;
}

export interface OptionsEntity {
  id: string;
  label: string;
  description?: string | null;
  available: boolean;
  selected: boolean;
}

export interface MetricsComparative {
  increase: boolean;
  offchain: string;
  onchain: string;
  total: string;
  total_diff: string;
}

export interface TokensMetrics {
  comparative: MetricsComparative;
  format: 'usd' | 'token' | 'number' | 'points';
  id: string;
  offchain: string;
  onchain: string;
  total: string;
}
