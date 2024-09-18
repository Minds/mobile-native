import { View, Image } from 'react-native';
import React from 'react';
import { B1 } from '~/common/ui';
import { observer } from 'mobx-react';
import { GetGiftCardByCodeQuery, GiftCardProductIdEnum } from '~/graphql/api';
import { useTranslation } from '../locales';
import assets from '@assets';
import sp from '~/services/serviceProvider';
import { useIsDarkTheme } from '~/styles/hooks';

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
          source={isDark ? assets.LOGO_HORIZONTAL_DARK : assets.LOGO_HORIZONTAL}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <View
        style={[
          styles.bar,
          isDark
            ? sp.styles.style.bgWhite
            : sp.styles.style.bgTertiaryBackground,
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

const styles = sp.styles.create({
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
