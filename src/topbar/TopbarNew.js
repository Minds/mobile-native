import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { observer, inject } from 'mobx-react/native'
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';

import { MINDS_CDN_URI } from '../config/Config';
import featuresService from '../common/services/features.service';
import { SafeAreaView } from 'react-navigation';
import isIphoneX from '../common/helpers/isIphoneX';
import testID from '../common/helpers/testID';
import { CommonStyle as CS } from '../styles/Common';

import SearchComponent from './SearchComponent';

const forceInset = isIphoneX ? {top: 32} : null

@inject('user')
@inject('wallet')
@observer
export default class TopbarNew extends Component {

  componentDidMount() {
    this.props.wallet.refresh();
  }

  listenForSearch = () => this.props.user.searching ? styles.scale0 : {};

  render() {
    const user = this.props.user;
    return (
      <SafeAreaView style={styles.container} forceInset={forceInset}>
        <View style={styles.topbar}>
            <View style={[styles.topbarLeft, this.listenForSearch()]}>
              <Text style={[CS.titleText, CS.colorPrimaryText, {lineHeight:0}]} >{this.props.title}</Text>
            </View>
            <View style={styles.topbarRight}>
              <Icon name="chat-bubble-outline" size={24} style={[styles.button, CS.colorIcon, this.listenForSearch()]}/>
              <SearchComponent user={this.props.user} />
            </View>
        </View>
      </SafeAreaView>
    );
  }
}

let topbarHeight = 56;
let topMargin = 0;

if (Platform.OS == 'ios') {
  topbarHeight = 56;
}

const styles = StyleSheet.create({
  container: {
    height: topbarHeight,
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    ...CS.backgroundThemeSecondary,
  },
  topbar: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingBottom: 5,
  },
  topbarLeft: {
    ...CS.marginLeft2x,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  topbarCenter: {
    flex: 1,
    alignItems: 'center',
    padding: 2,
  },
  topbarRight: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingRight: 4,
    paddingTop: 4,
  },
  button: {
    paddingHorizontal: 8,
  },
  scale0: {
    transform: [{ scale: 0 }]
  }
});
