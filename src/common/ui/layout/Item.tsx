import React from 'react';
import { StyleSheet } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import { ItemPropType, RowPropType } from './types';
import { Row } from './Row';
import { UNIT } from '~styles/Tokens';

export const Item = ({ noBorder, ...more }: ItemPropType & RowPropType) => {
  const style = StyleSheet.flatten([
    styles.container,
    !noBorder && styles.border,
  ]);

  return <Row containerStyle={style} align="centerBetween" {...more} />;
};

const styles = ThemedStyles.create({
  container: {
    paddingVertical: UNIT.M,
    paddingHorizontal: UNIT.L,
  },
  border: [
    { borderBottomWidth: StyleSheet.hairlineWidth },
    'bcolorPrimaryBorder',
  ],
});
