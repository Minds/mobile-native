import { observer } from 'mobx-react';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import number from '../../common/helpers/number';
import useApiFetch from '../../common/hooks/useApiFetch';
import ThemedStyles from '../../styles/ThemedStyles';

export default observer(function TokenPrice() {
  const theme = ThemedStyles.style;
  const textStyles = [theme.colorSecondaryText, theme.fontM, theme.fontMedium];
  const textStylesBold = [theme.colorPrimaryText, theme.bold];

  const { result } = useApiFetch<{ minds: number }>(
    'api/v3/blockchain/token-prices',
    {
      retry: 0, // retry until it loads successfully or it is unmounted
    },
  );

  if (!result) {
    return null;
  }

  // .get('api/v3/blockchain/token-prices')
  return (
    <Pressable
      style={[
        theme.borderPrimary,
        theme.border,
        theme.alignCenter,
        theme.borderRadius10x,
        theme.rowJustifyStart,
        theme.paddingRight2x,
      ]}>
      <View style={styles.avatarContainer}>
        <FastImage
          style={styles.avatar}
          resizeMode="contain"
          source={{
            uri:
              'https://cdn-assets.minds.com/front/dist/browser/en/assets/logos/bulb.jpg',
          }}
        />
      </View>
      <Text style={textStyles}>
        <Text style={textStylesBold}>1</Text> MINDS{' '}
        <Text style={textStylesBold}>= {number(result.minds, 4, 4)}</Text> USD
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  avatarContainer: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
  },
  avatar: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
});
