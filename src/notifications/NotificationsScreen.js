import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import { OptimizedFlatList } from 'react-native-optimized-flatlist';

import NotificationsTabIcon from './NotificationsTabIcon';
import CenteredLoading from '../common/components/CenteredLoading';
import Notification from './notification/Notification';
import NotificationsTopbar from './NotificationsTopbar';
import CaptureFab from '../capture/CaptureFab';
import { CommonStyle } from '../styles/Common';

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
@inject('notifications', 'tabs', 'navigatorStore')
@observer
export default class NotificationsScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <NotificationsTabIcon tintColor={tintColor}/>
    ),
    headerRight: <Icon name="ios-options" size={18} color='#444' style={styles.button} onPress={() => navigation.navigate('NotificationsSettings')} />
  });

  /**
   * On component mount
   */
  componentWillMount() {
    this.disposeEnter = this.props.navigatorStore.onEnterScreen('Notifications', (s) => {
      this.props.notifications.loadList();
      this.props.notifications.setUnread(0);
    });

    this.disposeState = this.props.tabs.onState((state) => {
      if (!state.previousScene) return;
      if (state.previousScene.key == "Notifications" && state.previousScene.key == state.scene.route.key) {
        this.props.notifications.refresh();
      }
    });
  }

  /**
   * On component unmount
   */
  componentWillUnmount() {
    // clear data to free memory
    this.props.notifications.list.clearList();
    this.disposeState();
  }

  /**
   * Render screen
   */
  render() {
    let body;
    const list = this.props.notifications.list;

    if (list.loaded) {
      body = (
        <OptimizedFlatList
          data={list.entities.slice()}
          renderItem={this.renderRow}
          keyExtractor={item => item.rowKey}
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          ListEmptyComponent={!this.props.notifications.loading && <Text style={[CommonStyle.fontXL, CommonStyle.textCenter, CommonStyle.padding2x]}>There are no notifications to load</Text>}
          onEndThreshold={0.05}
          initialNumToRender={12}
          windowSize={8}
          refreshing={list.refreshing}
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
        <CaptureFab navigation={this.props.navigation} />
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
  renderRow = (row) => {
    const entity = row.item;
    return (
      <Notification entity={entity} navigation={this.props.navigation}/>
    );
  }
}