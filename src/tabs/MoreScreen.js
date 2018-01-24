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

/**
 * More screen (menu)
 */
@inject('user', 'navigatorStore')
export default class MoreScreen extends Component {

  state = {
    active: false,
    activities: [],
    refreshing: false
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="menu" size={24} color={tintColor} />
    )
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    // load data on enter
    this.disposeEnter = this.props.navigatorStore.onEnterScreen('More', (s) => {
      this.setState({ active: true });
    });

    // clear data on leave
    this.disposeLeave = this.props.navigatorStore.onLeaveScreen('More', (s) => {
      this.setState({ active: false });
    });
  }

  /**
   * Dispose reactions of navigation store on unmount
   */
  componentWillUnmount() {
    this.disposeEnter();
    this.disposeLeave();
  }

  render() {
    // if tab is not active we return a blank view
    if (!this.state.active) {
      return <View style={CommonStyle.flexContainer} />
    }

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
          this.props.navigation.navigate('GroupView', { guid: '100000000000000681'});
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
        name: 'Logout',
        hideChevron: true,
        onPress: this.onPressLogout
      },
    ];

    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <List containerStyle={styles.container}>
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                titleStyle={{padding:8}}
                containerStyle={styles.listItem}
                switchButton={l.switchButton}
                hideChevron ={l.hideChevron}
                onPress= {l.onPress}
                noBorder
              />
            ))
          }
        </List>
        <View style={{flexGrow: 1}}>
        </View>
        <View style={styles.logoBackground}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={[ComponentsStyle.logo, CommonStyle.marginTop2x]}
            source={require('../assets/logos/medium.png')}
          />
          <View style={styles.footer}>
            <View style={styles.footercol}>
              <Text style={CommonStyle.colorDark}>FAQ</Text>
              <Text style={CommonStyle.colorDark}>Code</Text>
              <Text style={CommonStyle.colorDark}>Terms</Text>
              <Text style={CommonStyle.colorDark}>Privacy</Text>
            </View>
            <Text style={styles.version} textAlign={'center'}>v1.0.0 (201712)</Text>
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
  scrollView: {
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  scrollViewContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  container: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  logoBackground: {
    paddingTop: 16,
    backgroundColor: '#FFF'
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 8,
    paddingBottom: 8,
    //height:20
  },
  footercol: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  version: {
    marginTop: 16,
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#444'
  }
});