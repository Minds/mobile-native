import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { B1, B2, B3, Column, IIcon, Icon, Row } from '~/common/ui';
import Sort, { useSortState } from './Sort';
import {
  GiftCardTransactionEdge,
  useInfiniteGetGiftCardTransactionsLedgerQuery,
} from '~/graphql/api';
import { dateFormat, timeFormat, useInfiniteQuery } from './utils';
import { useTranslation } from '../locales';
import { TFunction } from 'i18next';
import { Image, View } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';

export const GiftTransationList = ({ guid }: { guid: string }) => {
  const { t } = useTranslation();
  const { data, isLoading, refetch, loadMore, sortState, setSortState } =
    useGetTransactions(guid);

  return (
    <FlashList
      ListHeaderComponent={
        <Row horizontal="XL" bottom="S" align="centerBetween">
          <B2 color="secondary">{t(sortState)}</B2>
          <Sort sortState={sortState} setSortState={setSortState} />
        </Row>
      }
      estimatedItemSize={200}
      keyExtractor={(item, index) => item?.node?.id ?? `${index}`}
      data={data}
      renderItem={renderItem(t)}
      refreshing={isLoading}
      onRefresh={refetch}
      onEndReached={loadMore}
    />
  );
};

const renderItem =
  (t: TFunction<'GiftCardModule', undefined, 'GiftCardModule'>) =>
  ({ item }: ListRenderItemInfo<GiftCardTransactionEdge>) => {
    const {
      node: { amount, createdAt },
    } = item;

    const [icon, title, indicatorProps] =
      amount > 0
        ? [
            <MindsIcon />,
            t('Boost Credit from @minds\n(Expires {{date}})', {
              date: dateFormat(createdAt),
            }),
            arrow.up,
          ]
        : [
            <Icon name={'boost'} />,
            t('Credit towards Boosted Content'),
            arrow.down,
          ];
    return (
      <Column horizontal="XL" vertical="L">
        <B1 color="secondary">{dateFormat(createdAt)} </B1>
        <Row flex top="L" align="centerBetween" background="secondary">
          <Row flex align="centerStart" background="tertiary">
            {icon}
            <Column flex left="M">
              <B1>{title}</B1>
              <B3 color="secondary">{timeFormat(createdAt)}</B3>
            </Column>
          </Row>
          <Row align="centerBoth">
            <Icon {...indicatorProps} />
            <B1 font="bold" color="primary">
              {Math.abs(amount ?? 0)}
            </B1>
          </Row>
        </Row>
      </Column>
    );
  };

const MindsIcon = () => {
  return (
    <View style={styles.logo}>
      <Image
        source={require('~/assets/logos/bulb.png')}
        resizeMode="contain"
        style={styles.bulb}
      />
    </View>
  );
};

const useGetTransactions = (giftCardGuid: string) => {
  const { sortState, setSortState } = useSortState();

  const result = useInfiniteQuery<GiftCardTransactionEdge>(
    useInfiniteGetGiftCardTransactionsLedgerQuery,
    {
      first: 12,
      giftCardGuid,
    },
    'giftCardTransactionLedger',
  );

  return {
    ...result,
    sortState,
    setSortState,
  };
};

const arrow: Record<string, IIcon> = {
  up: {
    name: 'triangle-up',
    color: 'SuccessBackground',
  },
  down: {
    name: 'triangle-down',
    color: 'DangerBackground',
  },
};

const styles = ThemedStyles.create({
  logo: [
    'bgWhite',
    'bcolorAvatarCircled',
    {
      justifyContent: 'center',
      alignItems: 'center',
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 1,
    },
  ],
  bulb: {
    width: 18,
    height: 18,
  },
});
