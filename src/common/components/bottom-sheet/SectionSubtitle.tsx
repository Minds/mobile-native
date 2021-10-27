import React from 'react';
import ThemedStyles from '../../../styles/ThemedStyles';
import MText from '../MText';

export default function SectionSubtitle({ children }) {
  return <MText style={style}>{children}</MText>;
}

const style = ThemedStyles.combine(
  'colorSecondaryText',
  'fontL',
  'marginVertical2x',
  'marginHorizontal5x',
);
