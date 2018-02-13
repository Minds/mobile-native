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
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from 'react-native-elements';

import { MINDS_CDN_URI } from '../config/Config';

@inject('user')
@inject('notifications')
@inject('wallet')
@observer
export default class Topbar extends Component {

  componentDidMount() {
    this.props.wallet.refresh();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topbar}>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications')} >
            <View style={styles.topbarLeft}>
              <CIcon name="bell" size={18} color='#444' style={ styles.button } />
              <Text>{this.props.notifications.unread}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.topbarCenter}>
            <Avatar
              rounded
              source={{ uri: MINDS_CDN_URI + 'icon/' + this.props.user.me.guid }}
              width={36}
              height={36}
              onPress={() => this.props.navigation.navigate('Channel', { guid: this.props.user.me.guid })}
            />
          </View>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('More', { navigation: this.props.navigation })} >
            <View style={styles.topbarRight}>
              <Icon name="more-vert" size={18} color='#444' style={ styles.button }/>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

let topbarHeight = 56;
let topbarPadding = 0;

if (Platform.OS == 'ios') {
  topbarHeight = 65;
  topbarPadding = 16;
}

const d = Dimensions.get('window');
if (d.height == 812 || d.width == 812) {
  topbarHeight = 76;
  topbarPadding = 32;
}

const styles = StyleSheet.create({
  container: {
    height: topbarHeight,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: topbarPadding,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
  },
  topbar: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  topbarLeft: {
    width: 100,
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
    width:100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingRight: 4
  },
  button: {
    padding: 8,
  }
});
