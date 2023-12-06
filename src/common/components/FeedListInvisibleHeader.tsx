import { View } from 'moti';
import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  invisibleStyle: { width: '100%', height: 1 },
});

const FeedListInvisibleHeader = () => <View style={styles.invisibleStyle} />;

export default FeedListInvisibleHeader;
