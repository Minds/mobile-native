import React, {
  Component
} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { Icon } from 'react-native-elements';

import { MINDS_CDN_URI } from '../config/Config';
import groupsService from './GroupsService';
import CenteredLoading from '../common/components/CenteredLoading';
import GroupHeader from './header/GroupHeader';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import NewsfeedList from '../newsfeed/NewsfeedList';

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
   * Nav to activity full screen
   */
  navToCapture = (group) => {
    this.props.navigation.navigate('Capture', {group});
  }

  /**
   * Render
   */
  render() {
    const group = this.props.groupView.group;

    if (!group || !this.props.groupView.list.loaded) {
      return <CenteredLoading />
    }

    const header = (
      <View>
        <GroupHeader store={this.props.groupView} me={this.props.user.me} styles={styles}/>
        <Icon color={colors.primary} containerStyle={styles.gobackicon} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()} raised />
      </View>
    )

    return (<View style={{flex:1}}> 
              <Icon
                raised
                name="md-radio-button-on"
                type='ionicon'
                color='#fff'
                size={32}
                containerStyle={{position:'absolute', backgroundColor:'#222', width:55, height:55, bottom:10, right:10, zIndex:1000}}
                onPress={() => this.navToCapture(group)} />
              <NewsfeedList newsfeed={ this.props.groupView } guid = { group.guid } header = { header } navigation = { this.props.navigation } />
            </View>);
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
