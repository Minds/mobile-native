import React, {
  Component
} from 'react';

import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { Icon } from 'react-native-elements';

import DiscoveryUser from '../discovery/DiscoveryUser';
import { MINDS_CDN_URI } from '../config/Config';
import groupsService from './GroupsService';
import CenteredLoading from '../common/components/CenteredLoading';
import GroupHeader from './header/GroupHeader';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import NewsfeedList from '../newsfeed/NewsfeedList';
import CaptureFab from '../capture/CaptureFab';
/**
 * Groups view screen
 */
@inject('groupView')
@inject('user')
@observer
export default class GroupViewScreen extends Component {
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
      this.props.groupView.loadFeed(params.group.guid);
    } else {
      this.props.groupView.loadGroup(params.guid);
      this.props.groupView.loadFeed(params.guid);
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
    switch (group.filter) {
      case 'feed': 
        return <NewsfeedList newsfeed={ group } guid = { group.group.guid } header = { header } navigation = { this.props.navigation } />;
        break;
      case 'members':
        return <FlatList
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
              />;
        break;
      case 'desc':
        return  <ScrollView style={CommonStyle.backgroundLight}>
                  {header}
                  <View style={CommonStyle.padding2x}>
                    <Text>{group.group.briefdescription}</Text>
                  </View>
                </ScrollView>;
        break;
      default:
        return <NewsfeedList newsfeed={ group } guid = { group.group.guid } header = { header } navigation = { this.props.navigation } />;
        break;
    }
  }

  /**
   * Render user row
   */
  renderRow = (row) => {
    return (
      <DiscoveryUser store={this.props.groupView} entity={row} navigation={this.props.navigation} />
    );
  }

  /**
   * Render
   */
  render() {
    const group = this.props.groupView.group;

    if (!group || !this.props.groupView.list.loaded) {
      return <CenteredLoading />
    }

    return (<View style={{flex:1}}> 
              <CaptureFab navigation={this.props.navigation} />
              {this.getList()}
            </View>);
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
