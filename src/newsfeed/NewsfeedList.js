import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react/native'

import Activity from './activity/Activity';
import TileElement from './TileElement';

/**
 * News feed list component
 */
@observer
export default class NewsfeedList extends Component {

  nextBoostedId = 1;

  state = {
    itemHeight: 0,
  }

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
   * Adjust tiles to 1/cols size
   */
  onLayout = e => {
    const width = e.nativeEvent.layout.width;
    this.setState({
      itemHeight: width / 3,
    });
  }

  /**
   * Calculate item layout for better performance on tiles
   */
  getItemLayout = (data, index) => {
    const { itemHeight } = this.state;
    return { length: itemHeight, offset: itemHeight * index, index };
  }

  /**
   * Render component
   */
  render() {
    let renderRow, getItemLayout;

    if (this.props.newsfeed.isTiled) {
      renderRow = this.renderTileActivity;
      getItemLayout  = this.getItemLayout;
    } else {
      renderRow = this.renderActivity;
      getItemLayout  = null;
    }

    return (
      <FlatList
        key={(this.props.newsfeed.isTiled ? 't' : 'f')}
        onLayout={this.onLayout}
        ListHeaderComponent={this.props.header}
        data={this.props.newsfeed.list.entities.slice()}
        renderItem={renderRow}
        keyExtractor={item => item.guid + (item.boosted ? this.boostedId:'')}
        onRefresh={this.refresh}
        refreshing={this.props.newsfeed.list.refreshing}
        onEndReached={this.loadFeed}
        onEndThreshold={0}
        numColumns={this.props.newsfeed.isTiled ? 3 : 1}
        style={styles.listView}
        initialNumToRender={6}
        windowSize={11}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
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
   * Render activity
   */
  renderActivity = (row) => {
    const entity = row.item;

    return <Activity
      entity={entity}
      newsfeed={this.props.newsfeed}
      navigation={this.props.navigation}
    />;
  }

  /**
   * Render tile
   */
  renderTileActivity = (row) => {
    const entity = row.item;
    return <TileElement size={this.state.itemHeight} entity={entity} navigation={this.props.navigation} />;
  }
}

const styles = StyleSheet.create({
  listView: {
    //paddingTop: 20,
    backgroundColor: '#FFF',
    flex: 1,
  }
});