import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { inject, observer } from 'mobx-react/native'
import MIcon from 'react-native-vector-icons/MaterialIcons';

import Activity from './activity/Activity';
import TileElement from './TileElement';
import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import ErrorLoading from '../common/components/ErrorLoading';
import ErrorBoundary from '../common/components/ErrorBoundary';

/**
 * News feed list component
 */
@inject('user')
@observer
export default class NewsfeedList extends Component {

  nextBoostedId = 1;
  viewOpts = {
    viewAreaCoveragePercentThreshold: 50
  }
  state = {
    itemHeight: 0,
    viewed: []
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
    let renderRow,
    getItemLayout,
    design,
    empty = null;

    const newsfeed = this.props.newsfeed;
    const me = this.props.user.me;

    if (newsfeed.isTiled) {
      renderRow = this.props.renderTileActivity || this.renderTileActivity;
      getItemLayout  = this.getItemLayout;
    } else {
      renderRow = this.props.renderActivity || this.renderActivity;
      getItemLayout  = null;
    }

    // empty view
    if (newsfeed.list.loaded && !newsfeed.list.refreshing) {
      if (this.props.emptyMessage) {
        empty = this.props.emptyMessage;
      } else if (newsfeed.filter == 'subscribed') {
        if (me && me.hasBanner && !me.hasBanner()) { //TODO: check for avatar too
          design = <Text
            style={ComponentsStyle.emptyComponentLink}
            onPress={() => this.props.navigation.push('Channel', { username: 'me' })}
            >
            Design your channel
          </Text>
        }

        empty = (
          <View style={ComponentsStyle.emptyComponentContainer}>
            <View style={ComponentsStyle.emptyComponent}>
              <MIcon name="home" size={72} color='#444' />
              <Text style={ComponentsStyle.emptyComponentMessage}>Your newsfeed is empty</Text>
              {design}
              <Text
                style={ComponentsStyle.emptyComponentLink}
                onPress={() => this.props.navigation.navigate('Capture')}
                >
                Create a post
              </Text>
              <Text
                style={ComponentsStyle.emptyComponentLink}
                onPress={() => this.props.navigation.navigate('Discovery', { type: 'user' })}
                >
                Find channels
              </Text>
            </View>
          </View>);
      } else {
        empty = (
          <View style={ComponentsStyle.emptyComponentContainer}>
            <View style={ComponentsStyle.emptyComponent}>
              <Text style={ComponentsStyle.emptyComponentMessage}>This feed is empty</Text>
            </View>
          </View>);
      }
    }

    const footer = this.getFooter();

    return (
      <FlatList
        key={(newsfeed.isTiled ? 't' : 'f')}
        onLayout={this.onLayout}
        ListHeaderComponent={this.props.header}
        ListFooterComponent={footer}
        data={newsfeed.list.entities.slice()}
        renderItem={renderRow}
        keyExtractor={item => item.rowKey}
        onRefresh={this.refresh}
        refreshing={newsfeed.list.refreshing}
        onEndReached={this.loadFeed}
        onEndThreshold={0}
        numColumns={newsfeed.isTiled ? 3 : 1}
        style={styles.listView}
        initialNumToRender={6}
        windowSize={11}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        ListEmptyComponent={empty}
        viewabilityConfig={this.viewOpts}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }

  getFooter() {

    if (this.props.newsfeed.loading && !this.props.newsfeed.list.refreshing){
      return (
        <View style={[CS.centered, CS.padding3x]}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    if (this.props.newsfeed.list.errorLoading) {
      return this.getErrorLoading();
    }
    return null;
  }

  getErrorLoading()
  {
    const message = this.props.newsfeed.list.entities.length ?
      "Can't load more" :
      "Can't load the feed";

    return <ErrorLoading message={message} tryAgain={this.loadFeedForce}/>
  }

  onViewableItemsChanged = ({viewableItems}) => {
    viewableItems.forEach((item) => {
      const { isViewable, key } = item;
      if (isViewable ) {
        this.props.newsfeed.addViewed(item.item);
      }
    });
  }

  /**
   * Load feed data
   */
  loadFeed = () => {
    if (this.props.newsfeed.list.errorLoading) return;
    this.props.newsfeed.loadFeed();
  }

  loadFeedForce = () => {
    this.props.newsfeed.loadFeed();
  }

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.nextBoostedId = 1;
    this.props.newsfeed.refresh(true)
  }

  /**
   * Render activity
   */
  renderActivity = (row) => {
    let isLast = this.props.newsfeed.list.entities.length == row.index + 1;
    const entity = row.item;

    return (
      <ErrorBoundary message="Can't show this activity">
        <Activity
          entity={entity}
          newsfeed={this.props.newsfeed}
          navigation={this.props.navigation}
          autoHeight={false}
          isLast={isLast}
        />
      </ErrorBoundary>
    )
  }

  /**
   * Render tile
   */
  renderTileActivity = (row) => {
    const entity = row.item;
    return <TileElement
      size={this.state.itemHeight}
      newsfeed={this.props.newsfeed}
      entity={entity}
      navigation={this.props.navigation}
      />;
  }
}

const styles = StyleSheet.create({
  listView: {
    //paddingTop: 20,
    backgroundColor: '#FFF',
    flex: 1,
  }
});