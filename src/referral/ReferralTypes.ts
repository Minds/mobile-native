export interface Referral {
  status: string;
  referrals: ReferralsEntity[];
  'load-next': string;
}

export interface ReferralsEntity {
  referrer_guid: string;
  prospect: Prospect;
  state: string;
  pingable: boolean;
  register_timestamp: number;
  join_timestamp: number;
  ping_timestamp: number;
  urn: string;
  guid: string;
}

export interface Prospect {
  guid: string;
  type: string;
  subtype: boolean;
  time_created: string;
  time_updated: boolean;
  container_guid: string;
  owner_guid: string;
  site_guid: boolean;
  access_id: string;
  tags?: null[] | null;
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
  city: boolean;
  merchant: boolean;
  boostProPlus: boolean;
  fb: boolean;
  mature: number;
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
  last_accepted_tos: number;
  opted_in_hashtags: number;
  last_avatar_upload: string;
  canary: boolean;
  theme: boolean;
  toaster_notifications: boolean;
  mode: number;
  btc_address: string;
  surge_token: string;
  hide_share_buttons: boolean;
  allow_unsubscribed_contact: boolean;
  dismissed_widgets?: null[] | null;
  urn: string;
  subscribed: number;
  subscriber: boolean;
  boost_rating: number;
  pro: boolean;
  pro_published: boolean;
  rewards: boolean;
  p2p_media_enabled: boolean;
  is_admin: boolean;
  onchain_booster: number;
  email_confirmed: boolean;
  eth_wallet: string;
  rating: number;
  disable_autoplay_videos: boolean;
  yt_channels?: null[] | null;
}
