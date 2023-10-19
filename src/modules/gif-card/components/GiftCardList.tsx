import { Image, View } from 'react-native';
import { observer } from 'mobx-react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { B1, B2, B3, Row } from '~/common/ui';
import Link from '~/common/components/Link';
import Filter, { useFilterState } from './Filter';
import {
  GiftCardEdge,
  GiftCardOrderingEnum,
  GiftCardProductIdEnum,
  GiftCardStatusFilterEnum,
  useGetGiftCardBalancesQuery,
  useInfiniteGetGiftCardsQuery,
} from '~/graphql/api';
import ThemedStyles, { useIsDarkTheme } from '~/styles/ThemedStyles';
import { dateFormat, useInfiniteQuery, useRefetchOnFocus } from './utils';
import { useTranslation } from '../locales';
import { TFunction } from 'i18next';
import assets from '@assets';

export const GiftCardList = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    data,
    isLoading,
    refetch,
    loadMore,
    gitfCardState,
    setGiftCardState,
  } = useGetGiftCards();

  return (
    <FlashList
      ListHeaderComponent={
        <Row horizontal="XL" bottom="S" align="centerEnd">
          <Filter
            filterState={gitfCardState}
            setFilterState={setGiftCardState}
          />
        </Row>
      }
      ListEmptyComponent={
        <B1 horizontal="XL" vertical="XL">
          {t('No Credits')}
        </B1>
      }
      estimatedItemSize={CARD_HEIGHT}
      keyExtractor={(item, index) => item?.node?.id ?? `${index}`}
      data={data}
      renderItem={renderCard(navigation, t)}
      refreshing={isLoading}
      onRefresh={refetch}
      onEndReached={loadMore}
    />
  );
};

const renderCard =
  (
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    t: TFunction<'GiftCardModule', undefined, 'GiftCardModule'>,
  ) =>
  ({ item }: ListRenderItemInfo<GiftCardEdge>) => {
    const {
      node: { guid, balance, amount, expiresAt, productId },
    } = item;

    const disabled = balance === 0 || expiresAt * 1000 < +new Date();

    const last = false;

    return (
      <Row top="XL" horizontal="XL">
        <MindsCard disabled={disabled} />
        <View style={[styles.textBox, last && styles.lastItem]}>
          <B2 font="bold">{t(`${productId}`)}</B2>
          <B2 bottom="XL">
            {t('Expires {{date}}', { date: dateFormat(expiresAt) })}
          </B2>
          <Link
            onPress={() =>
              balance === amount
                ? undefined
                : navigation.navigate('CreditTransactions', { guid, expiresAt })
            }
            decoration={false}>
            {balance === amount ? t('No Transactions') : t('View Transactions')}
          </Link>
          <Row top="S" bottom="L" align="centerBetween">
            <B2 font="bold">{t('Balance')}</B2>
            <B2 font="bold">${balance}</B2>
          </Row>
        </View>
      </Row>
    );
  };

const MindsCard = observer(({ disabled = false }) => {
  const isDark = useIsDarkTheme();
  return (
    <View style={[styles.card, disabled && styles.disabled]}>
      <Image
        source={isDark ? assets.LOGO_HORIZONTAL_DARK : assets.LOGO_HORIZONTAL}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
});

export const CreditsToExpire = () => {
  const { t } = useTranslation();
  const { data } = useGetGiftCards(true);

  const firstNode = data?.[0]?.node ?? {};
  const { balance, expiresAt } = firstNode;

  if (!balance || !expiresAt) {
    return undefined;
  }
  return (
    <B3 top="S">
      {t('${{balance}} in Boost Credits\nExpires {{date}}', {
        balance,
        date: dateFormat(expiresAt),
      })}
    </B3>
  );
};

export const useGetGiftCards = (forceActive = false) => {
  const productId = GiftCardProductIdEnum.Boost;
  const { gitfCardState, setGiftCardState, statusFilter } =
    useFilterState(forceActive);
  const result = useInfiniteQuery<GiftCardEdge>(
    useInfiniteGetGiftCardsQuery,
    {
      first: 12,
      productId,
      ordering: GiftCardOrderingEnum.ExpiringAsc,
      statusFilter: GiftCardStatusFilterEnum[statusFilter],
    },
    'giftCards',
  );
  useRefetchOnFocus(result.refetch);

  return {
    ...result,
    gitfCardState,
    setGiftCardState,
  };
};

export const useGetGiftBalance = (refresh = true) => {
  const { data: balances, refetch } = useGetGiftCardBalancesQuery();
  useRefetchOnFocus(refresh ? refetch : undefined);
  const productId = GiftCardProductIdEnum.Boost;
  const { balance } =
    balances?.giftCardsBalances?.filter(b => b.productId === productId)?.[0] ??
    {};
  return balance;
};

const CARD_HEIGHT = 86;
const styles = ThemedStyles.create({
  card: [
    {
      height: CARD_HEIGHT,
      width: 1.6468 * CARD_HEIGHT,
      borderRadius: 20,
      marginRight: 20,
    },
    'bgLink',
    'alignCenter',
    'justifyCenter',
  ],
  disabled: {
    opacity: 0.25,
  },
  logo: {
    width: '40%',
  },
  textBox: ['flexContainer', 'borderBottom1x', 'bcolorPrimaryBorder_Dark'],
  lastItem: {
    borderColor: 'transparent',
  },
});
