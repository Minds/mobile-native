import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  Platform,
  TouchableOpacity
} from 'react-native';

import { observer, inject } from 'mobx-react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ModalTopbar extends Component {

  static defaultProps = {
    closeButtonStyle: {},
    style: {},
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.topbar}>
          <View style={{flex:1}} />
          <Icon size={24} name="close" onPress={() => this.props.navigation.goBack()} style={[styles.close, this.props.closeButtonStyle]}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: (Platform.OS === 'ios') ? 65 : 56,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 16 : 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
  },
  topbar: {
    flex: 1,
    flexDirection: 'row',
  },
  close: {
    alignSelf: 'flex-end',
    padding: (Platform.OS === 'ios') ? 12 : 8,
    color: '#444'
  }
});
