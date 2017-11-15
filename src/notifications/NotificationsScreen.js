import React, { 
    Component 
} from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    View,
    FlatList,
    ListView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  MINDS_URI
} from '../config/Config';

import {
  getFeed,
} from './NotificationsService';

import Notification from './notification/Notification';

export default class NotificationsScreen extends Component<{}> {

  state = {
    entities: [],
    offset: '',
    loading: false,
    moreData: true,
    refreshing: false
  }

  render() {
    return (
      <FlatList
        data={this.state.entities}
        renderItem={this.renderRow}
        keyExtractor={item => item.guid}
        onRefresh={() => this.refresh()}
        refreshing={this.state.refreshing}
        onEndReached={() => this.loadMore()}
        onEndThreshold={0.3}
        style={styles.listView}
      />
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps == this.props && nextState == this.state)
      return false;
    return true;
  }

  loadFeed() {
    if (!this.state.moreData || this.state.loading) {
      return;
    }
    this.setState({ loading: true });
    getFeed(this.state.offset)
      .then((feed) => {
        this.setState({
          entities: [... this.state.entities, ...feed.entities],
          offset: feed.offset,
          moreData:  feed.entities.length,
          loading: false,
          refreshing: false
        });
      })
      .catch(err => {
        console.log('error');
      })
  }

  refresh() {
    this.setState({ refreshing: true })

    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000)
  }

  loadMore() {
    if (this.loading)
      return;
    this.loadFeed();
  }

  renderRow(row) {
    const entity = row.item;
    return (
      <Notification entity={entity}>
      </Notification>
    );
  }

}

const styles = StyleSheet.create({
	listView: {
    backgroundColor: '#FFF',
  },
  row: {
    padding: 16,
  },
});