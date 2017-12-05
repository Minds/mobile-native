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

  static navigationOptions = ({ navigation }) => ({
    headerRight: <Icon name="ios-options" size={18} color='#444' style={styles.button} onPress={() => navigation.navigate('NotificationsSettings')} />
  });

  /**
   * reset counter on mount
   */
  componentWillMount() {
    this.props.notifications.setUnread(0);
  }

  render() {
    return (
      <View style={styles.container}>
        <NotificationsTopbar  />
        <FlatList
          data={this.props.notifications.entities}
          renderItem={this.renderRow}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          onEndThreshold={0.3}
          refreshing={this.props.notifications.refreshing}
          style={styles.listView}
        />
      </View>
    );
  }

  /**
  * Clear and reload
  */
  refresh = () => {
    this.props.notifications.loadList(true);
  }

  /**
   * Load more rows
   */
  loadMore = () => {
    // fix to prevent load data twice on initial state
    if (!this.onEndReachedCalledDuringMomentum) {
      this.props.notifications.loadList()
      this.onEndReachedCalledDuringMomentum = true;
    }
  }

  onMomentumScrollBegin = () => {
    this.onEndReachedCalledDuringMomentum = false;
  }

  /**
   * render row
   * @param {object} row
   */
  renderRow(row) {
    const entity = row.item;
    return (
      <Notification entity={entity} />
    );
  }
}