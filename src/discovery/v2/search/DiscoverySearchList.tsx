import React, { useEffect, useRef } from 'react';

import { Text, View, FlatList } from 'react-native';

import { observer } from 'mobx-react';

import Activity from '../../../newsfeed/activity/Activity';
import { CommonStyle as CS } from '../../../styles/Common';
import { ComponentsStyle } from '../../../styles/Components';
import ErrorBoundary from '../../../common/components/ErrorBoundary';
import FeedList from '../../../common/components/FeedList';

import ThemedStyles from '../../../styles/ThemedStyles';
import { useDiscoveryV2SearchStore } from './DiscoveryV2SearchContext';

interface Props {
  navigation: any;
  style?: any;
}

export const DiscoverySearchList = observer((props: Props) => {
  const theme = ThemedStyles.style;

  const store = useDiscoveryV2SearchStore();
  let listRef = useRef<FlatList<[]>>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: -65, animated: true });
    }
  }, [listRef, store.refreshing]);

  const keyExtractor = (item) => item.urn;

  /**
   * Render activity item
   */
  const ItemPartial = (row) => {
    let entity: Element;

    switch (row.item.type) {
      case 'user':
      case 'group':
        entity = <View />;
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
      <View />
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
    <View style={theme.flexContainer}>
      <FeedList
        feedStore={store.listStore}
        navigation={props.navigation}
        emptyMessage={EmptyPartial}
      />
      {/* <FlatList
        ref={listRef}
        data={store.listStore.entities.slice()}
        onRefresh={() => store.refresh()}
        refreshing={store.refreshing}
        ListEmptyComponent={EmptyPartial}
        renderItem={ItemPartial}
        keyExtractor={keyExtractor}
        onEndReached={store.listStore.loadMore}
        style={theme.backgroundPrimary}
        initialNumToRender={6}
        windowSize={11}
      /> */}
    </View>
  );
});
