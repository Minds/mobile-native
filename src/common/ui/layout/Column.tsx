import React from 'react';
import { StyleSheet } from 'react-native';
import { Spacer } from '~ui/layout';

const Column = ({
  flex,
  center,
  centerStart,
  centerEnd,
  children,
  ...more
}: any) => {
  const style = [
    styles.container,
    center && styles.center,
    centerStart && styles.centerStart,
    centerEnd && styles.centerEnd,
    flex && styles.flex,
  ];

  return (
    <Spacer style={style} {...more}>
      {children}
    </Spacer>
  );
};

export default Column;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  flex: {
    flex: 1,
    alignItems: 'stretch',
  },
  center: {
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
