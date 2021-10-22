import React from 'react';
import { StyleSheet } from 'react-native';
import { TYPES } from './constants';
import Typography from './Typography';

export const H1 = (props: any) => (
  <Typography defStyle={styles.h1} {...props} />
);
export const H2 = (props: any) => (
  <Typography defStyle={styles.h2} {...props} />
);
export const H3 = (props: any) => (
  <Typography defStyle={styles.h3} {...props} />
);
export const H4 = (props: any) => (
  <Typography defStyle={styles.h4} {...props} />
);

const styles = StyleSheet.create({
  h1: {
    ...TYPES.header1,
  },
  h2: {
    ...TYPES.header2,
  },
  h3: {
    ...TYPES.header3,
  },
  h4: {
    ...TYPES.header4,
  },
});
