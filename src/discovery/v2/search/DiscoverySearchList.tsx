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

import { useStores } from '../../../common/hooks/use-stores';
import ThemedStyles from '../../../styles/ThemedStyles';

interface Props {
  navigation: any;
  style?: any;
}

export const DiscoverySearchList = observer((props: Props) => {
  const { discoveryV2Search } = useStores();

  const keyExtractor = (item) => item.urn;

  /**
   * Render activity item
   */
  const ItemPartial = (row) => {
    return (
      <ErrorBoundary
        containerStyle={CS.hairLineBottom}
        message="Could not load">
        <Activity
          entity={row.item}
          navigation={props.navigation}
          autoHeight={false}
        />
      </ErrorBoundary>
    );
  };

  const EmptyPartial = () => {
    return discoveryV2Search.refreshing ? (
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
        data={discoveryV2Search.listStore.entities.slice()}
        onRefresh={discoveryV2Search.refresh}
        refreshing={discoveryV2Search.refreshing}
        ListEmptyComponent={EmptyPartial}
        renderItem={ItemPartial}
        keyExtractor={keyExtractor}
        style={[styles.list, ThemedStyles.getColor('primary_background')]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
