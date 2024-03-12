import React from 'react';
import { FlashList } from '@shopify/flash-list';

import Message from './Message';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { IS_IOS } from '~/config/Config';

const renderMessage = ({ item }) => {
  return <Message message={item} />;
};

export default function MessageList({ data }) {
  const dimensions = useWindowDimensions();

  return (
    <FlashList
      data={data}
      contentContainerStyle={styles.container}
      estimatedItemSize={90}
      inverted
      estimatedListSize={!IS_IOS ? dimensions : undefined}
      renderItem={renderMessage}
      keyExtractor={keyExtractor}
    />
  );
}

const keyExtractor = item => item.id;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
