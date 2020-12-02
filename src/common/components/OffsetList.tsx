import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  Text,
  ViewStyle,
} from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import useApiFetch from '../hooks/useApiFetch';
import i18n from '../services/i18n.service';

type PropsType = {
  header?: React.ComponentType<any> | React.ReactElement;
  emptyMessage?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  ListEmptyComponent?: React.ReactNode;
  onRefresh?: () => void;
  renderItem: ListRenderItem<any>;
  fetchEndpoint: string;
  endpointData: string;
};

type FetchResponseType = {
  status: string;
  'load-next': string | number;
};

export default observer(function OffsetList<T>(props: PropsType) {
  const theme = ThemedStyles.style;
  const [offset, setOffset] = useState<string | number>('');
  const opts = {
    limit: 12,
    offset,
  };

  type ApiFetchType = FetchResponseType & T;

  const { result, loading, error, fetch } = useApiFetch<ApiFetchType>(
    props.fetchEndpoint,
    {
      params: opts,
      updateState: (newData: ApiFetchType, oldData: ApiFetchType) =>
        ({
          ...newData,
          [props.endpointData]: [
            ...(oldData ? oldData[props.endpointData] : []),
            ...(newData && newData[props.endpointData]
              ? newData[props.endpointData]
              : []),
          ],
        } as ApiFetchType),
    },
  );

  const onFetchMore = useCallback(
    () => result && result['load-next'] && setOffset(result['load-next']),
    [result],
  );

  const keyExtractor = (item, index: any) => `${item.urn}${index}`;

  if (error && !loading) {
    return (
      <Text
        style={[
          theme.colorSecondaryText,
          theme.textCenter,
          theme.fontL,
          theme.marginVertical4x,
        ]}
        onPress={() => fetch()}>
        {i18n.t('error') + '\n'}
        <Text style={theme.colorLink}>{i18n.t('tryAgain')}</Text>
      </Text>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <FlatList
      ListHeaderComponent={props.header}
      data={result[props.endpointData].slice()}
      renderItem={props.renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onFetchMore}
      style={[
        ThemedStyles.style.flexContainer,
        ThemedStyles.style.backgroundPrimary,
      ]}
    />
  );
});
