import React from 'react';
import { StyleSheet } from 'react-native';

import { ItemPropType, RowPropType, SpacerPropType } from './types';
import { Row } from './Row';
import { UNIT } from '~styles/Tokens';
import sp from '~/services/serviceProvider';

export const Item = ({
  noBorder,
  noPadding,
  ...more
}: ItemPropType & RowPropType & SpacerPropType) => {
  const style = StyleSheet.flatten([
    !noPadding && styles.container,
    !noBorder && styles.border,
  ]);

  return <Row containerStyle={style} align="centerBetween" {...more} />;
};

const styles = sp.styles.create({
  container: {
    paddingVertical: UNIT.M,
    paddingHorizontal: UNIT.L,
  },
  border: [
    { borderBottomWidth: StyleSheet.hairlineWidth },
    'bcolorPrimaryBorder',
  ],
});
