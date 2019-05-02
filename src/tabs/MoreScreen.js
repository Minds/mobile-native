import React, {
  Component
} from 'react';

import {
View,
StyleSheet,
Text,
ScrollView,
BackHandler,
Linking,
ImageBackground,
Alert,
Platform,
ToastAndroid,
TouchableOpacity,
} from 'react-native';

import {
inject
} from 'mobx-react/native'

import RNExitApp from 'react-native-exit-app';

import {
MINDS_URI,
CODE_PUSH_TOKEN
} from '../config/Config';

import {
StackActions,
NavigationActions
} from 'react-navigation';

import CodePush from 'react-native-code-push';

import Icon from 'react-native-vector-icons/MaterialIcons';
import authService from './../auth/AuthService';
import { List, ListItem } from 'react-native-elements'
import FastImage from 'react-native-fast-image';

import { ComponentsStyle } from '../styles/Components';
import { CommonStyle as CS } from '../styles/Common';
import shareService from '../share/ShareService';
import { Version } from '../config/Version';
import mindsService from '../common/services/minds.service';
import colors from '../styles/Colors';
import logService from '../common/services/log.service';
import testID from '../common/helpers/testID';


const ICON_SIZE = 24;

/**
* More screen (menu)
*/
@inject('user')
export default class MoreScreen extends Component {

  static navigationOptions = {
    title: 'Minds',
  };

  state = {
    active: false,
    activities: [],
    refreshing: false
  }

