import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Spacer } from '~ui/layout/Spacer';
import { RowPropType, SpacerPropType } from './types';

export const Row = ({
  flex,
  stretch,
  align,
  flexWrap,
  containerStyle,
  ...more
}: RowPropType & SpacerPropType) => {
  const spacerStyle: ViewStyle = StyleSheet.flatten([
    styles.container,
    align && styles[align],
    flex && styles.flex,
    flexWrap && styles.flexWrap,
    stretch && styles.stretch,
    containerStyle && containerStyle,
  ]);

  return <Spacer containerStyle={spacerStyle} {...more} />;
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexWrap: {
    flex: 1,
    flexWrap: 'wrap',
  },
  container: {
    flexDirection: 'row',
  },
  baseline: {
    alignItems: 'baseline',
    justifyContent: 'flex-start',
  },
  centerBoth: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerStart: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerEnd: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  centerBetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stretch: {
    alignItems: 'stretch',
  },
});
