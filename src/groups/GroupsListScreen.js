import React, {
  Component
} from 'react';

import {
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'


import { Avatar } from 'react-native-elements';
import { MINDS_CDN_URI, MINDS_FEATURES } from '../config/Config';
import { CommonStyle as CS } from '../styles/Common';
import CenteredLoading from '../common/components/CenteredLoading';
import Toolbar from '../common/components/toolbar/Toolbar';
import TagsSubBar from '../newsfeed/topbar/TagsSubBar';
import ErrorLoading from '../common/components/ErrorLoading';
import GroupsListItem from './GroupsListItem';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import { withErrorBoundary } from '../common/components/ErrorBoundary';

// define tabs based on enabled features
const selectedTextStyle = {color: 'black'};
const typeOptions = [
  { text: 'TOP', value: 'suggested', selectedTextStyle},
  { text: 'MY GROUPS', value: 'member', selectedTextStyle}
];

DebouncedGroupsListItem = withErrorBoundary(withPreventDoubleTap(GroupsListItem, "Can't show this group"));

/**
 * Groups list screen
 */
@inject('groups')
@observer
export default class GroupsListScreen extends Component {

  static navigationOptions = {
    title: 'Groups',
  };

  /**
   * Component will mount
   */
  componentWillMount() {
    this.props.groups.loadList()
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    this.props.groups.list.clearList();
  }

  /**
   * Navigate to group screen
   * @param {object} group
   */
  navigateToGroup(group) {
    this.props.navigation.push('GroupView', { group: group, scrollToBottom: true })
  }

  /**
   * On tag selection change
   */
  onTagSelectionChange = () => {
    this.props.groups.refresh();
  }

  /**
   * Render Tabs
   */
  renderToolbar() {
    return (
      <View>
        <Toolbar
          options={ typeOptions }
          initial={ this.props.groups.filter }
          onChange={ this.onTabChange }
        />
        { this.props.groups.filter == 'suggested' && <View style={[CS.paddingTop, CS.paddingBottom, CS.hairLineBottom]}>
          <TagsSubBar onChange={this.onTagSelectionChange}/>
        </View>}
      </View>
    )
  }

  /**
   * On tab change
   */
  onTabChange = (value) => {
    this.props.groups.setFilter(value);
  }

  renderItem = (row) => {
    return <DebouncedGroupsListItem group={row.item} onPress={() => this.navigateToGroup(row.item)}/>
  }

  /**
   * Load data
   */
  loadMore = () => {
    if (this.props.groups.list.errorLoading) return;
    this.props.groups.loadList();
  }

  /**
   * Load more forced
   */
  loadMoreForce = () => {
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

    const footer = this.getFooter()

    return (
      <FlatList
        data={list.entities.slice()}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderToolbar()}
        ListFooterComponent={footer}
        keyExtractor={item => item.rowKey}
        onRefresh={this.refresh}
        refreshing={list.refreshing}
        onEndReached={this.loadMore}
        // onEndReachedThreshold={0}
        style={styles.list}
        initialNumToRender={12}
        removeClippedSubviews={true}
      />
    );
  }

  /**
   * Get list's footer
   */
  getFooter() {
    if (this.props.groups.loading && !this.props.groups.list.refreshing){
      return (
        <View style={[CS.centered, CS.padding3x]}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    if (!this.props.groups.list.errorLoading) return null;

    const message = this.props.groups.list.entities.length ?
      "Can't load more" :
      "Can't load groups";

    return <ErrorLoading message={message} tryAgain={this.loadMoreForce}/>
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
