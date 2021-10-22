import React from 'react';
import { View, StyleSheet } from 'react-native';
import { H2 } from '~ui/typography';
import { Row } from '~ui/layout';

export const ScreenHeader = ({ title, extra, ...more }: any) => {
  return (
    <Row center spaceBetween vertical="L" horizontal="L" {...more}>
      <View style={styles.title}>
        <H2 bold>{title}</H2>
      </View>
      <View style={styles.extra}>{extra}</View>
    </Row>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 1,
  },
  extra: {},
});
