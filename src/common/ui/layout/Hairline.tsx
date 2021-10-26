import React from 'react';
import { StyleSheet } from 'react-native';
import { Row } from './Row';
import { Spacer } from './Spacer';
import ThemedStyles from '~/styles/ThemedStyles';
import {
  HairlinePropType,
  RowPropType,
  ColumnPropType,
  SpacerPropType,
} from './types';

export const HairlineSpacer = ({
  noBorder,
  ...more
}: HairlinePropType & SpacerPropType) => {
  return <Spacer style={!noBorder && styles.border} {...more} />;
};

export const HairlineRow = ({
  noBorder,
  ...more
}: HairlinePropType & RowPropType & SpacerPropType) => {
  return <Row style={!noBorder && styles.border} {...more} />;
};

export const HairlineColumn = ({
  noBorder,
  ...more
}: HairlinePropType & ColumnPropType & SpacerPropType) => {
  return <Row style={!noBorder && styles.border} {...more} />;
};

const styles = ThemedStyles.create({
  border: [
    { borderBottomWidth: StyleSheet.hairlineWidth },
    'bcolorPrimaryBorder',
  ],
});

export default HairlineRow;
