import React from 'react';
import { StyleSheet } from 'react-native';
import { TYPES } from './constants';
import Typography from './Typography';

export const B1 = (props: any) => (
  <Typography defStyle={styles.body1} {...props} />
);
export const B2 = (props: any) => (
  <Typography defStyle={styles.body2} {...props} />
);
export const B3 = (props: any) => (
  <Typography defStyle={styles.body3} {...props} />
);

const styles = StyleSheet.create({
  body1: {
    ...TYPES.body1,
  },
  body2: {
    ...TYPES.body2,
  },
  body3: {
    ...TYPES.body3,
  },
});
