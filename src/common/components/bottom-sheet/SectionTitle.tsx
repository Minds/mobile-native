import React from 'react';
import ThemedStyles from '../../../styles/ThemedStyles';
import MText from '../MText';

export default function SectionTitle({ children }) {
  return <MText style={style}>{children}</MText>;
}

const style = ThemedStyles.combine(
  'colorPrimaryText',
  'fontL',
  'fontMedium',
  'marginVertical2x',
  'marginHorizontal5x',
);
