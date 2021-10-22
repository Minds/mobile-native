import React from 'react';
import { StyleSheet } from 'react-native';
import { Spacer } from '~ui/layout';

export const Row = ({
  flex,
  centerBoth,
  centerStart,
  centerBetween,
  centerEnd,
  children,
  style,
  ...more
}: any) => {
  const containerStyle = [
    styles.container,
    centerBoth && styles.centerBoth,
    centerStart && styles.centerStart,
    centerBetween && styles.centerBetween,
    centerEnd && styles.centerEnd,
    flex && styles.flex,
    style && style,
  ];

  return (
    <Spacer style={containerStyle} {...more}>
      {children}
    </Spacer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
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
});
