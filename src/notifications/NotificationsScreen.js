import React, { Component } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { observer, inject } from 'mobx-react/native'
import Icon from 'react-native-vector-icons/Ionicons';

import Notification from './notification/Notification';

@inject('notificationsStore')
@observer
export default class NotificationsScreen extends Component {

  render() {
    return (
      <FlatList
        data={this.props.notificationsStore.entities}
        renderItem={this.renderRow}
        keyExtractor={item => item.guid}
        onRefresh={() => this.props.notificationsStore.refresh()}
        refreshing={this.props.notificationsStore.refreshing}
        onEndReached={() => this.props.notificationsStore.loadFeed()}
        onEndThreshold={0.3}
        style={styles.listView}
      />
    );
  }

  // Should be unessesary with MobX because the component is a observer and only is rerendered again on state change
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps == this.props && nextState == this.state)
  //     return false;
  //   return true;
  // }

  renderRow(row) {
    const entity = row.item;
    return (
      <Notification entity={entity}>
      </Notification>
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