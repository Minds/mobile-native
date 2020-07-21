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
