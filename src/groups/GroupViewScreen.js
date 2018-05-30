import React, {
  Component
} from 'react';

import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
  Alert
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import ActionSheet from 'react-native-actionsheet';
import { Icon } from 'react-native-elements';

import {truncate} from 'lodash';

import GroupUser from './GroupUser';
import { MINDS_CDN_URI } from '../config/Config';
import groupsService from './GroupsService';
import GroupHeader from './header/GroupHeader';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import NewsfeedList from '../newsfeed/NewsfeedList';
import CaptureFab from '../capture/CaptureFab';
import CenteredLoading from '../common/components/CenteredLoading';
/**
 * Groups view screen
 */
@inject('groupView', 'user', 'navigatorStore')
@observer
export default class GroupViewScreen extends Component {

  state = {
    memberActions: null,
    member: null,
  }

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    const params = this.props.navigation.state.params;

    if (params.group) {
      this.props.groupView.setGroup(params.group);
      this.props.groupView.loadFeed();
    } else {
      this.props.groupView.setGuid(params.guid)
      this.props.groupView.loadGroup(params.guid);
      this.props.groupView.loadFeed();
    }
  }

  componentDidMount() {
    const navParams = this.props.navigation.state.params;

    if (navParams && navParams.prepend) {
      this.props.groupView.prepend(navParams.prepend);
    }
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.props.groupView.clear();
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

  getList() {
    const group = this.props.groupView;

    const header = (
      <View>
        <GroupHeader store={this.props.groupView} me={this.props.user.me} styles={styles}/>
        <Icon color={colors.primary} containerStyle={styles.gobackicon} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()} raised />
      </View>
    )
    switch (group.tab) {
      case 'feed':
        return (
          <NewsfeedList
            newsfeed={ group }
            guid={ group.group.guid }
            header={ header }
            navigation={ this.props.navigation }
          />
        );
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
            onEndThreshold={0}
            initialNumToRender={12}
            style={styles.listView}
            removeClippedSubviews={false}
          />
        );
        break;
      case 'desc':
        return (
          <ScrollView style={CommonStyle.backgroundLight}>
            {header}
            <View style={CommonStyle.padding2x}>
              <Text>{group.group.briefdescription}</Text>
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

    const memberActions = ['Cancel'];
    const imOwner = this.props.groupView.group['is:owner'];
    const imModerator = this.props.groupView.group['is:moderator'];

    if (imOwner) {
      if (member['is:owner']) {
        memberActions.push('Remove as Owner');
      } else if (!member['is:moderator']) {
        memberActions.push('Make Owner');
        memberActions.push('Make Moderator');
      } else {
        memberActions.push('Remove as Moderator');
      }
    }

    if ((imOwner || imModerator) && !member['is:owner'] && !member['is:moderator']) {
      memberActions.push('Kick');
      memberActions.push('Ban');
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
      case 'Ban':
        Alert.alert(
          'Confirm',
          `Are you sure? You want to ban this user?`,
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes!', onPress: () => this.props.groupView.ban(this.state.member) }
          ]
        );
        break;
      case 'Kick':
        Alert.alert(
          'Confirm',
          `Are you sure? You want to kick this user?`,
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes!', onPress: () => this.props.groupView.kick(this.state.member) }
          ]
        );

        break;
      case 'Make Owner':
        this.props.groupView.makeOwner(this.state.member);
        break;
      case 'Remove as Owner':
        this.props.groupView.revokeOwner(this.state.member);
        break;
        case 'Make Moderator':
        this.props.groupView.makeModerator(this.state.member);
        break;
      case 'Remove as Moderator':
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
      <View style={{flex:1}}>
        <CaptureFab navigation={this.props.navigation} group={group} />
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
    paddingLeft: 15,
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
  countercontainer: {
    paddingLeft: 130,
    height: 60,
    flexDirection: 'row'
  },
  avatar: {
    position: 'absolute',
    left: 20,
    top: 135,
    height: 110,
    width: 110,
    borderRadius: 55
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  },
});
