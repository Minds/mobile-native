import { View, Image } from 'react-native';
import React from 'react';
import ThemedStyles, { useIsDarkTheme } from '~/styles/ThemedStyles';
import { B1 } from '~/common/ui';
import { observer } from 'mobx-react';
import { GetGiftCardByCodeQuery, GiftCardProductIdEnum } from '~/graphql/api';
import { useTranslation } from '../locales';
import assets from '@assets';

export default observer(function GiftCard({
  gift,
}: {
  gift: GetGiftCardByCodeQuery['giftCardByClaimCode'];
}) {
  const isDark = useIsDarkTheme();
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Image
          source={isDark ? assets.LOGO_MONO : assets.LOGO_MONO_WHITE}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <View
        style={[
          styles.bar,
          isDark
            ? ThemedStyles.style.bgWhite
            : ThemedStyles.style.bgTertiaryBackground,
        ]}>
        <TypeText type={gift.productId} />
        <B1 color="black">${gift.amount}</B1>
      </View>
    </View>
  );
});

const TypeText = ({ type }: { type: GiftCardProductIdEnum }) => {
  const { t } = useTranslation();
  return (
    <B1 color="black" font="bold">
      {t('claim.type.' + type)}
    </B1>
  );
};

const styles = ThemedStyles.create({
  logo: {
    width: '40%',
  },
  card: [
    {
      height: 220,
      borderRadius: 17,
    },
    'bgLink',
  ],
  bar: [
    'rowJustifySpaceBetween',
    'alignCenter',
    'paddingHorizontal3x',
    {
      flex: 1,
      borderBottomEndRadius: 17,
      borderBottomStartRadius: 17,
    },
  ],
  top: [{ flex: 3, alignItems: 'center', justifyContent: 'center' }],
});
