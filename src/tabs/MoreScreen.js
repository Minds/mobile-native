import React, {
    Component
} from 'react';

import {
  View,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';

import {
  inject
} from 'mobx-react/native'

import {
  NavigationActions
} from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import session from './../common/services/session.service';
import { List, ListItem } from 'react-native-elements'
import FastImage from 'react-native-fast-image';

import { ComponentsStyle } from '../styles/Components';
import { CommonStyle } from '../styles/Common';
import shareService from '../share/ShareService';

@inject('user')
export default class MoreScreen extends Component {

  state = {
    activities: [],
    refreshing: false
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="menu" size={24} color={tintColor} />
    )
  }

  render() {
    const list = [
      {
        name: 'Blogs',
        onPress: () => {
          this.props.navigation.navigate('BlogList');
        }
      },{
        name: 'Groups',
        onPress: () => {
          this.props.navigation.navigate('GroupsList');
        }
      },{
        name: 'Help & Support',
        onPress: () => {
          this.props.navigation.navigate('GroupsJoin', { guid: '100000000000000681'});
        }
      },{
        name: 'Invite',
        onPress: () => {
          shareService.invite(this.props.user.me.guid);
        }
      },{
        name: 'Settings',
        onPress: () => {
          this.props.navigation.navigate('Settings');
        }
      },{
        name: 'Autoplay videos',
        switchButton: true,
      }, {
        name: 'Points animation',
        switchButton: true,
      },{
        name: 'Logout',
        onPress: this.onPressLogout
      },
    ];

    return (
      <ScrollView >
        <List containerStyle={{flex:1}}>
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                titleStyle={{padding:8}}
                style={styles.listItem}
                switchButton={l.switchButton}
                hideChevron ={true}
                onPress= {l.onPress}
              />
            ))
          }
        </List>
        <View style={styles.logoBackground}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={[ComponentsStyle.logo, CommonStyle.marginTop2x]}
            source={require('../assets/logos/medium-white.png')}
          />
          <View style={styles.footer}>
            <Text style={styles.version} textAlign={'center'}>v1.0.0 (201712)</Text>
            <View style={styles.footercol}>
              <Text style={CommonStyle.colorWhite}>FAQ</Text>
              <Text style={CommonStyle.colorWhite}>Code</Text>
              <Text style={CommonStyle.colorWhite}>Terms</Text>
              <Text style={CommonStyle.colorWhite}>Privacy</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  onPressSettings = () => {
    this.props.navigation.navigate('Settings');
  }

  onPressLogout = () => {
    session.logout();
    const loginAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    })

    this.props.navigation.dispatch(loginAction);
  }
}

const styles = StyleSheet.create({
  logoBackground: {
    backgroundColor: '#444'
  },
	screen: {
    //paddingTop: 20,
    backgroundColor: '#FFF',
    flex: 1,
  },
  footer: {
    alignItems: 'stretch',
    width: '100%',
    height: 50,
  },
  listItem: {
    borderBottomColor: '#eee',
    height:20
  },
  footercol: {

    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  version: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
  }
});