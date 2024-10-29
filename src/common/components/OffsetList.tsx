import { observer } from 'mobx-react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import useApiFetch from '../hooks/useApiFetch';
import CenteredLoading from './CenteredLoading';
import ActivityIndicator from './ActivityIndicator';
import MText from './MText';
import { IS_IOS } from '../../config/Config';
import StickyListWrapper from './StickyListWrapper';
import sp from '~/services/serviceProvider';

export type OffsetListProps<T = any> = {
  header?: React.ReactElement;
  emptyMessage?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListEmptyComponent?: React.ReactNode;
  ListComponent?: any;
  onRefresh?: () => void;
  renderItem: ListRenderItem<T>;
  fetchEndpoint: string;
  endpointData: string;
  offsetField?: string;
  map?: (data: any) => any;
  params?: Object;
  placeholderCount?: number;
  renderPlaceholder?: () => JSX.Element;
  offsetPagination?: boolean;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onListUpdate?: (data?: any) => void;
  sticky?: boolean;
};

type FetchResponseType =
  | {
      status: string;
      'load-next': string | number;
    }
  | Array<any>;

export default observer(
  // TODO: add ref types
  forwardRef(function OffsetList(props: OffsetListProps, ref: any) {
    // =====================| STATES & VARIABLES |=====================>
    const theme = sp.styles.style;
    const [offset, setOffset] = useState<string | number>(
      props.offsetPagination ? 0 : '',
    );
    const [page, setPage] = useState<number>(1);
    const listRef = React.useRef<FlatList>(null);
    const offsetField = props.offsetField || 'offset';
    const opts = {
      limit: 12,
      [offsetField]: offset,
    };
    if (props.params) {
      Object.assign(opts, props.params);
    }
    if (props.offsetPagination) {
      opts[offsetField] = (page - 1) * opts.limit;
    }
    const [hasMore, setHasMore] = useState<boolean>(true);
    const keyExtractor = (item, index: any) => `${item.urn}${index}`;
    const map = useCallback(
      (data: any) => {
        if (!data.length) {
          setHasMore(false);
        }
        return props.map ? props.map(data) : data;
      },
      [props],
    );

    const fetchStore = useApiFetch<FetchResponseType>(props.fetchEndpoint, {
      params: opts,
      dataField: props.endpointData,
      updateStrategy: 'merge',
      map,
    });

    // if the fetchEndpoint changed, reset pagination and results
    useEffect(() => {
      if (fetchStore.result) {
        fetchStore.setResult(null);
        props.offsetPagination ? setPage(1) : setOffset('');
        setHasMore(true);
      }
    }, [props.fetchEndpoint, fetchStore, props.offsetPagination]);

    const data = useMemo(() => {
      if (fetchStore.result) {
        return Array.isArray(fetchStore.result)
          ? fetchStore.result.slice()
          : fetchStore.result[props.endpointData].slice();
      }

      if (props.placeholderCount) {
        return new Array(props.placeholderCount)
          .fill(null)
          .map((i, index) => ({ urn: `placeholder-${index}` }));
      }

      return [];
    }, [fetchStore.result, props.placeholderCount, props.endpointData]);

    // =====================| PROVIDED METHODS |=====================>
    useImperativeHandle(ref, () => ({
      refreshList: () => _refresh(),
      scrollToTop: () =>
        listRef.current?.scrollToOffset({ offset: 0, animated: true }),
    }));

    // =====================| EFFECTS |=====================>
    useEffect(() => {
      if (!fetchStore.loading) {
        props.onListUpdate?.(data);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // =====================| METHODS |=====================>

    const _refresh = React.useCallback(() => {
      if (fetchStore.loading) {
        return;
      }

      props.offsetPagination ? setPage(1) : setOffset('');
      fetchStore.refresh();
    }, [props.offsetPagination, fetchStore]);

    const onFetchMore = useCallback(() => {
      if (fetchStore.loading) {
        return;
      }

      if (props.offsetPagination && hasMore) {
        return setPage(oldPage => oldPage + 1);
      }

      if (fetchStore.result?.['load-next']) {
        setOffset(fetchStore.result['load-next']);
      }
    }, [
      fetchStore.loading,
      fetchStore.result,
      props.offsetPagination,
      hasMore,
    ]);

    // =====================| RENDERS |=====================>
    const renderItem = useMemo(() => {
      if (fetchStore.result?.[props.endpointData]) {
        return props.renderItem;
      }

      return props.renderPlaceholder || props.renderItem;
    }, [
      fetchStore.result,
      props.endpointData,
      props.renderPlaceholder,
      props.renderItem,
    ]);

    /**
     * if it was loading and we already had some results,
     * show the loading footer
     **/
    const loadingFooter = useMemo(
      () =>
        fetchStore.loading &&
        !fetchStore.refreshing &&
        fetchStore.result?.[props.endpointData] ? (
          <View style={theme.paddingVertical2x}>
            <ActivityIndicator size={30} />
          </View>
        ) : (
          !props.placeholderCount &&
          fetchStore.loading &&
          !fetchStore.result && <CenteredLoading />
        ),
      [
        fetchStore.loading,
        fetchStore.refreshing,
        fetchStore.result,
        props.endpointData,
        props.placeholderCount,
        theme.paddingVertical2x,
      ],
    );

    if (fetchStore.error && !fetchStore.loading) {
      return (
        <MText
          style={[
            theme.colorSecondaryText,
            theme.textCenter,
            theme.fontL,
            theme.marginVertical4x,
          ]}
          onPress={() => fetchStore.fetch()}>
          {sp.i18n.t('error') + '\n'}
          <MText style={theme.colorLink}>{sp.i18n.t('tryAgain')}</MText>
        </MText>
      );
    }

    const List = props.sticky
      ? Animated.FlatList
      : props.ListComponent ?? FlatList;

    const listProps: FlatListProps<any> = {
      ref: listRef,
      data: data,
      renderItem: renderItem,
      ListFooterComponent: loadingFooter || undefined,
      // @ts-ignore
      ListEmptyComponent: !fetchStore.loading && props.ListEmptyComponent,
      keyExtractor: keyExtractor,
      onEndReached: onFetchMore,
      refreshControl: (
        <RefreshControl
          refreshing={!!fetchStore.refreshing}
          onRefresh={_refresh}
          progressViewOffset={IS_IOS ? 0 : 80}
          tintColor={sp.styles.getColor('Link')}
          colors={[sp.styles.getColor('Link')]}
        />
      ),
      onScroll: props.onScroll,
      refreshing: fetchStore.refreshing,
      contentContainerStyle: props.contentContainerStyle,
      style: props.style || listStyle,
    };

    if (props.sticky) {
      return (
        <StickyListWrapper
          header={props.header}
          renderList={stickyProps => <List {...listProps} {...stickyProps} />}
        />
      );
    }

    return <List {...listProps} ListHeaderComponent={props.header} />;
  }),
);

const listStyle = sp.styles.combine('flexContainer', 'bgPrimaryBackground');
