import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react/native'

import Activity from './activity/Activity';

/**
 * News feed list component
 */
@observer
export default class NewsfeedList extends Component {

  nextBoostedId = 1;

  get boostedId() {
    return this.nextBoostedId++;
  }

  /**
   * On list mount
   */
  onComponentWillMount() {
    this.nextBoostedId = 1;
  }

  /**
   * Render component
   */
  render() {
    return (
      <FlatList
        ListHeaderComponent={this.props.header}
        data={this.props.newsfeed.list.entities.slice()}
        renderItem={this.renderActivity}
        keyExtractor={item => item.guid + (item.boosted ? this.boostedId:'')}
        onRefresh={this.refresh}
        refreshing={this.props.newsfeed.list.refreshing}
        onEndReached={this.loadFeed}
        onEndThreshold={0}
        style={styles.listView}
        initialNumToRender={6}
        windowSize={11}
        removeClippedSubviews={false}
      />
    );
  }

  /**
   * Load feed data
   */
  loadFeed = () => {
    this.props.newsfeed.loadFeed(this.props.guid);
  }

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.nextBoostedId = 1;
    this.props.newsfeed.refresh(this.props.guid)
  }

  /**
   * Render row
   */
  renderActivity = (row) => {
    const entity = row.item;
    return (
      <Activity entity={entity} newsfeed={this.props.newsfeed} navigation={this.props.navigation} />
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    //paddingTop: 20,
    backgroundColor: '#FFF',
    flex: 1,
  }
});