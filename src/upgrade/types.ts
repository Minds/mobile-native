import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/NavigationTypes';

export type payMethod = 'tokens' | 'usd';
export type Upgrades = 'pro' | 'plus';

export type UpgradeScreenRouteProp = RouteProp<
  RootStackParamList,
  'UpgradeScreen'
>;
export type UpgradeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UpgradeScreen'
>;

export type PaymentsIds = 'lifetime' | 'monthly' | 'annual';

export type PaymentPlan = {
  id: PaymentsIds;
  payment: string;
  cost: number;
  primarylabel: (monthly: number, total: number) => string;
  secondarylabel: (monthly: number, total: number) => string;
};

export type Plans = { [pay in payMethod]: Array<PaymentPlan> };

export type UpgradePlans = {
  [upgrade in Upgrades]: Plans;
};
