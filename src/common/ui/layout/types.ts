import { ReactNode } from 'react';
import { UISpacingPropType } from '~styles/Tokens';
import { ViewStyle } from 'react-native';

export type SpacerPropType = {
  containerStyle?: ViewStyle | ViewStyle[];
  children?: ReactNode;
} & UISpacingPropType;

export type ItemPropType = {
  noBorder?: boolean;
};

export type HairlinePropType = {
  noBorder?: boolean;
};

export type RowPropType = {
  align?:
    | 'centerBoth'
    | 'centerStart'
    | 'centerEnd'
    | 'centerBetween'
    | 'centerAround';
  background?: 'primary' | 'secondary' | 'tertiary';
  flex?: boolean;
  stretch?: boolean;
};

export type ColumnPropType = {
  align?: 'center' | 'centerStart' | 'centerEnd';
  background?: 'primary' | 'secondary' | 'tertiary';
  flex?: boolean;
  stretch?: boolean;
};
