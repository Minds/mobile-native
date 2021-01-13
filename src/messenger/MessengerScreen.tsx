//@ts-nocheck
import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';

import { inject, observer } from 'mobx-react';

import _ from 'lodash';

import Icon from 'react-native-vector-icons/MaterialIcons';

import ConversationView from './conversation/ConversationView';

import SearchView from '../common/components/SearchView';
import { ComponentsStyle } from '../styles/Components';
import ErrorLoading from '../common/components/ErrorLoading';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import ActivityIndicator from '../common/components/ActivityIndicator';
import MessengerSetup from './MessengerSetup';

/**
 * Messenger Conversation List Screen
 */
@inject('messengerList')
@observer
class MessengerScreen extends Component {
  state = {
    active: false,
  };

  static navigationOptions = {
    header: null,
  };

  /**
   * On component will mount
   */
  componentDidMount() {
    // // load data on enter
    this.disposeEnter = this.props.navigation.addListener('focus', () => {
      this.props.messengerList.loadList(true);
    });
  }

  /**
   * Dispose reactions of navigation store on unmount
   */
  componentWillUnmount() {
    if (this.disposeEnter) {
      this.disposeEnter();
    }
  }

  searchDebouncer = _.debounce((search) => {
    this.props.messengerList.setSearch(search);
  }, 200);

  /**
   * On logout
   */
  onLogoutPress = () => {
    Alert.alert(i18n.t('confirm'), i18n.t('messenger.logoutMessage'), [
      { text: i18n.t('no'), style: 'cancel' },
      { text: i18n.t('yes'), onPress: () => this.props.messengerList.logout() },
    ]);
  };

  /**
   * Render component
   */
  render() {
    const messengerList = this.props.messengerList;
    const conversations = messengerList.conversations;
    const loading = messengerList.loading;
    let loadingCmp = null;

    const theme = ThemedStyles.style;

    if (loading && !messengerList.refreshing) {
      loadingCmp = <ActivityIndicator style={styles.loading} />;
    }

    let empty;

    // show setup !configured yet
    if (!this.props.messengerList.configured) {
      return <MessengerSetup navigation={this.props.navigation} />;
    }

    if (messengerList.loaded && !messengerList.refreshing) {
      empty = (
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <Icon name="person-add" size={72} color="#444" />
            <Text style={ComponentsStyle.emptyComponentMessage}>
              {i18n.t('messenger.noMessages')}
            </Text>
          </View>
        </View>
      );
    }

    const iconRight = messengerList.configured ? 'md-lock-open-outline' : null;
    const footer = this.getFooter();

    return (
      <View style={[styles.container, theme.backgroundPrimary]}>
        <View
          style={[theme.rowJustifyStart, theme.alignCenter, theme.marginTop2x]}>
          <SearchView
            placeholder={i18n.t('discovery.search')}
            onChangeText={this.searchChange}
            iconRight={iconRight}
            containerStyle={[theme.backgroundSecondary, theme.flexContainer]}
            iconRightOnPress={this.onLogoutPress}
          />
        </View>
        {loadingCmp}
        <FlatList
          data={conversations.slice()}
          renderItem={this.renderMessage}
          keyExtractor={(item) => item.guid}
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          ListFooterComponent={footer}
          refreshing={messengerList.refreshing}
          style={styles.listView}
          ListEmptyComponent={empty}
          testID="MessengerList"
        />
      </View>
    );
  }

  /**
   * Get list footer
   */
  getFooter() {
    const messengerList = this.props.messengerList;

    if (!messengerList.errorLoading) return null;

    const message = messengerList.conversations.length
      ? i18n.t('cantLoadMore')
      : i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.loadMore} />;
  }

  /**
   * Search change
   * We debounce to prevent a fetch to the server on every key pressed
   */
  searchChange = (search) => {
    this.searchDebouncer(search);
  };

  /**
   * Clear and reload
   */
  refresh = () => {
    this.props.messengerList.refresh();
  };

  /**
   * Load more rows
   */
  loadMore = () => {
    this.props.messengerList.loadList();
  };

  /**
   * render row
   * @param {object} row
   */
  renderMessage = (row) => {
    return (
      <ConversationView
        item={row.item}
        styles={styles}
        navigation={this.props.navigation}
        testID={row.item.username.toUpperCase()}
      />
    );
  };
}

export default MessengerScreen;

// styles
const styles = StyleSheet.create({
  listView: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    right: 10,
    top: 15,
    ...Platform.select({
      android: {
        top: 20,
      },
    }),
  },
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  body: {
    marginLeft: 8,
    flex: 1,
  },
  icons: {
    padding: 5,
  },
  backIcon: {
    shadowOpacity: 0.4,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingLeft: 8,
    paddingBottom: 16,
    paddingRight: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});
