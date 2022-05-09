import React from 'react';
import { StyleSheet } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import { ItemPropType, RowPropType, SpacerPropType } from './types';
import { Row } from './Row';
import { UNIT } from '~styles/Tokens';

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
