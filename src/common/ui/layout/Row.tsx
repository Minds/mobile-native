import React from 'react';
import { StyleSheet } from 'react-native';
import { Spacer } from '~ui/layout';

const Row = ({
  center,
  centerStart,
  spaceBetween,
  centerEnd,
  children,
  style,
  ...extra
}: any) => {
  const container = [
    styles.container,
    center && styles.center,
    centerStart && styles.centerStart,
    spaceBetween && styles.spaceBetween,
    centerEnd && styles.centerEnd,
    style && style,
  ];

  return (
    <Spacer style={container} {...extra}>
      {children}
    </Spacer>
  );
};

export default Row;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  center: {
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
  spaceBetween: {
    justifyContent: 'space-between',
  },
});
