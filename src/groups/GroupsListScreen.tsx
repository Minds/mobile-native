//@ts-nocheck
import React, { Component } from 'react';

import { StyleSheet, FlatList, View, Text } from 'react-native';

import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../styles/Common';
import ErrorLoading from '../common/components/ErrorLoading';
import GroupsListItem from './GroupsListItem';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import ActivityIndicator from '../common/components/ActivityIndicator';

const DebouncedGroupsListItem = withErrorBoundary(
  withPreventDoubleTap(GroupsListItem, "Can't show this group"),
);

/**
 * Groups list screen
 */
@inject('groups')
@observer
export default class GroupsListScreen extends Component {
  /**
   * Component will mount
   */
  componentWillMount() {
    this.props.groups.loadList();
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
    this.props.navigation.push('GroupView', {
      group: group,
      scrollToBottom: true,
    });
  }

  renderItem = (row) => {
    return (
      <DebouncedGroupsListItem
        group={row.item}
        onPress={() => this.navigateToGroup(row.item)}
      />
    );
  };

  /**
   * Load data
   */
  loadMore = () => {
    if (this.props.groups.list.errorLoading) return;
    this.props.groups.loadList();
  };

  /**
   * Load more forced
   */
  loadMoreForce = () => {
    this.props.groups.loadList();
  };

  /**
   * Refresh data
   */
  refresh = () => {
    this.props.groups.refresh();
  };

  /**
   * Render
   */
  render() {
    const list = this.props.groups.list;
    const theme = ThemedStyles.style;

    const footer = this.getFooter();

    const header = (
      <View style={styles.header}>
        <Text
          style={[
            theme.titleText,
            theme.paddingLeft4x,
            theme.paddingVertical2x,
          ]}>
          {i18n.t('groups.myGroups')}
        </Text>
      </View>
    );

    return (
      <FlatList
        data={list.entities.slice()}
        renderItem={this.renderItem}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        keyExtractor={(item) => item.rowKey}
        onRefresh={this.refresh}
        refreshing={list.refreshing}
        onEndReached={this.loadMore}
        // onEndReachedThreshold={0}
        style={[styles.list, ThemedStyles.style.backgroundSecondary]}
        initialNumToRender={12}
        removeClippedSubviews={true}
      />
    );
  }

  /**
   * Get list's footer
   */
  getFooter() {
    if (this.props.groups.loading && !this.props.groups.list.refreshing) {
      return (
        <View style={[CS.centered, CS.padding3x]}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    if (!this.props.groups.list.errorLoading) return null;

    const message = this.props.groups.list.entities.length
      ? i18n.t('cantLoadMore')
      : i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.loadMoreForce} />;
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  list: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 0,
  },
});
