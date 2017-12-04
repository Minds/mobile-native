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
} from './DiscoveryService';

import DiscoveryTile from './DiscoveryTile';


export default class DiscoveryScreen extends Component<{}> {

  state = {
    entities: [],
    offset: '',
    loading: true,
    refreshing: false
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-search" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <FlatList
        data={this.state.entities}
        renderItem={this.renderTile}
        keyExtractor={item => item.guid}
        onRefresh={() => this.refresh()}
        refreshing={this.state.refreshing}
        onEndReached={() => this.loadMore()}
        onEndThreshold={0.3}
        contentContainerStyle={styles.listView}
        numColumns={3}
        horizontal={false}
      />
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps == this.props && nextState == this.state)
      return false;
    return true;
  }

  loadFeed() {
    getFeed(this.state.offset)
      .then((feed) => {
        this.setState({
          entities: [... this.state.entities, ...feed.entities],
          offset: feed.offset,
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

  renderTile(row) {
    const entity = row.item;
    return (
      <DiscoveryTile entity={entity} />
    );
  }


}

const styles = StyleSheet.create({
	listView: {
    backgroundColor: '#FFF',
  },
  tile: {
    flex: 1,
    minHeight: 100,
  },
  tileImage: {
    flex: 1,
  },
});