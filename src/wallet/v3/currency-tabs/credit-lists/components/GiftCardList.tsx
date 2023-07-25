import { Image, View } from 'react-native';
import { observer } from 'mobx-react';
import moment from 'moment';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import capitalize from '~/common/helpers/capitalize';
import { B2, B3, Row } from '~/common/ui';
import Link from '~/common/components/Link';
import Filter, { CreditFilterType } from './Filter';
import {
  GiftCardEdge,
  GiftCardOrderingEnum,
  GiftCardProductIdEnum,
  useGetGiftCardBalancesQuery,
  useInfiniteGetGiftCardsQuery,
} from '~/graphql/api';
import ThemedStyles, { useIsDarkTheme } from '~/styles/ThemedStyles';
import { useState } from 'react';

export const GiftCardList = () => {
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
        <Row horizontal="XL" bottom="S" align="centerBetween">
          <B2 color="secondary">{capitalize(gitfCardState)}</B2>
          <Filter
            filterState={gitfCardState}
            setFilterState={setGiftCardState}
          />
        </Row>
      }
      estimatedItemSize={CARD_HEIGHT}
      keyExtractor={(item, index) => item?.node?.id ?? `${index}`}
      data={data}
      renderItem={renderCard(navigation)}
      refreshing={isLoading}
      onRefresh={refetch}
      onEndReached={loadMore}
    />
  );
};

const renderCard =
  (navigation: NavigationProp<ReactNavigation.RootParamList>) =>
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
          <B2 font="bold">{productId}</B2>
          <B2 bottom="XL">Expires {dateFormat(expiresAt)}</B2>
          <Link
            onPress={() =>
              balance === amount
                ? undefined
                : navigation.navigate('CreditTransactions', { guid })
            }
            decoration={false}>
            {balance === amount ? 'No Transactions' : 'View Transactions'}
          </Link>
          <Row top="S" bottom="L" align="centerBetween">
            <B2 font="bold">Balance</B2>
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
        source={
          isDark
            ? require('~/assets/logos/logo_mono.png')
            : require('~/assets/logos/logo_mono_white.png')
        }
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
});

export const CreditsToExpire = () => {
  const { data } = useGetGiftCards(true);

  const firstNode = data?.[0]?.node ?? {};
  const { balance, expiresAt } = firstNode;

  if (!balance || !expiresAt) {
    return undefined;
  }
  return (
    <B3 top="S">
      ${balance} in Boost Credits{'\n'}Expires {dateFormat(expiresAt)}
    </B3>
  );
};

export const useGetGiftCards = (forceActive = false) => {
  const pageParamKey = 'after';
  const productId = GiftCardProductIdEnum.Boost;

  const [gitfCardState, setGiftCardState] =
    useState<CreditFilterType>('active');

  const {
    data: paginatedData,
    hasNextPage: morePages,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteGetGiftCardsQuery(
    pageParamKey,
    {
      first: 12,
      productId,
      ordering: GiftCardOrderingEnum.ExpiringAsc,
      statusFilter: forceActive ? 'active' : gitfCardState,
    },
    {
      getNextPageParam: lastPage => {
        const { endCursor, hasNextPage } = lastPage.giftCards.pageInfo ?? {};
        return hasNextPage ? { [pageParamKey]: endCursor } : undefined;
      },
    },
  );

  const data = (paginatedData?.pages?.flatMap(page => page.giftCards.edges) ||
    []) as GiftCardEdge[];

  const loadMore = () => (morePages ? fetchNextPage() : undefined);

  return {
    data,
    isLoading,
    isFetchingNextPage,
    gitfCardState,
    setGiftCardState,
    fetchNextPage,
    refetch,
    loadMore,
  };
};

export const useGetGiftBalance = () => {
  const { data: balances } = useGetGiftCardBalancesQuery();
  const productId = GiftCardProductIdEnum.Boost;
  const { balance } =
    balances?.giftCardsBalances?.filter(b => b.productId === productId)?.[0] ??
    {};
  return balance;
};

const dateFormat = (val: number) => moment(val * 1000).format('ddd MMM do');

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
