import React, {
  Component
} from 'react';

import {
  StyleSheet,
  FlatList,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';

import Notification from './notification/Notification';
import NotificationsTopbar from './NotificationsTopbar';

// style
const styles = StyleSheet.create({
  listView: {
    backgroundColor: '#FFF',
  },
  button: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  row: {
    padding: 16,
  },
});

@inject('notifications')
@observer
export default class NotificationsScreen extends Component {
  static navigationOptions = {
    headerRight: <Icon name="ios-options" size={18} color='#444' style={styles.button} />
  }

  render() {
    return (
      <View style={styles.container}>
        <NotificationsTopbar  />
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
      </View>
    );
  }

  renderRow(row) {
    const entity = row.item;
    return (
      <Notification entity={entity} />
    );
  }
}