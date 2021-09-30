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
};

type FetchResponseType = {
  status: string;
  'load-next': string | number;
};

const mapping = data => data;

export default observer(
  // TODO: add ref types
  forwardRef(function OffsetList<T>(props: PropsType, ref: any) {
    // =====================| STATES & VARIABLES |=====================>
    type ApiFetchType = FetchResponseType & T;
    const theme = ThemedStyles.style;
    const [offset, setOffset] = useState<string | number>('');
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const opts = {
      limit: 12,
      [props.offsetField || 'offset']: offset,
    };
    if (props.params) {
      Object.assign(opts, props.params);
    }
    const map = props.map || mapping;
    const keyExtractor = (item, index: any) => `${item.urn}${index}`;
    const { result, loading, error, fetch, setResult } =
      useApiFetch<ApiFetchType>(props.fetchEndpoint, {
        params: opts,
        updateState: (newData: ApiFetchType, oldData: ApiFetchType) =>
          ({
            ...newData,
            [props.endpointData]: [
              ...(oldData ? oldData[props.endpointData] : []),
              ...map(
                newData && newData[props.endpointData]
                  ? newData[props.endpointData]
                  : [],
              ),
            ],
          } as ApiFetchType),
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
    }, [result, props.placeholderCount]);

    // =====================| METHODS |=====================>
    useImperativeHandle(ref, () => ({
      refreshList: () => refresh(),
    }));

    const refresh = React.useCallback(async () => {
      setOffset('');
      setRefreshing(true);
      await fetch(undefined, undefined, {
        updateState: (newData: ApiFetchType) =>
          ({
            ...newData,
            [props.endpointData]: [
              ...map(
                newData && newData[props.endpointData]
                  ? newData[props.endpointData]
                  : [],
              ),
            ],
          } as ApiFetchType),
      });
      setRefreshing(false);
    }, [fetch, setResult]);

    const onFetchMore = useCallback(() => {
      !loading &&
        result &&
        result['load-next'] &&
        setOffset(result['load-next']);
    }, [loading, result]);

    // =====================| RENDERS |=====================>
    const renderItem = useMemo(() => {
      if (result && result[props.endpointData]) {
        return props.renderItem;
      }

      return props.renderPlaceholder || props.renderItem;
    }, [result, props.renderPlaceholder, props.renderItem]);

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
      [loading, refreshing, result?.[props.endpointData]],
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
          onPress={() => fetch()}
        >
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
        onRefresh={refresh}
        refreshing={refreshing}
        contentContainerStyle={props.contentContainerStyle}
        style={props.style || listStyle}
      />
    );
  }),
);

const listStyle = ThemedStyles.combine('flexContainer', 'bgPrimaryBackground');
