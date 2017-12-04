import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react/native'

import Activity from './activity/Activity';

/**
 * News feed list component
 */
@observer
export default class NewsfeedList extends Component {

  /**
   * Render component
   */
  render() {

    const params = this.props.guid;

    return (
      <FlatList
        ListHeaderComponent={this.props.header}
        data={this.props.newsfeed.entities}
        renderItem={this.renderActivity}
        keyExtractor={item => item.guid}
        onRefresh={() => this.props.newsfeed.refresh(params)}
        refreshing={this.props.newsfeed.refreshing}
        onEndReached={() => this.props.newsfeed.loadFeed(params)}
        onEndThreshold={0.3}
        style={styles.listView}
      />
    );
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