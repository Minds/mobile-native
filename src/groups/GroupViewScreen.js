import React, {
  Component
} from 'react';

import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';

import { Header } from 'react-navigation';

import {
  observer,
  inject
} from 'mobx-react/native'

import ActionSheet from 'react-native-actionsheet';
import { Icon } from 'react-native-elements';

import {truncate} from 'lodash';

import entities from 'entities';
import GroupUser from './GroupUser';
import colors from '../styles/Colors';
import Tags from '../common/components/Tags';
import CaptureFab from '../capture/CaptureFab';
import GroupHeader from './header/GroupHeader';
import { CommonStyle as CS } from '../styles/Common';
import CommentList from '../comments/CommentList';
import NewsfeedList from '../newsfeed/NewsfeedList';
import CenteredLoading from '../common/components/CenteredLoading';
import commentsStoreProvider from '../comments/CommentsStoreProvider';
import i18n from '../common/services/i18n.service';
import featuresService from '../common/services/features.service';
import FeedList from '../common/components/FeedList';

/**
 * Groups view screen
 */
@inject('groupView', 'user')
@observer
export default class GroupViewScreen extends Component {

  /**
   * Indicate if the screen should change to a tab after the first render
   */
  moveToTab = '';

  /**
   * Header reference
   */
  headerRef = null;

