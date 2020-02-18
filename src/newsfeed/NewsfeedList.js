import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { inject, observer } from 'mobx-react'
import MIcon from 'react-native-vector-icons/MaterialIcons';

import Activity from './activity/Activity';
import TileElement from './TileElement';
import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import ErrorLoading from '../common/components/ErrorLoading';
import ErrorBoundary from '../common/components/ErrorBoundary';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * News feed list component
 */
@inject('user')
@observer
export default class NewsfeedList extends Component {

  nextBoostedId = 1;
  viewOpts = {
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 300
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
  componentWillMount() {
    this.nextBoostedId = 1;
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

    const {
      newsfeed,
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

    if (newsfeed.isTiled) {
      renderRow = renderTileActivity || this.renderTileActivity;
      getItemLayout  = this.getItemLayout;
    } else {
      renderRow = renderActivity || this.renderActivity;
      getItemLayout  = null;
    }

    // empty view
    if (newsfeed.list.loaded && !newsfeed.list.refreshing) {
      if (emptyMessage) {
        empty = emptyMessage;
      } else if (newsfeed.filter == 'subscribed') {
        if (me && me.hasBanner && !me.hasBanner()) { //TODO: check for avatar too
          design = <Text
            style={ComponentsStyle.emptyComponentLink}
            onPress={() => navigation.push('Channel', { username: 'me' })}
            >
           {i18n.t('newsfeed.designYourChannel')}
          </Text>
        }

        empty = (
          <View style={ComponentsStyle.emptyComponentContainer}>
            <View style={ComponentsStyle.emptyComponent}>
              <MIcon name="home" size={72} color='#444' />
              <Text style={ComponentsStyle.emptyComponentMessage}>{i18n.t('newsfeed.empty')}</Text>
              {design}
              <Text
                style={ComponentsStyle.emptyComponentLink}
                onPress={() => navigation.navigate('Capture')}
              >
                {i18n.t('createAPost')}
              </Text>
              <Text
                style={ComponentsStyle.emptyComponentLink}
                onPress={() => navigation.navigate('Discovery', { type: 'channels' })}
              >
                {i18n.t('findChannels')}
              </Text>
            </View>
          </View>);
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
    const theme = ThemedStyles.style;

    return (
      <ListComponent
        key={(newsfeed.isTiled ? 't' : 'f')}
        onLayout={this.onLayout}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        data={newsfeed.list.entities.slice()}
        renderItem={renderRow}
        keyExtractor={this.keyExtractor}
        onRefresh={this.refresh}
        refreshing={newsfeed.list.refreshing}
        onEndReached={this.loadFeed}
        // onEndReachedThreshold={0}
        numColumns={newsfeed.isTiled ? 3 : 1}
        style={[theme.flexContainer, theme.backgroundSecondary]}
        initialNumToRender={6}
        windowSize={11}
        //getItemLayout={getItemLayout}
        // removeClippedSubviews={true}
        ListEmptyComponent={empty}
        viewabilityConfig={this.viewOpts}
        onViewableItemsChanged={this.onViewableItemsChanged}
        {...passThroughProps}
      />
    );
  }

  /**
   * Key extractor for list items
   */
  keyExtractor = item => item.rowKey;

  /**
   * Get footer
   */
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

  /**
   * Get error loading component
   */
  getErrorLoading()
  {
    const message = this.props.newsfeed.list.entities.length ?
    i18n.t('cantLoadMore') :
    i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.loadFeedForce}/>
  }

  /**
   * On viewable item changed
   */
  onViewableItemsChanged = ({viewableItems}) => {
    viewableItems.forEach((item) => {
      this.props.newsfeed.list.addViewed(item.item);
    });
  }

  /**
   * Load feed data
   */
  loadFeed = () => {
    if (this.props.newsfeed.list.errorLoading) return;
    this.props.newsfeed.loadFeed();
  }

  /**
   * Force feed load
   */
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
      <ErrorBoundary message={this.cantShowActivity} containerStyle={CS.hairLineBottom}>
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

