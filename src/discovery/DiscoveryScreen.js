import React, {
  Component,
  Fragment
} from 'react';

import {
  StyleSheet,
  Platform,
  Text,
  FlatList,
  Dimensions,
  View,
  TouchableHighlight,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal'

import {
  observer,
  inject
} from 'mobx-react/native'

import _ from 'lodash';

import { CollapsibleHeaderFlatList } from 'react-native-collapsible-header-views';

import DiscoveryTile from './DiscoveryTile';
import DiscoveryUser from './DiscoveryUser';
import Activity from '../newsfeed/activity/Activity';
import SearchView from '../common/components/SearchView';
import CenteredLoading from '../common/components/CenteredLoading';
import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import colors from '../styles/Colors';
import BlogCard from '../blogs/BlogCard';
import stores from '../../AppStores';
import CaptureFab from '../capture/CaptureFab';
import { MINDS_CDN_URI } from '../config/Config';
import ErrorLoading from '../common/components/ErrorLoading';
import TagsSubBar from '../newsfeed/topbar/TagsSubBar';
import GroupsListItem from '../groups/GroupsListItem'
import DiscoveryFilters from './NewsfeedFilters';
import ErrorBoundary from '../common/components/ErrorBoundary';

const isIos = Platform.OS === 'ios';

/**
 * Discovery screen
 */
@inject('discovery', 'channel')
@observer
export default class DiscoveryScreen extends Component {

  cols = 3;
  iconSize = 28;

  state = {
    active: false,
    showFeed: false,
    itemHeight: 0,
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
   * On component will mount
   */
  componentWillMount() {
    this._loadData(false, 24);

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
      this.props.discovery.filters.setType(params.type);
  }

  /**
   * Load data
   */
  _loadData(preload = false, limit = 12) {
    const params = this.props.navigation.state.params,
      q = params && params.q;

    if (q) {
      this.setState({ q });

      return this.props.discovery.search(q);
    } else {
      return this.props.discovery.loadList(false, false, limit);
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
    // calculate the itemHeight for 3 cols only
    if (this.cols === 3) {
      const width = Dimensions.get('window').width
      this.setState({
        itemHeight: width / this.cols,
      });
    }
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
    if (this.props.discovery.filters.type == 'images' && isIos) {
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

    let renderRow, columnWrapperStyle = null;
    this.cols = 3;
    switch (discovery.filters.type) {
      case 'lastchannels':
      case 'channels':
        renderRow = this.renderUser;
        this.cols = 1;
        break;
      case 'groups':
        renderRow = this.renderGroup;
        this.cols = 1;
        break;
      case 'activities':
        renderRow = this.renderActivity;
        this.cols = 1;
        break;
      case 'blogs':
        renderRow = this.renderBlog;
        this.cols = 1;
        break;
      default:
        if (this.state.showFeed === false) {
          renderRow = this.renderTile;
          columnWrapperStyle = { height: this.state.itemHeight };
        } else {
          renderRow = this.renderActivity;
          this.cols = 1;
        }
        break;
    }

    const footer = this.getFooter();

    body = (
      <CollapsibleHeaderFlatList
        onLayout={this.onLayout}
        key={'discofl' + this.cols} // we need to force component redering if we change cols
        data={list.entities.slice(this.state.showFeed)}
        renderItem={renderRow}
        ListFooterComponent={footer}
        CollapsibleHeaderComponent={this.getHeaders()}
        headerHeight={146}
        ListEmptyComponent={this.getEmptyList()}
        keyExtractor={item => item.rowKey}
        onRefresh={this.refresh}
        refreshing={list.refreshing}
        onEndReached={this.loadFeed}
        initialNumToRender={this.cols == 3 ? 12 : 3}
        style={styles.listView}
        numColumns={this.cols}
        horizontal={false}
        windowSize={9}
        removeClippedSubviews={false}
        columnWrapperStyle={columnWrapperStyle}
        keyboardShouldPersistTaps={'handled'}
        // onViewableItemsChanged={this.onViewableItemsChanged} Fix gifs desappear near the top when the header is hidden
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
   * Get empty list
   */
  getEmptyList() {
    if (!this.props.discovery.list.loaded || this.props.discovery.loading || this.props.discovery.list.errorLoading) return null;
    return (
      <View style={ComponentsStyle.emptyComponentContainer}>
        <View style={ComponentsStyle.emptyComponent}>
          <Text style={ComponentsStyle.emptyComponentMessage}>Nothing to show</Text>
        </View>
      </View>
    );
  }

  setTypeActivities = () => this.props.discovery.filters.setType('activities');
  setTypeChannels   = () => this.props.discovery.filters.setType('channels');
  setTypeBlogs      = () => this.props.discovery.filters.setType('blogs');
  setTypeGroups     = () => this.props.discovery.filters.setType('groups');
  setTypeVideos = () => {
    if (this.state.showFeed !== false && this.props.discovery.filters.type === 'videos') {
      return this.setState({showFeed: false});
    }
    this.props.discovery.filters.setType('videos');
  }
  setTypeImages = () => {
    if (this.state.showFeed !== false && this.props.discovery.filters.type === 'images') {
      return this.setState({showFeed: false});
    }
    this.props.discovery.filters.setType('images');
  }

  /**
   * Get header
   */
  getHeaders() {
    const filtersStore = this.props.discovery.filters;
    const navigation = (
      <View style={[styles.navigation]}>

        <TouchableHighlight style={styles.iconContainer} onPress={ this.setTypeActivities } underlayColor='#fff'>
          <View style={CS.columnAlignCenter}>
            <IonIcon
              name="ios-infinite"
              style={[styles.icon, filtersStore.type == 'activities' ? styles.iconActive : null ]}
              size={ this.iconSize }
            />
            <Text numberOfLines={1} style={[CS.fontS, filtersStore.type == 'activities' ? CS.colorPrimary : CS.colorDark]}>All</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.iconContainer} onPress={ this.setTypeChannels } underlayColor='#fff'>
          <View style={CS.columnAlignCenter}>
            <Icon
              name="people"
              style={[styles.icon, filtersStore.type == 'channels' ? styles.iconActive : null ]}
              size={ this.iconSize }
            />
            <Text numberOfLines={1} style={[CS.fontS, filtersStore.type == 'channels' ? CS.colorPrimary : CS.colorDark]}>Channels</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.iconContainer} onPress={ this.setTypeVideos } underlayColor='#fff'>
          <View style={CS.columnAlignCenter}>
            <IonIcon
              name={this.state.showFeed !== false &&  filtersStore.type == 'videos' ? 'md-apps' : 'md-videocam'}
              style={[styles.icon, filtersStore.type == 'videos' ? styles.iconActive : null ]}
              size={this.iconSize}
            />
            <Text numberOfLines={1} style={[CS.fontS, filtersStore.type == 'videos' ? CS.colorPrimary : CS.colorDark]}>Videos</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.iconContainer} onPress={ this.setTypeImages } underlayColor='#fff'>
          <View style={CS.columnAlignCenter}>
            <IonIcon
              name={this.state.showFeed !== false &&  filtersStore.type == 'images' ? 'md-apps' : 'md-photos'}
              style={[styles.icon, filtersStore.type == 'images' ? styles.iconActive : null ]}
              size={ this.iconSize }
            />
            <Text numberOfLines={1} style={[CS.fontS, filtersStore.type == 'images' ? CS.colorPrimary : CS.colorDark]}>Images</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.iconContainer} onPress={ this.setTypeBlogs } underlayColor='#fff'>
          <View style={CS.columnAlignCenter}>
            <Icon
              name="subject"
              style={[styles.icon, filtersStore.type == 'blogs' ? styles.iconActive : null ]}
              size={ this.iconSize }
            />
            <Text numberOfLines={1} style={[CS.fontS, filtersStore.type == 'blogs' ? CS.colorPrimary : CS.colorDark]}>Blogs</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.iconContainer} onPress={ this.setTypeGroups } underlayColor='#fff'>
          <View style={CS.columnAlignCenter}>
            <Icon
              name="group-work"
              style={[styles.icon, filtersStore.type == 'groups' ? styles.iconActive : null ]}
              size={ this.iconSize }
            />
            <Text numberOfLines={1} style={[CS.fontS, filtersStore.type == 'groups' ? CS.colorPrimary : CS.colorDark]}>Groups</Text>
          </View>
        </TouchableHighlight>
      </View>
    );

    const iconRight = filtersStore.searchtext ?
      'md-close-circle' :
      (filtersStore.type == 'channels') ?
        <Text numberOfLines={1} style={styles.lastVisited} onPress={this.showLastChannels}>Visited</Text> :
        null;


    const headerBody = filtersStore.type != 'lastchannels' ?
      <View style={CS.marginBottom}>
        <SearchView
          placeholder={`Search ${filtersStore.type}...`}
          onChangeText={this.setQ}
          value={this.state.q}
          containerStyle={[CS.marginTop, CS.marginBottom]}
          iconRight={ iconRight }
          iconRightOnPress={this.clearSearch}
        />
        <DiscoveryFilters store={this.props.discovery.filters} onTagsChange={this.onTagSelectionChange} onSelectOne={this.onSelectOne}/>
        {/* {!discovery.searchtext && <TagsSubBar onChange={this.onTagSelectionChange}/>} */}
      </View> :
      <Text style={[CS.fontM, CS.backgroundPrimary, CS.colorWhite, CS.textCenter, CS.padding]}>Recently visited</Text>;

    return (
      <View style={[CS.shadow, CS.backgroundWhite]}>
        {navigation}
        {headerBody}
      </View>
    )
  }

  onTagSelectionChange = () => {
    if (this.state.showFeed) {
      this.setState({showFeed: 0});
    }
    this.props.discovery.reload();
  }


  onSelectOne = (tag) => {
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
    if (this.props.discovery.searchtext) {
      this.props.discovery.search(this.props.discovery.searchtext);
    } else {
      this.loadFeed(null, true);
    }
  }

  /**
   * Show recently visited channel
   */
  showLastChannels = async() => {
    const list = await this.props.channel.lastVisited.first(30)

    // if (!list.length) return;
    this.props.discovery.filters.setType('lastchannels');
    this.props.discovery.list.clearList();
    this.props.discovery.list.setList({entities: list});
  }

  /**
   * ClearSearch
   */
  clearSearch = () => {
    this.setQ('');
    Keyboard.dismiss();
  }

  /**
   * Search debouncer
   */
  searchDebouncer = _.debounce((text) => {
    this.props.discovery.filters.search(text);
  }, 350);

  /**
   * Set search query
   */
  setQ = q => {
    this.setState({ q });
    this.searchDebouncer(q);
  };

  /**
   * Load feed data
   */
  loadFeed = (e, force = false) => {
    const type = this.props.discovery.filters.type;
    if (
      this.props.discovery.filters.type == 'lastchannels' ||
      (this.props.discovery.list.errorLoading && !force)
    ) {
      return;
    }

    const limit = this.state.showFeed ? 12 : (type == 'images' || type == 'videos' ? 24 : 12);

    this.props.discovery.loadList(false, false, limit);
  }

  /**
   * Refresh feed data
   */
  refresh = async() => {
    if (this.props.discovery.filters.type == 'lastchannels')
      return;
    await this.props.discovery.refresh();
  }

  /**
   * Render a tile
   */
  renderTile = (row) => {
    // if (!this.state.active && row.item.isGif()) {
    //   return <View style={{ height: this.state.itemHeight, width: this.state.itemHeight, backgroundColor: colors.greyed }}/>;
    // }
    return (
      <ErrorBoundary message="Render error" containerStyle={[CS.centered, {width: this.state.itemHeight, height:this.state.itemHeight}]} textSmall={true}>
        <DiscoveryTile entity={row.item} size={this.state.itemHeight} onPress={() => this.setState({'showFeed': row.index})}/>
      </ErrorBoundary>
    );
  }

  /**
   * Render user row
   */
  renderUser = (row) => {
    return (

      <ErrorBoundary message="Can't show this user" containerStyle={CS.hairLineBottom}>
        <DiscoveryUser store={this.props.discovery.stores['channels']} entity={row} navigation={this.props.navigation} hideButtons={this.props.discovery.filters.type == 'lastchannels'} />
      </ErrorBoundary>
    );
  }

  /**
   * Render activity item
   */
  renderActivity = (row) => {
    return (
      <ErrorBoundary message="Can't show this post" containerStyle={CS.hairLineBottom}>
        <Activity entity={row.item} navigation={this.props.navigation} autoHeight={false} newsfeed={this.props.discovery}/>
      </ErrorBoundary>
    );
  }

  /**
   * Render blog item
   */
  renderBlog = (row) => {
    return (
      <View style={styles.blogCardContainer}>
        <ErrorBoundary message="Can't show this blog" containerStyle={CS.hairLineBottom}>
          <BlogCard entity={row.item} navigation={this.props.navigation} />
        </ErrorBoundary>
      </View>
    );
  }

  /**
   * Render group item
   */
  renderGroup = (row) => {
    const item = row.item;
    return (
      <ErrorBoundary message="Can't show this group" containerStyle={CS.hairLineBottom}>
        <GroupsListItem group={row.item} onPress={() => this.navigateToGroup(row.item)}/>
      </ErrorBoundary>
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
    backgroundColor: '#FFF',
    ...Platform.select({
      android: {
        paddingTop: 2,
        paddingBottom: 2,
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
    paddingVertical: 5,
    height: 50
  },
  icon: {
    alignSelf: 'center',
    color: '#444',
    height: 28
  },
  iconActive: {
    color: colors.primary,
  },
  blogCardContainer: {
    backgroundColor: '#ececec',
    paddingBottom: 8,
  },
});
