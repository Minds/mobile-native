import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Platform,
    Text,
    FlatList,
    View,
    TouchableHighlight,
    Keyboard,
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

import {
  observer,
  inject
} from 'mobx-react/native'

import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Modal from 'react-native-modal'

import DiscoveryTile from './DiscoveryTile';
import DiscoveryUser from './DiscoveryUser';
import Activity from '../newsfeed/activity/Activity';
import SearchView from '../common/components/SearchView';
import CenteredLoading from '../common/components/CenteredLoading';
import debounce from '../common/helpers/debounce';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import BlogCard from '../blogs/BlogCard';

import Toolbar from '../common/components/toolbar/Toolbar';
import CaptureFab from '../capture/CaptureFab';
import { MINDS_CDN_URI } from '../config/Config';


/**
 * Discovery screen
 */
@inject('discovery', 'tabs', 'navigatorStore', 'channel')
@observer
export default class DiscoveryScreen extends Component {

  col = 3;

  state = {
    active: false,
    searching: false,
    itemHeight: 0,
    isModalVisible: false,
    currentSearchParam: void 0,
    q: ''
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="search" size={24} color={tintColor} />
    )
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    this._loadData();

    // load data on enter
    this.disposeEnter = this.props.navigatorStore.onEnterScreen('Discovery',(s) => {
      setTimeout(() => {
        this.setState({active: true});
      }, 50);
    });

    // clear data on leave
    this.disposeLeave = this.props.navigatorStore.onLeaveScreen('Discovery',(s) => {
      setTimeout(() => {
        this.setState({active: false});
      }, 50);
    });

