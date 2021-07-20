import React, { Component } from 'react';

import { Text, FlatList, View, TouchableHighlight } from 'react-native';

import { observer, inject } from 'mobx-react';

import i18n from '../../common/services/i18n.service';
import DiscoveryUser from '../../discovery/DiscoveryUser';
import CenteredLoading from '../../common/components/CenteredLoading';
import ErrorLoading from '../../common/components/ErrorLoading';
import ThemedStyles from '../../styles/ThemedStyles';
import type ChannelSubscribersStore from './ChannelSubscribersStore';

type PropsType = {
  channelSubscribersStore: ChannelSubscribersStore;
  route: any;
  navigation: any;
};

/**
 * Discovery screen
 */
@inject('channelSubscribersStore')
@observer
class ChannelSubscribers extends Component<PropsType> {
  /**
   * On component will mount
   */
  componentDidMount() {
    this._loadData();
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.props.channelSubscribersStore.reset();
  }

  /**
   * Load data
   */
  _loadData() {
    const params = this.props.route.params || {};
    if (params.filter) {
      this.props.channelSubscribersStore.setFilter(params.filter);
    } else {
      this.props.channelSubscribersStore.setFilter('subscribers');
    }

    if (params.guid) {
      this.props.channelSubscribersStore.setGuid(params.guid);
    }
  }

  /**
   * Render
   */
  render() {
    let body;
    const theme = ThemedStyles.style;
    const store = this.props.channelSubscribersStore;

    const footerCmp = store.errorLoading ? (
      <ErrorLoading message={i18n.t('cantLoad')} tryAgain={store.loadList} />
    ) : null;

    if (!store.list.loaded && !store.list.refreshing && !store.errorLoading) {
      body = <CenteredLoading />;
    } else {
      body = (
        <FlatList
          data={store.list.entities.slice()}
          renderItem={this.renderRow}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          refreshing={store.list.refreshing}
          onEndReached={this.loadFeed}
          // onEndReachedThreshold={0}
          initialNumToRender={12}
          style={theme.flexContainer}
          removeClippedSubviews={false}
          ListFooterComponent={footerCmp}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <View style={styles.row}>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => store.setFilter('subscribers')}
              style={
                store.filter === 'subscribers'
                  ? styles.selectedButton
                  : styles.buttons
              }>
              <Text style={theme.fontL}>{i18n.t('subscribers')}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => store.setFilter('subscriptions')}
              style={
                store.filter === 'subscriptions'
                  ? styles.selectedButton
                  : styles.buttons
              }>
              <Text style={theme.fontL}>{i18n.t('subscriptions')}</Text>
            </TouchableHighlight>
          </View>
        </View>
        {body}
      </View>
    );
  }

  /**
   * Load subs data
   */
  loadFeed = () => {
    this.props.channelSubscribersStore.loadList();
  };

  /**
   * Refresh subs data
   */
  refresh = () => {
    this.props.channelSubscribersStore.refresh();
  };

  /**
   * Render user row
   */
  renderRow = row => {
    return (
      <DiscoveryUser
        store={this.props.channelSubscribersStore}
        row={row}
        navigation={this.props.navigation}
      />
    );
  };
}

export default ChannelSubscribers;

const styles = ThemedStyles.create({
  topbar: {
    height: 35,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  row: ['flexContainer', 'rowJustifyCenter'],
  container: ['flexContainer', 'bgPrimaryBackground'],
  buttons: ['flexContainerCenter', 'alignCenter'],

  selectedButton: [
    'flexContainerCenter',
    'bcolorLink',
    'colorLink',
    {
      alignItems: 'center',
      borderBottomWidth: 3,
    },
  ],
});
