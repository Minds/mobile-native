import React, { Component } from 'react';
import { Text, StyleSheet, Image, View } from 'react-native';

import { observer, inject } from 'mobx-react/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { MINDS_URI } from '../config/Config';


@inject('notifications')
@observer
export default class Topbar extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topbar}>

          <View style={styles.topbarLeft}>
            <Icon name="bell" size={18} color='#444' onPress={() => this.props.navigation.navigate('Notifications')} style={ styles.button } />
            <Text>{this.props.notifications.unread}</Text>
          </View>

          <View style={styles.topbarCenter}>
            <Image source={ { uri: MINDS_URI + 'icon/me' }} style={styles.avatar} />
          </View>

          <View style={styles.topbarRight}>
            <Icon name="bank" size={18} color='#444' style={ styles.button }/>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 12,
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
    //paddingLeft: 8,
    alignItems: 'center',
    flexDirection: 'row'
  },
  topbarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topbarRight: {
    //paddingRight: 8,
  },
  button: {
    padding: 8,
  },
  avatar: {
    borderRadius: 16,
    width: 32,
    height: 32,
  },
});