    this.disposeState = this.props.tabs.onState((state) => {
      if (!state.previousScene) return;
      if (state.previousScene.key == "Discovery" && state.previousScene.key == state.scene.route.key) {
        this.props.discovery.refresh();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.navigation) {
      const params = nextProps.navigation.state.params,
        q = params && params.q;

      if (this.state.currentSearchParam !== q) {
        this.setState({ currentSearchParam: q });
        setTimeout(() => this._loadData());
      }
    }
  }

  /**
   * Load data
   */
  _loadData(preload = false) {
    const params = this.props.navigation.state.params,
      q = params && params.q;

    if (q) {
      this.setState({ q });

      return this.props.discovery.search(q);
    } else {
      return this.props.discovery.loadList(false, true);
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
    const list = discovery.list;


    let renderRow, columnWrapperStyle = null, getItemLayout=null;
    this.cols = 3;
    switch (discovery.type) {
      case 'lastchannels':
      case 'user':
        renderRow = this.renderUser;
        this.cols = 1;
        break;
      case 'group':
        renderRow = this.renderGroup;
        this.cols = 1;
        break;
      case 'activity':
        renderRow = this.renderActivity;
        this.cols = 1;
        break;
      case 'object/blog':
        renderRow = this.renderBlog;
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
        data={list.entities.slice()}
        renderItem={renderRow}
        keyExtractor={item => item.rowKey}
        onRefresh={this.refresh}
        refreshing={list.refreshing}
        onEndReached={this.loadFeed}
        onEndThreshold={0}
        initialNumToRender={12}
        style={styles.listView}
        numColumns={this.cols}
        horizontal={false}
        windowSize={9}
        removeClippedSubviews={false}
        getItemLayout={getItemLayout}
        columnWrapperStyle={columnWrapperStyle}
        keyboardShouldPersistTaps={'handled'}
      />
    )

    const navigation = (
      <View style={styles.navigation}>
        <TouchableHighlight style={ styles.iconContainer } onPress={ () => this.props.discovery.setType('user') } underlayColor='#fff'>
          <Icon
            name="people"
            style={[styles.icon, this.props.discovery.type == 'user' ? styles.iconActive : null ]}
            size={ 20 }
          />
        </TouchableHighlight>
        <TouchableHighlight style={ styles.iconContainer } onPress={ () => this.props.discovery.setType('object/video') } underlayColor='#fff'>
          <Icon
            name="videocam"
            style={[styles.icon, this.props.discovery.type == 'object/video' ? styles.iconActive : null ]}
            size={ 20
            }/>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.iconContainer } onPress={ () => this.props.discovery.setType('object/image') } underlayColor='#fff'>
          <IonIcon
            name="md-photos"
            style={[styles.icon, this.props.discovery.type == 'object/image' ? styles.iconActive : null ]}
            size={ 20 }/>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.iconContainer } onPress={ () => this.props.discovery.setType('object/blog') } underlayColor='#fff'>
          <Icon
            name="subject"
            style={[styles.icon, this.props.discovery.type == 'object/blog' ? styles.iconActive : null ]}
            size={ 20 }
            />
        </TouchableHighlight>
        <TouchableHighlight style={ styles.iconContainer } onPress={ () => this.props.discovery.setType('group') } underlayColor='#fff'>
          <Icon
            name="group-work"
            style={[styles.icon, this.props.discovery.type == 'group' ? styles.iconActive : null ]}
            size={ 20 }
            />
        </TouchableHighlight>
      </View>
    );

    const fullSearchBar = this.props.discovery.searchtext || this.props.discovery.type == 'lastchannels';

    return (
      <View style={CommonStyle.flexContainer}>
        <CaptureFab navigation={this.props.navigation} />
        <View style={{ flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#FFF' }}>
          <View style={{ flex: 1 }}>
            <SearchView
              placeholder='Search...'
              onFocus={this.searchFocus}
              onBlur={this.searchBlur}
              onChangeText={this.setQ}
              value={this.state.q}
              iconRight={ fullSearchBar ? 'md-close-circle' : '' }
              iconRightOnPress={this.clearSearch}
            />
          </View>
          {!fullSearchBar && navigation}
        </View>
        {body}
      </View>
    );
  }

  searchFocus = async () => {
    this.setState({ searching: true });

    const list = await this.props.channel.lastVisited.first(10)

    if (!list.length)
      return;

    this.props.discovery.setType('lastchannels');
    this.props.discovery.list.clearList();
    this.props.discovery.list.setList({entities: list});
  }

  searchBlur = () => {
    if (!this.props.discovery.searchtext) {
      this.setState({ searching: false });
    }
  }

  clearSearch = () => {
    this.setState({
      q: '',
      searching: false,
    });
    this.setQ('');
    Keyboard.dismiss();
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

  setQ = q => {
    this.setState({ q, currentSearchParam: q });
    this.searchDebouncer(q);
  };

  /**
   * Load feed data
   */
  loadFeed = () => {
    if (this.props.discovery.type == 'lastchannels')
      return;
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
    if (!this.state.active && row.item.gif) return <View style={{ height: this.state.itemHeight, width: this.state.itemHeight }}/>;
    return (
      <DiscoveryTile entity={row.item} size={this.state.itemHeight} navigation={this.props.navigation}/>
    );
  }
  /**
   * Render user row
   */
  renderUser = (row) => {
    return (
      <DiscoveryUser store={this.props.discovery.stores['user']} entity={row} navigation={this.props.navigation} />
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

  /**
   * Render blog
   */
  renderBlog = (row) => {
    return (
      <View style={styles.blogCardContainer}>
        <BlogCard entity={row.item} navigation={this.props.navigation} />
      </View>
    );
  }

  renderGroup = (row) => {
    const item = row.item;
    return (
      <ListItem
        containerStyle={{ borderBottomWidth: 0 }}
        title={item.name}
        avatar={<Avatar width={40} height={40} rounded source={{ uri: MINDS_CDN_URI + 'fs/v1/avatars/' + item.guid + '/small' }} />}
        subtitle={'Members ' + item['members:count']}
        hideChevron={true}
        onPress={() => this.navigateToGroup(item)}
      />
    )
  }

  navigateToGroup(group) {
    this.props.navigation.navigate('GroupView', { group: group })
  }
}

const styles = StyleSheet.create({
	listView: {
    backgroundColor: '#FFF',
    flex: 1,
    marginLeft: -1,
    marginRight: -1,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
    width: 230,
    ...Platform.select({
      android: {
        paddingTop: 5,
        paddingBottom: 5,
      },
    }),
  },
  iconContainer: {
    flex: 1,
    padding: 12,
  },
  icon: {
    color: '#444'
  },
  iconActive: {
    color: colors.primary,
  },
  blogCardContainer: {
    backgroundColor: '#ececec',
    paddingBottom: 8,
  },
});