  render() {
    const list = [
      // {
      //   name: 'Blogs',
      //   icon: (<Icon name='subject' size={ICON_SIZE} style={ styles.icon }/>),
      //   onPress: () => {
      //     this.props.navigation.navigate('BlogList');
      //   }
      // },
      // {
      //   name: 'Groups',
      //   icon: (<Icon name='group-work' size={ICON_SIZE} style={ styles.icon }/>),
      //   onPress: () => {
      //     this.props.navigation.navigate('GroupsList');
      //   }
      // },
      {
        name: 'Help & Support',
        icon: (<Icon name='help-outline' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.push('GroupView', { guid: '100000000000000681'});
        }
      },
      {
        name: 'Refer your friends',
        icon: (<Icon name='share' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          shareService.invite(this.props.user.me.guid);
        }
      },
      {
        name: 'Settings',
        icon: (<Icon name='settings' size={ICON_SIZE} style={ styles.icon }/>),
        onPress: () => {
          this.props.navigation.navigate('Settings');
        }
      },
      // {
      //   name: 'Push Notifications',
      //   icon: (<Icon name='notifications' size={ICON_SIZE} style={ styles.icon } />),
      //   onPress: () => {
      //     this.props.navigation.navigate('NotificationsSettings');
      //   }
      // },
      // {
      //   name: 'Check for updates',
      //   hideChevron: true,
      //   icon: (<Icon name="cloud-download" size={ICON_SIZE} style={ styles.icon }/>),
      //   onPress: async() => {

      //     const params = {
      //       updateDialog: Platform.OS !== 'ios',
      //       installMode:  CodePush.InstallMode.IMMEDIATE,
      //     };

      //     if (CODE_PUSH_TOKEN) params.deploymentKey = CODE_PUSH_TOKEN;

      //     let response = await CodePush.sync(params, (status) => {
      //       switch (status) {
      //         case CodePush.SyncStatus.UP_TO_DATE:
      //           ToastAndroid.show('No updates available', ToastAndroid.LONG);
      //           break;
      //         case CodePush.SyncStatus.SYNC_IN_PROGRESS:
      //           ToastAndroid.show('Updating...', ToastAndroid.LONG);
      //           break;
      //         case CodePush.SyncStatus.UPDATE_INSTALLED:
      //           ToastAndroid.show('Updated', ToastAndroid.LONG);
      //           break;
      //       }
      //     });
      //   }
      // },
      {
        name: 'Logout',
        hideChevron: true,
        icon: (<Icon name='power-settings-new' size={ICON_SIZE} style={ styles.icon } />),
        onPress: () => {
          authService.logout();
          const loginAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Login' })
            ]
          })

          this.props.navigation.dispatch(loginAction);
        }
      }
    ];

    const links1 = [{
        name: 'FAQ',
        icon: (<Icon name='open-in-new' size={16} style={ styles.icon }/>),
        hideChevron: true,
        onPress: () => {
          Linking.openURL(MINDS_URI + 'faq');
        }
      }, {
        name: 'Code',
        icon: (<Icon name='open-in-new' size={16} style={ styles.icon }/>),
        hideChevron: true,
        onPress: () => {
          Linking.openURL('https://gitlab.com/Minds');
        }
      }
    ];
    const links2 = [{
        name: 'Terms',
        icon: (<Icon name='open-in-new' size={16} style={ styles.icon }/>),
        hideChevron: true,
        onPress: () => {
          Linking.openURL(MINDS_URI + 'p/terms');
        }
      }, {
        name: 'Privacy',
        icon: (<Icon name='open-in-new' size={16} style={ styles.icon }/>),
        hideChevron: true,
        onPress: () => {
          Linking.openURL(MINDS_URI + 'p/privacy');
        }
      }
    ];

    // if it is enabled
    if (mindsService.settings && mindsService.settings.features.mobile_bug_report) {
      list.push({
        name: 'Report a bug',
        icon: (<Icon name='bug-report' size={ICON_SIZE} style={ styles.icon } />),
        onPress: () => {
          this.props.navigation.navigate('IssueReport');
        }
      });
    }

    list.push({
      name: 'Exit',
      hideChevron: true,
      icon: (<Icon name='close' size={ICON_SIZE} style={ styles.icon } />),
      onPress: () => {
        RNExitApp.exitApp();
      }
    });

    return (
      <ScrollView style={styles.scrollView}>
        <ImageBackground source={require('../assets/bg-1.jpg')} style={{width: '100%'}}>
          <View style={{backgroundColor: 'rgba(255, 255, 255, 0.66)'}}>
            <View style={[CS.rowJustifySpaceEvenly, CS.flexContainer, CS.paddingTop3x, CS.paddingBottom3x, CS.borderBottomHair, CS.borderDarkGreyed]}>
              <TouchableOpacity
                style={[CS.borderRadius5x, CS.shadow, CS.backgroundPrimary, CS.padding2x, styles.button]}
                onPress={() => {this.props.navigation.navigate('BlogList')}}>
                <Icon name='subject' size={35} style={ [CS.colorWhite, CS.textCenter] }/>
                <Text style={[CS.colorWhite, CS.textCenter]}>Blogs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[CS.borderRadius5x, CS.shadow, CS.backgroundPrimary, CS.padding2x, styles.button]}
                onPress={() => {this.props.navigation.navigate('GroupsList')}}>
                <Icon name='group-work' size={35} style={ [CS.colorWhite, CS.textCenter] }/>
                <Text style={[CS.colorWhite, CS.textCenter]}>My Groups</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {this.getList(list)}
        <View style={[CS.rowJustifyCenter, CS.marginTop1x, CS.borderTopHair, CS.borderDarkGreyed]}>
          {this.getList(links1)}
          {this.getList(links2)}
        </View>
        <View style={styles.logoBackground}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={[styles.logo, CS.marginTop2x]}
            source={require('../assets/logos/logo.png')}
          />
          <View style={styles.footer}>
            <Text style={styles.version} textAlign={'center'}>v{Version.VERSION} ({Version.BUILD})</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  onPressSettings = () => {
    this.props.navigation.navigate('Settings');
  }

  getList(list) {
    return (
      <List containerStyle={styles.container}>
        {
          list.map((l, i) => (
            <ListItem
              key={i}
              title={l.name}
              titleStyle={styles.listTitle}
              containerStyle={styles.listItem}
              switchButton={l.switchButton}
              hideChevron ={l.hideChevron}
              leftIcon={l.icon}
              onPress= {l.onPress}
              noBorder
              {...testID(l.name)}
            />
          ))
        }
      </List>
    )
  }
}

const styles = StyleSheet.create({
  logo: {
    height: 85,
    width: 230
  },
  scrollView: {
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  button: {
    width: 100
  },
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  logoBackground: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
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
    borderBottomWidth: 0,
    borderBottomColor: '#ddd',
    paddingTop: 8,
    paddingBottom: 8,
    //height:20
  },
  listTitle: {
    padding:8,
    color: '#455a64',
    fontFamily: 'Roboto',
  },
  icon: {
    color: colors.darkGreyed,
    alignSelf: 'center',
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
    fontWeight: '200',
    color: '#444'
  }
});
