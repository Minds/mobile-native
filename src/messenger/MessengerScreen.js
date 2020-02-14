import React, {Component} from 'react';

import {
  Text,
  View,
  Alert,
  Platform,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {inject, observer} from 'mobx-react/native';

import _ from 'lodash';

import Icon from 'react-native-vector-icons/MaterialIcons';

import ConversationView from './conversation/ConversationView';

import SearchView from '../common/components/SearchView';
import {ComponentsStyle} from '../styles/Components';
import MessengerTabIcon from './MessengerTabIcon';
import ErrorLoading from '../common/components/ErrorLoading';
import i18n from '../common/services/i18n.service';
import featuresService from '../common/services/features.service';

const tabBarIcon = !featuresService.has('navigation-2020')
  ? ({tintColor}) => <MessengerTabIcon tintColor={tintColor} />
  : null;


/**
 * Messenger Conversarion List Screen
 */
export default
@inject('messengerList')
@observer
class MessengerScreen extends Component {
  state = {
    active: false,
  };

  static navigationOptions = {
    tabBarIcon: tabBarIcon,
    header: null,
  };

  /**
   * On component will mount
   */
  componentDidMount() {
    // load list
    this.props.messengerList.loadList();

    // listen socket on app start
    this.props.messengerList.listen();

    // load data on enter
    this.disposeEnter = this.props.navigation.addListener('didFocus', (s) => {
      this.props.messengerList.loadList(true);
      //this.setState({ active: true });
    });

    // hidde on leave
    // this.disposeLeave = this.props.navigation.onLeaveScreen('Messenger', (s) => {
    //   this.setState({ active: false });
    // });
  }

  /**
   * Dispose reactions of navigation store on unmount
   */
  componentWillUnmount() {
    this.props.messengerList.unlisten();
    if (this.disposeEnter) {
      this.disposeEnter();
    }
    //this.disposeLeave();
  }

  searchDebouncer = _.debounce((search) => {
    this.props.messengerList.setSearch(search);
  }, 200);

  /**
   * On logout
   */
  onLogoutPress = () => {
    Alert.alert(
      i18n.t('confirm'),
      i18n.t('messenger.logoutMessage'),
      [
        { text: i18n.t('no'), style: 'cancel' },
        { text: i18n.t('yes'), onPress: () => this.props.messengerList.logout() }
      ]
    );
  }

  /**
   * Render component
   */
  render() {
    const messengerList = this.props.messengerList;
    const conversations = messengerList.conversations;
    const loading = messengerList.loading;
    let loadingCmp   = null;

    if (loading && !messengerList.refreshing) {
      loadingCmp = <ActivityIndicator style={styles.loading} />
    }

    //if (!this.state.active) {
    //  return <View/>
    //}

    let empty;

    if (messengerList.loaded && !messengerList.refreshing) {
      empty = (
      <View style={ComponentsStyle.emptyComponentContainer}>
        <View style={ComponentsStyle.emptyComponent}>
          <Icon name="person-add" size={72} color='#444' />
          <Text style={ComponentsStyle.emptyComponentMessage}>{i18n.t('messenger.noMessages')}</Text>
          <Text
            style={ComponentsStyle.emptyComponentLink}
            onPress={() => this.props.navigation.navigate('Discovery', { type: 'channels' })}
          >
            {i18n.t('findChannels')}
          </Text>
        </View>
      </View>);
    }

    const iconRight = messengerList.configured ? 'md-unlock': null;
    const footer = this.getFooter();

    return (
      <View style={styles.container}>
        <SearchView
          placeholder={i18n.t('discovery.search')}
          onChangeText={this.searchChange}
          iconRight={iconRight}
          iconRightOnPress={this.onLogoutPress}
        />
        {loadingCmp}
        <FlatList
          data={conversations.slice()}
          renderItem={this.renderMessage}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          // onEndReachedThreshold={0.01}
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

    const message = messengerList.conversations.length ?
    i18n.t('cantLoadMore') :
    i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.loadMore}/>
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
  renderMessage = row => {
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

// styles
const styles = StyleSheet.create({
  listView: {
    //paddingTop: 20,
    flex: 1
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
    paddingTop: 5,
    backgroundColor: '#FFF',
  },
  body: {
    marginLeft: 8,
    flex: 1,
  },
  icons: {
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingLeft: 8,
    paddingBottom: 16,
    paddingRight: 8,
    borderBottomColor: '#EEE',
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