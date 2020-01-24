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
  SafeAreaView,
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

import Icon from 'react-native-vector-icons/MaterialIcons';
import authService from '../auth/AuthService';
import { ListItem } from 'react-native-elements'
import FastImage from 'react-native-fast-image';

import { ComponentsStyle } from '../styles/Components';
import { CommonStyle as CS } from '../styles/Common';
import shareService from '../share/ShareService';
import { Version } from '../config/Version';
import mindsService from '../common/services/minds.service';
import colors from '../styles/Colors';
import logService from '../common/services/log.service';
import testID from '../common/helpers/testID';
import i18n from '../common/services/i18n.service';
import TabIcon from './TabIcon';

import { Avatar } from 'react-native-elements';

import { MINDS_CDN_URI } from '../config/Config';

/**
* More screen (menu)
*/
@inject('user')
export default class MoreScreenNew extends Component {

  static navigationOptions = {
    title: 'Minds',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon name="md-menu" size={24} color={tintColor} />
    ),
  };

  getSource = () => { uri: MINDS_CDN_URI + 'icon/' + this.props.user.me.guid + '/medium/' +  this.props.user.me.icontime }

  navToChannel = () => this.props.navigation.push('Channel', { guid: this.props.user.me.guid })

  render() {
    return (
      <SafeAreaView style={[
        CS.flexContainer,
        CS.backgroundThemePrimary,
        CS.paddingLeft3x,
        CS.paddingTop3x
      ]}>
        <View style={[

        ]}>
          { this.props.user.me && <Avatar
            rounded
            source={this.getSource()}
            width={56}
            height={56}
            onPress={this.navToChannel}
            testID="AvatarButton"
          /> }
        </View>
        <View></View>
      </SafeAreaView>
    );
  }

  onPressSettings = () => {
    this.props.navigation.navigate('Settings');
  }

  getList(list) {
    return (
      <View style={styles.container}>
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  logo: {
  }
});
