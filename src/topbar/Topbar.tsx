//@ts-nocheck
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import { observer, inject } from 'mobx-react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';

import { MINDS_CDN_URI } from '../config/Config';
import featuresService from '../common/services/features.service';

import isIphoneX from '../common/helpers/isIphoneX';
import testID from '../common/helpers/testID';
import EmailConfirmation from './EmailConfirmation';
import BannerInfo from './BannerInfo';

const forceInset = isIphoneX ? { top: 32 } : null;

@inject('user')
@inject('wallet')
@observer
class Topbar extends Component {
  componentDidMount() {
    this.props.wallet.refresh();
  }

  render() {
    return (
      <SafeAreaView style={styles.container} forceInset={forceInset}>
        <View style={styles.topbar}>
          {featuresService.has('crypto') && (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('BoostConsole', {
                  navigation: this.props.navigation,
                })
              }
              {...testID('boost-console button')}>
              <View style={styles.topbarLeft}>
                <Icon
                  name="trending-up"
                  size={22}
                  color="#444"
                  style={styles.button}
                />
              </View>
            </TouchableOpacity>
          )}

          {!featuresService.has('crypto') && <View style={styles.topbarLeft} />}

          <View style={styles.topbarCenter}>
            {this.props.user.me && (
              <Avatar
                rounded
                source={{
                  uri:
                    MINDS_CDN_URI +
                    'icon/' +
                    this.props.user.me.guid +
                    '/medium/' +
                    this.props.user.me.icontime,
                }}
                width={38}
                height={38}
                onPress={() =>
                  this.props.navigation.push('Channel', {
                    guid: this.props.user.me.guid,
                  })
                }
                testID="AvatarButton"
              />
            )}
          </View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('More', {
                navigation: this.props.navigation,
              })
            }
            {...testID('Main menu button')}>
            <View style={styles.topbarRight}>
              <Icon name="menu" size={22} color="#444" style={styles.button} />
            </View>
          </TouchableOpacity>
        </View>
        <EmailConfirmation user={this.props.user} />
        <BannerInfo user={this.props.user} logged={true} />
      </SafeAreaView>
    );
  }
}

export default Topbar;

let topbarHeight = 56;
let topMargin = 0;

if (Platform.OS == 'ios') {
  topbarHeight = 45;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
  },
  topbar: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  topbarLeft: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  topbarCenter: {
    flex: 1,
    alignItems: 'center',
    padding: 2,
  },
  topbarRight: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingRight: 4,
  },
  button: {
    paddingHorizontal: 8,
  },
});
