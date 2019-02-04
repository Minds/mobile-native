import React, {
    Component,
    Fragment
} from 'react';

import {
    StyleSheet,
    Platform,
    Text,
    FlatList,
    Animated,
    View,
    TouchableHighlight,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal'

import {
  observer,
  inject
} from 'mobx-react/native'

import _ from 'lodash';

import DiscoveryTile from './DiscoveryTile';
import DiscoveryUser from './DiscoveryUser';
import Activity from '../newsfeed/activity/Activity';
import SearchView from '../common/components/SearchView';
import CenteredLoading from '../common/components/CenteredLoading';
import { CommonStyle as CS } from '../styles/Common';
import colors from '../styles/Colors';
import BlogCard from '../blogs/BlogCard';
import stores from '../../AppStores';
import CaptureFab from '../capture/CaptureFab';
import { MINDS_CDN_URI } from '../config/Config';
import ErrorLoading from '../common/components/ErrorLoading';
import TagsSubBar from '../newsfeed/topbar/TagsSubBar';

const isIos = Platform.OS === 'ios';

/**
 * Discovery screen
 */
@inject('discovery', 'channel')
@observer
export default class DiscoveryScreen extends Component {

  col = 3;
  iconSize = 26;
  headerIsShown = true;

  state = {
    active: false,
    searching: false,
    itemHeight: 0,
    currentSearchParam: void 0,
    q: ''
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="search" size={24} color={tintColor} />
    ),
    tabBarOnPress: ({ navigation, defaultHandler }) => {
      // tab button tapped again?
      if (navigation.isFocused()) {
        stores.discovery.refresh();
        return;
      }
      defaultHandler();
    }
  }

  /**
   * On component react
   */
  componentWillReact() {
    if (!this.headerIsShown && this.props.discovery.list.refreshing) {
      this.showHeader();
    }
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    this._loadData();

    // load data on enter
    this.disposeEnter = this.props.navigation.addListener('didFocus', (s) => {
      setTimeout(() => {
        this.setState({active: true});
      }, 50);
    });

    // clear data on leave
    this.disposeLeave = this.props.navigation.addListener('didBlur', (s) => {
      setTimeout(() => {
        this.setState({active: false});
      }, 50);
    });

    const params = this.props.navigation.state.params;
    if (params && params.type)
      this.props.discovery.setType(params.type);
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

    const params = nextProps.navigation.state.params;
    if (params && params.type)
      this.props.discovery.setType(params.type);
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
    this.disposeEnter.remove();
    this.disposeLeave.remove();
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
   * On viewable items change in the list
   */
  onViewableItemsChanged = (change) => {
    if (this.props.discovery.type == 'images' && isIos) {
      change.changed.forEach(c => {
        if (c.item.gif) {
          c.item.setVisible(c.isViewable);
        }
      })
    }
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
      case 'channels':
        renderRow = this.renderUser;
        this.cols = 1;
        break;
      case 'groups':
        renderRow = this.renderGroup;
        this.cols = 1;
        break;
      case 'activity':
        renderRow = this.renderActivity;
        this.cols = 1;
        break;
      case 'blogs':
        renderRow = this.renderBlog;
        this.cols = 1;
        break;
      default:
        renderRow = this.renderTile;
        columnWrapperStyle = { height: this.state.itemHeight };
        getItemLayout = this.getItemLayout;
        break;
    }

    const footer = this.getFooter();

    body = (
      <FlatList
        onLayout={this.onLayout}
        key={'discofl' + this.cols} // we need to force component redering if we change cols
        data={list.entities.slice()}
        renderItem={renderRow}
        ListFooterComponent={footer}
        ListHeaderComponent={this.getHeaders()}
        stickyHeaderIndices={[0]}
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
        onViewableItemsChanged={this.onViewableItemsChanged}
        onScroll={ this.animateHeader }
        scrollEventThrottle={25}
      />
    )

    return (
      <View style={[CS.flexContainer, CS.backgroundWhite]}>
        {body}
        <CaptureFab navigation={this.props.navigation} />
      </View>
    );
  }

  /**
   * Handle scroll to hidde/show header
   */
  animateHeader = (e) => {
    if (e.nativeEvent.contentOffset.y < 100) return this.showHeader();
    const currentOffset = e.nativeEvent.contentOffset.y;
    const dif = currentOffset - (this.offset);

    this.offset = currentOffset;

    if (Math.abs(dif) < 3) {
      return;
    } else if (dif < 0) {
      this.showHeader();
    } else {
      this.hideHeader();
    }
  }

  /**
   * Show header
   */
  showHeader() {
    if (this.headerIsShown) return;
    this.headerView.slideInDown(400);
    this.headerIsShown = true;
  }

  /**
   * Hide header
   */
  hideHeader() {
    if (!this.headerIsShown) return;
    this.headerView.slideOutUp(1000);
    this.headerIsShown = false;
    Keyboard.dismiss();
  }

  /**
   * Header view ref handler
   */
  handleViewRef = ref => this.headerView = ref;

  /**
   * Get header
   */
  getHeaders() {
    const discovery = this.props.discovery;
    const navigation = (
      <View style={styles.navigation}>

        <TouchableHighlight style={ styles.iconContainer } onPress={ () => discovery.setType('channels') } underlayColor='#fff'>
          <Icon
            name="people"
            style={[styles.icon, discovery.type == 'channels' ? styles.iconActive : null ]}
            size={ this.iconSize }
          />
        </TouchableHighlight>
        <TouchableHighlight style={ styles.iconContainer } onPress={ () => discovery.setType('videos') } underlayColor='#fff'>
          <Icon
            name="videocam"
            style={[styles.icon, discovery.type == 'videos' ? styles.iconActive : null ]}
            size={ this.iconSize
            }/>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.iconContainer } onPress={ () => discovery.setType('images') } underlayColor='#fff'>
          <IonIcon
            name="md-photos"
            style={[styles.icon, discovery.type == 'images' ? styles.iconActive : null ]}
            size={ this.iconSize }/>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.iconContainer } onPress={ () => discovery.setType('blogs') } underlayColor='#fff'>
          <Icon
            name="subject"
            style={[styles.icon, discovery.type == 'blogs' ? styles.iconActive : null ]}
            size={ this.iconSize }
            />
        </TouchableHighlight>
        <TouchableHighlight style={ styles.iconContainer } onPress={ () => discovery.setType('groups') } underlayColor='#fff'>
          <Icon
            name="group-work"
            style={[styles.icon, discovery.type == 'groups' ? styles.iconActive : null ]}
            size={ this.iconSize }
            />
        </TouchableHighlight>
      </View>
    );

    const iconRight = discovery.searchtext ?
      'md-close-circle' :
      (discovery.type == 'channels') ?
        <Text style={styles.lastVisited} onPress={this.showLastChannels}>Visited</Text> :
        null;


    const headerBody = discovery.type != 'lastchannels' ?
      <Fragment>
        <SearchView
          placeholder={`Search ${discovery.type}...`}
          onFocus={this.searchFocus}
          onBlur={this.searchBlur}
          onChangeText={this.setQ}
          value={this.state.q}
          iconRight={ iconRight }
          iconRightOnPress={this.clearSearch}
        />
        {!discovery.searchtext && <TagsSubBar onChange={this.onTagSelectionChange}/>}
      </Fragment> :
      <Text style={[CS.fontM, CS.backgroundPrimary, CS.colorWhite, CS.textCenter, CS.padding]}>Recently visited</Text>;

    return (
      <Animatable.View ref={this.handleViewRef} style={[CS.shadow, CS.backgroundWhite, CS.paddingBottom]} useNativeDriver={true}>
        {navigation}
        {headerBody}
      </Animatable.View>
    )
  }

  onTagSelectionChange = () => {
    this.props.discovery.reload();
  }

  /**
   * Get list footer
   */
  getFooter() {
    const discovery = this.props.discovery;

    if (discovery.loading && !discovery.list.refreshing) {
      return (
        <View style={{ flex:1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }

    if (!discovery.list.errorLoading) return null;

    const message = discovery.list.entities.length ?
      "Can't load more" :
      "Can't connect";

    return <ErrorLoading message={message} tryAgain={this.tryAgain}/>
  }

  tryAgain = () => {
    if (this.state.searching) {
      this.props.discovery.search(this.props.discovery.searchtext);
    } else {
      this.loadFeed(null, true);
    }
  }

  searchFocus = async () => {
    this.setState({ searching: true });
  }

  /**
   * Show recently visited channel
   */
  showLastChannels = async() => {
    const list = await this.props.channel.lastVisited.first(10)

    if (!list.length) return;
    this.props.discovery.setType('lastchannels');
    this.props.discovery.list.clearList();
    this.props.discovery.list.setList({entities: list});
  }

  searchBlur = () => {
    if (!this.props.discovery.searchtext) {
      this.setState({ searching: false });
    }
  }

  /**
   * ClearSearch
   */
  clearSearch = () => {
    this.setState({
      q: '',
      searching: false,
    });
    this.setQ('');
    Keyboard.dismiss();
  }

  /**
   * Search debouncer
   */
  searchDebouncer = _.debounce((text) => {
    this.props.discovery.search(text);
  }, 350);

  /**
   * Set search query
   */
  setQ = q => {
    this.setState({ q, currentSearchParam: q });
    this.searchDebouncer(q);
  };

  /**
   * Load feed data
   */
  loadFeed = (e, force = false) => {
    if (
      this.props.discovery.type == 'lastchannels' ||
      (this.props.discovery.list.errorLoading && !force)
    ) {
      return;
    }
    this.props.discovery.loadList();
  }

  /**
   * Refresh feed data
   */
  refresh = async() => {
    if (this.props.discovery.type == 'lastchannels')
      return;
    await this.props.discovery.refresh();
  }

  /**
   * Render a tile
   */
  renderTile = (row) => {
    if (!this.state.active && row.item.gif) {
      return <View style={{ height: this.state.itemHeight, width: this.state.itemHeight, backgroundColor: colors.dark }}/>;
    }
    return (
      <DiscoveryTile entity={row.item} size={this.state.itemHeight} navigation={this.props.navigation}/>
    );
  }

  /**
   * Render user row
   */
  renderUser = (row) => {
    return (
      <DiscoveryUser store={this.props.discovery.stores['channels']} entity={row} navigation={this.props.navigation} hideButtons={this.props.discovery.type == 'lastchannels'} />
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
    this.props.navigation.push('GroupView', { group: group })
  }
}

const styles = StyleSheet.create({
  searchIcon: {
    padding: 17,
    width: 50
    //backgroundColor: '#EEE'
  },
	listView: {
    backgroundColor: '#FFF',
    flex: 1,
    // marginLeft: -1,
    // marginRight: -1,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    flex: 1,

    ...Platform.select({
      android: {
        paddingTop: 5,
        paddingBottom: 5,
      },
    }),
  },
  lastVisited: {
    right:10,
    position: 'absolute',
    color:colors.primary,
    fontSize:13,
    top: 14
  },
  iconContainer: {
    flex: 1,
    padding: 8,
  },
  icon: {
    alignSelf: 'center',
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
