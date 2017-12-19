import React, {
  Component
} from 'react';

import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import ConversationView from './conversation/ConversationView';

import SearchView from '../common/components/SearchView';
import debounce from '../common/helpers/debounce';
import MessengerSetup from './MessengerSetup';

/**
 * Messenger Conversarion List Screen
 */
@inject('messengerList')
@observer
export default class MessengerScreen extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-chatbubbles" size={24} color={tintColor} />
    )
  }

  searchDebouncer = debounce((search) => {
    this.props.messengerList.setSearch(search);
  }, 300);

  /**
   * Render component
   */
  render() {
    const messengerList = this.props.messengerList;

    // show setup !configured yet
    if (!messengerList.configured) {
      return <MessengerSetup/>
    }

    return (
      <View style={styles.container}>
        <SearchView
          placeholder='search...'
          onChangeText={this.searchChange}
        />
        <FlatList
          data={messengerList.conversations}
          renderItem={this.renderMessage}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          onEndThreshold={0.01}
          refreshing={messengerList.refreshing}
          style={styles.listView}
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
      <ConversationView item={row.item} styles={styles} navigation={this.props.navigation} />
    );
  }
}

// styles
const styles = StyleSheet.create({
	listView: {
    paddingTop: 20,
    flex: 1
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