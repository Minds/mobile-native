import React, {
  Component
} from 'react';

import {
  ScrollView,
  StyleSheet,
  FlatList
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { ListItem } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { MINDS_CDN_URI } from '../config/Config';

/**
 * Groups list screen
 */
@inject('groups')
@observer
export default class GroupsListScreen extends Component {
  componentWillMount() {
    this.props.groups.loadList()
  }

  componentWillUnmount() {
    this.props.groups.list.clearList();
  }

  navigateToGroupJoin(group) {
    this.props.navigation.navigate('GroupView', { group: group})
  }

  renderItem = (row) => {
    const item = row.item;
    return (
      <ListItem
        containerStyle={{ borderBottomWidth: 0 }}
        title={item.name}
        avatar={<Avatar width={40} height={40} rounded source={{ uri: MINDS_CDN_URI + 'fs/v1/avatars/' + item.guid + '/small' }} />}
        subtitle={'Members ' + item['members:count']}
        hideChevron={true}
        onPress={() => this.navigateToGroupJoin(item)}
      />
    )
  }

  /**
   * Load data
   */
  loadMore = () => {
    this.props.groups.loadList();
  }


  /**
   * Refresh data
   */
  refresh = () => {
    this.props.groups.refresh()
  }


  render() {
    return (
      <FlatList
        data={this.props.groups.list.entities.slice()}
        renderItem={this.renderItem}
        keyExtractor={item => item.guid}
        onRefresh={this.refresh}
        refreshing={this.props.groups.list.refreshing}
        onEndReached={this.loadMore}
        onEndThreshold={0}
        style={styles.list}
        initialNumToRender={3}
        removeClippedSubviews={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 5
  },
  screen: {
    backgroundColor: '#FFF',
    flex: 1,
  }
});
