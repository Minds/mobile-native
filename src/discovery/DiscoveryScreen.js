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
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import DiscoveryTile from './DiscoveryTile';
import DiscoveryUser from './DiscoveryUser';
import Activity from '../newsfeed/activity/Activity';
import SearchView from '../common/components/SearchView';
import CenteredLoading from '../common/components/CenteredLoading';
import debounce from '../common/helpers/debounce';

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

  componentWillMount() {
    const params = this.props.navigation.state.params;
    const q = (params) ? params.q : false;

    if (q) {
      this.props.discovery.search(q);
    } else {
      this.loadFeed();
    }
  }

  render() {
    let body;
    if (!this.props.discovery.list.loaded) {
      body = <CenteredLoading />
    } else {
      let renderRow;
      let cols = 3;
      switch (this.props.discovery.type) {
        case 'user':
          renderRow = this.renderUser;
          cols = 1;
          break;
        case 'activity':
          renderRow = this.renderActivity;
          cols = 1;
          break;
        default:
          renderRow = this.renderTile;
          break;
      }
      body = (
        <FlatList
          key={'discofl' + cols} // we need to force component redering if we change cols
          data={this.props.discovery.list.entities.slice()}
          renderItem={renderRow}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          refreshing={this.props.discovery.list.refreshing}
          onEndReached={this.loadFeed}
          onEndThreshold={0}
          initialNumToRender={15}
          style={styles.listView}
          numColumns={cols}
          horizontal={false}
        />
      )
    }

    return (
      <View style={{flex:1}}>
        <SearchView
          placeholder='search...'
          onChangeText={this.searchDebouncer}
        />
        {body}
      </View>
    );
  }

  searchDebouncer = debounce((text) => {
    this.props.discovery.search(text);
  }, 300);

  /**
   * Load feed data
   */
  loadFeed = () => {
    console.log('load');
    this.props.discovery.loadList();
  }

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.props.discovery.list.refresh()
  }
  /**
   * Render a tile
   */
  renderTile = (row) => {
    return (
      <DiscoveryTile entity={row} navigation={this.props.navigation}/>
    );
  }
  /**
   * Render user row
   */
  renderUser = (row) => {
    return (
      <DiscoveryUser entity={row} navigation={this.props.navigation} />
    );
  }
  /**
   * Render activity
   */
  renderActivity = (row) => {
    return (
      <Activity entity={row.item} navigation={this.props.navigation} />
    );
  }
}

const styles = StyleSheet.create({
	listView: {
    backgroundColor: '#FFF',
    flex:1
  }
});