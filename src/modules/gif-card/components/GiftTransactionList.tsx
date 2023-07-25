import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { B1, B2, B3, Column, IIcon, Icon, Row } from '~/common/ui';
import Sort, { useSortState } from './Sort';
import {
  GiftCardTransactionEdge,
  useInfiniteGetGiftCardTransactionsLedgerQuery,
} from '~/graphql/api';
import { IconMapNameType } from '~/common/ui/icons/map';
import capitalize from '~/common/helpers/capitalize';
import { dateFormat, timeFormat } from './date-utils';

export const GiftTransationList = ({ guid }: { guid: string }) => {
  const { data, isLoading, refetch, loadMore, sortState, setSortState } =
    useGetTransactions(guid);

  return (
    <FlashList
      ListHeaderComponent={
        <Row horizontal="XL" bottom="S" align="centerBetween">
          <B2 color="secondary">{capitalize(sortState)}</B2>
          <Sort sortState={sortState} setSortState={setSortState} />
        </Row>
      }
      estimatedItemSize={200}
      keyExtractor={(item, index) => item?.node?.id ?? `${index}`}
      data={data}
      renderItem={renderItem}
      refreshing={isLoading}
      onRefresh={refetch}
      onEndReached={loadMore}
    />
  );
};

const renderItem = ({ item }: ListRenderItemInfo<GiftCardTransactionEdge>) => {
  const {
    node: { amount, createdAt },
  } = item;

  const [iconName, title, indicatorProps] =
    amount > 0
      ? ['boost', 'Boost Credit from @minds\n(Expires Apr 18th)', arrow.up]
      : ['boost', 'Credit towards Boosted Content', arrow.down];
  return (
    <Column horizontal="XL" vertical="L">
      <B1 color="secondary">{dateFormat(createdAt)} </B1>
      <Row flex top="L" align="centerBetween" background="secondary">
        <Row flex align="centerStart" background="tertiary">
          <Icon name={iconName as IconMapNameType} />
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

const useGetTransactions = (giftCardGuid: string) => {
  const pageParamKey = 'after';
  const { sortState, setSortState } = useSortState();

  const {
    data: paginatedData,
    hasNextPage: morePages,
    isLoading,
    fetchNextPage,
    refetch,
  } = useInfiniteGetGiftCardTransactionsLedgerQuery(
    pageParamKey,
    {
      first: 12,
      giftCardGuid,
    },
    {
      getNextPageParam: lastPage => {
        const { endCursor, hasNextPage } =
          lastPage.giftCardTransactionLedger.pageInfo ?? {};
        return hasNextPage ? { [pageParamKey]: endCursor } : undefined;
      },
    },
  );

  const data = (paginatedData?.pages?.flatMap(
    page => page.giftCardTransactionLedger.edges,
  ) || []) as GiftCardTransactionEdge[];

  const loadMore = () => (morePages ? fetchNextPage() : undefined);

  return {
    data,
    isLoading,
    fetchNextPage,
    refetch,
    loadMore,
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
