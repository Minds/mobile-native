import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import type { AppStackParamList } from '../../navigation/NavigationTypes';

export type WalletScreenRouteProp = RouteProp<AppStackParamList, 'Fab'>;
export type WalletScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Fab'
>;
