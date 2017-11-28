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

import SearchView from './search/SearchView';
import debounce from './../common/helpers/debounce';
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
  }, 1300);

  /**
   * Render component
   */
  render() {
    console.log('render');
    return (
      <View style={styles.container}>
        <SearchView
          placeholder='search...'
          onChangeText={this.searchChange}
        />
        <FlatList
          data={this.props.messengerList.conversations}
          renderItem={this.renderMessage}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onEndThreshold={0.01}
          refreshing={this.props.messengerList.refreshing}
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
    this.props.messengerList.loadList(true);
  }

  /**
   * Load more rows
   */
  loadMore = () => {
    // fix to prevent load data twice on initial state
    if (!this.onEndReachedCalledDuringMomentum) {
      this.props.messengerList.loadList()
      this.onEndReachedCalledDuringMomentum = true;
    }
  }

  onMomentumScrollBegin = () => {
    this.onEndReachedCalledDuringMomentum = false;
  }

  /**
   * render row
   * @param {object} row
   */
  renderMessage(row) {
    return (
      <ConversationView item={row.item} styles={styles}/>
    );
  }
}

// styles
const styles = StyleSheet.create({
	listView: {
    paddingTop: 20,
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