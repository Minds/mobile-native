import { observer } from 'mobx-react';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import useApiFetch from '../hooks/useApiFetch';
import i18n from '../services/i18n.service';
import CenteredLoading from './CenteredLoading';
import ActivityIndicator from './ActivityIndicator';
import MText from './MText';

type PropsType = {
  header?: React.ComponentType<any> | React.ReactElement;
  emptyMessage?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListEmptyComponent?: React.ReactNode;
  ListComponent?: any;
  onRefresh?: () => void;
  renderItem: ListRenderItem<any>;
  fetchEndpoint: string;
  endpointData: string;
  offsetField?: string;
  map?: (data: any) => any;
  params?: Object;
  placeholderCount?: number;
  renderPlaceholder?: () => JSX.Element;
  offsetPagination: boolean;
};

type FetchResponseType = {
  status: string;
  'load-next': string | number;
};

export default observer(
  // TODO: add ref types
  forwardRef(function OffsetList<T>(props: PropsType, ref: any) {
    // =====================| STATES & VARIABLES |=====================>
    type ApiFetchType = FetchResponseType & T;
    const theme = ThemedStyles.style;
    const [offset, setOffset] = useState<string | number>('');
    const [page, setPage] = useState<number>(1);
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

    const updateState = useCallback(
      (newData: any, oldData: any) => {
        const map = props.map || ((data: any) => data);
        if (!newData?.[props.endpointData].length) {
          setHasMore(false);
        }

        return {
          ...newData,
          [props.endpointData]: [
            ...(oldData?.[props.endpointData] || []),
            ...map(newData?.[props.endpointData] || []),
          ],
        };
      },
      [props.endpointData, props.map],
    );

    const {
      result,
      loading,
      error,
      fetch,
      refresh,
      refreshing,
    } = useApiFetch<ApiFetchType>(props.fetchEndpoint, {
      params: opts,
      updateState,
    });
    const data = useMemo(() => {
      if (result) {
        return result[props.endpointData].slice();
      }

      if (props.placeholderCount) {
        return new Array(props.placeholderCount)
          .fill(null)
          .map((i, index) => ({ urn: `placeholder-${index}` }));
      }

      return [];
    }, [result, props.placeholderCount, props.endpointData]);

    // =====================| METHODS |=====================>
    useImperativeHandle(ref, () => ({
      refreshList: () => refresh(),
    }));

    const _refresh = React.useCallback(() => {
      setOffset('');
      refresh();
    }, [refresh]);

    const onFetchMore = useCallback(() => {
      if (loading) {
        return;
      }

      if (props.offsetPagination && hasMore) {
        return setPage(oldPage => oldPage + 1);
      }

      if (result?.['load-next']) {
        setOffset(result['load-next']);
      }
    }, [loading, result, props.offsetPagination, hasMore]);

    // =====================| RENDERS |=====================>
    const renderItem = useMemo(() => {
      if (result && result[props.endpointData]) {
        return props.renderItem;
      }

      return props.renderPlaceholder || props.renderItem;
    }, [result, props.endpointData, props.renderPlaceholder, props.renderItem]);

    /**
     * if it was loading and we already had some results,
     * show the loading footer
     **/
    const loadingFooter = useMemo(
      () =>
        loading && !refreshing && result?.[props.endpointData] ? (
          <View style={theme.paddingVertical2x}>
            <ActivityIndicator size={30} />
          </View>
        ) : undefined,
      [
        loading,
        refreshing,
        result,
        props.endpointData,
        theme.paddingVertical2x,
      ],
    );

    if (error && !loading) {
      return (
        <MText
          style={[
            theme.colorSecondaryText,
            theme.textCenter,
            theme.fontL,
            theme.marginVertical4x,
          ]}
          onPress={() => fetch()}>
          {i18n.t('error') + '\n'}
          <MText style={theme.colorLink}>{i18n.t('tryAgain')}</MText>
        </MText>
      );
    }

    if (!props.placeholderCount && loading && !result) {
      return <CenteredLoading />;
    }

    const List = props.ListComponent || FlatList;

    return (
      <List
        ListHeaderComponent={props.header}
        data={data}
        renderItem={renderItem}
        ListFooterComponent={loadingFooter}
        keyExtractor={keyExtractor}
        onEndReached={onFetchMore}
        onRefresh={_refresh}
        refreshing={refreshing}
        contentContainerStyle={props.contentContainerStyle}
        style={props.style || listStyle}
      />
    );
  }),
);

const listStyle = ThemedStyles.combine('flexContainer', 'bgPrimaryBackground');
