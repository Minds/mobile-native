import React, {
  Component
} from 'react';

import {
  Text,
  View,
  Alert,
  Image,
  Platform,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import _ from 'lodash';

import Icon from 'react-native-vector-icons/MaterialIcons';

import ConversationView from './conversation/ConversationView';

import SearchView from '../common/components/SearchView';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import Colors from '../styles/Colors';
import MessengerTabIcon from './MessengerTabIcon';

/**
 * Messenger Conversarion List Screen
 */
@inject('messengerList')
@observer
export default class MessengerScreen extends Component {
  state = {
    active: false,
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <MessengerTabIcon tintColor={tintColor} />
    )
  }

  /**
   * On component will mount
   */
  componentWillMount() {

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
    this.disposeEnter();
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
      'Confirm',
      `Do you want to logout from messenger?`.trim(),
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => this.props.messengerList.logout() }
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
          <Text style={ComponentsStyle.emptyComponentMessage}>You don't have any messages</Text>
          <Text
            style={ComponentsStyle.emptyComponentLink}
            onPress={() => this.props.navigation.navigate('Discovery', { type: 'user' })}
            >
            Find channels
          </Text>
        </View>
      </View>);
    }

    const iconRight = messengerList.configured ? 'md-unlock': null;

    return (
      <View style={styles.container}>
        <SearchView
          placeholder='Search...'
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
          onEndThreshold={0.01}
          refreshing={messengerList.refreshing}
          style={styles.listView}
          ListEmptyComponent={empty}
        />
      </View>
    );
  }

  /**
   * Search change
   * We debounce to prevent a fetch to the server on every key pressed
   */
  searchChange = (search) => {
    this.searchDebouncer(search);
  }

  /**
   * Clear and reload
   */
  refresh = () => {
    this.props.messengerList.refresh();
  }

  /**
   * Load more rows
   */
  loadMore = () => {
    this.props.messengerList.loadList()
  }

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
        />
    );
  }
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