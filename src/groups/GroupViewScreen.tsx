//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';

import { observer, inject } from 'mobx-react';

import { Icon } from 'react-native-elements';

import { truncate } from 'lodash';

import * as entities from 'entities';
import GroupUser from './GroupUser';
import Tags from '../common/components/Tags';
import CaptureFab from '../capture/CaptureFab';
import GroupHeader from './header/GroupHeader';
import CenteredLoading from '../common/components/CenteredLoading';
import i18n from '../common/services/i18n.service';
import FeedList from '../common/components/FeedList';
import {
  FLAG_CREATE_POST,
  FLAG_APPOINT_MODERATOR,
  FLAG_VIEW,
} from '../common/Permissions';
import ThemedStyles from '../styles/ThemedStyles';
import sessionService from '../common/services/session.service';
import ExplicitOverlay from '../common/components/explicit/ExplicitOverlay';
import CommentBottomSheet from '../comments/v2/CommentBottomSheet';
import ActivityModel from '../newsfeed/ActivityModel';
import BottomSheetModal from '../common/components/bottom-sheet/BottomSheetModal';
import MenuItem, {
  MenuItemProps,
} from '../common/components/bottom-sheet/MenuItem';

export const GroupContext = React.createContext(null);

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
    conversationIsOpen: false,
  };

  commentsRef;

  actionSheetRef = React.createRef();

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.commentsRef = React.createRef();
    this.props.groupView.reset();
  }

  /**
   * Load initial data
   */
  async initialLoad() {
    const params = this.props.route.params;

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

    // check permissions
    if (!this.props.groupView.group.can(FLAG_VIEW, true)) {
      this.props.navigation.goBack();
      return;
    }

    this.props.groupView.group.sendViewed('single');

    this.props.groupView.loadTopMembers();

    if (this.props.route.params && this.props.route.params.focusedUrn) {
      setTimeout(() => {
        this.openComments();
      }, 300);
    }
  }

  /**
   * Prepend new posts
   */
  prepend = (entity: ActivityModel) => {
    if (entity.containerObj?.guid === this.props.groupView.group.guid) {
      this.props.groupView.prepend(entity);
    }
  };

  componentDidMount() {
    const params = this.props.route.params;

    // load data async
    this.initialLoad();

    ActivityModel.events.on('newPost', this.prepend);

    if (params.tab && this.headerRef) {
      this.headerRef.onTabChange(params.tab);
    }
  }

  componentDidUpdate() {
    if (this.moveToTab && this.headerRef) {
      this.headerRef.onTabChange(this.moveToTab);
      this.moveToTab = '';
    }
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    ActivityModel.events.removeListener('newPost', this.prepend);
    this.props.groupView.clear();
    if (this.disposeEnter) {
      this.disposeEnter();
    }
  }

  /**
   * Load subs data
   */
  loadMembers = () => {
    this.props.groupView.loadMembers();
  };

  /**
   * Refresh subs data
   */
  refresh = () => {
    this.props.groupView.memberRefresh();
  };

  headerRefHandler = ref => (this.headerRef = ref);

  getBackIcon() {
    return (
      <SafeAreaView style={styles.gobackicon}>
        <Icon
          raised
          style={ThemedStyles.style.colorLink}
          size={22}
          name="arrow-back"
          onPress={() => this.props.navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  getList() {
    const group = this.props.groupView;

    const header = (
      <View>
        <GroupHeader
          store={this.props.groupView}
          me={this.props.user.me}
          styles={styles}
          ref={this.headerRefHandler}
          navigation={this.props.navigation}
          onPressComment={this.openComments}
        />
        {this.getBackIcon()}
      </View>
    );
    switch (group.tab) {
      case 'feed':
        return (
          <FeedList
            feedStore={group.feed}
            header={header}
            navigation={this.props.navigation}
            onScrollBeginDrag={() =>
              this.props.groupView.setShowPosterFab(false)
            }
            onMomentumScrollEnd={() =>
              this.props.groupView.setShowPosterFab(true)
            }
          />
        );
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
            style={ThemedStyles.style.bgPrimaryBackground}
            // onEndReachedThreshold={0}
            initialNumToRender={12}
            removeClippedSubviews={false}
          />
        );
      case 'desc':
        const description = entities
          .decodeHTML(group.group.briefdescription)
          .trim();
        return (
          <ScrollView style={ThemedStyles.style.bgPrimaryBackground}>
            {header}
            <View style={ThemedStyles.style.padding3x}>
              <Tags
                navigation={this.props.navigation}
                style={ThemedStyles.style.fontL}>
                {description}
              </Tags>
            </View>
          </ScrollView>
        );
    }
  }

  closeMemberMenu = () => this.actionSheetRef.current?.dismiss();

  /**
   * Member menu on press
   */
  memberMenuPress = member => {
    const group = this.props.groupView.group;
    const memberActions: Array<MenuItemProps> = [];
    const imOwner = group['is:owner'];
    const imModerator = group['is:moderator'];

    if (imOwner) {
      if (member['is:owner']) {
        memberActions.push({
          title: i18n.t('groups.removeOwner'),
          iconName: 'delete',
          iconType: 'material-community',
          onPress: () => {
            this.closeMemberMenu();
            this.props.groupView.revokeOwner(this.state.member);
          },
        });
      } else if (!member['is:moderator']) {
        memberActions.push({
          title: i18n.t('groups.makeOwner'),
          iconName: 'person-circle-outline',
          iconType: 'ionicon',
          onPress: () => {
            this.closeMemberMenu();
            this.props.groupView.makeOwner(this.state.member);
          },
        });
        if (group.can(FLAG_APPOINT_MODERATOR)) {
          memberActions.push({
            title: i18n.t('groups.makeModerator'),
            iconName: 'add-moderator',
            iconType: 'material',
            onPress: () => {
              this.closeMemberMenu();
              this.props.groupView.makeModerator(this.state.member);
            },
          });
        }
      } else {
        if (group.can(FLAG_APPOINT_MODERATOR)) {
          memberActions.push({
            title: i18n.t('groups.removeModerator'),
            iconName: 'remove-moderator',
            iconType: 'material',
            onPress: () => {
              this.closeMemberMenu();
              this.props.groupView.removeModerator(this.state.member);
            },
          });
        }
      }
    }

    if (
      (imOwner || imModerator) &&
      !member['is:owner'] &&
      !member['is:moderator']
    ) {
      memberActions.push({
        title: i18n.t('groups.kick'),
        iconName: 'exit-outline',
        iconType: 'ionicon',
        onPress: () => {
          this.closeMemberMenu();
          Alert.alert(i18n.t('confirm'), i18n.t('groups.confirmKick'), [
            { text: i18n.t('no'), style: 'cancel' },
            {
              text: i18n.t('yes'),
              onPress: () => this.props.groupView.kick(this.state.member),
            },
          ]);
        },
      });
      memberActions.push({
        title: i18n.t('groups.ban'),
        iconName: 'prohibited',
        iconType: 'foundation',
        onPress: () => {
          this.closeMemberMenu();
          Alert.alert(i18n.t('confirm'), i18n.t('groups.banConfirm'), [
            { text: i18n.t('no'), style: 'cancel' },
            {
              text: i18n.t('yes'),
              onPress: () => this.props.groupView.ban(this.state.member),
            },
          ]);
        },
      });
    }

    this.setState(
      {
        memberActions,
        member,
      },
      () => {
        this.actionSheetRef.current?.present();
      },
    );
  };

  /**
   * Open comments popup
   */
  openComments = () => {
    this.setState({ conversationIsOpen: true });
    this.commentsRef.current?.expand();
  };

  onChange = (isOpen: number) => {
    this.setState({ conversationIsOpen: isOpen === 1 });
  };

  /**
   * Render user row
   */
  renderRow = row => {
    return (
      <GroupUser
        store={this.props.groupView}
        row={row}
        navigation={this.props.navigation}
        onRightIconPress={this.memberMenuPress}
        isOwner={this.props.groupView.group['is:owner']}
        isModerator={this.props.groupView.group['is:moderator']}
      />
    );
  };

  /**
   * Render
   */
  render() {
    const group = this.props.groupView.group;

    if (!group) {
      return <CenteredLoading />;
    }

    // check async update of permissions
    if (!group.can(FLAG_VIEW, true)) {
      this.props.navigation.goBack();
      return null;
    }

    const showPosterFab =
      this.props.groupView.tab === 'feed' &&
      group.can(FLAG_CREATE_POST) &&
      !this.state.conversationIsOpen;

    const memberActionSheet = this.state.memberActions ? (
      <BottomSheetModal
        key={`sheet${this.state.memberActions.length}`}
        ref={this.actionSheetRef}
        title={truncate(this.state.member.name, {
          length: 25,
          separator: ' ',
        })}>
        {this.state.memberActions.map((o, i) => (
          <MenuItem {...o} key={i} />
        ))}
      </BottomSheetModal>
    ) : null;

    const theme = ThemedStyles.style;

    if (
      !sessionService.getUser().mature &&
      group &&
      group.guid !== sessionService.guid &&
      group.nsfw &&
      group.nsfw.length > 0 &&
      !group.mature_visibility
    ) {
      return (
        <View
          style={[
            theme.bgSecondaryBackground,
            theme.flexContainer,
            theme.justifyCenter,
          ]}>
          <ExplicitOverlay entity={group} text={group.name} />
          {this.getBackIcon()}
        </View>
      );
    }

    return (
      <View style={[theme.flexContainer, theme.bgSecondaryBackground]}>
        <GroupContext.Provider value={this.props.groupView.group}>
          {this.getList()}
          {showPosterFab && (
            <CaptureFab
              visible={this.props.groupView.showPosterFab}
              navigation={this.props.navigation}
              group={group}
              route={this.props.route}
            />
          )}
          {memberActionSheet}
          {this.props.groupView.comments && (
            <CommentBottomSheet
              title={i18n.t('conversation')}
              ref={this.commentsRef}
              hideContent={!this.state.conversationIsOpen}
              commentsStore={this.props.groupView.comments}
              onChange={this.onChange}
            />
          )}
        </GroupContext.Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gobackicon: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 40,
    width: 40,
  },
  headertextcontainer: {
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  namecol: {
    flex: 1,
    justifyContent: 'center',
  },
  namecontainer: {
    flexDirection: 'row',
    flex: 1,
  },
  buttonscol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 100,
    alignSelf: 'flex-end',
  },
  carouselcontainer: {
    flex: 1,
    paddingBottom: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    height: 170,
  },
  briefdescription: {
    fontSize: 12,
    paddingTop: 25,
    paddingBottom: 20,
    color: '#919191',
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
    fontSize: 10,
  },
  countervalue: {
    paddingTop: 5,
    fontWeight: 'bold',
  },
  avatarContainer: {
    paddingLeft: 135,
    paddingTop: 5,
    height: 60,
    flexDirection: 'row',
  },
  avatar: {
    height: 110,
    width: 110,
    borderWidth: 3,
    borderRadius: 55,
  },
  userAvatar: {
    borderRadius: 17,
    height: 34,
    width: 34,
    margin: 4,
    borderWidth: 2,
    marginLeft: -18,
  },
});
