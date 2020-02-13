import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { inject, observer } from 'mobx-react/native'

import Activity from '../../newsfeed/activity/Activity';
import TileElement from '../../newsfeed/TileElement';
import { CommonStyle as CS } from '../../styles/Common';
import { ComponentsStyle } from '../../styles/Components';
import ErrorLoading from './ErrorLoading';
import ErrorBoundary from './ErrorBoundary';
import i18n from '../services/i18n.service';

/**
 * News feed list component
 */
@observer
export default class FeedList extends Component {

  viewOpts = {
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 300
  }
  state = {
    itemHeight: 0,
    viewed: []
  }

  /**
   * On list mount
   */
  componentWillMount() {
    this.cantShowActivity = i18n.t('errorShowActivity');
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
   * Scroll to top
   * @param {boolean} animated
   */
  scrollToTop(animated = true) {
    this.listRef.scrollToOffset({animated, offset:0});
  }

  /**
   * Set list reference
   */
  setListRef = (r) => this.listRef = r;

  onScroll = e => {
    this.props.feedStore.scrollOffset = e.nativeEvent.contentOffset.y;
  };

  /**
   * Render component
   */
  render() {
    let renderRow,
    design,
    empty = null;

    const {
      feedStore,
      me,
      renderTileActivity,
      renderActivity,
      emptyMessage,
      navigation,
      header,
      listComponent,
      ...passThroughProps
    } = this.props;

    const ListComponent = listComponent || FlatList;

    if (feedStore.isTiled) {
      renderRow = renderTileActivity || this.renderTileActivity;
    } else {
      renderRow = renderActivity || this.renderActivity;
    }

    // empty view
    if (feedStore.loaded && !feedStore.refreshing) {
      if (emptyMessage) {
        empty = emptyMessage;
      } else {
        empty = (
          <View style={ComponentsStyle.emptyComponentContainer}>
            <View style={ComponentsStyle.emptyComponent}>
              <Text style={ComponentsStyle.emptyComponentMessage}>{i18n.t('newsfeed.empty')}</Text>
            </View>
          </View>);
      }
    }

    const footer = this.getFooter();

    return (
      <ListComponent
        ref={this.setListRef}
        key={(feedStore.isTiled ? 't' : 'f')}
        onLayout={this.onLayout}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        data={feedStore.entities.slice()}
        renderItem={renderRow}
        keyExtractor={this.keyExtractor}
        onRefresh={this.refresh}
        refreshing={feedStore.refreshing}
        onEndReached={this.loadMore}
        // onEndReachedThreshold={0}
        numColumns={feedStore.isTiled ? 3 : 1}
        style={styles.listView}
        initialNumToRender={6}
        windowSize={11}
        // removeClippedSubviews={true}
        ListEmptyComponent={empty}
        viewabilityConfig={this.viewOpts}
        onViewableItemsChanged={this.onViewableItemsChanged}
        onScroll={this.onScroll}
        {...passThroughProps}
      />
    );
  }

  /**
   * Key extractor for list items
   */
  keyExtractor = item => item.urn;

  /**
   * Get footer
   */
  getFooter() {

    if (this.props.feedStore.loading && !this.props.feedStore.refreshing){
      return (
        <View style={[CS.centered, CS.padding3x]} testID="ActivityIndicatorView">
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    if (this.props.feedStore.errorLoading) {
      return this.getErrorLoading();
    }
    return null;
  }

  /**
   * Get error loading component
   */
  getErrorLoading()
  {
    const message = this.props.feedStore.entities.length ?
    i18n.t('cantLoadMore') :
    i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.loadFeedForce}/>
  }

  /**
   * On viewable item changed
   */
  onViewableItemsChanged = (change) => {
    change.viewableItems.forEach((item) => {
      this.props.feedStore.addViewed(item.item);
    });
    change.changed.forEach(c => {
      c.item.setVisible(c.isViewable);
    })
  }

  /**
   * Load feed data
   */
  loadMore = () => {
    if (this.props.feedStore.errorLoading) return;
    this.props.feedStore.loadMore();
  }

  /**
   * Force feed load
   */
  loadFeedForce = () => {
    this.props.feedStore.reload();
  }

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.props.feedStore.refresh(true)
  }

  /**
   * Render activity
   */
  renderActivity = (row) => {
    let isLast = this.props.feedStore.entities.length == row.index + 1;
    const entity = row.item;

    return (
      <ErrorBoundary message={this.cantShowActivity} containerStyle={CS.hairLineBottom}>
        <Activity
          entity={entity}
          newsfeed={this.props.feedStore}
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
      newsfeed={this.props.feedStore}
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