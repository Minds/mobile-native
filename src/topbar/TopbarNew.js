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

const forceInset = isIphoneX ? {top: 32} : null

@inject('user')
@inject('wallet')
@observer
export default class TopbarNew extends Component {

  componentDidMount() {
    this.props.wallet.refresh();
  }

  render() {
    console.log("TOPBARNEW PROPS", this.props);
    return (
      <View style={styles.container} forceInset={forceInset}>
        <View style={styles.topbar}>
            <View style={styles.topbarLeft}>
              <Text style={[CS.titleText, CS.colorPrimaryText]} >Newsfeed</Text>
            </View>
            <View style={styles.topbarRight}>
              <Icon name="chat-bubble-outline" size={24} style={ styles.button }/>
              <Icon name="search" size={24} style={ styles.button }/>
            </View>
        </View>
      </View>
    );
  }
}

let topbarHeight = 56;
let topMargin = 0;

if (Platform.OS == 'ios') {
  topbarHeight = 45;
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  topbarLeft: {
    ...CS.marginLeft2x,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    ...CS.colorIcon,
  }
});
