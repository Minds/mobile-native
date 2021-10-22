import React from 'react';
import { View, StyleSheet } from 'react-native';
import { H2 } from '~ui/typography';
import { Row } from '~ui/layout';

const PageHeader = ({ title, extra, ...more }) => {
  return (
    <Row center spaceBetween top="4x" horizontal="4x" bottom="4x" {...more}>
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

export default PageHeader;
