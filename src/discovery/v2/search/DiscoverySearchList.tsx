import React, { Component, Fragment, ComponentType, useEffect } from 'react';

import {
  StyleSheet,
  Platform,
  Text,
  Dimensions,
  RefreshControl,
  View,
  FlatList,
} from 'react-native';

import { observer } from 'mobx-react';

import _ from 'lodash';

import Activity from '../../../newsfeed/activity/Activity';
import { CommonStyle as CS } from '../../../styles/Common';
import { ComponentsStyle } from '../../../styles/Components';

import ErrorLoading from '../../../common/components/ErrorLoading';

import ErrorBoundary from '../../../common/components/ErrorBoundary';
import i18n from '../../../common/services/i18n.service';
import FallbackBoundary from '../../FallbackBoundary';

import ThemedStyles from '../../../styles/ThemedStyles';
import { useDiscoveryV2SearchStore } from './DiscoveryV2SearchContext';

interface Props {
  navigation: any;
  style?: any;
}

export const DiscoverySearchList = observer((props: Props) => {
  const store = useDiscoveryV2SearchStore();
  let listRef: FlatList<[]> | null;

  useEffect(() => {
    listRef && listRef.scrollToOffset({ offset: -65, animated: true });
  }, [store.refreshing]);

  const keyExtractor = (item) => item.urn;

  /**
   * Render activity item
   */
  const ItemPartial = (row) => {
    let entity: Element;

    switch (row.item.type) {
      case 'user':
      case 'group':
        entity = <View></View>;
        break;
      default:
        entity = (
          <Activity
            entity={row.item}
            navigation={props.navigation}
            autoHeight={false}
          />
        );
    }

    return (
      <ErrorBoundary
        containerStyle={CS.hairLineBottom}
        message="Could not load">
        {entity}
      </ErrorBoundary>
    );
  };

  const EmptyPartial = () => {
    return store.refreshing ? (
      <View></View>
    ) : (
      <View>
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <Text style={ComponentsStyle.emptyComponentMessage}>
              Nothing to see here...
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // const FooterPartial = () => {
  //   const store = discoveryV2Search;

  //   if (store.listStore.loading && !store.listStore.refreshing) {
  //     return (
  //       <View
  //         style={{
  //           flex: 1,
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           padding: 16,
  //         }}>
  //         <ActivityIndicator size={'large'} />
  //       </View>
  //     );
  //   }

  //   if (!store.listStore.errorLoading) return null;

  //   const message = store.listStore.entities.length
  //     ? i18n.t('cantLoadMore')
  //     : i18n.t('cantLoad');

  //   return <ErrorLoading message={message} tryAgain={() => {}} />;
  // };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={(ref) => (listRef = ref)}
        data={[...store.listStore.entities.slice()]}
        onRefresh={() => store.refresh()}
        refreshing={store.refreshing}
        ListEmptyComponent={EmptyPartial}
        renderItem={ItemPartial}
        keyExtractor={keyExtractor}
        style={[ThemedStyles.getColor('primary_background')]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
