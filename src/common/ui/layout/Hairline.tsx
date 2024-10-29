import React from 'react';
import { StyleSheet } from 'react-native';
import { Row } from './Row';
import { Spacer } from './Spacer';

import { Column } from './Column';
import {
  HairlinePropType,
  RowPropType,
  SpacerPropType,
  ColumnPropType,
} from './types';

import sp from '~/services/serviceProvider';

export const HairlineSpacer = ({
  noBorder,
  ...more
}: HairlinePropType & SpacerPropType) => {
  return <Spacer containerStyle={!noBorder && styles.border} {...more} />;
};

export const HairlineRow = ({
  noBorder,
  ...more
}: HairlinePropType & RowPropType & SpacerPropType) => {
  return <Row containerStyle={!noBorder && styles.border} {...more} />;
};

export const HairlineColumn = ({
  noBorder,
  ...more
}: HairlinePropType & ColumnPropType & SpacerPropType) => {
  return <Column containerStyle={!noBorder && styles.border} {...more} />;
};

const styles = sp.styles.create({
  border: [
    { borderBottomWidth: StyleSheet.hairlineWidth },
    'bcolorPrimaryBorder',
  ],
});

export default HairlineRow;