  /**
   * State
   */
  state = {
    memberActions: null,
    member: null,
  }

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null,
  }

  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.comments = commentsStoreProvider.get();
  }

  /**
   * On component will mount
   */
  async componentWillMount() {
    const params = this.props.navigation.state.params;

    if (params.group) {
      // load group and update async
      await this.props.groupView.loadGroup(params.group);
      // load feed
      this.props.groupView.loadFeed();
    } else {
      this.props.groupView.setGuid(params.guid);

      // should move to tab after load?
      this.moveToTab = params.tab || '';
      // load group
      await this.props.groupView.loadGroupByGuid(params.guid);
      // load feed
      this.props.groupView.loadFeed();
    }
    this.props.groupView.loadTopMembers();

    this.disposeEnter = this.props.navigation.addListener('didFocus', (s) => {
      const params = this.props.navigation.state.params;
      if (params && params.prepend) {
        this.props.groupView.prepend(params.prepend);
        // we clear the parameter to prevent prepend it again on goBack
        this.props.navigation.setParams({prepend: null});
      }
    });
  }

  componentDidMount() {
    const navParams = this.props.navigation.state.params;

    if (navParams && navParams.prepend) {
      this.props.groupView.prepend(navParams.prepend);
    }

    if (navParams.tab && this.headerRef) {
      this.headerRef.wrappedInstance.onTabChange(navParams.tab)
    }
  }

  componentDidUpdate() {
    if (this.moveToTab && this.headerRef) {
      this.headerRef.wrappedInstance.onTabChange(this.moveToTab);
      this.moveToTab = '';
    }
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.props.groupView.clear();
    this.disposeEnter.remove();
  }

  /**
   * Load subs data
   */
  loadMembers = () => {
    this.props.groupView.loadMembers();
  }

  /**
   * Refresh subs data
   */
  refresh = () => {
    this.props.groupView.memberRefresh();
  }

  headerRefHandler = ref => this.headerRef = ref;

  getList() {
    const group = this.props.groupView;

    const header = (
      <View>
        <GroupHeader store={this.props.groupView} me={this.props.user.me} styles={styles} ref={this.headerRefHandler}/>
        <SafeAreaView style={styles.gobackicon}>
          <Icon raised color={colors.primary} size={22} name='arrow-back' onPress={() => this.props.navigation.goBack()}/>
        </SafeAreaView>
      </View>
    )
    switch (group.tab) {
      case 'feed':

        if (featuresService.has('es-feeds')) {
          return (
            <FeedList
              feedStore={ group.feed }
              header={ header }
              navigation={ this.props.navigation }
            />
          );
        } else {
          return (
            <NewsfeedList
              newsfeed={ group }
              guid={ group.group.guid }
              header={ header }
              navigation={ this.props.navigation }
            />
          );
        }
        break;
      case 'members':
        return (
          <FlatList
            ListHeaderComponent={header}
            data={group.members.entities.slice()}
            renderItem={this.renderRow}
            keyExtractor={item => item.guid}
            onRefresh={this.refresh}
            refreshing={group.members.refreshing}
            onEndReached={this.loadMembers}
            // onEndReachedThreshold={0}
            initialNumToRender={12}
            style={styles.listView}
            removeClippedSubviews={false}
          />
        );
        break;
      case 'conversation':
        return (
          <CommentList
            header={header}
            entity={group.group}
            store={this.comments}
            navigation={this.props.navigation}
            keyboardVerticalOffset = {Header.HEIGHT - 65}
          />
        );
      case 'desc':
        const description = entities.decodeHTML(group.group.briefdescription).trim();
        return (
          <ScrollView style={CS.backgroundLight}>
            {header}
            <View style={CS.padding2x}>
              <Tags navigation={this.props.navigation}>{description}</Tags>
            </View>
          </ScrollView>
        );
        break;
    }
  }

  /**
   * Member menu on press
   */
  memberMenuPress = (member) => {

    const memberActions = [ i18n.t('cancel') ];
    const imOwner = this.props.groupView.group['is:owner'];
    const imModerator = this.props.groupView.group['is:moderator'];

    if (imOwner) {
      if (member['is:owner']) {
        memberActions.push( i18n.t('groups.removeOwner') );
      } else if (!member['is:moderator']) {
        memberActions.push( i18n.t('groups.makeOwner') );
        memberActions.push( i18n.t('groups.makeModerator') );
      } else {
        memberActions.push( i18n.t('groups.removeModerator') );
      }
    }

    if ((imOwner || imModerator) && !member['is:owner'] && !member['is:moderator']) {
      memberActions.push( i18n.t('groups.kick') );
      memberActions.push( i18n.t('groups.ban') );
    }

    this.setState({
      memberActions,
      member
    }, () => {
      this.ActionSheet.show();
    })
  }

  /**
   * Render user row
   */
  renderRow = (row) => {
    return (
      <GroupUser
        store={this.props.groupView}
        entity={row}
        navigation={this.props.navigation}
        onRightIconPress={this.memberMenuPress}
        isOwner={this.props.groupView.group['is:owner']}
        isModerator={this.props.groupView.group['is:moderator']}
      />
     );
  }

  handleSelection = (option) => {
    let selected = this.state.memberActions[option];

    switch (selected) {
      case i18n.t('groups.ban'):
        Alert.alert(
          i18n.t('confirm'),
          i18n.t('groups.banConfirm'),
          [
            { text: i18n.t('no'), style: 'cancel' },
            { text: i18n.t('yes'), onPress: () => this.props.groupView.ban(this.state.member) }
          ]
        );
        break;
      case i18n.t('groups.kick'):
        Alert.alert(
          i18n.t('confirm'),
          i18n.t('groups.confirmKick'),
          [
            { text: i18n.t('no'), style: 'cancel' },
            { text: i18n.t('yes'), onPress: () => this.props.groupView.kick(this.state.member) }
          ]
        );

        break;
      case i18n.t('groups.makeOwner'):
        this.props.groupView.makeOwner(this.state.member);
        break;
      case i18n.t('groups.removeOwner'):
        this.props.groupView.revokeOwner(this.state.member);
        break;
      case i18n.t('groups.makeModerator'):
        this.props.groupView.makeModerator(this.state.member);
        break;
      case i18n.t('groups.removeModerator'):
        this.props.groupView.revokeModerator(this.state.member);
        break;
    }
  }

  /**
   * Render
   */
  render() {
    const group = this.props.groupView.group;

    if (!group) {
      return <CenteredLoading/>
    }

    const memberActionSheet = this.state.memberActions ?
      <ActionSheet
        ref={o => this.ActionSheet = o}
        title={truncate(this.state.member.name, {'length': 25, 'separator': ' '})}
        options={this.state.memberActions}
        onPress={this.handleSelection}
        cancelButtonIndex={0}
      /> :
      null;

    return (
      <View style={CS.flexContainer}>
        {this.props.groupView.tab === 'feed' && <CaptureFab navigation={this.props.navigation} group={group} /> }
        {this.getList()}
        {memberActionSheet}
      </View>
    );
  }
}

const styles = StyleSheet.create({
	listView: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  gobackicon: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 40,
    width: 40,
  },
  headertextcontainer: {
    padding: 8,
    paddingRight: 15,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  namecol: {
    flex: 1,
    justifyContent: 'center'
  },
  namecontainer: {
    flexDirection: 'row',
    flex: 1
  },
  buttonscol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 100,
    alignSelf: 'flex-end'
  },
  carouselcontainer: {
    flex: 1,
    paddingBottom: 20
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    height: 190,
  },
  briefdescription: {
    fontSize: 12,
    paddingTop: 25,
    paddingBottom: 20,
    color: '#919191'
  },
  headercontainer: {
    flex: 1,
    height: 200,
    flexDirection: 'row',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  countertitle: {
    color: '#666',
    fontSize: 10
  },
  countervalue: {
    paddingTop: 5,
    fontWeight: 'bold',
  },
  avatarContainer: {
    paddingLeft: 115,
    height: 60,
    flexDirection: 'row'
  },
  avatar: {
    position: 'absolute',
    left: 15,
    top: 135,
    height: 110,
    width: 110,
    borderRadius: 55
  },
  userAvatar: {
    borderRadius: 15,
    height: 30,
    width: 30,
    margin: 4
  }
});
