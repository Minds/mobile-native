import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/NavigationTypes';

export type PayMethodType = 'tokens' | 'usd';
export type UpgradesType = 'pro' | 'plus';

export type UpgradeScreenRouteProp = RouteProp<
  RootStackParamList,
  'UpgradeScreen'
>;
export type UpgradeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UpgradeScreen'
>;

export type SettingsPlanType = {
  tokens?: number;
  usd?: number;
  can_have_trial?: boolean;
};

export type SettingsSubscriptionsType = {
  monthly: SettingsPlanType;
  yearly: SettingsPlanType;
  lifetime: SettingsPlanType;
};

export type SubscriptionType = keyof SettingsSubscriptionsType;

export type PaymentPlanType = {
  id: SubscriptionType;
  cost: number;
  iapSku?: string; // in-app purchases SKU
  offerToken?: string; // Android Subscriptions needs a offerToken
  can_have_trial: boolean;
};
