import React from 'react';
import { Text } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';

export default function SectionTitle({ children }) {
  return <Text style={style}>{children}</Text>;
}

const style = ThemedStyles.combine(
  'colorPrimaryText',
  'fontL',
  'fontMedium',
  'marginVertical2x',
);
