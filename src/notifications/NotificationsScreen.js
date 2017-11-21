import React, { Component } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { observer, inject } from 'mobx-react/native'
import Icon from 'react-native-vector-icons/Ionicons';

import Notification from './notification/Notification';

@inject('notifications')
@observer
export default class NotificationsScreen extends Component {

  render() {
    return (
      <FlatList
        data={this.props.notifications.entities}
        renderItem={this.renderRow}
        keyExtractor={item => item.guid}
        onRefresh={() => this.props.notifications.refresh()}
        refreshing={this.props.notifications.refreshing}
        onEndReached={() => this.props.notifications.loadFeed()}
        onEndThreshold={0.3}
        style={styles.listView}
      />
    );
  }

  renderRow(row) {
    const entity = row.item;
    return (
      <Notification entity={entity} />
    );
  }

}

const styles = StyleSheet.create({
	listView: {
    backgroundColor: '#FFF',
  },
  row: {
    padding: 16,
  },
});