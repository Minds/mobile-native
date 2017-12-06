import React, {
    Component
} from 'react';

import {
    StyleSheet,
    FlatList,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import DiscoveryTile from './DiscoveryTile';

/**
 * Discovery screen
 */
@inject('discovery')
@observer
export default class DiscoveryScreen extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-search" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <FlatList
        data={this.props.discovery.entities.slice()}
        renderItem={this.renderTile}
        keyExtractor={item => item.guid}
        onRefresh={this.refresh}
        refreshing={this.props.discovery.refreshing}
        onEndReached={this.loadFeed}
        onEndThreshold={0}
        initialNumToRender={15}
        style={styles.listView}
        numColumns={3}
        horizontal={false}
      />
    );
  }

  /**
   * Load feed data
   */
  loadFeed = () => {
    this.props.discovery.loadFeed();
  }

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.props.discovery.refresh()
  }

  renderTile = (row) => {
    return (
      <DiscoveryTile entity={row} navigation={this.props.navigation}/>
    );
  }
}

const styles = StyleSheet.create({
	listView: {
    backgroundColor: '#FFF',
    flex:1
  }
});