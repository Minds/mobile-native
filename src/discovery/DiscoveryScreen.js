import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Text,
    FlatList,
    View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal'

import DiscoveryTile from './DiscoveryTile';
import DiscoveryUser from './DiscoveryUser';
import Activity from '../newsfeed/activity/Activity';
import SearchView from '../common/components/SearchView';
import CenteredLoading from '../common/components/CenteredLoading';
import debounce from '../common/helpers/debounce';
import { CommonStyle } from '../styles/Common';

import Toolbar from '../common/components/toolbar/Toolbar';

/**
 * Discovery screen
 */
@inject('discovery', 'navigatorStore')
@observer
export default class DiscoveryScreen extends Component {

  col = 3;

  state = {
    active: false,
    itemHeight: 0,
    isModalVisible: false,
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-search" size={24} color={tintColor} />
    )
  }

  /**
   * On component will mount
   */
  componentWillMount() {

    // load data on enter
    this.disposeEnter = this.props.navigatorStore.onEnterScreen('Discovery',(s) => {
      this._loadData();
    });

    // clear data on leave
    this.disposeLeave = this.props.navigatorStore.onLeaveScreen('Discovery',(s) => {
      this.props.discovery.list.clearList();
    });
  }

  /**
   * Load data
   */
  _loadData() {
    const params = this.props.navigation.state.params;
    const q = (params) ? params.q : false;
    if (q) {
      this.props.discovery.search(q);
    } else {
      this.props.discovery.loadList();
    }
  }

  /**
   * Dispose reactions of navigation store on unmount
   */
  componentWillUnmount() {
    this.disposeEnter();
    this.disposeLeave();
  }

  /**
   * Adjust tiles to 1/cols size
   */
  onLayout = e => {
    const width = e.nativeEvent.layout.width;
    this.setState({
      itemHeight: width / this.cols,
    });
  }

  closeOptionsModal = () => {
    console.log('close');
  }

  /**
   * Calculate item layout for better performance on tiles
   */
  getItemLayout = (data, index) => {
    const { itemHeight } = this.state;
    return { length: itemHeight, offset: itemHeight * index, index };
  }

  /**
   * Render
   */
  render() {
    let body;

    const discovery = this.props.discovery;

    if (!discovery.list.loaded) {
      body = <CenteredLoading />
    } else {
      let renderRow, columnWrapperStyle = null, getItemLayout=null;
      this.cols = 3;
      switch (discovery.type) {
        case 'user':
          renderRow = this.renderUser;
          this.cols = 1;
          break;
        case 'activity':
          renderRow = this.renderActivity;
          this.cols = 1;
          break;
        default:
          renderRow = this.renderTile;
          columnWrapperStyle = { height: this.state.itemHeight };
          getItemLayout = this.getItemLayout;
          break;
      }
      body = (
        <FlatList
          onLayout={this.onLayout}
          key={'discofl' + this.cols} // we need to force component redering if we change cols
          data={discovery.list.entities.slice()}
          renderItem={renderRow}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          refreshing={discovery.list.refreshing}
          onEndReached={this.loadFeed}
          onEndThreshold={0}
          initialNumToRender={12}
          style={styles.listView}
          numColumns={this.cols}
          horizontal={false}
          windowSize={9}
          removeClippedSubviews={true}
          getItemLayout={getItemLayout}
          columnWrapperStyle={columnWrapperStyle}
        />
      )
    }

    const typeOptions = [
      { text: 'Image', icon: 'image', value: 'object/image' },
      { text: 'Video', icon: 'md-videocam', iconType: 'ion', value: 'object/video' },
      { text: 'Channel', icon: 'ios-people', iconType: 'ion', value: 'user' }
    ]

    const filterOptions = [
      { text: 'Trending', icon: 'trending-up', value: 'trending' },
      { text: 'Featured', icon: 'star', value: 'featured' },
    ]

    return (
      <View style={CommonStyle.flexContainer}>
        <Modal
          isVisible={this.state.isModalVisible}
          useNativeDriver={true}
          onBackdropPress={this.hideModal}
          onModalHide={this.onModalHide}
        >
          <View style={[CommonStyle.alignJustifyCenter,{backgroundColor: 'white'}]}>
            <Toolbar options={filterOptions} initial={discovery.filter} onChange={this.onFilterChange}/>
            <Toolbar options={typeOptions} initial={discovery.type} onChange={this.onTypeChange}/>
          </View>
        </Modal>
        <SearchView
          placeholder='search...'
          onChangeText={this.searchDebouncer}
          iconRight={'md-options'}
          iconRightOnPress={this.onPressOptions}
        />
        {body}
      </View>
    );
  }

  onFilterChange = (val) => {
    this.props.discovery.setFilter(val);
  }

  onTypeChange = (val) => {
    this.props.discovery.setType(val);
  }

  onPressOptions = () => {
    this.setState({ isModalVisible: true });
  }

  hideModal = () => {
    this.setState({ isModalVisible: false });
  }

  onModalHide = () => {
  }

  searchDebouncer = debounce((text) => {
    this.props.discovery.search(text);
  }, 300);

  /**
   * Load feed data
   */
  loadFeed = () => {
    this.props.discovery.loadList();
  }

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.props.discovery.refresh()
  }
  /**
   * Render a tile
   */
  renderTile = (row) => {
    return (
      <DiscoveryTile entity={row.item} size={this.state.itemHeight} navigation={this.props.navigation}/>
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
    flex: 1,
    marginLeft: -1,
    marginRight: -1,
  }
});