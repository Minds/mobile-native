//@ts-nocheck
import React, {
  Component
} from 'react';

import {
  StyleSheet,
  FlatList,
  Text,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react'

import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

import CenteredLoading from '../common/components/CenteredLoading';
import formatDate from '../common/helpers/date';
/**
 * Notification Screen
 */
@inject('walletHistory')
@observer
export default class WalletHistoryScreen extends Component {

  /**
   * Render screen
   */
  render() {

    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.walletHistory.list.entities.slice()}
          renderItem={this.renderRow}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          onEndReached={this.loadMore}
          // onEndReachedThreshold={0.05}
          refreshing={this.props.walletHistory.list.refreshing}
          style={styles.listView}
        />
      </View>
    );
  }

  /**
   * Clear and reload
   */
  refresh = () => {
    this.props.walletHistory.refresh();
  }

  /**
   * Load more rows
   */
  loadMore = () => {
    this.props.walletHistory.loadList()
  }

  /**
   * render row
   * @param {object} row
   */
  renderRow(row) {
    const entity = row.item;
    return (
      <View style={{flex:1}}>
        <View style={{flex:1}}>
          <Text style={{
            color: entity.points > 0 ? 'green': 'red',
            fontWeight:'bold',
            fontSize: 28,
            padding: 10
          }}>
            {entity.points > 0 ? '+':''}{entity.points}
          </Text>
        </View>
        <View style={styles.walletHistoryItem}>
          <View style={{flex:1}}>
            <Text>{entity.description}</Text>
          </View>
          <View style={styles.walletItemDetails}>
            <IonIcon color='rgb(96, 125, 139)'  name='ios-clock-outline' size={20} />
            <Text style={{paddingLeft:10}}>{formatDate(entity.time_created)}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  walletHistoryItem: {
    flex:1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  walletItemDetails: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  listView: {
    backgroundColor: '#FFF',
    flex: 1,
  },

});