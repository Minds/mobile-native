import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Spacer } from '~ui/layout';

import { ColumnPropType } from './types';
import sp from '~/services/serviceProvider';

export const Column = ({
  align,
  flex,
  stretch,
  containerStyle,
  background,
  ...more
}: ColumnPropType) => {
  const style: ViewStyle = StyleSheet.flatten([
    styles.container,
    align && styles[align],
    flex && styles.flex,
    stretch && styles.stretch,
    background && styles[background],
    containerStyle && containerStyle,
  ]);

  return <Spacer containerStyle={style} {...more} />;
};

const styles = sp.styles.create({
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
  primary: ['flexContainer', 'bgPrimaryBackground'],
  secondary: ['flexContainer', 'bgSecondaryBackground'],
  tertiary: ['flexContainer', 'bgTertiaryBackground'],
});
