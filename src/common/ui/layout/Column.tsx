import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Spacer } from '~ui/layout';
import { ColumnPropType, SpacerPropType } from './types';

export const Column = ({
  align,
  flex,
  stretch,
  containerStyle,
  ...more
}: ColumnPropType & SpacerPropType) => {
  const style: ViewStyle = StyleSheet.flatten([
    styles.container,
    align && styles[align],
    flex && styles.flex,
    stretch && styles.stretch,
    containerStyle && containerStyle,
  ]);

  return <Spacer containerStyle={style} {...more} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  flex: {
    flex: 1,
  },
  centerBoth: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerStart: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerEnd: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  stretch: {
    height: '100%',
    flexGrow: 1,
  },
});
