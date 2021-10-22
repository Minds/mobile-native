import React from 'react';
import { StyleSheet } from 'react-native';
import { Spacer } from '~ui/layout';

export const Column = ({
  flex,
  centerBoth,
  centerStart,
  centerEnd,
  children,
  style,
  ...more
}: any) => {
  const containerStyle = [
    styles.container,
    centerBoth && styles.centerBoth,
    centerStart && styles.centerStart,
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
});
