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
import CenteredLoading from '../common/components/CenteredLoading';
import Toolbar from '../common/components/toolbar/Toolbar';

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

  /**
   * Render Tabs
   */
  renderToolbar() {
    selectedTextStyle={color: 'black'};
    const typeOptions = [
      { text: 'TOP', value: 'trending', selectedTextStyle},
      { text: 'MY GROUPS', value: 'member', selectedTextStyle}
    ]
    return (
      <Toolbar
        options={ typeOptions }
        initial={ this.props.groups.filter }
        onChange={ this.onTabChange }
      />
    )
  }

  onTabChange = (value) => {
    this.props.groups.setFilter(value);
  }

  renderItem = (row) => {
    const item = row.item;
    return (
      <ListItem
        containerStyle={{ borderBottomWidth: 0 }}
        title={item.name}
        keyExtractor={item => item.rowKey}
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

  /**
   * Render
   */
  render() {
    const list = this.props.groups.list;

    return (
      <FlatList
        data={list.entities.slice()}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderToolbar()}
        keyExtractor={item => item.guid}
        onRefresh={this.refresh}
        refreshing={list.refreshing || !list.loaded}
        onEndReached={this.loadMore}
        onEndThreshold={0}
        style={styles.list}
        initialNumToRender={12}
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
    marginTop: 0,
    backgroundColor: '#FFF'
  }
});
