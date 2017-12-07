import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react/native'

import Activity from './activity/Activity';
import Poster from './Poster';

/**
 * News feed list component
 */
@observer
export default class NewsfeedList extends Component {

  /**
   * Render component
   */
  render() {
    return (
      <FlatList
        ListHeaderComponent={<Poster/>}
        data={this.props.newsfeed.entities.slice()}
        renderItem={this.renderActivity}
        keyExtractor={item => item.guid}
        onRefresh={this.refresh}
        refreshing={this.props.newsfeed.refreshing}
        onEndReached={this.loadFeed}
        onEndThreshold={0}
        style={styles.listView}
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
    this.props.newsfeed.refresh(this.props.guid)
  }

  /**
   * Render row
   */
  renderActivity = (row) => {
    const entity = row.item;
    return (
      <View>
        <Activity entity={entity} navigation={this.props.navigation} />
      </View>
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