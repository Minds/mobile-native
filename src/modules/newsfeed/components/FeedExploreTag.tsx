import { View } from 'react-native';
import React from 'react';
import { H2, Button, Icon } from '~/common/ui';

import sp from '~/services/serviceProvider';

/**
 * Feed Header
 */
function FeedExploreTag({ tag }: { tag: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name="explore" active />
        <H2 left="S">#{tag}</H2>
      </View>
      <Button
        mode="outline"
        onPress={() =>
          sp.navigation.navigate('App', {
            screen: 'DiscoverySearch',
            params: { query: tag },
          })
        }>
        Explore
      </Button>
    </View>
  );
}

export default React.memo(FeedExploreTag);

const styles = sp.styles.create({
  titleContainer: ['rowJustifySpaceBetween', 'alignCenter'],
  container: [
    'padding3x',
    'rowJustifySpaceBetween',
    'alignCenter',
    'bcolorBaseBackground',
    'borderBottom1x',
  ],
});
