import type OffsetListStore from '../../../common/stores/OffsetListStore';
import type UserModel from '../../../channel/UserModel';
import { WalletStoreType } from '../createWalletStore';
import { BottomOptionsStoreType } from '../../../common/components/BottomOptionPopup';

export type FilterStore = {
  filters: ListFiltersType;
  refresh: () => void;
};

export type Entity = {
  _list: OffsetListStore;
  amount: number;
  contract: string;
  failed: boolean;
  guid: string;
  receiver: UserModel;
  sender: UserModel;
  timestamp: number;
  tx: string;
  user: UserModel;
  user_guid: number;
  wallet_address: string;
};

export type deltaType = 'neutral' | 'positive' | 'negative';

export interface ExtendedEntity extends Entity {
  formatted: boolean;
  superType: string;
  date: Date | string;
  customer_user: any;
  otherUser: {
    avatar: {
      uri: any;
      headers: any;
    };
    username: string;
    isSender: boolean;
  } | null;
  delta: deltaType;
  runningTotal: {
    total: any;
    int: number;
    frac: any;
  };
}

export type SectionListEntities = {
  title: string;
  data: Array<ExtendedEntity>;
};

export type currencyType = 'tokens' | 'usd' | 'ether' | 'bitcoin';

export type ItemPropsType = {
  entity: ExtendedEntity;
  navigation: any;
  currency: currencyType;
};

export type DeltaIconPropsType = {
  delta: deltaType;
};

export type PropsType = {
  filters: Array<[string, string]>;
  currency: currencyType;
  navigation: any;
  wallet: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
};

export type transactionTypes =
  | 'all'
  | 'offchain:wire'
  | 'wire'
  | 'offchain:reward'
  | 'purchase'
  | 'offchain:boost'
  | 'boost'
  | 'withdraw';

export type ListFiltersType = {
  transactionType: transactionTypes;
  dateRange: {
    none: boolean;
    from: Date;
    to: Date;
  };
};
