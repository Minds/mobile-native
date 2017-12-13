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

import CenteredLoading from '../common/components/CenteredLoading';
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

/**
 * Notification Screen
 */
@inject('notifications')
@observer
export default class NotificationsScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerRight: <Icon name="ios-options" size={18} color='#444' style={styles.button} onPress={() => navigation.navigate('NotificationsSettings')} />
  });

  /**
   * On component mount
   */
  componentWillMount() {
    // reset counter
    this.props.notifications.setUnread(0);
    // initial load
    this.props.notifications.loadList();
  }

  /**
   * On component unmount
   */
  componentWillUnount() {
    // clear data to free memory
    this.props.notifications.list.clearList();
  }

  /**
   * Render screen
   */
  render() {
    let body;

    if (this.props.notifications.list.loaded) {
      body = (
        <FlatList
          data={this.props.notifications.list.entities.slice()}
          renderItem={this.renderRow}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          onEndThreshold={0.1}
          refreshing={this.props.notifications.list.refreshing}
          style={styles.listView}
        />
      )
    } else {
      body = <CenteredLoading/>
    }

    return (
      <View style={styles.container}>
        <NotificationsTopbar  />
        {body}
      </View>
    );
  }

  /**
   * Clear and reload
   */
  refresh = () => {
    this.props.notifications.refresh();
  }

  /**
   * Load more rows
   */
  loadMore = () => {
    this.props.notifications.loadList()
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