import type UserModel from '../channel/UserModel';
import type GroupModel from '../groups/GroupModel';
import type ActivityModel from '../newsfeed/ActivityModel';

export type ThumbSize = 'small' | 'medium' | 'large' | 'xlarge';

export type Optionalize<T extends K, K> = Omit<T, keyof K>;

export type ActivityEntity = {
  guid: string;
  remind_object?: Object;
  ownerObj: UserModel;
  containerObj: GroupModel | null;
  message: string;
  title: string;
  blurb: string;
  custom_type: 'video' | 'batch';
  custom_data: any;
  entity_guid: string | null;
  thumbnail_src: string;
  perma_url: string;
  time_created: number;
  edited: boolean;
  modal_source_url?: string;
  ephemeral?: boolean;
  nsfw: Array<number>;
  paywall: boolean;
  impressions: number;
  boostToggle: boolean;
  url?: string;
  urn?: string;
  boosted_guid?: string;
};

export type FeedType = {
  entities: Array<ActivityModel>;
  offset: string;
};

export type LockType = 'members' | 'paywall' | 'plus';

export interface Filter {
  id: string;
  label: string;
  options: Option[];
  description?: string;
  expanded?: boolean;
}

export interface Option {
  id: string;
  label: string;
  available?: boolean;
  selected?: boolean;
  description?: string;
  interval?: string;
  comparison_interval?: number;
  from_ts_ms?: number;
  from_ts_iso?: string;
}

export type SocialProfile = {
  key: string;
  value: string;
};

export interface SocialProfileMeta {
  key: string;
  label: string;
  link: string;
  icon: string;
  customIcon?: boolean;
  domain: string;
}
