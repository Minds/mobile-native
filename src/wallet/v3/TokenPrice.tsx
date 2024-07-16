import { observer } from 'mobx-react';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';

import number from '../../common/helpers/number';
import useApiFetch from '../../common/hooks/useApiFetch';
import { B3 } from '~ui';
import sp from '~/services/serviceProvider';

export default observer(function TokenPrice() {
  const { result } = useApiFetch<{ minds: number }>(
    'api/v3/blockchain/token-prices',
    {
      retry: 3, // retry until it loads successfully or it is unmounted
    },
  );

  if (!result) {
    return null;
  }
  return (
    <Pressable style={styles.pressableContainer}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          contentFit="contain"
          source={{
            uri: 'https://cdn-assets.minds.com/front/dist/browser/en/assets/logos/bulb.jpg',
          }}
        />
      </View>
      <B3 font="medium">
        1{' '}
        <B3 font="medium" color="secondary">
          MINDS
        </B3>{' '}
        = {number(result.minds, 4, 4)}{' '}
        <B3 font="medium" color="secondary">
          USD
        </B3>
      </B3>
    </Pressable>
  );
});

const styles = sp.styles.create({
  pressableContainer: [
    'bcolorPrimaryBorder',
    'border',
    'alignCenter',
    'borderRadius20x',
    'rowJustifyStart',
    'paddingHorizontal2x',
    'paddingVertical',
  ],
  avatarContainer: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  avatar: {
    height: 16,
    width: 16,
    borderRadius: 8,
  },
});
